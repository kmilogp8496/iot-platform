<script lang="ts" setup>
import { z } from 'zod'
import { variablesSchema } from './variables.const'
import { displayErrorFromApi } from '~/utils/notifications'
import { useFormDialog } from '~/composables/useCreateDialog'

const emit = defineEmits<{
  created: [InferResponse<typeof createVariable>]
}>()

const model = defineModel({
  default: false,
})

const defaultState = {
  name: '',
  description: '',
  unit: '',
  project: undefined as WithId | undefined,
}

const state = ref(defaultState)

const computedBody = computed(() => ({ ...state.value, project: state.value.project?.id }))

const { formDialog } = useFormDialog(model, state, defaultState)

const createVariable = useFetch('/api/variables', {
  method: 'POST',
  body: computedBody,
  immediate: false,
  watch: false,
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
  <FormDialog ref="formDialog" v-model="model" title="Crear variable" :state="state" :schema="variablesSchema" @submit="onSubmit">
    <template #activator="{ on }">
      <UButton :icon="ICONS.create" v-bind="on">
        Crear
      </UButton>
    </template>
    <VariablesForm v-model:state="state" />
    <template #actions>
      <UButton label="Cancelar" :icon="ICONS.cancel" variant="outline" :loading="createVariable.status.value === 'pending'" @click="model = false" />
      <UButton label="Crear" type="submit" :icon="ICONS.create" :loading="createVariable.status.value === 'pending'" />
    </template>
  </FormDialog>
</template>

<style>

</style>
