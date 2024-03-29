import { count, desc, eq, inArray, like, sql } from 'drizzle-orm'
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
  if (!userProjects.length)
    return createPaginatedResponse(0, [])

  const sensorsQb = db.select({
    id: sensors.id,
    name: sensors.name,
    project: {
      name: projects.name,
      id: projects.id,
    },
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
    .orderBy(desc(sensors.createdAt))
    .$dynamic()

  const totalQb = db.select({ total: count() }).from(sensors)
    .where(inArray(sensors.project, userProjects.map(p => p.id)))
    .$dynamic()

  if (query.search) {
    totalQb.where(like(sensors.name, `${query.search}%`))
    sensorsQb.where(like(sensors.name, `${query.search}%`))
  }
  const sensorsResults = await sensorsQb

  if (!sensorsResults.length)
    return createPaginatedResponse(0, [])

  const [{ total }] = await totalQb

  return createPaginatedResponse(total, sensorsResults)
})
