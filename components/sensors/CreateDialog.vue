<script lang="ts" setup>
import { sensorsFormSchema as schema } from './sensor.constants'
import { useCreateDialog } from '~/composables/useCreateDialog'
import { displayErrorFromApi } from '~/utils/notifications'
import type { InferResponse, WithId } from '~/utils/typing.ts'

const emit = defineEmits<{
  created: [InferResponse<typeof createSensor>]
}>()

const model = defineModel({
  default: false,
})

const defaultState = {
  name: '',
  description: '',
  username: '',
  password: '',
  project: undefined as undefined | WithId,
  variables: [] as WithId[],
} as const

const state = ref({ ...defaultState })
const { formDialog } = useCreateDialog(model, state, defaultState)

const computedBody = computed(() => {
  return { ...state.value, project: state.value.project?.id, variables: state.value.variables.map(v => v.id) }
})

const createSensor = useFetch('/api/sensors', {
  method: 'POST',
  body: computedBody,
  immediate: false,
  watch: false,
})

async function onSubmit() {
  await createSensor.execute()
  if (createSensor.error.value || !createSensor.data.value)
    return displayErrorFromApi(createSensor.error)

  emit('created', createSensor.data.value)
  model.value = false
}
</script>

<template>
  <FormDialog ref="formDialog" v-model="model" title="Crear sensor" :state="state" :schema="schema" @submit="onSubmit">
    <template #activator="{ on }">
      <UButton icon="i-heroicons-plus" v-bind="on">
        Crear
      </UButton>
    </template>
    <SensorsForm v-model:state="state" show-credentials-inputs />
    <template #actions>
      <UButton label="Cancelar" icon="i-heroicons-x-circle" variant="outline" :loading="createSensor.status.value === 'pending'" @click="model = false" />
      <UButton label="Crear" type="submit" icon="i-heroicons-plus" :loading="createSensor.status.value === 'pending'" />
    </template>
  </FormDialog>
</template>
