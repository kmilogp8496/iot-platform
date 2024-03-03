import { eq } from 'drizzle-orm'
import { projects } from '../schemas/projects.schema'
import type { DB, SelectFields } from '~/server/utils/db'

export function getUserProjects<T extends DB, K extends SelectFields>(db: T, userId: number, fields?: K) {
  if (fields)
    return db.select(fields).from(projects).where(eq(projects.createdBy, userId)).$dynamic()

  return db.select().from(projects).where(eq(projects.createdBy, userId)).$dynamic()
}
