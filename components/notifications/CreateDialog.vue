<script lang="ts" setup>
import type { z } from 'zod'
import { notificationsSchema } from './notifications.const'
import { displayErrorFromApi } from '~/utils/notifications'
import { useFormDialog } from '~/composables/useCreateDialog'

const emit = defineEmits<{
  created: []
}>()

const model = defineModel({
  default: false,
})

const defaultState: z.infer<typeof notificationsSchema> = {
  name: '',
  message: '',
  level: 'error',
  type: 'slack',
  url: '',
  description: '',
}

const state = ref(defaultState)

const { formDialog } = useFormDialog(model, state, defaultState)

const createNotification = useFetch('/api/notifications', {
  method: 'POST',
  body: state,
  immediate: false,
  watch: false,
})

async function onSubmit() {
  await createNotification.execute()
  if (createNotification.error.value)
    return displayErrorFromApi(createNotification.error)

  emit('created')
  model.value = false
}
</script>

<template>
  <FormDialog
    ref="formDialog"
    v-model="model"
    title="Crear notificación"
    :state="state"
    :schema="notificationsSchema"
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
    <NotificationsForm v-model:state="state" />
    <template #actions>
      <UButton
        label="Cancelar"
        :icon="ICONS.cancel"
        variant="outline"
        :loading="createNotification.status.value === 'pending'"
        @click="model = false"
      />
      <UButton
        label="Crear"
        type="submit"
        :icon="ICONS.create"
        :loading="createNotification.status.value === 'pending'"
      />
    </template>
  </FormDialog>
</template>

<style>

</style>
