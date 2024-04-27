<script lang="ts" setup>
import { actuatorConfigurationFormSchema } from './actuatorConfiguration.constants'
import { useFormDialog } from '~/composables/useCreateDialog'
import { displayErrorFromApi } from '~/utils/notifications'
import type { WithId } from '~/utils/typing.ts'

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
  sensorConfiguration: undefined as undefined | WithId,
} as const

const state = ref({ ...defaultState })
const { formDialog } = useFormDialog(model, state, defaultState)

const computedBody = computed(() => {
  return { ...state.value, sensorConfiguration: state.value.sensorConfiguration?.id }
})

const createActuatorConfiguration = useFetch('/api/actuatorConfiguration', {
  method: 'POST',
  body: computedBody,
  immediate: false,
  watch: false,
})

async function onSubmit() {
  await createActuatorConfiguration.execute()
  if (createActuatorConfiguration.error.value)
    return displayErrorFromApi(createActuatorConfiguration.error)

  emit('created')
  model.value = false
}
</script>

<template>
  <FormDialog
    ref="formDialog"
    v-model="model"
    title="Crear configuración de actuador"
    :state="state"
    :schema="actuatorConfigurationFormSchema"
    @submit="onSubmit"
  >
    <template #activator="{ on }">
      <UButton
        :icon="ICONS.create"
        v-bind="on"
      >
        Crear
      </UButton>
    </template>
    <ActuatorConfigurationForm v-model:state="state" />
    <template #actions>
      <UButton
        label="Cancelar"
        :icon="ICONS.cancel"
        variant="outline"
        :loading="createActuatorConfiguration.status.value === 'pending'"
        @click="model = false"
      />
      <UButton
        label="Crear"
        type="submit"
        :icon="ICONS.create"
        :loading="createActuatorConfiguration.status.value === 'pending'"
      />
    </template>
  </FormDialog>
</template>
