import { eq, inArray, like, sql } from 'drizzle-orm'
import { z } from 'zod'
import { projects } from '~/server/database/schemas/projects.schema'
import { variables } from '~/server/database/schemas/variables.schema'
import { createPaginatedResponse, useValidatedPaginatedQuery } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const query = await useValidatedPaginatedQuery(event, {
    search: z.string().optional(),
  })

  const db = useDB()

  const projectIds = await db.select({ id: projects.id }).from(projects).where(eq(projects.createdBy, user.id))

  if (!projectIds.length)
    return createPaginatedResponse(0, [])

  const variablesQB = db.select({
    id: variables.id,
    name: variables.name,
    unit: variables.unit,
    project: {
      id: projects.id,
      name: projects.name,
    },
    description: variables.description,
    createdAt: variables.createdAt,
  })
    .from(variables)
    .leftJoin(projects, eq(variables.project, projects.id))
    .where(inArray(variables.project, projectIds.map(p => p.id)))
    .limit(query.limit)
    .offset(query.offset)
    .$dynamic()

  const totalQb = db.select({ total: sql<number>`count(*)` }).from(variables)
    .$dynamic()

  if (query.search) {
    totalQb.where(like(variables.name, `${query.search}%`))
    variablesQB.where(like(variables.name, `${query.search}%`))
  }

  const [{ total }] = await totalQb

  return createPaginatedResponse(Number(total), await variablesQB)
})
