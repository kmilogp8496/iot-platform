<script lang="ts" setup>
import { actuatorConfigurationFormSchema } from './actuatorConfiguration.constants'
import { useFormDialog } from '~/composables/useCreateDialog'
import type { ActuatorConfiguration } from '~/pages/sensors/[id].vue'
import { displayErrorFromApi } from '~/utils/notifications'

const props = defineProps<{
  item: ActuatorConfiguration
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
  return { ...state.value, sensorConfiguration: state.value.sensorConfiguration?.id, sensor: props.sensor.id }
})

const editSensorConfiguration = useFetch(`/api/actuatorConfiguration/${props.item.id}`, {
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
  <FormDialog ref="formDialog" v-model="model" :title="`Editar ${item.name}`" :state="state" :schema="actuatorConfigurationFormSchema" @submit="onSubmit">
    <template #activator="{ on }">
      <UButton variant="ghost" :icon="ICONS.edit" v-bind="on" size="xs" color="orange" />
    </template>
    <ActuatorConfigurationForm v-model:state="state" :sensor-id="sensor.id" />
    <template #actions>
      <UButton label="Cancelar" :icon="ICONS.cancel" variant="outline" :loading="editSensorConfiguration.status.value === 'pending'" @click="model = false" />
      <UButton label="Editar" type="submit" color="orange" :icon="ICONS.edit" :loading="editSensorConfiguration.status.value === 'pending'" />
    </template>
  </FormDialog>
</template>
