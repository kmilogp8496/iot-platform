import { ActuatorConfigurationInsertSchema, ActuatorConfigurations } from '~/server/database/schemas/actuatorConfiguration.schema'
import { validateUniqueKeyError } from '~/server/utils/api'
import { validateSensorBelongsToUser, validateSensorConfigurationBelongsToUser } from '~/server/utils/validations'

export default defineEventHandler(async (event) => {
  const { user } = await requireEventPermission(event, [
    ['CREATE', 'actuators'],
  ])

  const body = await readValidatedBody(event, ActuatorConfigurationInsertSchema.pick({
    description: true,
    name: true,
    sensor: true,
    sensorConfiguration: true,
  }).required().parse)

  const db = useDB()

  await validateSensorBelongsToUser(body.sensor, user.id, db)

  await validateSensorConfigurationBelongsToUser(body.sensorConfiguration, user.id, db)

  try {
    await db.insert(ActuatorConfigurations).values({
      ...body,
      createdBy: user.id,
    })
  }
  catch (error) {
    validateUniqueKeyError(error, 'Este sensor ya tiene esta configuración de sensor asignada')
    throw error
  }

  return null
})
