<script lang="ts" setup>
import { sensorsConfigurationFormSchema } from './sensorConfiguration.constants'
import { useFormDialog } from '~/composables/useCreateDialog'
import type { SensorConfiguration } from '~/pages/sensors/[id].vue'
import { displayErrorFromApi } from '~/utils/notifications'

const props = defineProps<{
  item: SensorConfiguration
  sensor: { name: string, id: number }
}>()

const emit = defineEmits<{
  edited: []
}>()

const model = defineModel({
  default: false,
})

const state = ref({ ...props.item })
const { formDialog } = useFormDialog(model, state, props.item)

const computedBody = computed(() => {
  return { ...state.value, location: state.value.location?.id, variable: state.value.variable.id, sensor: props.sensor.id }
})

const editSensorConfiguration = useFetch(`/api/sensorsConfiguration/${props.item.id}`, {
  method: 'PUT',
  body: computedBody,
  immediate: false,
  watch: false,
})

async function onSubmit() {
  await editSensorConfiguration.execute()
  if (editSensorConfiguration.error.value)
    return displayErrorFromApi(editSensorConfiguration.error)

  emit('edited')
  model.value = false
}

watch(() => props.item, () => {
  state.value = { ...props.item }
})
</script>

<template>
  <FormDialog ref="formDialog" v-model="model" :title="`Editar configuración ${sensor.name}`" :state="state" :schema="sensorsConfigurationFormSchema" @submit="onSubmit">
    <template #activator="{ on }">
      <UButton icon="i-heroicons-pencil" v-bind="on" size="xs" color="orange" />
    </template>
    <SensorsConfigurationForm v-model:state="state" />
    <template #actions>
      <UButton label="Cancelar" icon="i-heroicons-x-circle" variant="outline" :loading="editSensorConfiguration.status.value === 'pending'" @click="model = false" />
      <UButton label="Editar" type="submit" color="orange" icon="i-heroicons-pencil" :loading="editSensorConfiguration.status.value === 'pending'" />
    </template>
  </FormDialog>
</template>./sensor.constants
