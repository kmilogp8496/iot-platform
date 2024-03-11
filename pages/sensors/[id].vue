<script lang="ts" setup>
import { usePermissions } from '~/shared/permissions'
import type { InferPaginationItem } from '~/utils/typing.ts'

const locations = useFetch('/api/locations')

type Location = InferPaginationItem<typeof locations>

const session = useUserSession()

const permissions = usePermissions(session)

const columns = useTableColumns<Location>([
  {
    key: 'project.name',
    label: 'Proyecto',
  },
  {
    key: 'name',
    label: 'Nombre',
  },
  {
    key: 'createdAt',
    label: 'Creado en',
    transform: value => new Date(value.createdAt!).toLocaleDateString(),
  },
  {
    key: 'actions',
    label: 'Acciones',
    hidden: !permissions.canUpdate('sensors') && !permissions.canDelete('sensors'),
  },
])
</script>

<template>
  <div class="flex mb-4 gap-4 items-center">
    <PageTitle title="Sensores" />
    <BaseSpacer />
    <UButton icon="material-symbols:sync-rounded" :loading="locations.status.value === 'pending'" @click="locations.refresh()">
      Actualizar
    </UButton>
    <!-- <SensorsCreateDialog @created="locations.refresh()" /> -->
  </div>
  <AsyncTable :total="locations.data.value?.total ?? 0" :loading="locations.pending.value" :rows="locations.data.value?.results ?? []" :columns="columns">
    <template #actions-data="{ row }">
      <!-- <LazySensorsEditDialog v-if="permissions.canUpdate('sensors')" :item="row" @edited="locations.refresh()" />
      <LazySensorsDeleteButton v-if="permissions.canDelete('sensors')" :sensor="row" @deleted="locations.refresh()" /> -->
    </template>
  </AsyncTable>
</template>
