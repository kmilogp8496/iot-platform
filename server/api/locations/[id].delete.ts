import { and, eq } from 'drizzle-orm'
import { Locations } from '~/server/database/schemas/locations.schema'
import { projects } from '~/server/database/schemas/projects.schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireEventPermission(event, [
    ['DELETE', 'locations'],
  ])

  const id = await getNumericIdFromRouteParams(event)

  const db = useDB()

  const location = (await db.select({
    id: Locations.id,
    project: Locations.project,
  })
    .from(Locations).where(
      and(
        eq(Locations.id, id),
        eq(projects.createdBy, user!.id),
      ),
    )
    .leftJoin(projects, eq(projects.id, Locations.project))).at(0)

  if (!location) {
    throw createError({
      message: 'Ubicación no encontrada',
      statusCode: 404,
    })
  }

  return (await db.delete(Locations).where(eq(Locations.id, id))).at(0)!
})
