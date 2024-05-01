import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { Sensors } from '~/server/database/schemas/sensors.schema'
import { hashPassword } from '~/server/utils/db'
import { RolesDefinition } from '~/utils/constants'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, z.object({
    id: z.number(),
    username: z.string(),
    password: z.string(),
  }).parse)

  const db = useDB()
  const hashedPassword = await hashPassword(body.password)

  const sensor = (await db.select({ id: Sensors.id, name: Sensors.name })
    .from(Sensors)
    .where(
      and(
        eq(Sensors.id, body.id),
        eq(Sensors.username, body.username),
        eq(Sensors.password, hashedPassword),
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
