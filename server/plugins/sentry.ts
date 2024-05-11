import { nodeProfilingIntegration } from '@sentry/profiling-node'
import * as Sentry from '@sentry/node'

declare module 'h3' {
  interface H3EventContext {
    $sentry?: typeof Sentry
  }
}

export default defineNitroPlugin((nitroApp) => {
  const { public: { sentry } } = useRuntimeConfig()

  // If no sentry DSN set, ignore and warn in the console
  if (!sentry.serverDsn) {
    console.warn('Sentry DSN not set, skipping Sentry initialization')
    return
  }

  // Initialize Sentry
  Sentry.init({
    dsn: sentry.serverDsn,
    environment: sentry.environment,
    integrations: [nodeProfilingIntegration()],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Change in production!
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0, // Change in production!
  })

  // Inside the plugin, after initializing sentry
  nitroApp.hooks.hook('error', (error) => {
    Sentry.captureException(error)
  })

  nitroApp.hooks.hook('request', (event) => {
    event.context.$sentry = Sentry
  })

  nitroApp.hooks.hook('close', async () => {
    await Sentry.close(2000)
  })
})
