import { and, eq } from 'drizzle-orm'
import { projects } from '~/server/database/schemas/projects.schema'
import { Sensors } from '~/server/database/schemas/sensors.schema'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)

  const sensorId = await getNumericIdFromRouteParams(event)

  const db = useDB()

  const sensor = (await db.select({
    id: Sensors.id,
    name: Sensors.name,
    username: Sensors.username,
  }).from(Sensors).where(
    and(
      eq(Sensors.id, sensorId),
      eq(projects.createdBy, user.id),
    ),
  ).leftJoin(projects, eq(Sensors.project, projects.id))).at(0)

  if (!sensor) {
    throw createError({
      statusCode: 404,
      message: 'Sensor no encontrado',
    })
  }

  return sensor
})
