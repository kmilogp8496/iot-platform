<script setup lang="ts" generic="T extends ZodRawShape, K extends Zod.ZodObject<T>">
import type { ZodRawShape, z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { UForm } from '#components'

defineProps<{
  title: string
  modelValue?: boolean
  schema?: K
  state: InstanceType<typeof UForm>['$props']['state']
}>()

const emit = defineEmits<{
  submit: [FormSubmitEvent<z.output<K>>]
}>()

const model = defineModel({
  default: false,
})

const form = ref<InstanceType<typeof UForm> | null>(null)

function onClick() {
  model.value = !model.value
}

function clearForm() {
  form.value?.clear()
}

defineExpose({
  clearForm,
})
</script>

<template>
  <slot
    name="activator"
    :on="{ onClick }"
  />

  <UModal
    v-model="model"
    :ui="{ base: 'overflow-visible' }"
  >
    <UForm
      ref="form"
      v-bind="{ state, schema }"
      @submit="emit('submit', $event)"
    >
      <UCard>
        <template #header>
          <slot name="title">
            <h4 class="text-xl font-semibold">
              {{ title }}
            </h4>
          </slot>
        </template>

        <div class="space-y-4">
          <slot />
        </div>
        <template #footer>
          <div class="flex justify-end gap-4">
            <slot name="actions" />
          </div>
        </template>
      </UCard>
    </UForm>
  </UModal>
</template>
