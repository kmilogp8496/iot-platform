import { Point } from '@influxdata/influxdb-client'
import { and, eq, inArray } from 'drizzle-orm'
import { z } from 'zod'
import { ActuatorConfigurations } from '~/server/database/schemas/actuatorConfiguration.schema'
import { Locations } from '~/server/database/schemas/locations.schema'
import { projects } from '~/server/database/schemas/projects.schema'
import { Sensors } from '~/server/database/schemas/sensors.schema'
import { SensorsConfigurations } from '~/server/database/schemas/sensorsConfiguration.schema'
import { variables } from '~/server/database/schemas/variables.schema'
import { webSocketPeers } from '~/server/routes/_ws'
import { sendNotifications } from '~/server/utils/notifications'

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
    id: Sensors.id,
    name: Sensors.name,
    project: {
      id: projects.id,
      name: projects.name,
    },
  })
    .from(Sensors)
    .leftJoin(projects, eq(projects.id, Sensors.project))
    .where(eq(Sensors.id, session.user!.id))).at(0)

  if (!sensor) {
    throw createError({
      statusCode: 404,
      message: 'Sensor not found',
    })
  }

  const configurations = await db.select({
    id: SensorsConfigurations.id,
    name: SensorsConfigurations.name,
    description: SensorsConfigurations.description,
    variable: {
      id: variables.id,
      name: variables.name,
      unit: variables.unit,
    },
    location: {
      id: SensorsConfigurations.location,
      name: Locations.name,
    },
  })
    .from(SensorsConfigurations)
    .where(
      and(
        eq(SensorsConfigurations.sensor, sensor.id),
        inArray(SensorsConfigurations.id, sensorConfigurations),
      ),
    )
    .leftJoin(variables, eq(SensorsConfigurations.variable, variables.id))
    .leftJoin(Locations, eq(SensorsConfigurations.location, Locations.id))

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

  const updatePromises: Promise<any>[] = []

  for (const configuration of configurations) {
    updatePromises.push(db.update(SensorsConfigurations).set({ lastValue: body[configuration.id] }).where(eq(SensorsConfigurations.id, configuration.id)))

    points.push(
      new Point(configuration.name)
        .floatField(sensor.name, body[configuration.id])
        .tag('configurationID', configuration.id.toString())
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

    await Promise.all(updatePromises)
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Error writing to database',
    })
  }

  await sendNotifications(db, sensorConfigurations)

  return body
})
