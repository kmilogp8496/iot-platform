import { eq } from 'drizzle-orm'
import { sensors } from '../schemas/sensors.schema'
import type { DB, SelectFields } from '~/server/utils/db'

export async function getSensorById<T extends DB, K extends SelectFields>(db: T, sensorId: number, fields?: K) {
  if (fields)
    return (await db.select(fields).from(sensors).where(eq(sensors.id, sensorId))).at(0)

  return (await db.select({
    name: sensors.name,
    id: sensors.id,
    description: sensors.description,
    project: sensors.project,
  }).from(sensors).where(eq(sensors.id, sensorId))).at(0)
}
