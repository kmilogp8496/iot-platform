import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users.schema'

export const Notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  createdBy: integer('created_by').notNull().references(() => users.id),
  name: text('name').notNull(),
  message: text('message').notNull(),
  description: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
