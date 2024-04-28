<script lang="ts" setup>
import { notificationsSchema } from './notifications.const'
import { displayErrorFromApi } from '~/utils/notifications'
import { useFormDialog } from '~/composables/useCreateDialog'
import type { NotificationItem } from '~/pages/notifications/index.vue'

const props = defineProps<{
  item: NotificationItem
}>()

const emit = defineEmits<{
  edited: [InferResponse<typeof editNotification>]
}>()

const model = defineModel({
  default: false,
})

const state = ref({ ...props.item })

const { formDialog } = useFormDialog(model, state, props.item)

const editNotification = useFetch(`/api/notifications/${props.item.id}`, {
  method: 'PUT',
  body: state,
  immediate: false,
  watch: false,
})

async function onSubmit() {
  await editNotification.execute()
  if (editNotification.error.value || !editNotification.data.value)
    return displayErrorFromApi(editNotification.error)

  emit('edited', editNotification.data.value)
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
    title="Editar variable"
    :state="state"
    :schema="notificationsSchema"
    @submit="onSubmit"
  >
    <template #activator="{ on }">
      <UButton
        variant="ghost"
        color="orange"
        size="xs"
        :icon="ICONS.edit"
        v-bind="on"
      />
    </template>
    <NotificationsForm v-model:state="state" />
    <template #actions>
      <UButton
        label="Cancelar"
        :icon="ICONS.cancel"
        variant="outline"
        :loading="editNotification.status.value === 'pending'"
        @click="model = false"
      />
      <UButton
        label="Editar"
        color="orange"
        type="submit"
        :icon="ICONS.edit"
        :loading="editNotification.status.value === 'pending'"
      />
    </template>
  </FormDialog>
</template>

<style>

</style>
