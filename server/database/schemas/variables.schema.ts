import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const variables = pgTable('variables', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  unit: text('unit').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
})

export type InsertVariable = typeof variables.$inferInsert
export type Variable = typeof variables.$inferSelect
