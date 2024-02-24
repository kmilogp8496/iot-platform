export default defineNuxtConfig({
  runtimeConfig: {
    influxHost: '',
    influxToken: '',
    influxDatabase: '',
    influxOrganization: '',
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    'nuxt-auth-utils',
  ],
})
