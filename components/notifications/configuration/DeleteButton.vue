<script setup lang="ts" generic="T extends {id: number, name: string}">
const props = defineProps<{
  notificationConfiguration: T
}>()

const emit = defineEmits<{
  deleted: [T]
}>()

async function onDeleteNotificationConfiguration() {
  try {
    await $fetch(`/api/notifications/configurations/${props.notificationConfiguration.id}`, {
      method: 'DELETE',
    })
    displaySuccessNotification({
      title: 'Configuración eliminada',
      description: `La configuración ${props.notificationConfiguration.name} ha sido eliminada correctamente`,
    })
    emit('deleted', props.notificationConfiguration)
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
    :title="`Elminiar ${props.notificationConfiguration.name}`"
    :content="`¿Confirma que desea eliminar la configuración ${props.notificationConfiguration.name}? No se tomará en cuenta para activar notificaciones.`"
    :on-success="onDeleteNotificationConfiguration"
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
