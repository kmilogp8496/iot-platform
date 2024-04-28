import { and, eq } from 'drizzle-orm'
import { Notifications } from '~/server/database/schemas/notifications.schema'

const handler = defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const id = await getNumericIdFromRouteParams(event, 'id')

  const db = useDB()

  const notification = (await db.select().from(Notifications)
    .where(
      and(
        eq(Notifications.id, id),
        eq(Notifications.createdBy, user.id),
      ),
    )).at(0)

  if (!notification) {
    throw createError({
      statusCode: 404,
      message: 'Notificación no encontrada',
    })
  }

  return notification
})

export type NotificationByIdResponse = Awaited<ReturnType<(typeof handler)>>

export default handler
