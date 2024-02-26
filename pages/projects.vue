<script lang="ts" setup>
import { useTableColumns } from '../composables/useTableColumns'
import type { InferPaginationItem } from '~/utils/typing.ts'

const { user } = useUserSession()

const achievements = useFetch('/api/projects')

const columns = useTableColumns<InferPaginationItem<typeof achievements>>([
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
    label: 'Created By',
    hidden: user.value!.role !== RolesDefinition.ADMIN,
  },
])
</script>

<template>
  <PageTitle title="Proyectos" />
  <div class="flex justify-end items-center">
    <ProjectsCreateDialog />
  </div>
  <AsyncTable :total="achievements.data.value?.total ?? 0" :loading="achievements.pending.value" :rows="achievements.data.value?.results ?? []" :columns="columns" />
</template>
