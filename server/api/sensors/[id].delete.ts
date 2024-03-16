import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getSensorById } from '~/server/database/repositories/sensorsRepository'
import { sensors } from '~/server/database/schemas/sensors.schema'
import { sensorsConfigurations } from '~/server/database/schemas/sensorsConfiguration.schema'
import { getUserFromEvent } from '~/server/utils/api'

import { requireEventPermission } from '~/server/utils/permissions'

export default defineEventHandler(async (event) => {
  await requireEventPermission(event, [
    ['DELETE', 'sensors'],
  ])

  const user = await getUserFromEvent(event)

  const db = useDB()

  const { id: sensorId } = await getValidatedRouterParams(event, z.object({
    id: z.preprocess(Number, z.number()),
  }).parse)

  const sensor = await getSensorById(db, sensorId, { id: sensors.id, createdBy: sensors.createdBy })

  if (!sensor) {
    throw createError({
      statusCode: 404,
      message: 'Sensor no encontrado',
    })
  }

  if (sensor.createdBy !== user.id) {
    throw createError({
      statusCode: 403,
      message: 'No tienes permisos para eliminar este sensor',
    })
  }

  await db.delete(sensorsConfigurations).where(eq(sensorsConfigurations.sensor, sensorId))
  await db.delete(sensors).where(eq(sensors.id, sensorId))

  return null
})
