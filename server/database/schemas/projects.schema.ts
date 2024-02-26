import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { users } from './users.schema'

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdBy: integer('created_by').notNull().references(() => users.id),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
})

export type InsertProject = typeof projects.$inferInsert
export type Project = typeof projects.$inferSelect

export const projectsInsertSchema = createInsertSchema(projects)
export const projectsSelectSchema = createSelectSchema(projects)
export const projectsUpdateSchema = projectsInsertSchema.omit({ id: true })
