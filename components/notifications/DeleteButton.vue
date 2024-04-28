<script setup lang="ts" generic="T extends {id: number, name: string}">
const props = defineProps<{
  notification: T
}>()

const emit = defineEmits<{
  deleted: [T]
}>()

async function onDeleteNotification() {
  try {
    await $fetch(`/api/notifications/${props.notification.id}`, {
      method: 'DELETE',
    })
    displaySuccessNotification({
      title: 'Notificación eliminada',
      description: `La notificación "${props.notification.name}" ha sido eliminada correctamente`,
    })
    emit('deleted', props.notification)
    return true
  }
  catch (error: any) {
    displayErrorFromApi(error)
    return false
  }
}
</script>

<template>
  <ConfirmDialog
    :content="`¿Confirma que desea eliminar la notificación ${props.notification.name}?`"
    :on-success="onDeleteNotification"
  >
    <template #activator="{ on }">
      <UButton
        variant="ghost"
        size="xs"
        :icon="ICONS.delete"
        color="red"
        v-bind="on"
      />
    </template>
  </ConfirmDialog>
</template>
