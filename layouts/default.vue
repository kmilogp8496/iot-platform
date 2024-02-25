<script lang="ts" setup>
const { loggedIn, clear } = useUserSession()

function onLogout() {
  clear()
  navigateTo('/home')
}

useHead({
  titleTemplate: '%s - IoT Platform',
})
</script>

<template>
  <div class="container h-svh flex flex-col mx-auto">
    <nav class="py-2 border-b border-b-gray-200">
      <ul class="flex items-center justify-end gap-4">
        <li>
          <UButton variant="link" to="/home">
            Inicio
          </UButton>
        </li>
        <li>
          <UButton v-if="loggedIn" variant="link" @click="onLogout">
            Cerrar sesión
          </UButton>
          <UButton v-else variant="link" to="/auth/login">
            Iniciar sesión
          </UButton>
        </li>
      </ul>
    </nav>
    <nav class="py-2">
      <ul class="flex items-center justify-center gap-4">
        <li />
      </ul>
    </nav>
    <div class="inline-flex gap-4 flex-grow pt-4">
      <div class="max-w-40">
        <LayoutDesktopVerticalNavigation />
      </div>
      <main class="relative flex-grow">
        <slot />
      </main>
      <div class="hidden lg:inline-flex w-40" />
    </div>
  </div>
</template>
