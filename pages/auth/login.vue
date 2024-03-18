<script setup lang="ts">
useHead({
  title: 'Iniciar sesión',
})

definePageMeta({
  layout: 'auth',
})
</script>

<template>
  <div class="min-h-full flex items-center justify-center">
    <div class="inline-flex flex-col gap-4">
      <a href="/auth/github">
        <UButton variant="outline" color="white" size="xl">
          Iniciar sesión con Github <UIcon name="i-mdi-github" />
        </UButton>
      </a>
      <a href="/auth/google">
        <UButton variant="outline" color="white" size="xl">
          Iniciar sesión con Google <UIcon name="i-mdi-google" />
        </UButton>
      </a>
    </div>
  </div>
</template>
