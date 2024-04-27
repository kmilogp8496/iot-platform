<script lang="ts" setup>
import { useTableColumns } from '../composables/useTableColumns'
import type { InferPaginationItem } from '~/utils/typing.ts'

const { user } = useUserSession()

const projects = useFetch('/api/projects')

const columns = useTableColumns<InferPaginationItem<typeof projects>>([
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
    hidden: user.value!.role !== RolesDefinition.ADMIN,
  },
])
</script>

<template>
  <div>
    <div class="flex mb-4 gap-4 items-center">
      <PageTitle title="Proyectos" />
      <BaseSpacer />
      <UButton
        icon="material-symbols:sync-rounded"
        :loading="projects.status.value === 'pending'"
        @click="projects.refresh()"
      >
        Actualizar
      </UButton>
      <ProjectsCreateDialog @created="projects.refresh()" />
    </div>
    <AsyncTable
      :total="projects.data.value?.total ?? 0"
      :loading="projects.pending.value"
      :rows="projects.data.value?.results ?? []"
      :columns="columns"
    />
  </div>
</template>
