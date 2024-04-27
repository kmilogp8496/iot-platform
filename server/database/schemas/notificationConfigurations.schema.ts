import { integer, numeric, pgEnum, pgTable, serial, timestamp, unique } from 'drizzle-orm/pg-core'
import { Notifications } from './notifications.schema'
import { SensorsConfigurations } from './sensorsConfiguration.schema'

export const notificationSignEnum = pgEnum('sign', ['gte', 'lte', 'eq', 'neq', 'gt', 'lt'])

export const NotificationConfigurations = pgTable('notificationConfigurations', {
  id: serial('id').primaryKey(),
  notification: integer('notification').notNull().references(() => Notifications.id, { onDelete: 'cascade' }),
  sensorConfiguration: integer('sensor_configuration').notNull().references(() => SensorsConfigurations.id),
  sign: notificationSignEnum('sign').notNull(),
  threshold: numeric('threshold', { precision: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, tb => ({
  notificationSensorConfigurationUnique: unique().on(tb.notification, tb.sensorConfiguration),
}))
