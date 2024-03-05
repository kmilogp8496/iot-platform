<script setup lang="ts">
defineProps<{
  titleIcon: string
  title: string
  content: {
    locationName: string
    locationIcon: string
    locationContent: string
  }[]
}>()
</script>

<template>
  <UCard>
    <template #header>
      <slot name="title">
        <div class="flex items-center gap-2 text-xl font-semibold">
          <UIcon :name="titleIcon" class="w-8 h-8" />
          <div>
            {{ title }}
          </div>
        </div>
      </slot>
    </template>
    <div class="space-y-4">
      <div v-for="location in content" :key="location.locationName" class="flex items-center gap-2">
        <UIcon :name="location.locationIcon" class="w-8 h-8" />
        <dl>
          <dt class="text-lg font-bold">
            {{ location.locationName }}
          </dt>
          <dd class="text-primary-500 text-md">
            {{ location.locationContent }}
          </dd>
        </dl>
        <UButton variant="soft" size="md" class="ml-auto" icon="i-heroicons-eye-20-solid" />
      </div>
    </div>

    <template #footer>
      <div class="flex items-center">
        <UButton variant="ghost" class="ml-auto" trailing-icon="i-heroicons-presentation-chart-line">
          Detalles
        </UButton>
      </div>
    </template>
  </UCard>
</template>
