import { pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { sensors } from './sensors.schema'
import { variables } from './variables.schema'
import { locations } from './locations.schema'
import { users } from './users.schema'

export const sensorsConfigurations = pgTable('sensorsConfigurations', {
  id: serial('id').primaryKey(),
  sensor: serial('sensor_id').notNull().references(() => sensors.id),
  variable: serial('variable_id').notNull().references(() => variables.id),
  location: serial('location_id').notNull().references(() => locations.id),
  createdBy: serial('created_by').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
})

export type InsertSensorsConfiguration = typeof sensorsConfigurations.$inferInsert
export type SensorsConfiguration = typeof sensorsConfigurations.$inferSelect

export const sensorsConfigurationInsertSchema = createInsertSchema(sensorsConfigurations)
export const sensorsConfigurationSelectSchema = createSelectSchema(sensorsConfigurations)
export const sensorsConfigurationUpdateSchema = sensorsConfigurationInsertSchema.omit({ id: true })
