import { eq } from 'drizzle-orm'
import { NotificationConfigurations } from '~/server/database/schemas/notificationConfigurations.schema'
import { validateNotificationConfigurationBelongsToUser } from '~/server/utils/validations'

export default defineEventHandler(async (event) => {
  const { user } = await requireEventPermission(event, [
    ['DELETE', 'notifications'],
  ])

  const notificationConfigurationId = await getNumericIdFromRouteParams(event)

  const db = useDB()

  const notificationConfiguration = await validateNotificationConfigurationBelongsToUser(notificationConfigurationId, user.id, db)

  try {
    await db.delete(NotificationConfigurations).where(
      eq(NotificationConfigurations.id, notificationConfiguration.id),
    )
  }
  catch (error) {
    throw createError({
      message: 'Error al eliminar la configuración',
      data: error,
      statusCode: 422,
      cause: error,
    })
  }

  return null
})
