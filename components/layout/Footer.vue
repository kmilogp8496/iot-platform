<template>
  <footer class="px-4 py-10">
    <div class="flex flex-col gap-4 items-center">
      <div class="inline-flex gap-4 items-center">
        <AppLogo />
        <BaseColorModeButton />
        <ULink
          variant="ghost"
          to="https://github.com/kmilogp8496/iot-platform"
          target="_blank"
        >
          <UIcon name="i-mdi-github" />
        </ULink>
      </div>
      <p class="text-gray-600">
        © 2024 IoT platform.  Todos los derechos reservados.
      </p>
    </div>
  </footer>
</template>
