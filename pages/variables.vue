<script lang="ts" setup>
import type { InferPaginationItem } from '~/utils/typing.ts'

const session = useUserSession()
const permissions = usePermissions(session)

const variables = useFetch('/api/variables', {
  onResponseError: (error) => {
    displayErrorFromApi({ data: error.response._data })
  },
})

const columns = useTableColumns<InferPaginationItem<typeof variables>>([
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
    key: 'unit',
    label: 'Unidad',
  },
  {
    key: 'createdAt',
    label: 'Creada en',
    transform: value => new Date(value.createdAt!).toLocaleDateString(),
  },
  {
    key: 'actions',
    label: 'Acciones',
    hidden: !permissions.canUpdate('variables') && !permissions.canDelete('sensors'),
  },
])
</script>

<template>
  <div>
    <div class="flex mb-4 gap-4 items-center">
      <PageTitle title="Variables" />
      <BaseSpacer />
      <UButton icon="material-symbols:sync-rounded" :loading="variables.status.value === 'pending'" @click="variables.refresh()">
        Actualizar
      </UButton>
      <VariablesCreateDialog @created="variables.refresh()" />
    </div>
    <AsyncTable :total="variables.data.value?.total ?? 0" :loading="variables.pending.value" :rows="variables.data.value?.results ?? []" :columns="columns">
      <template #actions-data="{ row }">
        <LazyVariablesEditDialog v-if="permissions.canUpdate('variables')" :item="row" @edited="variables.refresh()" />
      </template>
    </AsyncTable>
  </div>
</template>
