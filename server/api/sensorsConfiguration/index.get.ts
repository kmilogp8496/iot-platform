import { and, eq, like, sql } from 'drizzle-orm'
import { z } from 'zod'
import { locations } from '~/server/database/schemas/locations.schema'
import { projects } from '~/server/database/schemas/projects.schema'
import { sensors } from '~/server/database/schemas/sensors.schema'
import { sensorsConfigurations } from '~/server/database/schemas/sensorsConfiguration.schema'
import { variables } from '~/server/database/schemas/variables.schema'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const query = await useValidatedPaginatedQuery(event, {
    search: z.string().optional(),
    sensor: z.preprocess(Number, z.number()).optional(),
  })

  const db = useDB()

  if (query.sensor) {
    const sensor = (await db.select({ id: sensors.id }).from(sensors)
      .where(
        and(
          eq(sensors.id, query.sensor),
          eq(projects.createdBy, session.user.id),
        ),
      ).leftJoin(projects, eq(sensors.project, projects.id))).at(0)

    if (!sensor) {
      throw createError({
        statusCode: 404,
        message: 'Sensor no encontrado',
      })
    }
  }

  const sensorConfigurationsQb = db
    .select({
      id: sensorsConfigurations.id,
      name: sensorsConfigurations.name,
      createdAt: sensorsConfigurations.createdAt,
      description: sensorsConfigurations.description,
      variable: {
        id: sensorsConfigurations.variable,
        name: variables.name,
        unit: variables.unit,
      },
      location: {
        id: sensorsConfigurations.location,
        name: locations.name,
      },
      project: {
        name: projects.name,
      },
    })
    .from(sensorsConfigurations)
    .where(eq(sensorsConfigurations.createdBy, session.user.id))
    .leftJoin(variables, eq(sensorsConfigurations.variable, variables.id))
    .leftJoin(locations, eq(sensorsConfigurations.location, locations.id))
    .leftJoin(projects, eq(locations.project, projects.id))
    .limit(query.limit)
    .offset(query.offset)
    .$dynamic()

  const totalQb = db.select({
    total: sql<number>`cast(count(${sensorsConfigurations.id}) as int)`,
  }).from(sensorsConfigurations)
    .where(eq(sensorsConfigurations.createdBy, session.user.id))
    .$dynamic()

  if (query.search) {
    sensorConfigurationsQb.where(like(sensorsConfigurations.name, `%${query.search}%`))
    totalQb.where(like(sensorsConfigurations.name, `%${query.search}%`))
  }
  if (query.sensor) {
    sensorConfigurationsQb.where(eq(sensorsConfigurations.sensor, query.sensor))
    totalQb.where(eq(sensorsConfigurations.sensor, query.sensor))
  }

  const [{ total }] = await totalQb

  return createPaginatedResponse(total, await sensorConfigurationsQb)
})
