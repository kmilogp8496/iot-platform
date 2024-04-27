import { variables, variablesInsertSchema } from '~/server/database/schemas/variables.schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireEventPermission(event, [
    ['CREATE', 'variables'],
  ])

  const body = await readValidatedBody(event, variablesInsertSchema.pick({
    name: true,
    description: true,
    unit: true,
    project: true,
  }).required().parse)

  const db = useDB()

  await validateProjectBelongsToUser(body.project, user!.id, db)

  const insertVariable = {
    ...body,
    createdBy: user!.id,
  }

  return (await db.insert(variables).values(insertVariable).returning()).at(0)!
})
