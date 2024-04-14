import { Point } from '@influxdata/influxdb-client'
import { and, eq, inArray } from 'drizzle-orm'
import { z } from 'zod'
import { ActuatorConfigurations } from '~/server/database/schemas/actuatorConfiguration.schema'
import { locations } from '~/server/database/schemas/locations.schema'
import { projects } from '~/server/database/schemas/projects.schema'
import { sensors } from '~/server/database/schemas/sensors.schema'
import { sensorsConfigurations } from '~/server/database/schemas/sensorsConfiguration.schema'
import { variables } from '~/server/database/schemas/variables.schema'
import { webSocketPeers } from '~/server/routes/_ws'

export const ThingsPostBodySchema = z.record(
  z.preprocess(Number, z.number()),
  z.number(),
)

export default defineEventHandler(async (event) => {
  const session = await requireEventPermission(event, [
    ['CREATE', 'thingsData'],
  ])

  const db = useDB()

  // Body contains the data indexed by the sensor configuration id
  const body = await readValidatedBody(event, ThingsPostBodySchema.parse)

  const sensorConfigurations = Object.keys(body).map(Number)

  if (sensorConfigurations.length === 0)
    return null

  if (!body) {
    throw createError({
      statusCode: 400,
      message: 'Body is required',
    })
  }

  const sensor = (await db.select({
    id: sensors.id,
    name: sensors.name,
    project: {
      id: projects.id,
      name: projects.name,
    },
  })
    .from(sensors)
    .leftJoin(projects, eq(projects.id, sensors.project))
    .where(eq(sensors.id, session.user!.id))).at(0)

  if (!sensor) {
    throw createError({
      statusCode: 404,
      message: 'Sensor not found',
    })
  }

  const configurations = await db.select({
    id: sensorsConfigurations.id,
    name: sensorsConfigurations.name,
    description: sensorsConfigurations.description,
    variable: {
      id: variables.id,
      name: variables.name,
      unit: variables.unit,
    },
    location: {
      id: sensorsConfigurations.location,
      name: locations.name,
    },
  })
    .from(sensorsConfigurations)
    .where(
      and(
        eq(sensorsConfigurations.sensor, sensor.id),
        inArray(sensorsConfigurations.id, sensorConfigurations),
      ),
    )
    .leftJoin(variables, eq(sensorsConfigurations.variable, variables.id))
    .leftJoin(locations, eq(sensorsConfigurations.location, locations.id))

  db.select({
    id: ActuatorConfigurations.id,
    sensorConfiguration: ActuatorConfigurations.sensorConfiguration,
    sensor: ActuatorConfigurations.sensor,
  })
    .from(ActuatorConfigurations)
    .where(
      inArray(ActuatorConfigurations.sensorConfiguration, sensorConfigurations),
    ).then((actuators) => {
      for (const actuator of actuators) {
        const sensorConfigurations = configurations.filter(configuration => configuration.id === actuator.sensorConfiguration)

        if (!sensorConfigurations.length)
          continue

        webSocketPeers.get(actuator.sensor)
          ?.peer.send(
            Object.fromEntries(sensorConfigurations
              .map(configuration => [String(configuration.id), body[configuration.id]]),
            ),
          )
      }
    })

  const points: Point[] = []

  for (const configuration of configurations) {
    points.push(
      new Point(configuration.name)
        .floatField(sensor.name, body[configuration.id])
        .tag('sensorID', sensor.id.toString())
        .tag('variableID', configuration.variable?.id.toString() ?? '')
        .tag('locationID', configuration.location?.id.toString() ?? '')
        .tag('projectID', sensor.project?.id.toString() ?? '')
        .tag('unit', configuration.variable?.unit ?? '')
        .tag('variable', configuration.variable?.name ?? '')
        .tag('location', configuration.location?.name ?? '')
        .tag('project', sensor.project?.name ?? ''),
    )
  }

  const influxWriteClient = useInfluxWriteClient()

  influxWriteClient.writePoints(points)
  try {
    await influxWriteClient.flush()
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Error writing to influx',
    })
  }
  return body
})
