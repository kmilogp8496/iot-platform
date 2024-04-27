<script setup lang="ts" generic="T extends {id: number, name: string}">
const props = defineProps<{
  location: T
}>()

const emit = defineEmits<{
  deleted: [T]
}>()

async function onDeleteLocation() {
  try {
    await $fetch(`/api/locations/${props.location.id}`, {
      method: 'DELETE',
    })
    displaySuccessNotification({
      title: 'Ubicación eliminada',
      description: `La ubicación ${props.location.name} ha sido eliminada correctamente`,
    })
    emit('deleted', props.location)
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
    :content="`¿Confirma que desea eliminar la ubicación ${props.location.name}?`"
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
