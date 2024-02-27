<template>
  <div class="container h-svh flex flex-col mx-auto">
    <nav class="py-2">
      <ul class="flex items-center justify-end gap-4">
        <li>
          <UButton variant="link" to="/home">
            Inicio
          </UButton>
        </li>
      </ul>
    </nav>
    <nav class="py-2">
      <ul class="flex items-center justify-center gap-4">
        <li />
      </ul>
    </nav>
    <main class="h-full">
      <slot />
    </main>
  </div>
</template>
