import { integer, numeric, pgEnum, pgTable, serial, text, timestamp, unique } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { Notifications } from './notifications.schema'
import { SensorsConfigurations } from './sensorsConfiguration.schema'

export const notificationSignEnum = pgEnum('sign', ['gte', 'lte', 'eq', 'neq', 'gt', 'lt'])

export const NotificationConfigurations = pgTable('notificationConfigurations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  notification: integer('notification').notNull().references(() => Notifications.id, { onDelete: 'cascade' }),
  sensorConfiguration: integer('sensor_configuration').notNull().references(() => SensorsConfigurations.id),
  sign: notificationSignEnum('sign').notNull(),
  threshold: numeric('threshold', { precision: 100 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, tb => ({
  notificationSensorConfigurationUnique: unique().on(tb.notification, tb.sensorConfiguration),
}))

export type InsertNotificationConfiguration = typeof NotificationConfigurations.$inferInsert
export type NotificationConfiguration = typeof NotificationConfigurations.$inferSelect

export const notificationConfigurationsInsertSchema = createInsertSchema(NotificationConfigurations)
export const notificationConfigurationsSelectSchema = createSelectSchema(NotificationConfigurations)
export const notificationConfigurationsUpdateSchema = notificationConfigurationsInsertSchema.omit({ id: true })
