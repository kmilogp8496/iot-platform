<script setup lang="ts" generic="T extends {id: number, name: string}">
const props = defineProps<{
  actuatorConfiguration: T
}>()

const emit = defineEmits<{
  deleted: [T]
}>()

async function onDeleteLocation() {
  try {
    await $fetch(`/api/actuatorConfiguration/${props.actuatorConfiguration.id}`, {
      method: 'DELETE',
    })
    displaySuccessNotification({
      title: 'Ubicación eliminada',
      description: `El actuador ${props.actuatorConfiguration.name} ha sido eliminada correctamente`,
    })
    emit('deleted', props.actuatorConfiguration)
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
    :title="`Eliminar ${props.actuatorConfiguration.name}`"
    :content="`¿Confirma que desea eliminar el actuador ${props.actuatorConfiguration.name}? Si tienes algún actuador activo dejará de recibir información de esta configuración.`"
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
