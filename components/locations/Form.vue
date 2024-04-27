<script lang="ts" setup>
defineProps<{ showCredentialsInputs?: boolean }>()

const state = defineModel<{
  name: string
  project?: WithId | null
}>('state', {
  required: true,
})

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
  <UFormGroup
    label="Nombre"
    name="name"
  >
    <UInput
      v-model="state.name"
      placeholder="Nombre de la ubicación"
      :icon="ICONS.text"
    />
  </UFormGroup>
  <UFormGroup
    label="Proyecto"
    name="project"
  >
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
</template>

<style>

</style>
