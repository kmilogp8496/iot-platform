import { notificationsSchema } from '~/components/notifications/notifications.const'
import { Notifications } from '~/server/database/schemas/notifications.schema'

const createNotificationSchema = notificationsSchema

export default defineEventHandler(async (event) => {
  const { user } = await requireEventPermission(event, [
    ['CREATE', 'notifications'],
  ])

  const body = await readValidatedBody(event, createNotificationSchema.parse)

  const db = useDB()

  try {
    await db.insert(Notifications).values({
      ...body,
      createdBy: user.id,
    })
  }
  catch (error) {
    throw createError({
      message: 'Error al crear notificación',
      data: error,
      statusCode: 422,
      cause: error,
    })
  }

  return null
})
