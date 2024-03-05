export default defineEventHandler((event) => {
  // eslint-disable-next-line no-console
  console.log(`DEBUG: ${event.method} ${event.path} ${event._requestBody?.toString() ?? ''}`)
})
