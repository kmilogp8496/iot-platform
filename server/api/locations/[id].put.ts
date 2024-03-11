import { and, eq } from 'drizzle-orm'
import { locations, locationsUpdateSchema } from '~/server/database/schemas/locations.schema'
import { projects } from '~/server/database/schemas/projects.schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireEventPermission(event, [
    ['UPDATE', 'locations'],
  ])

  const id = await getNumericIdFromRouteParams(event)

  const body = await readValidatedBody(event, locationsUpdateSchema.pick({
    name: true,
    project: true,
  }).parse)

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

  if (body.project !== location.project) {
    const project = (await db.select({
      id: projects.id,
    }).from(projects).where(
      and(
        eq(projects.id, body.project),
        eq(projects.createdBy, user!.id),
      ),
    )).at(0)

    if (!project) {
      throw createError({
        message: 'Proyecto no encontrado',
        statusCode: 400,
      })
    }
  }

  const returningValue = (await db.update(locations).set(body).where(eq(locations.id, id)).returning()).at(0)!

  return returningValue
})
