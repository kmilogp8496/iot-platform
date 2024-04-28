import { and, eq, sql } from 'drizzle-orm'
import { NotificationConfigurations } from '~/server/database/schemas/notificationConfigurations.schema'
import { Notifications } from '~/server/database/schemas/notifications.schema'
import { SensorsConfigurations } from '~/server/database/schemas/sensorsConfiguration.schema'

const handler = defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const db = useDB()

  const query = await useValidatedPaginatedQuery(event, {
    notificationId: processedNumber,
  })

  const notification = (await db.select({ id: Notifications.id }).from(Notifications).where(
    and(
      eq(Notifications.id, query.notificationId),
      eq(Notifications.createdBy, user.id),
    ),
  )).at(0)

  if (!notification) {
    throw createError({
      statusCode: 404,
      message: 'Notificación no encontrada',
    })
  }

  const notificationConfigurations = await db.select({
    id: NotificationConfigurations.id,
    name: NotificationConfigurations.name,
    threshold: NotificationConfigurations.threshold,
    sign: NotificationConfigurations.sign,
    sensorConfiguration: {
      id: SensorsConfigurations.id,
      name: SensorsConfigurations.name,
    },
    createdAt: NotificationConfigurations.createdAt,
    updatedAt: NotificationConfigurations.updatedAt,
  }).from(NotificationConfigurations)
    .where(
      eq(NotificationConfigurations.notification, notification.id),
    )
    .leftJoin(SensorsConfigurations, eq(SensorsConfigurations.id, NotificationConfigurations.sensorConfiguration))
    .limit(query.limit)
    .offset(query.offset)

  const [{ total }] = await db.select({ total: sql`count(*)`.mapWith(Number) })
    .from(Notifications)
    .where(eq(Notifications.createdBy, user.id))

  return createPaginatedResponse(total, notificationConfigurations
    .map(notificationConfiguration =>
      ({ ...notificationConfiguration, threshold: Number(notificationConfiguration.threshold) }),
    ))
})

export type NotificationConfigurationsResponse = Awaited<ReturnType<(typeof handler)>>

export default handler
