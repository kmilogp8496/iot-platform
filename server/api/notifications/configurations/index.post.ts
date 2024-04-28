import { z } from 'zod'
import { NotificationConfigurations, notificationConfigurationsInsertSchema } from '~/server/database/schemas/notificationConfigurations.schema'
import { validateNotificationBelongsToUser } from '~/server/utils/validations'

export default defineEventHandler(async (event) => {
  const { user } = await requireEventPermission(event, [
    ['CREATE', 'notifications'],
  ])

  const body = await readValidatedBody(event, notificationConfigurationsInsertSchema.omit({
    createdAt: true,
    updatedAt: true,
    id: true,
    threshold: true,
  }).merge(z.object({
    threshold: processedNumber.transform(v => v.toFixed(2)),
  })).parse)

  const db = useDB()

  await validateNotificationBelongsToUser(body.notification, user.id, db)
  await validateSensorConfigurationBelongsToUser(body.sensorConfiguration, user.id, db)

  try {
    await db.insert(NotificationConfigurations).values(body)
  }
  catch (error) {
    if ((error as any)?.routine === '_bt_check_unique') {
      throw createError({
        message: 'Ya existe una configuración de notificación similar',
        statusCode: 400,
      })
    }
    throw createError({
      message: 'Error al crear notificación',
      data: error,
      statusCode: 422,
      cause: error,
    })
  }

  return null
})
