<script lang="ts" setup>
const route = useRoute()

const sensor = await useFetch(`/api/sensors/${route.params.id}`)

if (!sensor.data.value)
  await navigateTo('/sensors')

const sensorsConfigurations = useFetch('/api/sensorsConfiguration', {
  query: {
    sensor: route.params.id,
    limit: 10,
  },
})

const actuatorConfigurations = useFetch('/api/actuatorConfiguration', {
  query: {
    sensor: route.params.id,
    limit: 10,
  },
})

export type SensorConfiguration = InferPaginationItem<typeof sensorsConfigurations>
export type ActuatorConfiguration = InferPaginationItem<typeof actuatorConfigurations>

const session = useUserSession()

const permissions = usePermissions(session)

const sensorConfigurationTableColumns = useTableColumns<SensorConfiguration>([
  {
    key: 'name',
    label: 'Nombre',
  },
  {
    key: 'generatedId',
    label: 'ID Generado',
  },
  {
    key: 'variable.name',
    label: 'Variable',
    transform: value => `${value.variable.name} (${value.variable.unit})`,
  },
  {
    key: 'location.name',
    label: 'Ubicación',
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

const actuatorConfigurationTableColumns = useTableColumns<ActuatorConfiguration>([
  {
    key: 'name',
    label: 'Nombre',
  },
  {
    key: 'variable.name',
    label: 'Variable',
    transform: value => `${value.variable.name} (${value.variable.unit})`,
  },
  {
    key: 'location.name',
    label: 'Ubicación',
  },
  {
    key: 'createdAt',
    label: 'Creado en',
    transform: value => new Date(value.createdAt!).toLocaleDateString(),
  },
  {
    key: 'actions',
    label: 'Acciones',
    hidden: !permissions.canUpdate('actuators') && !permissions.canDelete('actuators'),
  },
])

const { copy } = useCopyToClipboard()

async function onCopyToClipboard() {
  const sensorConfigurationsData = sensorsConfigurations.data.value
  const sensorActuatorsData = actuatorConfigurations.data.value
  if (!sensorConfigurationsData || !sensorActuatorsData || !sensor.data.value)
    return

  const text = generateSensorFile(sensorConfigurationsData.results, sensor.data.value)

  copy(text, {
    title: 'Copiado al portapapeles',
    description: 'Tus configuraciones de los sensores han sido copiadas al portapapeles',
  }, {
    title: 'Error al copiar al portapapeles',
    description: 'No se ha podido copiar al portapapeles',
  })
}
</script>

<template>
  <div>
    <div class="flex mb-4 gap-4 items-center">
      <PageTitle :title="`Configuración de ${sensor.data.value?.name ?? ''}`" />
      <BaseSpacer />
      <UTooltip
        text="Copiar PlatformSensor.h al portapapeles"
      >
        <UButton
          icon="material-symbols:content-copy"
          @click="onCopyToClipboard()"
        />
      </UTooltip>
      <UButton
        :icon="ICONS.refresh"
        :loading="sensorsConfigurations.status.value === 'pending'"
        @click="sensorsConfigurations.refresh()"
      >
        Actualizar
      </UButton>
      <SensorsConfigurationCreateDialog
        v-if="sensor.data.value"
        :sensor-id="sensor.data.value.id"
        @created="sensorsConfigurations.refresh()"
      />
    </div>
    <AsyncTable
      :total="sensorsConfigurations.data.value?.total ?? 0"
      :loading="sensorsConfigurations.pending.value"
      :rows="sensorsConfigurations.data.value?.results ?? []"
      :columns="sensorConfigurationTableColumns"
    >
      <template #generatedId-data="{ row }">
        <TableTruncatedCell :content="generateSensorConfigurationId(row)" />
      </template>
      <template #actions-data="{ row }">
        <LazySensorsConfigurationEditDialog
          v-if="permissions.canUpdate('sensorConfiguration')"
          :key="row.id"
          :item="row"
          :sensor="sensor.data.value!"
          @edited="sensorsConfigurations.refresh()"
        />
        <LazySensorsConfigurationDeleteButton
          v-if="permissions.canDelete('sensorConfiguration')"
          :key="row.id"
          :sensor-configuration="row"
          @deleted="sensorsConfigurations.refresh()"
        />
      </template>
    </AsyncTable>
    <div class="flex my-4 gap-4 items-center">
      <h2 class="text-2xl font-semibold">
        Configuraciones de actuador
      </h2>
      <BaseSpacer />
      <UButton
        :icon="ICONS.refresh"
        :loading="actuatorConfigurations.status.value === 'pending'"
        @click="actuatorConfigurations.refresh()"
      >
        Actualizar
      </UButton>
      <ActuatorConfigurationCreateDialog
        v-if="sensor.data.value"
        :sensor-id="sensor.data.value.id"
        @created="actuatorConfigurations.refresh()"
      />
    </div>
    <AsyncTable
      :rows="actuatorConfigurations.data.value?.results ?? []"
      :columns="actuatorConfigurationTableColumns"
      :total="actuatorConfigurations.data.value?.total ?? 0"
      :loading="actuatorConfigurations.pending.value"
    >
      <template #actions-data="{ row }">
        <div class="flex items-center">
          <LazyActuatorConfigurationEditDialog
            v-if="permissions.canUpdate('actuators')"
            :key="row.id"
            :item="row"
            :sensor="sensor.data.value!"
            @edited="actuatorConfigurations.refresh()"
          />
          <ActuatorConfigurationPostValueButton
            v-if="permissions.canUpdate('actuators')"
            :key="row.id"
            :actuator-configuration="row"
          />
          <LazyActuatorConfigurationDeleteButton
            v-if="permissions.canDelete('actuators')"
            :key="row.id"
            :actuator-configuration="row"
            @deleted="actuatorConfigurations.refresh()"
          />
        </div>
      </template>
    </AsyncTable>
  </div>
</template>
