<script lang="ts" setup>
import { notificationConfigurationFormSchema } from './notificationConfiguration.constants'
import { useFormDialog } from '~/composables/useCreateDialog'
import { displayErrorFromApi } from '~/utils/notifications'
import type { WithId } from '~/utils/typing.ts'

const props = defineProps<{
  notificationId: number
}>()

const emit = defineEmits<{
  created: []
}>()

const model = defineModel({
  default: false,
})

const defaultState = {
  name: '',
  notification: props.notificationId,
  sensorConfiguration: undefined as WithId | undefined,
  sign: 'gte',
  threshold: 0,
} as const

const state = ref({ ...defaultState })
const { formDialog } = useFormDialog(model, state, defaultState)

const computedBody = computed(() => {
  return { ...state.value, sensorConfiguration: state.value.sensorConfiguration?.id }
})

const createNotificationConfiguration = useFetch('/api/notifications/configurations/', {
  method: 'POST',
  body: computedBody,
  immediate: false,
  watch: false,
})

async function onSubmit() {
  await createNotificationConfiguration.execute()
  if (createNotificationConfiguration.error.value)
    return displayErrorFromApi(createNotificationConfiguration.error)

  emit('created')
  model.value = false
}
</script>

<template>
  <FormDialog
    ref="formDialog"
    v-model="model"
    title="Crear configuración de notificación"
    :state="state"
    :schema="notificationConfigurationFormSchema"
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
    <NotificationsConfigurationForm v-model:state="state" />
    <template #actions>
      <UButton
        label="Cancelar"
        :icon="ICONS.cancel"
        variant="outline"
        :loading="createNotificationConfiguration.status.value === 'pending'"
        @click="model = false"
      />
      <UButton
        label="Crear"
        type="submit"
        :icon="ICONS.create"
        :loading="createNotificationConfiguration.status.value === 'pending'"
      />
    </template>
  </FormDialog>
</template>
