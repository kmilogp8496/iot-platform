import { eq } from 'drizzle-orm'
import { ActuatorConfigurationInsertSchema, ActuatorConfigurations } from '~/server/database/schemas/actuatorConfiguration.schema'
import { validateSensorBelongsToUser, validateSensorConfigurationBelongsToUser } from '~/server/utils/validations'

export default defineEventHandler(async (event) => {
  const { user } = await requireEventPermission(event, [
    ['UPDATE', 'actuators'],
  ])

  const actuatorConfigurationId = await getNumericIdFromRouteParams(event)

  const db = useDB()

  const actuatorConfiguration = (await db.select({
    createdBy: ActuatorConfigurations.createdBy,
    sensor: ActuatorConfigurations.sensor,
    sensorConfiguration: ActuatorConfigurations.sensorConfiguration,
  }).from(ActuatorConfigurations).where(
    eq(ActuatorConfigurations.id, actuatorConfigurationId),
  )).at(0)

  if (!actuatorConfiguration) {
    throw createError({
      statusCode: 404,
      message: 'Configuración de sensor no encontrada',
    })
  }

  if (actuatorConfiguration.createdBy !== user.id) {
    throw createError({
      statusCode: 403,
      message: 'No tienes permiso para actualizar esta configuración de sensor',
    })
  }

  const body = await readValidatedBody(event, ActuatorConfigurationInsertSchema.pick({
    name: true,
    description: true,
    sensor: true,
    sensorConfiguration: true,
  }).required().parse)

  if (body.sensor !== actuatorConfiguration.sensor)
    await validateSensorBelongsToUser(body.sensor, user.id, db)

  if (body.sensorConfiguration !== actuatorConfiguration.sensorConfiguration)
    await validateSensorConfigurationBelongsToUser(body.sensorConfiguration, user.id, db)

  await db.update(ActuatorConfigurations).set(body).where(
    eq(ActuatorConfigurations.id, actuatorConfigurationId),
  )

  return null
})
