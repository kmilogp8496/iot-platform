<script lang="ts" setup>
const state = defineModel<{
  name: string
  description: string | null
  project?: WithId | null
  variables: WithId[]
}>('state', {
  required: true,
})

const loading = ref({
  project: false,
  variables: false,
})

async function onSearchProjects(search: string) {
  loading.value.project = true

  const projects = await $fetch('/api/projects', {
    params: { search },
  })

  loading.value.project = false

  return projects.results
}

async function onSearchVariables(search: string) {
  loading.value.variables = true

  const variables = await $fetch('/api/variables', {
    params: { search },
  })

  loading.value.variables = false

  return variables.results
}
</script>

<template>
  <UFormGroup label="Nombre" name="name">
    <UInput v-model="state.name" placeholder="Nombre del sensor" icon="i-heroicons-list-bullet" />
  </UFormGroup>
  <UFormGroup label="Proyecto" name="project">
    <USelectMenu
      v-model="state.project"
      :loading="loading.project"
      :searchable="onSearchProjects"
      placeholder="Seleccionar un proyecto..."
      option-attribute="name"
      trailing
      by="id"
    />
  </UFormGroup>
  <UFormGroup label="Variables" name="variables">
    <USelectMenu
      v-model="state.variables"
      :loading="loading.variables"
      :searchable="onSearchVariables"
      placeholder="Selecciona las variables del sensor..."
      option-attribute="name"
      trailing
      multiple
      by="id"
    />
  </UFormGroup>
  <UFormGroup label="Descripción" name="description">
    <UTextarea v-model="state.description" placeholder="Descripción" icon="i-heroicons-list-bullet" />
  </UFormGroup>
</template>

<style>

</style>
