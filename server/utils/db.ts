import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

let _db: PostgresJsDatabase

export function useDB() {
  if (!_db) {
    const config = useRuntimeConfig()
    const client = postgres(config.dbUrl, { prepare: false })
    _db = drizzle(client)
  }
  return _db
}
