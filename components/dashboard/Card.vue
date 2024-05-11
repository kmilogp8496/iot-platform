<script setup lang="ts">
import { VisAxis, VisCrosshair, VisLine, VisScatter, VisTooltip, VisXYContainer } from '@unovis/vue'
import type { UnwrapRef } from 'vue'
import type { SensorConfigurationByProject } from '~/pages/dashboard.vue'
import { PrimaryColor } from '~~/tailwind.config'

const props = defineProps<{
  configuration: SensorConfigurationByProject
}>()

const ONE_HOUR = 60 * 60 * 1000
const ONE_DAY = 24 * ONE_HOUR

const fromOptions = [
  { label: '1 minuto', value: 1 * 60 * 1000 },
  { label: '15 minutos', value: 15 * 60 * 1000 },
  { label: '30 minutos', value: 30 * 60 * 1000 },
  { label: '1 hora', value: ONE_HOUR },
  { label: '3 horas', value: 3 * ONE_HOUR },
  { label: '6 horas', value: 6 * ONE_HOUR },
  { label: '12 horas', value: 12 * ONE_HOUR },
  { label: '1 día', value: ONE_DAY },
  { label: '2 días', value: 2 * ONE_DAY },
  { label: '3 días', value: 3 * ONE_DAY },
  { label: '7 días', value: 7 * ONE_DAY },
  { label: '15 días', value: 15 * ONE_DAY },
]

const from = ref(fromOptions[3].value)

const data = useLazyFetch(`/api/measurements/${props.configuration.id}`, {
  params: {
    from,
  },
})

function tickFormat(d: number) {
  return new Date(d).toLocaleString('es-ES', {
    hour12: false,
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

type DataPoint = UnwrapRef<typeof computedData>[number]

const computedData = computed(() => {
  return data.data.value?.results.map(d => ({
    y: d._value,
    x: new Date(d._time).valueOf(),
    tooltip: `${d._value.toFixed(2)} ${props.configuration.variable.unit} (${new Date(d._time).toLocaleString()})`,
  })) ?? []
})

const YLabel = computed(() => props.configuration.variable.unit ? `${props.configuration.variable.name} (${props.configuration.variable.unit})` : props.configuration.variable.name)

const currentValue = computed(() => {
  let last = data.data.value?.lastValue ?? null
  const beforeLast = computedData.value.at(-2) ?? null

  if (null === last || null === beforeLast || !data.data.value?.updatedAt)
    return null

  const diff = parseFloat(last) - beforeLast.y

  let icon: string | null = null
  switch (true) {
    case diff > 0:
      icon = 'i-streamline:graph-arrow-increase'
      break
    case diff < 0:
      icon = 'i-streamline:graph-arrow-decrease'
      break
    default:
      icon = null
      break
  }

  if (props.configuration.variable.unit) {
    last += ` (${props.configuration.variable.unit})`
  }

  return {
    value: last,
    icon,
    ago: useTimeAgo(data.data.value.updatedAt, TIME_AGO_DEFAULT_MESSAGES),
  }
})

const computedTitle = computed(() => `${props.configuration.name} - ${props.configuration.sensor.name}`)

function onGenerateCsv() {
  let csv = 'Tiempo,Valor\n'
  csv += computedData.value.map(d => `${new Date(d.x).toISOString()},${d.y}`).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${computedTitle.value} - ${new Date().toLocaleString()}.csv`
  a.click()
  a.remove()
}

const template = (d: DataPoint) => d.tooltip
const color = () => PrimaryColor[300]

const helpRequest = useFetch(`/api/measurements/${props.configuration.id}/help`, {
  method: 'POST',
  immediate: false,
  watch: false,
})
const onHelpRequest = async () => {
  await helpRequest.execute()
  if (helpRequest.error.value) {
    displayErrorFromApi(helpRequest.error.value)
  }
  else {
    displaySuccessNotification({
      title: 'El asistente ha respondido',
      description: helpRequest.data.value,
    })
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <slot name="title">
        <div class="text-lg sm:text-xl font-bold flex items-center justify-between">
          {{ computedTitle }}
          <div
            v-if="currentValue"
            class="font-medium text-gray-700 dark:text-gray-300"
          >
            {{ currentValue.value }} <UIcon
              v-if="currentValue.icon"
              :name="currentValue.icon"
            />
          </div>
        </div>
        <div class="font-extralight text-base sm:text-lg flex justify-between items-center">
          {{ YLabel }} en {{ configuration.location.name }}
          <div
            class="inline-flex items-center gap-2"
          >
            <UButton
              variant="ghost"
              size="xs"
              :loading="data.status.value === 'pending'"
              trailing-icon="i-heroicons:arrow-path"
              @click="data.refresh()"
            >
              <template v-if="currentValue">
                ({{ currentValue.ago.value }})
              </template>
            </UButton>
          </div>
        </div>
      </slot>
    </template>
    <VisXYContainer
      class="transition-opacity duration-500"
      :data="computedData"
      :class="{ 'opacity-20': data.status.value === 'pending' }"
    >
      <VisLine
        :color="PrimaryColor[600]"
        :x="(d: DataPoint) => d.x"
        :y="(d: DataPoint) => d.y"
      />
      <VisCrosshair
        :color="color"
        :template="template"
      />

      <VisTooltip />
      <VisAxis
        type="x"
        :tick-format="tickFormat"
        :tick-text-width="50"
        :num-ticks="5"
      />
      <VisAxis
        type="y"
        :num-ticks="5"
      />
      <VisScatter
        v-if="computedData.length < 100"
        :size="7"
        :color="PrimaryColor[600]"
        :x="(d: DataPoint) => d.x"
        :y="(d: DataPoint) => d.y"
      />
    </VisXYContainer>

    <div
      class="w-full aspect-video bg-red-500"
    />

    <template #footer>
      <div class="flex gap-2">
        <UTooltip
          text="Identificar patrones de la gráfica mediante asistente"
        >
          <UButton
            size="sm"
            variant="ghost"
            icon="i-mdi-help-circle-outline"
            :loading="helpRequest.status.value === 'pending'"
            @click="onHelpRequest"
          />
        </UTooltip>
        <UButton
          class="mr-auto"
          size="sm"
          variant="ghost"
          :icon="ICONS.sensorConfiguration"
          :loading="helpRequest.status.value === 'pending'"
          :to="`/sensors/${props.configuration.sensor.id}`"
        />
        <div class="inline-flex items-center gap-4 text-xs">
          Desde hace:
          <USelectMenu
            v-model="from"
            size="sm"
            :options="fromOptions"
            value-attribute="value"
            placeholder="Desde"
          />
        </div>
        <div>
          <UButton
            size="sm"
            icon="i-mdi-file-download-outline"
            @click="onGenerateCsv"
          >
            CSV
          </UButton>
        </div>
      </div>
    </template>
  </UCard>
</template>
