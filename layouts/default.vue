<script lang="ts" setup>
import Spacer from '~/components/base/Spacer.vue'

const { loggedIn, clear, user } = useUserSession()

async function onLogout() {
  await clear()
  navigateTo('/home')
}

useHead({
  titleTemplate: '%s - IoT Platform',
})
</script>

<template>
  <div class="lg:container px-4 h-svh flex flex-col mx-auto">
    <nav class="py-2">
      <ul class="flex items-center gap-4">
        <LayoutMobileVerticalNavigation class="lg:hidden" />
        <Spacer />
        <li>
          <UButton
            v-if="!loggedIn"
            variant="link"
            to="/home"
          >
            Inicio
          </UButton>
        </li>
        <li class="capitalize">
          {{ user?.role }}
        </li>
        <li>
          <BaseColorModeButton />
        </li>
        <li>
          <UButton
            v-if="loggedIn"
            color="black"
            trailing-icon="i-mdi-logout"
            variant="link"
            @click="onLogout"
          >
            Cerrar sesión
          </UButton>
          <UButton
            v-else
            variant="link"
            to="/auth/login"
          >
            Iniciar sesión
          </UButton>
        </li>
      </ul>
    </nav>
    <div class="lg:inline-flex lg:gap-4 lg:flex-grow pt-4">
      <div class="hidden lg:inline-block max-w-40">
        <LayoutDesktopVerticalNavigation />
      </div>
      <main class="relative flex-grow">
        <slot />
      </main>
    </div>
  </div>
</template>
