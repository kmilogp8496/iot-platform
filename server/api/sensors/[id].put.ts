import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getSensorById } from '~/server/database/repositories/sensorsRepository'
import { sensors, sensorsUpdateSchema } from '~/server/database/schemas/sensors.schema'
import { getNumericIdFromRouteParams, getUserFromEvent } from '~/server/utils/api'
import { validateProjectBelongsToUser } from '~/server/utils/validations'

export default defineEventHandler(async (event) => {
  await requireEventPermission(event, [
    ['UPDATE', 'sensors'],
  ])
  const user = await getUserFromEvent(event)
  const variablesSchema = z.object({
    variables: z.array(z.number()),
  })
  const db = useDB()

  const sensorId = await getNumericIdFromRouteParams(event)

  const body = await readValidatedBody(event, sensorsUpdateSchema.pick({
    name: true,
    description: true,
    project: true,
  }).merge(variablesSchema).parse)

  await validateProjectBelongsToUser(user.id, body.project, db)

  const sensor = await getSensorById(db, sensorId)

  if (!sensor) {
    return createError({
      statusCode: 404,
      message: 'Sensor no encontrado',
    })
  }

  const returningValue = (await db.update(sensors).set(body).where(eq(sensors.id, sensorId)).returning()).at(0)!

  return returningValue
})
