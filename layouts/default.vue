<script lang="ts" setup>
import { breakpointsTailwind } from '@vueuse/core'
import Spacer from '~/components/base/Spacer.vue'

const { loggedIn, clear } = useUserSession()

const { lg } = useBreakpoints(breakpointsTailwind)

async function onLogout() {
  await clear()
  navigateTo('/home')
}

useHead({
  titleTemplate: '%s - IoT Platform',
})
</script>

<template>
  <div class="container px-4 h-svh flex flex-col mx-auto">
    <nav class="py-2">
      <ul class="flex items-center gap-4">
        <ClientOnly>
          <LayoutMobileVerticalNavigation v-if="!lg" />
        </ClientOnly>
        <Spacer />
        <li>
          <UButton v-if="!loggedIn" variant="link" to="/home">
            Inicio
          </UButton>
        </li>
        <li>
          <UButton v-if="loggedIn" trailing-icon="i-mdi-logout" variant="link" @click="onLogout">
            Cerrar sesión
          </UButton>
          <UButton v-else variant="link" to="/auth/login">
            Iniciar sesión
          </UButton>
        </li>
      </ul>
    </nav>
    <div class="md:inline-flex md:gap-4 md:flex-grow pt-4">
      <ClientOnly>
        <div v-if="lg" class="max-w-40">
          <LayoutDesktopVerticalNavigation />
        </div>
      </ClientOnly>
      <main class="relative flex-grow">
        <slot />
      </main>
    </div>
    <UNotifications />
  </div>
</template>
