<script setup lang="ts" generic="T extends {id: number, name: string}">
interface BasicSensor {
  id: number
  name: string
}

const props = defineProps<{
  sensor: BasicSensor
}>()

const emit = defineEmits<{
  deleted: [T]
}>()

async function onDeleteSensor(sensor: T) {
  try {
    await $fetch(`/api/sensors/${sensor.id}`, {
      method: 'DELETE',
    })
    displaySuccessNotification({
      title: 'Sensor eliminado',
      description: `El sensor ${props.sensor.name} ha sido eliminado correctamente`,
    })
    emit('deleted', sensor)
    return true
  }
  catch (error: any) {
    displayErrorNotification({
      title: error?.title ?? 'Error',
      description: error?.message ?? 'Ocurrió un error al eliminar el sensor',
    })
    return false
  }
}
</script>

<template>
  <ConfirmDialog :content="`¿Confirma que desea eliminar el sensor ${sensor.name}?`" :on-success="() => onDeleteSensor(sensor)">
    <template #activator="{ on }">
      <UButton size="xs" icon="i-heroicons-trash" color="red" v-bind="on" />
    </template>
  </ConfirmDialog>
</template>
