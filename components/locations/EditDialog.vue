<script lang="ts" setup>
import { locationsFormSchema } from './locations.constants'
import { useCreateDialog } from '~/composables/useCreateDialog'
import { displayErrorFromApi } from '~/utils/notifications'
import type { InferResponse, WithId } from '~/utils/typing'

const props = defineProps<{
  item: {
    id: number
    name: string
    project: WithId | null
  }
}>()

const emit = defineEmits<{
  edited: [InferResponse<typeof editLocation>]
}>()

const model = defineModel({
  default: false,
})

const state = ref({ ...props.item })
const { formDialog } = useCreateDialog(model, state, props.item)

const computedBody = computed(() => {
  return { ...state.value, project: state.value.project?.id }
})

const editLocation = useFetch(`/api/locations/${props.item.id}`, {
  method: 'PUT',
  body: computedBody,
  immediate: false,
  watch: false,
})

async function onSubmit() {
  await editLocation.execute()
  if (editLocation.error.value || !editLocation.data.value)
    return displayErrorFromApi(editLocation.error)

  emit('edited', editLocation.data.value)
  model.value = false
}

watch(() => props.item, () => {
  state.value = { ...props.item }
})
</script>

<template>
  <FormDialog ref="formDialog" v-model="model" title="Editar ubicación" :state="state" :schema="locationsFormSchema" @submit="onSubmit">
    <template #activator="{ on }">
      <UButton icon="i-heroicons-pencil" v-bind="on" size="xs" color="orange" />
    </template>
    <LocationsForm v-model:state="state" />
    <template #actions>
      <UButton label="Cancelar" icon="i-heroicons-x-circle" variant="outline" :loading="editLocation.status.value === 'pending'" @click="model = false" />
      <UButton label="Editar" type="submit" color="orange" icon="i-heroicons-pencil" :loading="editLocation.status.value === 'pending'" />
    </template>
  </FormDialog>
</template>./sensor.constants
