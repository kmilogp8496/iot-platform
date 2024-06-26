export default defineEventHandler(async (event) => {
  if (
    event.path.startsWith('/auth')
    || event.path.startsWith('/home')
    || event.path.startsWith('/api/_content')
    || event.path.startsWith('/api/things')
  )
    return

  const session = await getUserSession(event)

  if (session.user && event.context.$sentry) {
    event.context.$sentry.setUser({
      id: session.user.id,
      email: session.user.email,
      ip_address: event.node.req.socket.remoteAddress,
    })
  }

  if (!session.user && event)
    return sendRedirect(event, '/home?error=unauthorized')
})
