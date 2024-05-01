import { pgTable, serial, text, timestamp, unique } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { SensorsConfigurations } from './sensorsConfiguration.schema'
import { Sensors } from './sensors.schema'
import { users } from './users.schema'

export const ActuatorConfigurations = pgTable('actuatorConfigurations', {
  id: serial('id').primaryKey(),
  sensor: serial('sensor').notNull().references(() => Sensors.id),
  sensorConfiguration: serial('sensor_configuration').notNull().references(() => SensorsConfigurations.id),
  createdBy: serial('created_by').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
}, t => ({
  sensorConfigurationUniqueWithSensor: unique().on(t.sensor, t.sensorConfiguration),
}))

export type InsertActuatorConfiguration = typeof ActuatorConfigurations.$inferInsert
export type ActuatorConfiguration = typeof ActuatorConfigurations.$inferSelect

export const ActuatorConfigurationInsertSchema = createInsertSchema(ActuatorConfigurations)
export const ActuatorConfigurationSelectSchema = createSelectSchema(ActuatorConfigurations)
export const ActuatorConfigurationUpdateSchema = ActuatorConfigurationInsertSchema.omit({ id: true })
