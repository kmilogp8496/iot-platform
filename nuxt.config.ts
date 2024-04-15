export default defineNuxtConfig({
  runtimeConfig: {
    influxHost: process.env.NUXT_INFLUX_HOST ?? '',
    influxToken: process.env.NUXT_INFLUX_TOKEN ?? '',
    influxDatabase: process.env.NUXT_INFLUX_DATABASE ?? '',
    influxOrganization: process.env.NUXT_INFLUX_ORGANIZATION ?? '',
    dbUrl: process.env.NUXT_DB_URL ?? '',
  },
  modules: [
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@vueuse/nuxt',
    '@nuxt/fonts',
    '@nuxt/eslint',
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  css: ['~/assets/css/main.css'],
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  nitro: {
    experimental: {
      websocket: true,
    },
    prerender: {
      autoSubfolderIndex: false,
    },
  },
})
