import { pgTable, primaryKey, serial } from 'drizzle-orm/pg-core'
import { sensors } from './sensors.schema'
import { variables } from './variables.schema'

export const sensorsToVariables = pgTable('sensorsToVariables', {
  sensorId: serial('sensor_id').notNull().references(() => sensors.id),
  variableId: serial('variable_id').notNull().references(() => variables.id),
}, t => ({
  pk: primaryKey({ columns: [t.sensorId, t.variableId], name: 'pk_sensorsToVariables' }),
}))

export type InsertSensorsToVariables = typeof sensorsToVariables.$inferInsert
export type SensorsToVariables = typeof sensorsToVariables.$inferSelect
