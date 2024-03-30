<script lang="ts" setup>
const props = defineProps<{
  sensorId: number
}>()
const state = defineModel<{
  name: string
  description: string
  sensorConfiguration?: WithId | null
}>('state', {
  required: true,
})

const loading = ref({
  sensorConfiguration: false,
})

async function onSearchSensorConfigurations(search: string) {
  loading.value.sensorConfiguration = true

  const sensorConfigurations = await $fetch('/api/sensorsConfiguration', {
    params: { search, sensor: props.sensorId },
  })

  loading.value.sensorConfiguration = false

  return sensorConfigurations.results
}
</script>

<template>
  <UFormGroup label="Nombre" name="name">
    <UInput v-model="state.name" placeholder="Nombre de la configuración de actuador" :icon="ICONS.text" />
  </UFormGroup>
  <UFormGroup label="Configuración de sensor" name="sensorConfiguration">
    <USelectMenu
      v-model="state.sensorConfiguration"
      :loading="loading.sensorConfiguration"
      :searchable="onSearchSensorConfigurations"
      placeholder="Seleccionar una configuración de sensor..."
      option-attribute="name"
      :trailing-icon="ICONS.sensorConfiguration"
      by="id"
    />
  </UFormGroup>
  <UFormGroup label="Descripción" name="description">
    <UTextarea v-model="state.description" placeholder="Descripción" :icon="ICONS.text" />
  </UFormGroup>
</template>

<style>

</style>
