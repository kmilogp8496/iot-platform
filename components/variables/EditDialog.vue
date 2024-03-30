<script lang="ts" setup>
import { variablesSchema } from './variables.const'
import { displayErrorFromApi } from '~/utils/notifications'
import { useFormDialog } from '~/composables/useCreateDialog'

const props = defineProps<{
  item: {
    id: number
    name: string
    description: string | null
    unit: string
    project: WithId | null
  }
}>()

const emit = defineEmits<{
  edited: [InferResponse<typeof editVariable>]
}>()

const model = defineModel({
  default: false,
})

const state = ref({ ...props.item })

const computedBody = computed(() => ({ ...state.value, project: state.value.project?.id }))

const { formDialog } = useFormDialog(model, state, props.item)

const editVariable = useFetch(`/api/variables/${props.item.id}`, {
  method: 'PUT',
  body: computedBody,
  immediate: false,
  watch: false,
})

async function onSubmit() {
  await editVariable.execute()
  if (editVariable.error.value || !editVariable.data.value)
    return displayErrorFromApi(editVariable.error)

  emit('edited', editVariable.data.value)
  model.value = false
}

watch(() => props.item, () => {
  state.value = { ...props.item }
})
</script>

<template>
  <FormDialog ref="formDialog" v-model="model" title="Editar variable" :state="state" :schema="variablesSchema" @submit="onSubmit">
    <template #activator="{ on }">
      <UButton variant="ghost" color="orange" size="xs" :icon="ICONS.edit" v-bind="on" />
    </template>
    <VariablesForm v-model:state="state" />
    <template #actions>
      <UButton label="Cancelar" :icon="ICONS.cancel" variant="outline" :loading="editVariable.status.value === 'pending'" @click="model = false" />
      <UButton label="Editar" color="orange" type="submit" :icon="ICONS.edit" :loading="editVariable.status.value === 'pending'" />
    </template>
  </FormDialog>
</template>

<style>

</style>
