<script setup lang="ts">
const { accordionItems } = await useLayoutItems()

const items = computed(() => accordionItems.value.map(item => item.items ?? []))
</script>

<template>
  <UDropdown
    :items="items"
    :popper="{ placement: 'bottom-start' }"
  >
    <UIcon
      name="i-mdi:hamburger"
      class="w-6 h-6"
    />
  </UDropdown>
</template>
