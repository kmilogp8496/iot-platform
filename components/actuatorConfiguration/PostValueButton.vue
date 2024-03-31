<script setup lang="ts">
import { z } from 'zod'
import type { ActuatorConfiguration } from '~/pages/sensors/[id].vue'

const props = defineProps<{
  actuatorConfiguration: ActuatorConfiguration
}>()

const state = ref({
  value: 0,
})

const schema = z.object({
  value: z.number({
    description: 'Valor a enviar al actuador',
    invalid_type_error: 'El valor debe ser un número',
  }).max(65532),
})

const submitValue = await useFetch(`/api/actuatorConfiguration/${props.actuatorConfiguration.id}/value`, {
  method: 'POST',
  body: state.value,
  immediate: false,
  watch: false,
})

async function onSubmit() {
  await submitValue.execute()
  if (submitValue.error.value)
    displayErrorFromApi(submitValue.error.value)
}
</script>

<template>
  <UPopover mode="hover">
    <UButton variant="ghost" :loading="submitValue.status.value === 'pending'" size="xs" :icon="ICONS.message" />
    <template #panel>
      <UForm :state :schema class="px-4 py-2 space-y-4" @submit="onSubmit">
        <UFormGroup label="Enviar valor al actuador" name="value">
          <UInput v-model="state.value" type="number" max="65532" min="0" />
        </UFormGroup>
        <div class="flex justify-end">
          <UButton label="Enviar" size="xs" :loading="submitValue.status.value === 'pending'" :icon="ICONS.message" type="submit" />
        </div>
      </UForm>
    </template>
  </UPopover>
</template>
