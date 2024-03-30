<script lang="ts" setup>
import { z } from 'zod'
import { useFormDialog } from '~/composables/useCreateDialog'
import { displayErrorFromApi } from '~/utils/notifications'

const props = defineProps<{
  sensor: {
    id: number
    name: string
  }
}>()

const model = defineModel({
  default: false,
})

const state = ref({
  username: '',
  password: '',
})

const schema = z.object({
  username: z.string().min(1, 'El usuario no puede estar vacío'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})
const { formDialog } = useFormDialog(model, state, { username: '', password: '' })

const updateSensorCredentials = useFetch(`/api/sensors/credentials/${props.sensor.id}`, {
  method: 'PUT',
  body: state,
  immediate: false,
  watch: false,
})

async function onSubmit() {
  await updateSensorCredentials.execute()
  if (updateSensorCredentials.error.value || !updateSensorCredentials.data.value)
    return displayErrorFromApi(updateSensorCredentials.error)

  model.value = false
}
</script>

<template>
  <FormDialog ref="formDialog" v-model="model" :title="`Actualizar credenciales de sensor ${sensor.name}`" :state="state" :schema="schema" @submit="onSubmit">
    <template #activator="{ on }">
      <UButton variant="ghost" icon="i-heroicons-lock-closed" v-bind="on" size="xs" color="teal" />
    </template>
    <UFormGroup label="Nuevo usuario" name="username">
      <UInput v-model="state.username" autocomplete="off" placeholder="usuario" :icon="ICONS.text" />
    </UFormGroup>
    <UFormGroup label="Contraseña" name="password">
      <UInput v-model="state.password" autocomplete="off" type="password" placeholder="Contraseña" :icon="ICONS.text" />
    </UFormGroup>
    <template #actions>
      <UButton label="Cancelar" :icon="ICONS.cancel" variant="outline" :loading="updateSensorCredentials.status.value === 'pending'" @click="model = false" />
      <UButton label="Actualizar" type="submit" color="teal" icon="i-heroicons-lock-closed" :loading="updateSensorCredentials.status.value === 'pending'" />
    </template>
  </FormDialog>
</template>./sensor.constants
