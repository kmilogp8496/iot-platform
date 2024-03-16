export default defineNuxtConfig({
  runtimeConfig: {
    influxHost: '',
    influxToken: '',
    influxDatabase: '',
    influxOrganization: '',
    dbUrl: '',
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@vueuse/nuxt',
    '@nuxt/fonts',
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  css: ['~/assets/css/main.css'],
})
