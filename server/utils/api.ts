import { z } from 'zod'
import type { MaybeRef } from 'vue'
import type { ZodObject, ZodRawShape } from 'zod'
import type { H3Event } from 'h3'
import postgres from 'postgres'

export type MaybePromise<T> = T | Promise<T>

export type MaybeRefObject<T> = {
  [K in keyof T]: MaybeRef<T[K]>
}

export type QueryType<T extends ZodObject<ZodRawShape>> = Partial<MaybeRefObject<ReturnType<T['parse']>>>

export const processedNumber = z.preprocess(Number, z.number())

export const paginationQuerySchema = z.object({
  limit: processedNumber.default(20),
  offset: processedNumber.default(0),
})

export const createPaginatedQuerySchema = <T extends ZodRawShape>(schema: T) => z.object(schema).merge(paginationQuerySchema)
export const createPaginatedQuerySchemaParser = <T extends ZodRawShape>(schema: T) => createPaginatedQuerySchema(schema).parse

export function useValidatedPaginatedQuery<T extends ZodRawShape>(event: H3Event, schema: T) {
  return getValidatedQuery(event, createPaginatedQuerySchemaParser(schema))
}

export function useValidatedQuery<T extends ZodRawShape>(event: H3Event, schema: T) {
  return getValidatedQuery(event, z.object(schema).parse)
}

export function useValidatedBody<T extends ZodRawShape>(event: H3Event, schema: T) {
  return readValidatedBody(event, z.object(schema).parse)
}

export async function getUserFromEvent(event: H3Event) {
  const { user } = await requireUserSession(event)
  return user!
}

export interface PaginatedResponse<T> {
  total: number
  results: T[]
}

export const createPaginatedResponse = <T>(total: number, results: T[]): PaginatedResponse<T> => ({ total, results })

export async function getNumericIdFromRouteParams(event: H3Event, idName = 'id') {
  return (await getValidatedRouterParams(event, z.object({
    [idName]: processedNumber,
  }).parse))[idName]
}

export async function validateUniqueKeyError(error: unknown, message: string) {
  if (error instanceof postgres.PostgresError && error.routine === '_bt_check_unique') {
    throw createError({
      statusCode: 400,
      message,
    })
  }
}
