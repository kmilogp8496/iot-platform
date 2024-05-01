import { eq, like, sql } from 'drizzle-orm'
import { z } from 'zod'
import { Locations } from '~/server/database/schemas/locations.schema'
import { projects } from '~/server/database/schemas/projects.schema'
import { usersToProjects } from '~/server/database/schemas/usersToProjects.schema'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)

  const query = await useValidatedPaginatedQuery(event, {
    search: z.string().optional(),
  })

  const db = useDB()

  const locationsQb = db
    .select({
      id: Locations.id,
      name: Locations.name,
      createdAt: Locations.createdAt,
      updatedAt: Locations.updatedAt,
      project: {
        id: projects.id,
        name: projects.name,
      },
    })
    .from(Locations)
    .leftJoin(usersToProjects, eq(Locations.project, usersToProjects.projectId))
    .leftJoin(projects, eq(projects.id, usersToProjects.projectId))
    .where(eq(usersToProjects.userId, user.id))
    .limit(query.limit)
    .offset(query.offset)
    .$dynamic()

  const totalQb = db.select({
    total: sql<number>`cast(count(${Locations.id}) as int)`,
  }).from(usersToProjects)
    .where(eq(usersToProjects.userId, user.id))
    .leftJoin(Locations, eq(Locations.project, usersToProjects.projectId))
    .$dynamic()

  if (query.search) {
    locationsQb.where(like(Locations.name, `%${query.search}%`))
    totalQb.where(like(Locations.name, `%${query.search}%`))
  }

  const [{ total }] = await totalQb

  return createPaginatedResponse(total, await locationsQb)
})
