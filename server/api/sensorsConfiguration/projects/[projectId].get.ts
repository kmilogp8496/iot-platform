import { and, eq } from 'drizzle-orm'
import { locations } from '~/server/database/schemas/locations.schema'
import { projects } from '~/server/database/schemas/projects.schema'
import { sensors } from '~/server/database/schemas/sensors.schema'
import { SensorsConfigurations } from '~/server/database/schemas/sensorsConfiguration.schema'
import { variables } from '~/server/database/schemas/variables.schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const projectId = await getNumericIdFromRouteParams(event, 'projectId')

  const db = useDB()

  const project = (
    await db.select({ id: projects.id })
      .from(projects)
      .where(
        and(
          eq(projects.id, projectId),
          eq(projects.createdBy, user.id),
        ),
      )
  ).at(0)

  if (!project) {
    throw createError({
      statusCode: 404,
      message: 'Proyecto no encontrado',
    })
  }

  return db.select({
    id: SensorsConfigurations.id,
    name: SensorsConfigurations.name,
    sensor: {
      id: sensors.id,
      name: sensors.name,
    },
    variable: {
      id: SensorsConfigurations.variable,
      name: variables.name,
      unit: variables.unit,
    },
    location: {
      id: SensorsConfigurations.location,
      name: locations.name,
    },
  }).from(SensorsConfigurations)
    .innerJoin(sensors, and(
      eq(sensors.id, SensorsConfigurations.sensor),
      eq(sensors.project, projectId),
    ))
    .leftJoin(variables, eq(SensorsConfigurations.variable, variables.id))
    .leftJoin(locations, eq(SensorsConfigurations.location, locations.id))
})
