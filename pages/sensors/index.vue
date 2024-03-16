<script lang="ts" setup>
import { usePermissions } from '~/shared/permissions'
import type { InferPaginationItem } from '~/utils/typing.ts'

const sensors = useFetch('/api/sensors')

type Sensor = InferPaginationItem<typeof sensors>

const session = useUserSession()

const permissions = usePermissions(session)

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
    hidden: !permissions.canUpdate('sensors') && !permissions.canDelete('sensors'),
  },
])
</script>

<template>
  <div>
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
        <LazySensorsEditDialog v-if="permissions.canUpdate('sensors')" :item="row" @edited="sensors.refresh()" />
        <UButton size="xs" icon="i-carbon-settings-edit" :to="`/sensors/${row.id}`" />
        <LazySensorsDeleteButton v-if="permissions.canDelete('sensors')" :sensor="row" @deleted="sensors.refresh()" />
      </template>
    </AsyncTable>
  </div>
</template>
