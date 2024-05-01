import { z } from 'zod'
import { Sensors, sensorsInsertSchema } from '~/server/database/schemas/sensors.schema'
import { getUserFromEvent } from '~/server/utils/api'
import { hashPassword } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await requireEventPermission(event, [
    ['CREATE', 'sensors'],
  ])

  const user = await getUserFromEvent(event)
  const extraSchema = z.object({
    password: z.string().min(8),
  })

  const body = await readValidatedBody(event, sensorsInsertSchema.pick({
    name: true,
    description: true,
    project: true,
    username: true,
  }).merge(extraSchema).parse)

  const hashedPassword = await hashPassword(body.password)

  const insertSensor = {
    ...body,
    createdBy: user.id,
    variables: undefined,
    password: hashedPassword,
  }

  const db = useDB()

  const returningValue = (await db.insert(Sensors).values(insertSensor).returning()).at(0)!

  return returningValue
})
