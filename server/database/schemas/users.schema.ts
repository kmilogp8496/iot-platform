import { pgTable, serial, text } from 'drizzle-orm/pg-core'

export const USER_ROLES = ['ADMIN', 'USER', 'GUEST'] as const

export type UserRoles = typeof USER_ROLES[number]

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  role: text('role', { enum: USER_ROLES }).notNull().default('GUEST'),
})

export type InsertUser = typeof users.$inferInsert
export type User = typeof users.$inferSelect
