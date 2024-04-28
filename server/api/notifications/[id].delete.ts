import { and, eq } from 'drizzle-orm'
import { Notifications } from '~/server/database/schemas/notifications.schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireEventPermission(event, [
    ['DELETE', 'notifications'],
  ])

  const notificationId = await getNumericIdFromRouteParams(event)

  const db = useDB()

  const notification = (await db.select({ id: Notifications.id }).from(Notifications).where(
    and(
      eq(Notifications.id, notificationId),
      eq(Notifications.createdBy, user.id),
    ),
  )).at(0)

  if (!notification) {
    throw createError({
      message: 'Notificación no encontrada',
      statusCode: 404,
    })
  }

  try {
    await db.delete(Notifications).where(
      eq(Notifications.id, notification.id),
    )
  }
  catch (error) {
    throw createError({
      message: 'Error al eliminar notificación',
      data: error,
      statusCode: 422,
      cause: error,
    })
  }

  return null
})
