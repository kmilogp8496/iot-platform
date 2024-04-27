<script lang="ts" setup>
const state = defineModel<{
  name: string
  description: string
  location?: WithId | null
  variable?: WithId | null
}>('state', {
  required: true,
})

const loading = ref({
  location: false,
  variable: false,
})

async function onSearchLocations(search: string) {
  loading.value.location = true

  const projects = await $fetch('/api/locations', {
    params: { search },
  })

  loading.value.location = false

  return projects.results
}

async function onSearchVariables(search: string) {
  loading.value.variable = true

  const variables = await $fetch('/api/variables', {
    params: { search },
  })

  loading.value.variable = false

  return variables.results
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
    label="Ubicación"
    name="location"
  >
    <USelectMenu
      v-model="state.location"
      :loading="loading.location"
      :searchable="onSearchLocations"
      placeholder="Seleccionar una ubicación..."
      option-attribute="name"
      trailing-icon="i-mdi-map-marker"
      by="id"
    />
  </UFormGroup>
  <UFormGroup
    label="Variables"
    name="variable"
  >
    <USelectMenu
      v-model="state.variable"
      :loading="loading.variable"
      :searchable="onSearchVariables"
      placeholder="Selecciona una variable..."
      option-attribute="name"
      trailing-icon="i-mdi-variable"
      by="id"
    />
  </UFormGroup>
  <UFormGroup
    label="Descripción"
    name="description"
  >
    <UTextarea
      v-model="state.description"
      placeholder="Descripción"
      :icon="ICONS.text"
    />
  </UFormGroup>
</template>

<style>

</style>
