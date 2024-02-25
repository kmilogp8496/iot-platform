import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const USER_ROLES = ['ADMIN', 'USER', 'GUEST'] as const

export type UserRoles = typeof USER_ROLES[number]

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  role: text('role', { enum: USER_ROLES }).notNull().default('GUEST'),
})

export type InsertUser = typeof users.$inferInsert
export type User = typeof users.$inferSelect
