import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getSensorById } from '~/server/database/repositories/sensorsRepository'
import { Sensors } from '~/server/database/schemas/sensors.schema'
import { getNumericIdFromRouteParams } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  await requireEventPermission(event, [
    ['UPDATE', 'sensors'],
  ])

  const updateSensorSchema = z.object({
    username: z.string(),
    password: z.string().min(8),
  })
  const db = useDB()

  const sensorId = await getNumericIdFromRouteParams(event)

  const sensor = await getSensorById(db, sensorId)

  if (!sensor) {
    return createError({
      statusCode: 404,
      message: 'Sensor no encontrado',
    })
  }

  const body = await readValidatedBody(event, updateSensorSchema.parse)

  const returningValue = (await db.update(Sensors).set({
    username: body.username,
    password: await hashPassword(body.password),
  }).where(eq(Sensors.id, sensorId)).returning()).at(0)!

  return returningValue
})
