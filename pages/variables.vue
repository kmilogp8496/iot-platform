<script lang="ts" setup>
import { useTableColumns } from '../composables/useTableColumns'
import type { InferPaginationItem } from '~/utils/typing.ts'

const variables = useFetch('/api/variables')

const columns = useTableColumns<InferPaginationItem<typeof variables>>([
  {
    key: 'name',
    label: 'Nombre',
  },
  {
    key: 'description',
    label: 'Descripción',
  },
  {
    key: 'unit',
    label: 'Unidad',
  },
  {
    key: 'createdAt',
    label: 'Creada en',
    transform: value => new Date(value.createdAt!).toLocaleDateString(),
  },
])
</script>

<template>
  <div class="flex gap-4 items-center">
    <PageTitle title="Variables" />
    <BaseSpacer />
    <UButton icon="material-symbols:sync-rounded" :loading="variables.status.value === 'pending'" @click="variables.refresh()">
      Actualizar
    </UButton>
    <VariablesCreateDialog @created="variables.refresh()" />
  </div>
  <AsyncTable :total="variables.data.value?.total ?? 0" :loading="variables.pending.value" :rows="variables.data.value?.results ?? []" :columns="columns" />
</template>
