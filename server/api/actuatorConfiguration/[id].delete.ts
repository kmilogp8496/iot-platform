import { and, eq } from 'drizzle-orm'
import { ActuatorConfigurations } from '~/server/database/schemas/actuatorConfiguration.schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireEventPermission(event, [
    ['DELETE', 'actuators'],
  ])

  const actuatorConfigurationId = await getNumericIdFromRouteParams(event)

  const db = useDB()

  const actuatorConfiguration = (await db.select({
    createdBy: ActuatorConfigurations.createdBy,
  }).from(ActuatorConfigurations).where(
    and(
      eq(ActuatorConfigurations.id, actuatorConfigurationId),
      eq(ActuatorConfigurations.createdBy, user.id),
    ),
  )).at(0)

  if (!actuatorConfiguration) {
    throw createError({
      statusCode: 404,
      message: 'Configuración de actuador no encontrada',
    })
  }

  await db.delete(ActuatorConfigurations).where(eq(ActuatorConfigurations.id, actuatorConfigurationId))

  return null
})
