<script lang="ts" setup>
import { sensorsFormSchema as schema } from './sensor.constants'
import { useCreateDialog } from '~/composables/useCreateDialog'
import { displayErrorFromApi } from '~/utils/notifications'
import type { InferResponse, WithId } from '~/utils/typing'

const props = defineProps<{
  item: {
    id: number
    name: string
    description: string | null
    project: WithId | null
    variables: WithId[]
  }
}>()

const emit = defineEmits<{
  edited: [InferResponse<typeof editSensor>]
}>()

const model = defineModel({
  default: false,
})

const state = ref({ ...props.item })
const { formDialog } = useCreateDialog(model, state, props.item)

const computedBody = computed(() => {
  return { ...state.value, project: state.value.project?.id, variables: state.value.variables.map(v => v.id) }
})

const editSensor = useFetch(`/api/sensors/${props.item.id}`, {
  method: 'PUT',
  body: computedBody,
  immediate: false,
  watch: false,
})

async function onSubmit() {
  await editSensor.execute()
  if (editSensor.error.value || !editSensor.data.value)
    return displayErrorFromApi(editSensor.error)

  emit('edited', editSensor.data.value)
  model.value = false
}

watch(() => props.item, () => {
  state.value = { ...props.item }
})
</script>

<template>
  <FormDialog ref="formDialog" v-model="model" title="Editar sensor" :state="state" :schema="schema" @submit="onSubmit">
    <template #activator="{ on }">
      <UButton icon="i-heroicons-pencil" v-bind="on" size="xs" color="orange" />
    </template>
    <SensorsForm v-model:state="state" />
    <template #actions>
      <UButton label="Cancelar" icon="i-heroicons-x-circle" variant="outline" :loading="editSensor.status.value === 'pending'" @click="model = false" />
      <UButton label="Editar" type="submit" color="orange" icon="i-heroicons-pencil" :loading="editSensor.status.value === 'pending'" />
    </template>
  </FormDialog>
</template>./sensor.constants
