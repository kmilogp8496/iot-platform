import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

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

export const variablesInsertSchema = createInsertSchema(variables)
export const variablesSelectSchema = createSelectSchema(variables)
export const variablesUpdateSchema = variablesInsertSchema.omit({ id: true })
