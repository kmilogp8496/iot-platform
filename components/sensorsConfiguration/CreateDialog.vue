<script lang="ts" setup>
import { sensorsConfigurationFormSchema } from './sensorConfiguration.constants'
import { useFormDialog } from '~/composables/useCreateDialog'
import { displayErrorFromApi } from '~/utils/notifications'
import type { InferResponse, WithId } from '~/utils/typing.ts'

const props = defineProps<{
  sensorId: number
}>()

const emit = defineEmits<{
  created: []
}>()

const model = defineModel({
  default: false,
})

const defaultState = {
  name: '',
  description: '',
  sensor: props.sensorId,
  location: undefined as undefined | WithId,
  variable: undefined as undefined | WithId,
} as const

const state = ref({ ...defaultState })
const { formDialog } = useFormDialog(model, state, defaultState)

const computedBody = computed(() => {
  return { ...state.value, location: state.value.location?.id, variable: state.value.variable?.id }
})

const createSensorConfiguration = useFetch('/api/sensorsConfiguration', {
  method: 'POST',
  body: computedBody,
  immediate: false,
  watch: false,
})

async function onSubmit() {
  await createSensorConfiguration.execute()
  if (createSensorConfiguration.error.value)
    return displayErrorFromApi(createSensorConfiguration.error)

  emit('created')
  model.value = false
}
</script>

<template>
  <FormDialog ref="formDialog" v-model="model" title="Crear configuración de sensor" :state="state" :schema="sensorsConfigurationFormSchema" @submit="onSubmit">
    <template #activator="{ on }">
      <UButton :icon="ICONS.create" v-bind="on">
        Crear
      </UButton>
    </template>
    <SensorsConfigurationForm v-model:state="state" />
    <template #actions>
      <UButton label="Cancelar" :icon="ICONS.cancel" variant="outline" :loading="createSensorConfiguration.status.value === 'pending'" @click="model = false" />
      <UButton label="Crear" type="submit" :icon="ICONS.create" :loading="createSensorConfiguration.status.value === 'pending'" />
    </template>
  </FormDialog>
</template>
