import { projects, projectsInsertSchema } from '~/server/database/schemas/projects.schema'
import { usersToProjects } from '~/server/database/schemas/usersToProjects.schema'
import { getUserFromEvent } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)

  const body = await readValidatedBody(event, projectsInsertSchema.pick({
    name: true,
    description: true,
  }).parse)

  const insertProject = {
    ...body,
    createdBy: user.id,
  }

  const db = useDB()

  const createdProject = (await db.insert(projects).values(insertProject).returning()).at(0)!

  await db.insert(usersToProjects).values({
    userId: user.id,
    projectId: createdProject.id,
  })

  return createdProject
})
