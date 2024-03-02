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
    to: '/projects',
  },
  {
    label: 'Sensores',
    icon: 'i-cbi-motion-sensor-temperature',
    to: '/sensors',
  },
  {
    label: 'Variables',
    icon: 'mdi:variable',
    to: '/variables',
  },
]
</script>

<template>
  <UVerticalNavigation :links="links" />
</template>
