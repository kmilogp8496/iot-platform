import { date, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
})

export type InsertProject = typeof projects.$inferInsert
export type Project = typeof projects.$inferSelect
