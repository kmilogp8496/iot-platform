<template>
  <div class="container h-svh flex flex-col mx-auto">
    <nav class="px-4 py-2 flex gap-4 items-center container mx-auto">
      <AppLogo /> <ULink
        to="/home"
        class="ml-2 text-lg font-semibold"
      >
        IoT platform
      </ULink>

      <BaseSpacer />

      <BaseColorModeButton />
    </nav>
    <nav class="py-2">
      <ul class="flex items-center justify-center gap-4">
        <li />
      </ul>
    </nav>
    <main class="h-full">
      <slot />
    </main>
    <section>
      <LayoutFooter />
    </section>
  </div>
</template>
