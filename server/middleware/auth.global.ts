export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/auth') || event.path.startsWith('/home'))
    return

  const session = await getUserSession(event)
  if (!session.user && event)
    return sendRedirect(event, '/home?error=unauthorized')
})
