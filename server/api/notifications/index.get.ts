import { eq, like, sql } from 'drizzle-orm'
import { z } from 'zod'
import { Notifications } from '~/server/database/schemas/notifications.schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const query = await useValidatedPaginatedQuery(event, {
    search: z.string().optional(),
  })

  const db = useDB()

  const notificationsQb = db.select().from(Notifications)
    .where(eq(Notifications.createdBy, user.id))
    .limit(query.limit)
    .offset(query.offset)
    .$dynamic()

  const totalQb = db.select({ total: sql`count(*)`.mapWith(Number) })
    .from(Notifications)
    .where(eq(Notifications.createdBy, user.id))
    .$dynamic()

  if (query.search) {
    totalQb.where(like(Notifications.name, `${query.search}%`))
    notificationsQb.where(like(Notifications.name, `${query.search}%`))
  }

  const [{ total }] = await totalQb

  return createPaginatedResponse(total, await notificationsQb)
})
