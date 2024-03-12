import { and, eq } from 'drizzle-orm'
import { projects } from '~/server/database/schemas/projects.schema'
import { sensors } from '~/server/database/schemas/sensors.schema'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)

  const sensorId = await getNumericIdFromRouteParams(event)

  const db = useDB()

  const sensor = (await db.select({ id: sensors.id, name: sensors.name }).from(sensors).where(
    and(
      eq(sensors.id, sensorId),
      eq(projects.createdBy, user.id),
    ),
  ).leftJoin(projects, eq(sensors.project, projects.id))).at(0)

  if (!sensor) {
    throw createError({
      statusCode: 404,
      message: 'Sensor no encontrado',
    })
  }

  return sensor
})
