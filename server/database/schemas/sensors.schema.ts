import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { projects } from './projects.schema'

export const sensors = pgTable('sensors', {
  id: serial('id').primaryKey(),
  project: integer('project').notNull().references(() => projects.id),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
})

export type InsertSensor = typeof sensors.$inferInsert
export type Sensor = typeof sensors.$inferSelect
