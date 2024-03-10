import { pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { sensors } from './sensors.schema'
import { variables } from './variables.schema'
import { locations } from './locations.schema'
import { users } from './users.schema'

export const sensorsConfiguration = pgTable('sensorsConfiguration', {
  id: serial('id').primaryKey(),
  sensorId: serial('sensor_id').notNull().references(() => sensors.id),
  variableId: serial('variable_id').notNull().references(() => variables.id),
  location: serial('location_id').notNull().references(() => locations.id),
  createdBy: serial('created_by').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
})

export type InsertSensorsConfiguration = typeof sensorsConfiguration.$inferInsert
export type SensorsConfiguration = typeof sensorsConfiguration.$inferSelect
