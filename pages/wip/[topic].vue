<script lang="ts" setup>
const route = useRoute()

useHead({
  title: String(route.params.topic),
})
</script>

<template>
  <div class="flex flex-col items-center gap-8">
    <h1 class="py-10 font-bold text-2xl">
      Disponible próximamente
    </h1>
    <div>
      <UButton
        :icon="ICONS.dashboard"
        to="/dashboard"
      >
        Volver al dashboard
      </UButton>
    </div>
  </div>
</template>
