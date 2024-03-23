import { and, eq, like, sql } from 'drizzle-orm'
import { z } from 'zod'
import { locations } from '~/server/database/schemas/locations.schema'
import { projects } from '~/server/database/schemas/projects.schema'
import { sensors } from '~/server/database/schemas/sensors.schema'
import { sensorsConfigurations } from '~/server/database/schemas/sensorsConfiguration.schema'
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
    id: sensorsConfigurations.id,
    name: sensorsConfigurations.name,
    sensor: {
      id: sensors.id,
      name: sensors.name,
    },
    variable: {
      id: sensorsConfigurations.variable,
      name: variables.name,
      unit: variables.unit,
    },
    location: {
      id: sensorsConfigurations.location,
      name: locations.name,
    },
  }).from(sensorsConfigurations)
    .innerJoin(sensors, and(
      eq(sensors.id, sensorsConfigurations.sensor),
      eq(sensors.project, projectId),
    ))
    .leftJoin(variables, eq(sensorsConfigurations.variable, variables.id))
    .leftJoin(locations, eq(sensorsConfigurations.location, locations.id))
})
