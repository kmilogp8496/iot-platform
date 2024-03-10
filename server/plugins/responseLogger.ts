import { useLogger } from 'nuxt/kit'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    const loggerId = Date.now()
    event.context.loggerId = loggerId
    const logger = useLogger('DEBUG')
    logger.info(`Request ${event.method} ${event.path} ${loggerId}`)
  })

  nitroApp.hooks.hook('error', (event) => {
    const logger = useLogger('DEBUG')
    logger.info(`${event.name} ${event.message} ${event.stack}`)
  })
})
