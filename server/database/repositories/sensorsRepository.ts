import { eq } from 'drizzle-orm'
import { Sensors } from '../schemas/sensors.schema'
import type { DB, SelectFields } from '~/server/utils/db'

export async function getSensorById<T extends DB, K extends SelectFields>(db: T, sensorId: number, fields?: K) {
  if (fields)
    return (await db.select(fields).from(Sensors).where(eq(Sensors.id, sensorId))).at(0)

  return (await db.select({
    name: Sensors.name,
    id: Sensors.id,
    description: Sensors.description,
    project: Sensors.project,
  }).from(Sensors).where(eq(Sensors.id, sensorId))).at(0)
}
