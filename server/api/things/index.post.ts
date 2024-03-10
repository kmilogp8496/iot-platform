import { Point } from '@influxdata/influxdb-client'
import { and, eq, inArray } from 'drizzle-orm'
import { z } from 'zod'
import { getSensorById } from '~/server/database/repositories/sensorsRepository'
import { sensors } from '~/server/database/schemas/sensors.schema'
import { sensorsToVariables } from '~/server/database/schemas/sensorsToVariables.schema'
import { variables as variablesSchema } from '~/server/database/schemas/variables.schema'

export default defineEventHandler(async (event) => {
  const session = await requireEventPermission(event, [
    ['CREATE', 'thingsData'],
  ])

  const db = useDB()

  const body = await readValidatedBody(event, z.record(z.preprocess(Number, z.number()), z.number()).parse)

  const variableIds = Object.keys(body)

  if (variableIds.length === 0)
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
  })
    .from(sensors)
    .where(eq(sensors.id, session.user!.id))).at(0)

  if (!sensor) {
    throw createError({
      statusCode: 404,
      message: 'Sensor not found',
    })
  }

  const variables = await db.select({
    id: variablesSchema.id,
    name: variablesSchema.name,
    unit: variablesSchema.unit,
  })
    .from(sensorsToVariables)
    .where(
      and(
        eq(sensorsToVariables.sensorId, sensor.id),
        inArray(sensorsToVariables.variableId, variableIds.map(Number)),
      ),
    )
    .leftJoin(variablesSchema, eq(sensorsToVariables.variableId, variablesSchema.id))

  const influxWriteClient = useInfluxWriteClient()

  const points = variables.map((variable) => {
    return new Point(variable.name!)
      .floatField(sensor.name, body[variable.id!])
      .tag('sensorID', sensor.id.toString())
      .tag('unit', variable.unit!)
  })

  influxWriteClient.writePoints(points)
  influxWriteClient.flush()

  return body
})
