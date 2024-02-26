import type { PaginatedResponse } from '~/server/utils/api'

export type InferPaginationItem<T extends ReturnType<typeof useFetch>, K = Exclude<T['data']['value'], null>> = K extends PaginatedResponse<any> ? K['results'][number] : never
export type InferResponse<T extends ReturnType<typeof useFetch>> = Exclude<T['data']['value'], null>
