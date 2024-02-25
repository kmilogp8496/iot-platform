export default defineEventHandler((event) => {
  console.log(`DEBUG: ${event.method} ${event.path} ${event._requestBody?.toString() ?? ''}`)
})
