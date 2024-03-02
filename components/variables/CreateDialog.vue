<script lang="ts" setup>
import { z } from 'zod'
import { displayErrorFromApi } from '~/utils/notifications'
import type { InferResponse } from '~/utils/typing.ts'

const emit = defineEmits<{
  created: [InferResponse<typeof createVariable>]
}>()

const model = defineModel({
  default: false,
})

const state = ref({
  name: '',
  description: '',
  unit: '',
})

const createVariable = useFetch('/api/variables', {
  method: 'POST',
  body: state,
  immediate: false,
  watch: false,
})

const schema = z.object({
  name: z.string().min(1, 'Campo requerido'),
  description: z.string(),
  unit: z.string(),
})

async function onSubmit() {
  await createVariable.execute()
  if (createVariable.error.value || !createVariable.data.value)
    return displayErrorFromApi(createVariable.error)

  emit('created', createVariable.data.value)
  model.value = false
}
</script>

<template>
  <FormDialog v-model="model" title="Crear variable" :state="state" :schema="schema" @submit="onSubmit">
    <template #activator="{ on }">
      <UButton icon="i-heroicons-plus" v-bind="on">
        Crear
      </UButton>
    </template>
    <UFormGroup label="Nombre" name="name">
      <UInput v-model="state.name" placeholder="Nombre de la variable" icon="i-heroicons-list-bullet" />
    </UFormGroup>
    <UFormGroup label="Unidad" name="unit">
      <UInput v-model="state.unit" placeholder="Unidad de medida (kg, ºC, L, etc...)" icon="i-heroicons-list-bullet" />
    </UFormGroup>
    <UFormGroup label="Descripción" name="description">
      <UTextarea v-model="state.description" placeholder="Descripción" icon="i-heroicons-list-bullet" />
    </UFormGroup>
    <template #actions>
      <UButton label="Cancelar" icon="i-heroicons-x-circle" variant="outline" :loading="createVariable.status.value === 'pending'" @click="model = false" />
      <UButton label="Crear" type="submit" icon="i-heroicons-plus" :loading="createVariable.status.value === 'pending'" />
    </template>
  </FormDialog>
</template>

<style>

</style>
