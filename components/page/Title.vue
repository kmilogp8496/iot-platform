<script lang="ts" setup>
const props = defineProps<{
  title: string
}>()

useHead({
  title: props.title,
})
</script>

<template>
  <h1 class="text-2xl font-semibold">
    {{ title }}
  </h1>
</template>

<style>

</style>
