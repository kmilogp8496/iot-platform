import { numeric, pgTable, serial, text, timestamp, unique } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { Sensors } from './sensors.schema'
import { variables } from './variables.schema'
import { Locations } from './locations.schema'
import { users } from './users.schema'

export const SensorsConfigurations = pgTable('sensorsConfigurations', {
  id: serial('id').primaryKey(),
  sensor: serial('sensor_id').notNull().references(() => Sensors.id),
  variable: serial('variable_id').notNull().references(() => variables.id),
  location: serial('location_id').notNull().references(() => Locations.id),
  createdBy: serial('created_by').notNull().references(() => users.id),
  lastValue: numeric('last_value', { precision: 10, scale: 2 }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdateFn(() => new Date()),
  deletedAt: timestamp('deleted_at'),
}, tb => ({
  sensorsConfigurationNameIdUnique: unique().on(tb.sensor, tb.name, tb.location, tb.variable),
}))

export type InsertSensorsConfiguration = typeof SensorsConfigurations.$inferInsert
export type SensorsConfiguration = typeof SensorsConfigurations.$inferSelect

export const sensorsConfigurationInsertSchema = createInsertSchema(SensorsConfigurations)
export const sensorsConfigurationSelectSchema = createSelectSchema(SensorsConfigurations)
export const sensorsConfigurationUpdateSchema = sensorsConfigurationInsertSchema.omit({ id: true })
