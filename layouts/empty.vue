<template>
  <div class="flex flex-col min-h-[100dvh]">
    <LayoutHomeHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutHomeFooter />
  </div>
</template>
