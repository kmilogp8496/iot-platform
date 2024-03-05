<script lang="ts" setup>
function dashboardCards() {
  return [
    {
      titleIcon: 'i-mdi-thermometer',
      title: 'Temperatura',
      content: [
        {
          locationName: 'Oficina',
          locationIcon: 'i-mdi-thermometer',
          locationContent: `${Math.floor(Math.random() * (30 - 20 + 1)) + 20}ºC`,
        },
        {
          locationName: 'Exterior',
          locationIcon: 'i-mdi-thermometer',
          locationContent: `${Math.floor(Math.random() * (20 - 10 + 1)) + 10}ºC`,
        },
      ],
      order: Math.random(),
    },
    {
      titleIcon: 'i-mdi-water',
      title: 'Humedad',
      content: [
        {
          locationName: 'Oficina',
          locationIcon: 'i-mdi-water',
          locationContent: `${Math.floor(Math.random() * (70 - 40 + 1)) + 40}%`,
        },
        {
          locationName: 'Exterior',
          locationIcon: 'i-mdi-water',
          locationContent: `${Math.floor(Math.random() * (90 - 60 + 1)) + 60}%`,
        },
      ],
      order: Math.random(),
    },
    {
      titleIcon: 'i-mdi-weather-sunny',
      title: 'Luminosidad',
      content: [
        {
          locationName: 'Oficina',
          locationIcon: 'i-mdi-weather-sunny',
          locationContent: `${Math.floor(Math.random() * (80 - 50 + 1)) + 50}%`,
        },
        {
          locationName: 'Exterior',
          locationIcon: 'i-mdi-weather-sunny',
          locationContent: `${Math.floor(Math.random() * (100 - 70 + 1)) + 70}%`,
        },
      ],
      order: Math.random(),
    },
    {
      titleIcon: 'i-mdi-weather-windy',
      title: 'Viento',
      content: [
        {
          locationName: 'Oficina',
          locationIcon: 'i-mdi-weather-windy',
          locationContent: `${Math.floor(Math.random() * (60 - 30 + 1)) + 30}%`,
        },
        {
          locationName: 'Exterior',
          locationIcon: 'i-mdi-weather-windy',
          locationContent: `${Math.floor(Math.random() * (90 - 60 + 1)) + 60}%`,
        },
      ],
      order: Math.random(),
    },
  ].sort((a, b) => a.order - b.order)
}
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold mb-4 text-right">
      Proyecto 1
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <DashboardCard v-for="card in dashboardCards()" :key="card.title" :title-icon="card.titleIcon" :title="card.title" :content="card.content" />
    </div>
    <h2 class="text-2xl font-bold mb-4 text-right">
      Proyecto 2
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <DashboardCard v-for="card in dashboardCards()" :key="card.title" :title-icon="card.titleIcon" :title="card.title" :content="card.content" />
    </div>
    <h2 class="text-2xl font-bold mb-4 text-right">
      Proyecto 3
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <DashboardCard v-for="card in dashboardCards()" :key="card.title" :title-icon="card.titleIcon" :title="card.title" :content="card.content" />
    </div>
  </div>
</template>

<style>

</style>
