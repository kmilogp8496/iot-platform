<script lang="ts" setup>
import { signLabels, type sign } from './notificationConfiguration.constants'

const state = defineModel<{
  name: string
  sign: (typeof sign)[number]
  threshold: number
  sensorConfiguration?: WithId | null
}>('state', {
      required: true,
    })

const loading = ref({
  sensorConfigurations: false,
})

async function onSearchSensorConfiguration(search: string) {
  loading.value.sensorConfigurations = true

  const sensorConfigurations = await $fetch('/api/sensorsConfiguration', {
    params: { search },
  })

  loading.value.sensorConfigurations = false

  return sensorConfigurations.results
}
</script>

<template>
  <UFormGroup
    label="Nombre"
    name="name"
  >
    <UInput
      v-model="state.name"
      placeholder="Nombre de la configuración"
      :icon="ICONS.text"
    />
  </UFormGroup>
  <UFormGroup
    label="Configuración del sensor"
    name="sensorConfiguration"
  >
    <USelectMenu
      v-model="state.sensorConfiguration as WithId"
      :loading="loading.sensorConfigurations"
      :searchable="onSearchSensorConfiguration"
      placeholder="Configuración del sensor"
      option-attribute="name"
      :trailing-icon="ICONS.sensorConfiguration"
      by="id"
    />
  </UFormGroup>
  <UFormGroup
    label="Comparación"
    name="sign"
  >
    <USelectMenu
      v-model="state.sign"
      placeholder="Comparación"
      :trailing-icon="ICONS.sensorConfiguration"
      :options="signLabels"
      value-attribute="value"
      option-attribute="label"
    />
  </UFormGroup>
  <UFormGroup
    label="Umbral"
    name="threshold"
  >
    <UInput
      v-model.number="state.threshold"
      type="number"
      placeholder="Umbral"
      :icon="ICONS.text"
    />
  </UFormGroup>
</template>
