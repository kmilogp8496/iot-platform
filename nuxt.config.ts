export default defineNuxtConfig({
  runtimeConfig: {
    influxHost: '',
    influxToken: '',
    influxDatabase: '',
    influxOrganization: '',
    dbUrl: '',
  },
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
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
})
