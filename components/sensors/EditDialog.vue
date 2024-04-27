<script lang="ts" setup>
import { sensorsFormSchema as schema } from './sensor.constants'
import { useFormDialog } from '~/composables/useCreateDialog'
import { displayErrorFromApi } from '~/utils/notifications'
import type { InferResponse, WithId } from '~/utils/typing'

const props = defineProps<{
  item: {
    id: number
    name: string
    description: string | null
    project: WithId | null
  }
}>()

const emit = defineEmits<{
  edited: [InferResponse<typeof editSensor>]
}>()

const model = defineModel({
  default: false,
})

const state = ref({ ...props.item })
const { formDialog } = useFormDialog(model, state, props.item)

const computedBody = computed(() => {
  return { ...state.value, project: state.value.project?.id }
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
  <FormDialog
    ref="formDialog"
    v-model="model"
    title="Editar sensor"
    :state="state"
    :schema="schema"
    @submit="onSubmit"
  >
    <template #activator="{ on }">
      <UButton
        :icon="ICONS.edit"
        variant="ghost"
        v-bind="on"
        size="xs"
        color="orange"
      />
    </template>
    <SensorsForm v-model:state="state" />
    <template #actions>
      <UButton
        label="Cancelar"
        :icon="ICONS.cancel"
        variant="outline"
        :loading="editSensor.status.value === 'pending'"
        @click="model = false"
      />
      <UButton
        label="Editar"
        type="submit"
        color="orange"
        :icon="ICONS.edit"
        :loading="editSensor.status.value === 'pending'"
      />
    </template>
  </FormDialog>
</template>./sensor.constants
