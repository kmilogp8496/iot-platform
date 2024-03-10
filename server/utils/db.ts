import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { subtle } from 'uncrypto'

let _db: PostgresJsDatabase

export function useDB() {
  if (!_db) {
    const config = useRuntimeConfig()
    const client = postgres(config.dbUrl, { prepare: false })
    _db = drizzle(client)
  }
  return _db
}

export type DB = ReturnType<typeof useDB>
export type SelectFields = Exclude<Parameters<DB['select']>[0], undefined>

export async function hashPassword(password: string) {
  return new TextDecoder().decode(await subtle.digest({
    name: 'SHA-256',
  }, new TextEncoder().encode(password)))
}
