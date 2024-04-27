<script setup lang="ts">
defineProps<{
  title: string
  icon: string
  description: string
  href: string
}>()
</script>

<template>
  <div class="rounded-lg px-4 py-6 border shadow-sm border-gray-200 dark:border-gray-800 max-w-[400px] text-left">
    <ULink :href>
      <div class="flex justify-between">
        <h2 class="font-semibold text-2xl">
          {{ title }}
        </h2>

        <UIcon
          :name="icon"
          class="text-4xl"
        />
      </div>
      <p class="text-gray-500 mt-4 text-left">
        {{ description }}
      </p>
    </ULink>
  </div>
</template>
