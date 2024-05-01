import { foreignKey, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { projects } from './projects.schema'

export const Locations = pgTable('locations', {
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

export type InsertLocation = typeof Locations.$inferInsert
export type Location = typeof Locations.$inferSelect

export const locationsInsertSchema = createInsertSchema(Locations)
export const locationsSelectSchema = createSelectSchema(Locations)
export const locationsUpdateSchema = locationsInsertSchema.omit({ id: true })
