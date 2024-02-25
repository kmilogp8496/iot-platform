export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  if (to.name?.toString().startsWith('auth-') || to.name === 'home' && !loggedIn.value)
    return

  if (to.name === 'home' && loggedIn.value)
    return navigateTo('/dashboard')

  if (!loggedIn.value)
    return navigateTo('/auth/login')
})
