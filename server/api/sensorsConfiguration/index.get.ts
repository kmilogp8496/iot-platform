import { and, eq, like, sql } from 'drizzle-orm'
import { z } from 'zod'
import { Locations } from '~/server/database/schemas/locations.schema'
import { projects } from '~/server/database/schemas/projects.schema'
import { Sensors } from '~/server/database/schemas/sensors.schema'
import { SensorsConfigurations } from '~/server/database/schemas/sensorsConfiguration.schema'
import { variables } from '~/server/database/schemas/variables.schema'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const query = await useValidatedPaginatedQuery(event, {
    search: z.string().optional(),
    sensor: z.preprocess(Number, z.number()).optional(),
  })

  const db = useDB()

  if (query.sensor) {
    const sensor = (await db.select({ id: Sensors.id }).from(Sensors)
      .where(
        and(
          eq(Sensors.id, query.sensor),
          eq(projects.createdBy, session.user.id),
        ),
      ).leftJoin(projects, eq(Sensors.project, projects.id))).at(0)

    if (!sensor) {
      throw createError({
        statusCode: 404,
        message: 'Sensor no encontrado',
      })
    }
  }

  const sensorConfigurationsQb = db
    .select({
      id: SensorsConfigurations.id,
      name: SensorsConfigurations.name,
      createdAt: SensorsConfigurations.createdAt,
      description: SensorsConfigurations.description,
      variable: {
        id: SensorsConfigurations.variable,
        name: variables.name,
        unit: variables.unit,
      },
      location: {
        id: SensorsConfigurations.location,
        name: Locations.name,
      },
      project: {
        name: projects.name,
      },
    })
    .from(SensorsConfigurations)
    .where(eq(SensorsConfigurations.createdBy, session.user.id))
    .leftJoin(variables, eq(SensorsConfigurations.variable, variables.id))
    .leftJoin(Locations, eq(SensorsConfigurations.location, Locations.id))
    .leftJoin(projects, eq(Locations.project, projects.id))
    .limit(query.limit)
    .offset(query.offset)
    .$dynamic()

  const totalQb = db.select({
    total: sql<number>`cast(count(${SensorsConfigurations.id}) as int)`,
  }).from(SensorsConfigurations)
    .where(eq(SensorsConfigurations.createdBy, session.user.id))
    .$dynamic()

  if (query.search) {
    sensorConfigurationsQb.where(like(SensorsConfigurations.name, `%${query.search}%`))
    totalQb.where(like(SensorsConfigurations.name, `%${query.search}%`))
  }
  if (query.sensor) {
    sensorConfigurationsQb.where(eq(SensorsConfigurations.sensor, query.sensor))
    totalQb.where(eq(SensorsConfigurations.sensor, query.sensor))
  }

  const [{ total }] = await totalQb

  return createPaginatedResponse(total, await sensorConfigurationsQb)
})
