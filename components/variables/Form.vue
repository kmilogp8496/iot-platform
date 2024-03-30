<script setup lang="ts">
const state = defineModel<{
  name: string
  unit: string
  project?: WithId | null
  description: string | null
}>('state', { required: true })

const loading = ref({
  project: false,
})

async function onSearchProjects(search: string) {
  loading.value.project = true

  const projects = await $fetch('/api/projects', {
    params: { search },
  })

  loading.value.project = false

  return projects.results
}
</script>

<template>
  <UFormGroup label="Nombre" name="name">
    <UInput v-model="state.name" placeholder="Nombre de la variable" :icon="ICONS.text" />
  </UFormGroup>
  <UFormGroup label="Unidad" name="unit">
    <UInput v-model="state.unit" placeholder="Unidad de medida (kg, ºC, L, etc...)" :icon="ICONS.text" />
  </UFormGroup>
  <UFormGroup label="Proyecto" name="project">
    <USelectMenu
      v-model="state.project"
      :loading="loading.project"
      :searchable="onSearchProjects"
      placeholder="Selecciona un proyecto..."
      option-attribute="name"
      trailing
      by="id"
    />
  </UFormGroup>
  <UFormGroup label="Descripción" name="description">
    <UTextarea v-model="state.description" placeholder="Descripción" :icon="ICONS.text" />
  </UFormGroup>
</template>
