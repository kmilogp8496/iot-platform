<script lang="ts" setup>
const projects = useFetch('/api/fixtures')
</script>

<template>
  <AsyncTable :columns="[]" :rows="[]" :total="0" />
</template>

<style>

</style>
