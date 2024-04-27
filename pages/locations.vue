<script lang="ts" setup>
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
    hidden: !permissions.canUpdate('locations') && !permissions.canDelete('locations'),
  },
])
</script>

<template>
  <div>
    <div class="flex mb-4 gap-4 items-center">
      <PageTitle title="Ubicaciones" />
      <BaseSpacer />
      <UButton
        icon="material-symbols:sync-rounded"
        :loading="locations.status.value === 'pending'"
        @click="locations.refresh()"
      >
        Actualizar
      </UButton>
      <LocationsCreateDialog @created="locations.refresh()" />
    </div>
    <AsyncTable
      :total="locations.data.value?.total ?? 0"
      :loading="locations.pending.value"
      :rows="locations.data.value?.results ?? []"
      :columns="columns"
    >
      <template #actions-data="{ row }">
        <LazyLocationsEditDialog
          v-if="permissions.canUpdate('sensors')"
          :item="row"
          @edited="locations.refresh()"
        />
        <LazyLocationsDeleteButton
          v-if="permissions.canDelete('sensors')"
          :location="row"
          @deleted="locations.refresh()"
        />
      </template>
    </AsyncTable>
  </div>
</template>
