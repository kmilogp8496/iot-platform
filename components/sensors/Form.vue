<script lang="ts" setup>
defineProps<{ showCredentialsInputs?: boolean }>()

const state = defineModel<{
  name: string
  description: string | null
  username?: string
  password?: string
  project?: WithId | null
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
</script>

<template>
  <UFormGroup label="Nombre" name="name">
    <UInput v-model="state.name" placeholder="Nombre del sensor" icon="i-heroicons-list-bullet" />
  </UFormGroup>
  <UFormGroup v-if="showCredentialsInputs" label="Usuario" name="username">
    <UInput v-model="state.username" autocomplete="off" placeholder="Nombre del sensor" icon="i-heroicons-list-bullet" />
  </UFormGroup>
  <UFormGroup v-if="showCredentialsInputs" label="Contraseña" name="password">
    <UInput v-model="state.password" autocomplete="off" type="password" placeholder="Nombre del sensor" icon="i-heroicons-list-bullet" />
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
  <UFormGroup label="Descripción" name="description">
    <UTextarea v-model="state.description" placeholder="Descripción" icon="i-heroicons-list-bullet" />
  </UFormGroup>
</template>

<style>

</style>
