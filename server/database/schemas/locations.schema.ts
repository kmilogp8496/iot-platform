import { foreignKey, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { projects } from './projects.schema'

export const locations = pgTable('locations', {
  id: serial('id').primaryKey(),
  project: integer('project').notNull().references(() => projects.id),
  parentLocation: integer('parent_location'),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
}, table => ({
  parentLocation: foreignKey({ columns: [table.parentLocation], foreignColumns: [table.id] }),
}))

export type InsertLocation = typeof locations.$inferInsert
export type Location = typeof locations.$inferSelect

export const locationsInsertSchema = createInsertSchema(locations)
export const locationsSelectSchema = createSelectSchema(locations)
export const locationsUpdateSchema = locationsInsertSchema.omit({ id: true })
