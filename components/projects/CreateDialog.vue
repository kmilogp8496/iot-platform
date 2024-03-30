<script lang="ts" setup>
import { z } from 'zod'
import { displayErrorFromApi } from '~/utils/notifications'
import type { InferResponse } from '~/utils/typing.ts'

const emit = defineEmits<{
  created: [InferResponse<typeof createProject>]
}>()

const model = defineModel({
  default: false,
})

const state = ref({
  name: '',
  description: '',
})

const createProject = useFetch('/api/projects', {
  method: 'POST',
  body: state,
  immediate: false,
  watch: false,
})

const schema = z.object({
  name: z.string().min(1),
  description: z.string(),
})

async function onSubmit() {
  await createProject.execute()
  if (createProject.error.value || !createProject.data.value)
    return displayErrorFromApi(createProject.error)

  emit('created', createProject.data.value)
  model.value = false
}
</script>

<template>
  <FormDialog v-model="model" title="Crear proyecto" :state="state" :schema="schema" @submit="onSubmit">
    <template #activator="{ on }">
      <UButton :icon="ICONS.create" v-bind="on">
        Crear
      </UButton>
    </template>
    <UFormGroup label="Nombre" name="title">
      <UInput v-model="state.name" placeholder="Nombre del proyecto" :icon="ICONS.text" />
    </UFormGroup>
    <UFormGroup label="Descripción" name="description">
      <UTextarea v-model="state.description" placeholder="Descripción" :icon="ICONS.text" />
    </UFormGroup>
    <template #actions>
      <UButton label="Cancelar" :icon="ICONS.cancel" variant="outline" :loading="createProject.status.value === 'pending'" @click="model = false" />
      <UButton label="Crear" type="submit" :icon="ICONS.create" :loading="createProject.status.value === 'pending'" />
    </template>
  </FormDialog>
</template>

<style>

</style>
