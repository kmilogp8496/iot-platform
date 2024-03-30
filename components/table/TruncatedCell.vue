<script setup lang="ts">
withDefaults(defineProps<{
  content: string
  width?: string
}>(), {
  width: 'max-w-40',
})
</script>

<template>
  <UTooltip :text="content">
    <div class="truncate" :class="[width]">
      {{ content }}
    </div>
  </UTooltip>
</template>
