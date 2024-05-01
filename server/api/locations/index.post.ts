import { and, eq } from 'drizzle-orm'
import { Locations, locationsInsertSchema } from '~/server/database/schemas/locations.schema'
import { projects } from '~/server/database/schemas/projects.schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireEventPermission(event, [
    ['CREATE', 'locations'],
  ])

  const body = await readValidatedBody(event, locationsInsertSchema.pick({
    name: true,
    project: true,
  }).parse)

  const db = useDB()

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

  const returningValue = (await db.insert(Locations).values(body).returning()).at(0)!

  return returningValue
})
