import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  out: 'server/database/migrations',
  schema: ['./server/database/**/*.schema.ts'],
  dbCredentials: {
    // connectionString: process.env.NUXT_DB_URL ?? '',
    url: process.env.NUXT_DB_URL ?? '',
  },
})
