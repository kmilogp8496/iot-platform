import { createConsola } from 'consola'

export default defineNitroPlugin((nitro) => {
  const logger = createConsola()
  nitro.hooks.hook('request', async (event) => {
    event.context.requestTimestamp = Date.now()
    logger.info(`[REQUEST]  ${event.context.requestTimestamp} \t\t ${event.method} ${event.path}`)
  })

  nitro.hooks.hook('afterResponse', async (event) => {
    const logLevel = event.node.res.statusCode >= 400 ? 'error' : 'info'
    const duration = Date.now() - event.context.requestTimestamp

    logger[logLevel](`[RESPONSE] ${event.context.requestTimestamp} ${duration} ms\t ${event.node.res.statusCode} ${event.path}`)
  })
})
