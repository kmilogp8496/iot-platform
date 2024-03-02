<script lang="ts" setup>
import { useTableColumns } from '../composables/useTableColumns'
import type { InferPaginationItem } from '~/utils/typing.ts'

const sensors = useFetch('/api/sensors')

const columns = useTableColumns<InferPaginationItem<typeof sensors>>([
  {
    key: 'projectName',
    label: 'Proyecto',
  },
  {
    key: 'name',
    label: 'Nombre',
  },
  {
    key: 'description',
    label: 'Descripción',
  },
  {
    key: 'createdAt',
    label: 'Creado en',
    transform: value => new Date(value.createdAt!).toLocaleDateString(),
  },
  {
    key: 'createdByEmail',
    label: 'Creado por',
  },
])
</script>

<template>
  <div class="flex gap-4 items-center">
    <PageTitle title="Sensores" />
    <BaseSpacer />
    <UButton icon="material-symbols:sync-rounded" :loading="sensors.status.value === 'pending'" @click="sensors.refresh()">
      Actualizar
    </UButton>
    <SensorsCreateDialog @created="sensors.refresh()" />
  </div>
  <AsyncTable :total="sensors.data.value?.total ?? 0" :loading="sensors.pending.value" :rows="sensors.data.value?.results ?? []" :columns="columns" />
</template>
