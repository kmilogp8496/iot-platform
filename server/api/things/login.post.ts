import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { sensors } from '~/server/database/schemas/sensors.schema'
import { hashPassword } from '~/server/utils/db'
import { RolesDefinition } from '~/utils/constants'

export default defineEventHandler(async (event) => {
  const db = useDB()

  const body = await readValidatedBody(event, z.object({
    id: z.number(),
    username: z.string(),
    password: z.string(),
  }).parse)

  const hashedPassword = await hashPassword(body.password)

  const sensor = (await db.select({ id: sensors.id, name: sensors.name })
    .from(sensors)
    .where(
      and(
        eq(sensors.id, body.id),
        eq(sensors.username, body.username),
        eq(sensors.password, hashedPassword),
      ),
    )).at(0)

  if (!sensor) {
    throw createError({
      statusCode: 401,
      message: 'Credenciales inválidas',
    })
  }

  await setUserSession(event, {
    loggedAt: new Date(),
    user: {
      email: sensor.name,
      role: RolesDefinition.SENSOR,
      firstName: '',
      lastName: '',
      id: sensor.id,
    },
  })

  return null
})
