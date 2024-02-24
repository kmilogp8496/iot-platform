export default defineNuxtConfig({
  runtimeConfig: {
    influxHost: '',
    influxToken: '',
    influxDatabase: '',
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    'nuxt-auth-utils',
  ],
})
