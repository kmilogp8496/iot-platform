import { eq, inArray, like, sql } from 'drizzle-orm'
import { z } from 'zod'
import { projects } from '~/server/database/schemas/projects.schema'
import { sensors } from '~/server/database/schemas/sensors.schema'
import { users } from '~/server/database/schemas/users.schema'
import { usersToProjects } from '~/server/database/schemas/usersToProjects.schema'
import { createPaginatedResponse, useValidatedPaginatedQuery } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)

  const query = await useValidatedPaginatedQuery(event, {
    search: z.string().optional(),
  })

  const db = useDB()

  const userProjects = await db.select({ id: usersToProjects.projectId }).from(usersToProjects).where(eq(usersToProjects.userId, user.id))

  const sensorsQb = db.select({
    name: sensors.name,
    projectName: projects.name,
    createdAt: sensors.createdAt,
    description: sensors.description,
    createdByEmail: users.email,
  })
    .from(sensors)
    .where(inArray(sensors.project, userProjects.map(p => p.id)))
    .leftJoin(users, eq(sensors.createdBy, users.id))
    .leftJoin(projects, eq(projects.id, sensors.project))
    .limit(query.limit)
    .offset(query.offset)
    .$dynamic()

  const totalQb = db.select({ total: sql<number>`count(*)` }).from(sensors)
    .where(inArray(sensors.project, userProjects.map(p => p.id)))
    .$dynamic()

  if (query.search) {
    totalQb.where(like(sensors.name, `${query.search}%`))
    sensorsQb.where(like(sensors.name, `${query.search}%`))
  }

  const [{ total }] = await totalQb

  return createPaginatedResponse(Number(total), await sensorsQb)
})
