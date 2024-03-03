import { eq, inArray } from 'drizzle-orm'
import { sensorsToVariables } from '../schemas/sensorsToVariables.schema'
import { variables } from '../schemas/variables.schema'
import type { DB, SelectFields } from '~/server/utils/db'

export async function getVariablesInSensors<T extends DB, K extends SelectFields>(db: T, sensorIds: number[], fields?: K) {
  if (fields) {
    return db.select(fields)
      .from(sensorsToVariables)
      .where(inArray(sensorsToVariables.sensorId, sensorIds))
      .leftJoin(variables, eq(sensorsToVariables.variableId, variables.id))
  }
  return db.select()
    .from(sensorsToVariables)
    .where(inArray(sensorsToVariables.sensorId, sensorIds))
    .leftJoin(variables, eq(sensorsToVariables.variableId, variables.id))
}
