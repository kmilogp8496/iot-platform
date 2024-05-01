import { and, eq, like, sql } from 'drizzle-orm'
import { z } from 'zod'
import { ActuatorConfigurations } from '~/server/database/schemas/actuatorConfiguration.schema'
import { Locations } from '~/server/database/schemas/locations.schema'
import { projects } from '~/server/database/schemas/projects.schema'
import { Sensors } from '~/server/database/schemas/sensors.schema'
import { SensorsConfigurations } from '~/server/database/schemas/sensorsConfiguration.schema'
import { variables } from '~/server/database/schemas/variables.schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const query = await useValidatedPaginatedQuery(event, {
    search: z.string().optional(),
    sensor: z.preprocess(Number, z.number()),
  })

  const db = useDB()

  const sensor = (await db.select({ id: Sensors.id }).from(Sensors)
    .where(
      and(
        eq(Sensors.id, query.sensor),
        eq(projects.createdBy, user.id),
      ),
    ).leftJoin(projects, eq(Sensors.project, projects.id))).at(0)

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
        name: SensorsConfigurations.name,
      },
      variable: {
        id: SensorsConfigurations.variable,
        name: variables.name,
        unit: variables.unit,
      },
      location: {
        id: SensorsConfigurations.location,
        name: Locations.name,
      },
    })
    .from(ActuatorConfigurations)

    .where(eq(ActuatorConfigurations.sensor, query.sensor))

    .leftJoin(SensorsConfigurations, eq(SensorsConfigurations.id, ActuatorConfigurations.sensorConfiguration))
    .leftJoin(variables, eq(SensorsConfigurations.variable, variables.id))
    .leftJoin(Locations, eq(SensorsConfigurations.location, Locations.id))

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
