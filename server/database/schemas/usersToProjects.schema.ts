import { pgTable, primaryKey, serial } from 'drizzle-orm/pg-core'
import { projects } from './projects.schema'
import { users } from './users.schema'

export const usersToProjects = pgTable('usersToProject', {
  userId: serial('user_id').notNull().references(() => users.id),
  projectId: serial('project_id').notNull().references(() => projects.id),
}, t => ({
  pk: primaryKey({ columns: [t.userId, t.projectId], name: 'pk_usersToProject' }),
}))

export type InsertUsersToProjects = typeof usersToProjects.$inferInsert
export type UsersToProjects = typeof usersToProjects.$inferSelect
