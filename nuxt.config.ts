export default defineNuxtConfig({
  runtimeConfig: {
    influxHost: process.env.NUXT_INFLUX_HOST,
    influxToken: process.env.NUXT_INFLUX_TOKEN,
    influxDatabase: process.env.NUXT_INFLUX_DATABASE,
    influxOrganization: process.env.NUXT_INFLUX_ORGANIZATION,
    dbUrl: process.env.NUXT_DB_URL,
    oauth: {
      github: {
        clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET,
      },
      google: {
        clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET,
      },
    },
    aiApiKey: process.env.NUXT_AI_API_KEY,
    aiClientId: process.env.NUXT_AI_CLIENT_ID,
    public: {
      sentry: {
        dsn: process.env.NUXT_SENTRY_DSN,
        serverDsn: process.env.NUXT_SENTRY_SERVER_DSN,
        environment: process.env.NUXT_SENTRY_ENVIRONMENT,
      },
      studio: {
        tokens: process.env.NUXT_PUBLIC_STUDIO_TOKENs,
      },
    },
  },
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@vueuse/nuxt',
    '@nuxt/fonts',
    '@nuxt/eslint',
    '@nuxthq/studio',
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
  },
})
