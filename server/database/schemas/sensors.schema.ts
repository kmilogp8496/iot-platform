import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { projects } from './projects.schema'
import { users } from './users.schema'

export const Sensors = pgTable('sensors', {
  id: serial('id').primaryKey(),
  project: integer('project').notNull().references(() => projects.id),
  createdBy: integer('created_by').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description'),
  username: text('username').notNull().default(''),
  password: text('password').notNull().default(''),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
})

export type InsertSensor = typeof Sensors.$inferInsert
export type Sensor = typeof Sensors.$inferSelect

export const sensorsInsertSchema = createInsertSchema(Sensors)
export const sensorsSelectSchema = createSelectSchema(Sensors)
export const sensorsUpdateSchema = sensorsInsertSchema.omit({ id: true })
