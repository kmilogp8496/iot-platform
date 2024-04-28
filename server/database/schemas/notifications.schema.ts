import { integer, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { users } from './users.schema'

export const notificationLevel = pgEnum('notification_level', ['info', 'warning', 'error'])
export const notificationType = pgEnum('notification_type', ['slack', 'discord', 'http'])

export const Notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  createdBy: integer('created_by').notNull().references(() => users.id),
  name: text('name').notNull(),
  message: text('message').notNull(),
  description: text('description').notNull().default(''),
  level: notificationLevel('level').notNull(),
  type: notificationType('type').notNull(),
  url: text('url').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type InsertNotification = typeof Notifications.$inferInsert
export type Notification = typeof Notifications.$inferSelect

export const notificationsInsertSchema = createInsertSchema(Notifications)
export const notificationsSelectSchema = createSelectSchema(Notifications)
export const notificationsUpdateSchema = notificationsInsertSchema.omit({ id: true })
