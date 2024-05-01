import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { NotificationConfigurations, notificationConfigurationsUpdateSchema } from '~/server/database/schemas/notificationConfigurations.schema'
import { validateNotificationConfigurationBelongsToUser } from '~/server/utils/validations'

export default defineEventHandler(async (event) => {
  const { user } = await requireEventPermission(event, [
    ['UPDATE', 'notifications'],
  ])

  const body = await readValidatedBody(event, notificationConfigurationsUpdateSchema.omit({
    createdAt: true,
    updatedAt: true,
    threshold: true,
    notification: true,
  }).merge(z.object({
    threshold: processedNumber.transform(v => v.toFixed(2)),
  })).parse)

  const notificationConfigurationId = await getNumericIdFromRouteParams(event)

  const db = useDB()

  const notificationConfiguration = await validateNotificationConfigurationBelongsToUser(notificationConfigurationId, user.id, db)
  await validateSensorConfigurationBelongsToUser(body.sensorConfiguration, user.id, db)

  try {
    await db.update(NotificationConfigurations).set(body).where(
      eq(NotificationConfigurations.id, notificationConfiguration.id),
    )
  }
  catch (error) {
    throw createError({
      message: 'Error al actualizar notificación',
      data: error,
      statusCode: 422,
      cause: error,
    })
  }

  return null
})
