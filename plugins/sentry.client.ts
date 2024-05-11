import { init, browserTracingIntegration, replayIntegration } from '@sentry/vue'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const { public: { sentry } } = useRuntimeConfig()

  if (!sentry.dsn) {
    return
  }

  init({
    app: nuxtApp.vueApp,
    dsn: sentry.dsn,
    environment: sentry.environment,
    integrations: [
      browserTracingIntegration({ router }),
      replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Configure this whole part as you need it!

    tracesSampleRate: 0.2, // Change in prod

    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost', 'https://iot.kmilo.dev'],

    replaysSessionSampleRate: 1.0, // Change in prod
    replaysOnErrorSampleRate: 1.0, // Change in prod if necessary
  })
})
