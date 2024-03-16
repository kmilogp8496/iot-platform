<script lang="ts" setup>
import type { InferPaginationItem } from '~/utils/typing.ts'

const route = useRoute()

const sensor = await useFetch(`/api/sensors/${route.params.id}`)

if (!sensor.data.value)
  await navigateTo('/sensors')

const sensorsConfigurations = useFetch('/api/sensorsConfiguration', {
  query: { sensor: route.params.id },
})

export type SensorConfiguration = InferPaginationItem<typeof sensorsConfigurations>

const session = useUserSession()

const permissions = usePermissions(session)

const columns = useTableColumns<SensorConfiguration>([
  {
    key: 'project.name',
    label: 'Proyecto',
  },
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
    hidden: !permissions.canUpdate('sensors') && !permissions.canDelete('sensors'),
  },
])

const { copy } = useCopyToClipboard()

const cPlusPlusLize = (text: string) => text.replaceAll(' ', '_').toUpperCase().normalize('NFD').replace(/[\u0300-\u036F]/g, '')

async function onCopyToClipboard() {
  const data = sensorsConfigurations.data.value
  if (!data || !sensor.data.value)
    return

  const text = [
    '#ifndef _IOT_PLATFORM_SENSOR_H_',
    '#define _IOT_PLATFORM_SENSOR_H_',
    '',
    `#define SENSOR_ID ${sensor.data.value!.id}`,
    `#define SENSOR_NAME "${sensor.data.value!.username}"`,
    '#define SENSOR_PASSWORD "[YOUR_SENSOR_PASSWORD]"',
    '',
    data.results.map((item) => {
      const configurationDefinition = [
        'SENSOR',
        cPlusPlusLize(item.name),
        cPlusPlusLize(item.variable.name ?? ''),
        cPlusPlusLize(item.location.name ?? ''),
      ].join('_')

      return `#define ${configurationDefinition} "${item.id}"`
    }).join('\n'),
    '#endif',
  ].join('\n')

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
        text="Copiar IoTPlatformSensor.h al portapapeles"
      >
        <UButton icon="material-symbols:content-copy" @click="onCopyToClipboard()" />
      </UTooltip>
      <UButton icon="material-symbols:sync-rounded" :loading="sensorsConfigurations.status.value === 'pending'" @click="sensorsConfigurations.refresh()">
        Actualizar
      </UButton>
      <SensorsConfigurationCreateDialog v-if="sensor.data.value" :sensor-id="sensor.data.value.id" @created="sensorsConfigurations.refresh()" />
    </div>
    <AsyncTable :total="sensorsConfigurations.data.value?.total ?? 0" :loading="sensorsConfigurations.pending.value" :rows="sensorsConfigurations.data.value?.results ?? []" :columns="columns">
      <template #actions-data="{ row }">
        <LazySensorsConfigurationEditDialog v-if="permissions.canUpdate('sensorConfiguration')" :key="row.id" :item="row" :sensor="sensor.data.value!" @edited="sensorsConfigurations.refresh()" />
        <LazySensorsConfigurationDeleteButton v-if="permissions.canDelete('sensorConfiguration')" :key="row.id" :sensor-configuration="row" @deleted="sensorsConfigurations.refresh()" />
      </template>
    </AsyncTable>
  </div>
</template>
