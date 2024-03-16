import { eq } from 'drizzle-orm'
import { variables, variablesInsertSchema } from '~/server/database/schemas/variables.schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireEventPermission(event, [
    ['UPDATE', 'variables'],
  ])

  const variableId = await getNumericIdFromRouteParams(event)

  const body = await readValidatedBody(event, variablesInsertSchema.pick({
    name: true,
    description: true,
    unit: true,
    project: true,
  }).required().parse)

  const db = useDB()

  await validateVariableBelongsToUserProjects(variableId, user!.id, db)
  await validateProjectBelongsToUser(body.project, user!.id, db)

  return (await db.update(variables).set(body).where(eq(variables.id, variableId)).returning()).at(0)!
})
