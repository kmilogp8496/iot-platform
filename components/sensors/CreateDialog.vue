<script lang="ts" setup>
import { z } from 'zod'
import { displayErrorFromApi } from '~/utils/notifications'
import type { InferResponse, WithId } from '~/utils/typing.ts'

const emit = defineEmits<{
  created: [InferResponse<typeof createSensor>]
}>()

const model = defineModel({
  default: false,
})

const state = ref({
  name: '',
  description: '',
  project: undefined as undefined | WithId,
  variables: [] as WithId[],
})

const computedBody = computed(() => {
  return { ...state.value, project: state.value.project?.id, variables: state.value.variables.map(v => v.id) }
})

const loading = ref({
  project: false,
  variables: false,
})

const createSensor = useFetch('/api/sensors', {
  method: 'POST',
  body: computedBody,
  immediate: false,
  watch: false,
})

const schema = z.object({
  name: z.string().min(1, 'Campo requerido'),
  description: z.string(),
  project: z.object({
    id: z.number({ required_error: 'Campo requerido' }),
  }, {
    required_error: 'Campo requerido',
  }),
  variables: z.array(
    z.object({
      id: z.number({ required_error: 'Valor incorrecto' }),
    }),
  ),
})

async function onSubmit() {
  await createSensor.execute()
  if (createSensor.error.value || !createSensor.data.value)
    return displayErrorFromApi(createSensor.error)

  emit('created', createSensor.data.value)
  model.value = false
}

async function onSearchProjects(search: string) {
  loading.value.project = true

  const projects = await $fetch('/api/projects', { params: { search } })

  loading.value.project = false

  return projects.results
}

async function onSearchVariables(search: string) {
  loading.value.variables = true

  const variables = await $fetch('/api/variables', { params: { search } })

  loading.value.variables = false

  return variables.results
}
</script>

<template>
  <FormDialog v-model="model" title="Crear sensor" :state="state" :schema="schema" @submit="onSubmit">
    <template #activator="{ on }">
      <UButton icon="i-heroicons-plus" v-bind="on">
        Crear
      </UButton>
    </template>
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
    <template #actions>
      <UButton label="Cancelar" icon="i-heroicons-x-circle" variant="outline" :loading="createSensor.status.value === 'pending'" @click="model = false" />
      <UButton label="Crear" type="submit" icon="i-heroicons-plus" :loading="createSensor.status.value === 'pending'" />
    </template>
  </FormDialog>
</template>

<style>

</style>
