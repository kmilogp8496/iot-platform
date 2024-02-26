import { eq, like, sql } from 'drizzle-orm'
import { z } from 'zod'
import { projects } from '~/server/database/schemas/projects.schema'
import { users } from '~/server/database/schemas/users.schema'
import { createPaginatedResponse, useValidatedPaginatedQuery } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)

  const query = await useValidatedPaginatedQuery(event, {
    search: z.string().optional(),
  })

  const db = useDB()

  const projectsQb = db.select({
    name: projects.name,
    createdAt: projects.createdAt,
    description: projects.description,
    createdBy: projects.createdBy,
    createdByEmail: users.email,
  }).from(projects)
    .where(eq(projects.createdBy, user!.id))
    .leftJoin(users, eq(projects.createdBy, users.id))
    .limit(query.limit)
    .offset(query.offset)
    .$dynamic()

  const totalQb = db.select({ total: sql<number>`count(*)` }).from(projects).where(eq(projects.createdBy, user!.id)).$dynamic()

  if (query.search) {
    totalQb.where(like(projects.name, `${query.search}%`))
    projectsQb.where(like(projects.name, `${query.search}%`))
  }

  const [{ total }] = await totalQb

  return createPaginatedResponse(total, await projectsQb)
})
