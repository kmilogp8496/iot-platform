export default defineNuxtConfig({
  runtimeConfig: {
    influxHost: '',
    influxToken: '',
    influxDatabase: '',
    influxOrganization: '',
    dbUrl: '',
    supabaseProjectUrl: '',
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    'nuxt-auth-utils',
  ],
})
