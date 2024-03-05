<script setup lang="ts">
import { NAVIGATION_LINKS } from './navigationitems'
</script>

<template>
  <UDropdown :items="[NAVIGATION_LINKS]" :popper="{ placement: 'bottom-start' }">
    <UIcon name="i-mdi:hamburger" class="w-6 h-6" />
  </UDropdown>
</template>
