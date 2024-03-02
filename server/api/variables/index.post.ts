import { variables, variablesInsertSchema } from '~/server/database/schemas/variables.schema'
import { getUserFromEvent } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)

  const body = await readValidatedBody(event, variablesInsertSchema.pick({
    name: true,
    description: true,
    unit: true,
  }).parse)

  const insertVariable = {
    ...body,
    createdBy: user.id,
  }

  const db = useDB()

  return (await db.insert(variables).values(insertVariable).returning()).at(0)!
})
