export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    const loggerId = Date.now()
    event.context.loggerId = loggerId
    console.info(`Request ${event.method} ${event.path} ${loggerId}`)
  })

  nitroApp.hooks.hook('error', (event) => {
    console.info(`${event.name} ${event.message} ${event.stack}`)
  })
})
