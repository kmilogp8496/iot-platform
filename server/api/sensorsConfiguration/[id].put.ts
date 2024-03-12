import { eq } from 'drizzle-orm'
import { sensorsConfigurationInsertSchema, sensorsConfigurations } from '~/server/database/schemas/sensorsConfiguration.schema'

export default defineEventHandler(async (event) => {
  const session = await requireEventPermission(event, [
    ['UPDATE', 'sensorConfiguration'],
  ])

  const sensorConfigurationId = await getNumericIdFromRouteParams(event)

  const db = useDB()

  const sensorConfiguration = (await db.select({
    createdBy: sensorsConfigurations.createdBy,
    location: sensorsConfigurations.location,
    variable: sensorsConfigurations.variable,

  }).from(sensorsConfigurations).where(
    eq(sensorsConfigurations.id, sensorConfigurationId),
  )).at(0)

  if (!sensorConfiguration) {
    throw createError({
      statusCode: 404,
      message: 'Configuración de sensor no encontrada',
    })
  }

  if (sensorConfiguration.createdBy !== session.user!.id) {
    throw createError({
      statusCode: 403,
      message: 'No tienes permiso para actualizar esta configuración de sensor',
    })
  }

  const body = await readValidatedBody(event, sensorsConfigurationInsertSchema.pick({
    description: true,
    name: true,
    location: true,
    variable: true,
  }).required().parse)

  if (body.variable !== sensorConfiguration.variable)
    await validateLocationBelongsToUserProjects(body.variable, session.user!.id, db)

  if (body.variable !== sensorConfiguration.variable)
    await validateVariableExists(body.variable, db)

  await db.update(sensorsConfigurations).set(body).where(eq(sensorsConfigurations.id, sensorConfigurationId))

  return null
})
