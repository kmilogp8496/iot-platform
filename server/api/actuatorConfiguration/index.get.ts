import { and, eq, like, sql } from 'drizzle-orm'
import { z } from 'zod'
import { ActuatorConfigurations } from '~/server/database/schemas/actuatorConfiguration.schema'
import { locations } from '~/server/database/schemas/locations.schema'
import { projects } from '~/server/database/schemas/projects.schema'
import { sensors } from '~/server/database/schemas/sensors.schema'
import { sensorsConfigurations } from '~/server/database/schemas/sensorsConfiguration.schema'
import { variables } from '~/server/database/schemas/variables.schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const query = await useValidatedPaginatedQuery(event, {
    search: z.string().optional(),
    sensor: z.preprocess(Number, z.number()),
  })

  const db = useDB()

  const sensor = (await db.select({ id: sensors.id }).from(sensors)
    .where(
      and(
        eq(sensors.id, query.sensor),
        eq(projects.createdBy, user.id),
      ),
    ).leftJoin(projects, eq(sensors.project, projects.id))).at(0)

  if (!sensor) {
    throw createError({
      statusCode: 404,
      message: 'Sensor no encontrado',
    })
  }

  const actuatorConfigurations = db
    .select({
      id: ActuatorConfigurations.id,
      name: ActuatorConfigurations.name,
      createdAt: ActuatorConfigurations.createdAt,
      description: ActuatorConfigurations.description,
      sensorConfiguration: {
        id: ActuatorConfigurations.sensorConfiguration,
        name: sensorsConfigurations.name,
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
    })
    .from(ActuatorConfigurations)

    .where(eq(ActuatorConfigurations.sensor, query.sensor))

    .leftJoin(sensorsConfigurations, eq(sensorsConfigurations.id, ActuatorConfigurations.sensorConfiguration))
    .leftJoin(variables, eq(sensorsConfigurations.variable, variables.id))
    .leftJoin(locations, eq(sensorsConfigurations.location, locations.id))

    .limit(query.limit)
    .offset(query.offset)
    .$dynamic()

  const totalQb = db.select({
    total: sql<number>`cast(count(${ActuatorConfigurations.id}) as int)`,
  }).from(ActuatorConfigurations)
    .where(eq(ActuatorConfigurations.sensor, query.sensor))
    .$dynamic()

  if (query.search) {
    actuatorConfigurations.where(like(ActuatorConfigurations.name, `%${query.search}%`))
    totalQb.where(like(ActuatorConfigurations.name, `%${query.search}%`))
  }

  const [{ total }] = await totalQb

  return createPaginatedResponse(total, await actuatorConfigurations)
})
