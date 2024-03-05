<script lang="ts" setup>
import { useTableColumns } from '../composables/useTableColumns'
import type { InferPaginationItem } from '~/utils/typing.ts'

const sensors = useFetch('/api/sensors')

type Sensor = InferPaginationItem<typeof sensors>

const columns = useTableColumns<Sensor>([
  {
    key: 'project.name',
    label: 'Proyecto',
  },
  {
    key: 'name',
    label: 'Nombre',
  },
  {
    key: 'variables',
    label: 'Variables',
    transform: value => value.variables.map(value => value.name).join(', '),
    class: 'w-12 truncate',
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
  {
    key: 'actions',
    label: 'Acciones',
  },
])
</script>

<template>
  <div class="flex mb-4 gap-4 items-center">
    <PageTitle title="Sensores" />
    <BaseSpacer />
    <UButton icon="material-symbols:sync-rounded" :loading="sensors.status.value === 'pending'" @click="sensors.refresh()">
      Actualizar
    </UButton>
    <SensorsCreateDialog @created="sensors.refresh()" />
  </div>
  <AsyncTable :total="sensors.data.value?.total ?? 0" :loading="sensors.pending.value" :rows="sensors.data.value?.results ?? []" :columns="columns">
    <template #actions-data="{ row }">
      <SensorsEditDialog :item="row" @edited="sensors.refresh()" />
      <SensorsDeleteButton :sensor="row" @deleted="sensors.refresh()" />
    </template>
  </AsyncTable>
</template>
