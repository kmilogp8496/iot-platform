<script setup lang="ts">
useHead({
  title: 'Iniciar sesión',
})
</script>

<template>
  <div class="min-h-full flex items-center justify-center">
    <div class="inline-flex flex-col gap-4">
      <a href="/auth/github">
        <UButton variant="outline" class="border border-gray-300" size="xl">
          Iniciar sesión con Github <UIcon name="i-logos-github-icon" />
        </UButton>
      </a>
    </div>
  </div>
</template>
