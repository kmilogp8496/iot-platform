<script setup lang="ts" generic="T extends {id: number, name: string}">
const props = defineProps<{
  sensorConfiguration: T
}>()

const emit = defineEmits<{
  deleted: [T]
}>()

async function onDeleteLocation() {
  try {
    await $fetch(`/api/sensorsConfiguration/${props.sensorConfiguration.id}`, {
      method: 'DELETE',
    })
    displaySuccessNotification({
      title: 'Ubicación eliminada',
      description: `La configuración ${props.sensorConfiguration.name} ha sido eliminada correctamente`,
    })
    emit('deleted', props.sensorConfiguration)
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
    :title="`Elminiar ${props.sensorConfiguration.name}`"
    :content="`¿Confirma que desea eliminar la configuración ${props.sensorConfiguration.name}? Si tienes algún sensor activo dejará de transmitir.`"
    :on-success="onDeleteLocation"
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
