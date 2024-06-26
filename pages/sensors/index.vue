<script lang="ts" setup>
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
      <UButton
        :icon="ICONS.refresh"
        :loading="sensors.status.value === 'pending'"
        @click="sensors.refresh()"
      >
        Actualizar
      </UButton>
      <SensorsCreateDialog @created="sensors.refresh()" />
    </div>
    <AsyncTable
      :total="sensors.data.value?.total ?? 0"
      :loading="sensors.pending.value"
      :rows="sensors.data.value?.results ?? []"
      :columns="columns"
    >
      <template #actions-data="{ row }">
        <LazySensorsEditDialog
          v-if="permissions.canUpdate('sensors')"
          :item="row"
          @edited="sensors.refresh()"
        />
        <LazySensorsCredentialsDialog
          v-if="permissions.canUpdate('sensors')"
          :sensor="row"
        />
        <UButton
          variant="ghost"
          size="xs"
          :icon="ICONS.sensorConfiguration"
          :to="`/sensors/${row.id}`"
        />
        <LazySensorsDeleteButton
          v-if="permissions.canDelete('sensors')"
          :sensor="row"
          @deleted="sensors.refresh()"
        />
      </template>
    </AsyncTable>
  </div>
</template>
