import { projects } from '~/server/database/schemas/projects.schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const db = useDB()

  const dbProjects = db.select().from(projects)

  return dbProjects
})
