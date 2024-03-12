import { eq } from 'drizzle-orm'
import { sensorsConfigurations } from '~/server/database/schemas/sensorsConfiguration.schema'

export default defineEventHandler(async (event) => {
  const session = await requireEventPermission(event, [
    ['DELETE', 'sensorConfiguration'],
  ])

  const sensorConfigurationId = await getNumericIdFromRouteParams(event)

  const db = useDB()

  const sensorConfiguration = (await db.select({
    createdBy: sensorsConfigurations.createdBy,
  }).from(sensorsConfigurations).where(
    eq(sensorsConfigurations.id, sensorConfigurationId),
  )).at(0)

  if (!sensorConfiguration) {
    throw createError({
      statusCode: 404,
      message: 'Configuración de sensor no encontrada',
    })
  }

  if (sensorConfiguration.createdBy !== session.user!.id) {
    throw createError({
      statusCode: 403,
      message: 'No tienes permiso para eliminar esta configuración de sensor',
    })
  }

  await db.delete(sensorsConfigurations).where(eq(sensorsConfigurations.id, sensorConfigurationId))
  return null
})
