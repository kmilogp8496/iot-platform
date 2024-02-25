<script setup lang="ts">
const links = [
  {
    label: 'Dashboard',
    icon: 'i-heroicons-presentation-chart-line-solid',
    to: '/dashboard',
  },
  {
    label: 'Proyectos',
    icon: 'i-heroicons-chart-bar',
    to: '#',
  },
]
</script>

<template>
  <UVerticalNavigation :links="links" />
</template>
