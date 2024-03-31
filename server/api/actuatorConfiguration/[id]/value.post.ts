import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { ActuatorConfigurations } from '~/server/database/schemas/actuatorConfiguration.schema'
import { webSocketPeers } from '~/server/routes/_ws'

export default defineEventHandler(async (event) => {
  const { user } = await requireEventPermission(event, [
    ['UPDATE', 'actuators'],
  ])
  const actuatorConfigurationId = await getNumericIdFromRouteParams(event)

  const body = await readValidatedBody(event, z.object({
    value: z.number().max(65535).min(0),
  }).parse)

  const db = useDB()

  const actuatorConfiguration = (await db.select({
    id: ActuatorConfigurations.id,
    sensor: ActuatorConfigurations.sensor,
    sensorConfiguration: ActuatorConfigurations.sensorConfiguration,
  })
    .from(ActuatorConfigurations)
    .where(
      and(
        eq(ActuatorConfigurations.id, actuatorConfigurationId),
        eq(ActuatorConfigurations.createdBy, user.id),
      ),
    )).at(0)

  if (!actuatorConfiguration) {
    throw createError({
      statusCode: 404,
      message: 'Configuración de actuador no encontrada',
    })
  }

  const wsConnection = webSocketPeers.get(actuatorConfiguration.sensor)

  if (wsConnection?.peer.readyState !== 1 /** OPEN */) {
    throw createError({
      statusCode: 400,
      message: 'El actuador no está conectado',
    })
  }

  const message = {
    [actuatorConfiguration.sensorConfiguration]: body.value,
  }

  wsConnection.peer.send(message)

  return message
})
