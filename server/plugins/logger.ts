import { createConsola } from 'consola'

export default defineNitroPlugin((nitro) => {
  const logger = createConsola({
    fancy: true,
  })
  nitro.hooks.hook('request', async (event) => {
    if (event.path.startsWith('/_nuxt') || event.path.startsWith('/favicon.ico')) {
      return
    }
    event.context.requestTimestamp = Date.now()
    logger.info(`[REQUEST]  ${event.context.requestTimestamp} \t ${event.method} ${event.path}`)
  })

  nitro.hooks.hook('afterResponse', async (event) => {
    if (event.path.startsWith('/_nuxt') || event.path.startsWith('/favicon.ico')) {
      return
    }
    const logLevel = event.node.res.statusCode >= 400 ? 'error' : 'info'
    const duration = Date.now() - event.context.requestTimestamp

    logger[logLevel](`[RESPONSE] ${event.context.requestTimestamp} ${duration} ms\t ${event.node.res.statusCode} ${event.path}`)
  })
})
