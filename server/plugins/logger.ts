import { createConsola } from 'consola'

export default defineNitroPlugin((nitro) => {
  const logger = createConsola({})
  nitro.hooks.hook('request', async (event) => {
    event.context.requestTimestamp = Date.now()
    logger.info(`[REQUEST] \t ${event.context.requestTimestamp}\t ${event.method} ${event.path}`)
  })

  nitro.hooks.hook('afterResponse', async (event) => {
    const logLevel = event.node.res.statusCode >= 400 ? 'error' : 'info'

    logger[logLevel](`[RESPONSE] \t ${event.context.requestTimestamp}\t ${event.node.res.statusCode} ${event.path}`)
  })
})
