import { eq } from 'drizzle-orm'
import { notificationsSchema } from '~/components/notifications/notifications.const'
import { Notifications } from '~/server/database/schemas/notifications.schema'

const updateNotificationSchema = notificationsSchema

export default defineEventHandler(async (event) => {
  const { user } = await requireEventPermission(event, [
    ['UPDATE', 'notifications'],
  ])

  const notificationId = await getNumericIdFromRouteParams(event)

  const body = await readValidatedBody(event, updateNotificationSchema.parse)

  const db = useDB()

  const notification = await validateNotificationBelongsToUser(notificationId, user.id, db)

  try {
    await db.update(Notifications).set(body).where(
      eq(Notifications.id, notification.id),
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
