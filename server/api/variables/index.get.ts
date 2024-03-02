import { like, sql } from 'drizzle-orm'
import { z } from 'zod'
import { sensors } from '~/server/database/schemas/sensors.schema'
import { variables } from '~/server/database/schemas/variables.schema'
import { createPaginatedResponse, useValidatedPaginatedQuery } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const query = await useValidatedPaginatedQuery(event, {
    search: z.string().optional(),
  })

  const db = useDB()

  const variablesQB = db.select({
    id: variables.id,
    name: variables.name,
    unit: variables.unit,
    description: variables.description,
    createdAt: variables.createdAt,
  })
    .from(variables)
    .limit(query.limit)
    .offset(query.offset)
    .$dynamic()

  const totalQb = db.select({ total: sql<number>`count(*)` }).from(variables)
    .$dynamic()

  if (query.search) {
    totalQb.where(like(sensors.name, `${query.search}%`))
    variablesQB.where(like(sensors.name, `${query.search}%`))
  }

  const [{ total }] = await totalQb

  return createPaginatedResponse(Number(total), await variablesQB)
})
