import { z } from 'zod'
import { sensors, sensorsInsertSchema } from '~/server/database/schemas/sensors.schema'
import { sensorsToVariables } from '~/server/database/schemas/sensorsToVariables.schema'
import { getUserFromEvent } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  const variablesSchema = z.object({
    variables: z.array(z.number()),
  })

  const body = await readValidatedBody(event, sensorsInsertSchema.pick({
    name: true,
    description: true,
    project: true,
  }).merge(variablesSchema).parse)

  const insertSensor = {
    ...body,
    createdBy: user.id,
    variables: undefined,
  }

  const db = useDB()

  const returningValue = (await db.insert(sensors).values(insertSensor).returning()).at(0)!

  await db.insert(sensorsToVariables).values(body.variables.map(variableId => ({
    sensorId: returningValue.id,
    variableId,
  })))

  return returningValue
})
