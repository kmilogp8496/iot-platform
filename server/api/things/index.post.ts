import { z } from 'zod'
import { getSensorById } from '~/server/database/repositories/sensorsRepository'

export default defineEventHandler(async (event) => {
  // TODO - validate sensor session
  
  const db = useDB()

  const body = await readValidatedBody(event, z.object({
    id: z.number(),
    name: z.string(),
  }).parse)

  const sensor = await getSensorById(db, body.id)

  if (!sensor) {
    throw createError({
      statusCode: 404,
      message: 'Sensor not found',
    })
  }

  return body
})
