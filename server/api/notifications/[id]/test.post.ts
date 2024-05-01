import { Notifications } from '~/server/database/schemas/notifications.schema'
import { getNotificationHandlerByType } from '~/server/utils/notifications'

type NotificationType = typeof Notifications.$inferSelect

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const id = await getNumericIdFromRouteParams(event)
  const db = useDB()

  const notification = await validateNotificationBelongsToUser(id, user.id, db, {
    url: Notifications.url,
    type: Notifications.type,
  }) as unknown as Pick<NotificationType, 'id' | 'url' | 'type'>

  return getNotificationHandlerByType(notification.type)?.(notification.url, {
    name: 'Test notification',
    message: 'This is a test notification',
  }, [
    {
      location: { name: 'Test location' },
      sensor: { name: 'Test sensor' },
      sensorConfiguration: { id: 1, lastValue: 1 },
      variable: { name: 'Test variable', unit: 'Test unit' },
    },
  ], new Date()) ?? null
})
