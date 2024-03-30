<script lang="ts" setup>
import { locationsFormSchema } from './locations.constants'
import { useFormDialog } from '~/composables/useCreateDialog'
import { displayErrorFromApi } from '~/utils/notifications'
import type { InferResponse, WithId } from '~/utils/typing.ts'

const emit = defineEmits<{
  created: [InferResponse<typeof createLocation>]
}>()

const model = defineModel({
  default: false,
})

const defaultState = {
  name: '',
  project: undefined as undefined | WithId,
} as const

const state = ref({ ...defaultState })
const { formDialog } = useFormDialog(model, state, defaultState)

const computedBody = computed(() => {
  return { ...state.value, project: state.value.project?.id }
})

const createLocation = useFetch('/api/locations', {
  method: 'POST',
  body: computedBody,
  immediate: false,
  watch: false,
})

async function onSubmit() {
  await createLocation.execute()
  if (createLocation.error.value || !createLocation.data.value)
    return displayErrorFromApi(createLocation.error)

  emit('created', createLocation.data.value)
  model.value = false
}
</script>

<template>
  <FormDialog ref="formDialog" v-model="model" title="Crear ubicación" :state="state" :schema="locationsFormSchema" @submit="onSubmit">
    <template #activator="{ on }">
      <UButton :icon="ICONS.create" v-bind="on">
        Crear
      </UButton>
    </template>
    <LocationsForm v-model:state="state" />
    <template #actions>
      <UButton label="Cancelar" :icon="ICONS.cancel" variant="outline" :loading="createLocation.status.value === 'pending'" @click="model = false" />
      <UButton label="Crear" type="submit" :icon="ICONS.create" :loading="createLocation.status.value === 'pending'" />
    </template>
  </FormDialog>
</template>
