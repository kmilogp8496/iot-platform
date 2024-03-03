import { getSensorById } from '~/server/database/repositories/sensorsRepository'
import { getNumericIdFromRouteParams } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const db = useDB()

  const sensorId = await getNumericIdFromRouteParams(event)
  const sensor = await getSensorById(db, sensorId)

  if (!sensor) {
    throw createError({
      statusCode: 404,
      message: 'Sensor not found',
    })
  }

  return 'Received'
})
