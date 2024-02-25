<script lang="ts" setup>
const { user } = useUserSession()
</script>

<template>
  Welcome {{ user?.email }} - {{ user?.role }}
</template>

<style>

</style>
