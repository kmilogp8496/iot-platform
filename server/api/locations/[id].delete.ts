import { and, eq } from 'drizzle-orm'
import { locations } from '~/server/database/schemas/locations.schema'
import { projects } from '~/server/database/schemas/projects.schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireEventPermission(event, [
    ['DELETE', 'locations'],
  ])

  const id = await getNumericIdFromRouteParams(event)

  const db = useDB()

  const location = (await db.select({
    id: locations.id,
    project: locations.project,
  })
    .from(locations).where(
      and(
        eq(locations.id, id),
        eq(projects.createdBy, user!.id),
      ),
    )
    .leftJoin(projects, eq(projects.id, locations.project))).at(0)

  if (!location) {
    throw createError({
      message: 'Ubicación no encontrada',
      statusCode: 404,
    })
  }

  return (await db.delete(locations).where(eq(locations.id, id)).returning()).at(0)!
})
