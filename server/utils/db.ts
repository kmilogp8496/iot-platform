import { subtle } from 'uncrypto'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

let _db: ReturnType<typeof drizzle>

export function useDB() {
  if (!_db) {
    const config = useRuntimeConfig()
    const client = neon(config.dbUrl)
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
