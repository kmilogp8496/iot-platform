<script setup lang="ts">
const { accordionItems } = await useLayoutItems()
</script>

<template>
  <UAccordion
    multiple
    :items="accordionItems"
  >
    <template #item="{ item }">
      <UVerticalNavigation :links="item.items" />
    </template>
  </UAccordion>
</template>
