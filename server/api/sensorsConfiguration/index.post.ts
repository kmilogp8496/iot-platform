import { and, eq } from 'drizzle-orm'
import { projects } from '~/server/database/schemas/projects.schema'
import { sensors } from '~/server/database/schemas/sensors.schema'
import { sensorsConfigurationInsertSchema, sensorsConfigurations } from '~/server/database/schemas/sensorsConfiguration.schema'

export default defineEventHandler(async (event) => {
  const session = await requireEventPermission(event, [
    ['CREATE', 'sensorConfiguration'],
  ])

  const body = await readValidatedBody(event, sensorsConfigurationInsertSchema.pick({
    description: true,
    name: true,
    location: true,
    variable: true,
    sensor: true,
  }).required().parse)

  const db = useDB()

  const sensor = (await db.select({ id: sensors.id }).from(sensors)
    .where(
      and(
        eq(sensors.id, body.sensor),
        eq(projects.createdBy, session.user!.id),
      ),
    ).leftJoin(projects, eq(sensors.project, projects.id))).at(0)

  if (!sensor) {
    throw createError({
      statusCode: 404,
      message: 'Sensor no encontrado',
    })
  }

  await validateLocationBelongsToUserProjects(body.location, session.user!.id, db)

  await validateVariableExists(body.variable, db)

  await db.insert(sensorsConfigurations).values({
    ...body,
    createdBy: session.user!.id,
  })

  return null
})
