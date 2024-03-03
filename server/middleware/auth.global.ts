export default defineEventHandler(async (event) => {
  if (
    event.path.startsWith('/auth')
    || event.path.startsWith('/home')
    || event.path.startsWith('/api/things')
  )
    return

  const session = await getUserSession(event)
  if (!session.user && event)
    return sendRedirect(event, '/home?error=unauthorized')
})
