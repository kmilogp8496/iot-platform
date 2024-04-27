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
  <div class="h-svh flex items-stretch">
    <LayoutDesktopVerticalNavigation class="max-w-72 hidden lg:inline-flex p-4 border-r border-r-gray-300 dark:border-r-gray-600" />
    <div class="lg:container mx-auto px-4">
      <nav class="py-2">
        <ul class="flex items-center gap-2 lg:gap-4">
          <LayoutMobileVerticalNavigation class="lg:hidden mr-auto" />
          <li class="ml-auto">
            <UButton
              v-if="!loggedIn"
              variant="link"
              to="/home"
            >
              Inicio
            </UButton>
          </li>
          <li>
            <div class="truncate max-w-36 lg:max-w-max">
              {{ user?.email }}
            </div>
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
              class="text-nowrap"
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

      <main>
        <slot />
      </main>
    </div>
  </div>
</template>
