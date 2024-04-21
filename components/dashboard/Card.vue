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
  return data.data.value?.map(d => ({
    y: d._value,
    x: new Date(d._time).valueOf(),
    tooltip: `${d._value.toFixed(2)} ${props.configuration.variable.unit} (${new Date(d._time).toLocaleString()})`,
  })) ?? []
})

const YLabel = computed(() => `${props.configuration.variable.name} (${props.configuration.variable.unit})`)

const currentValue = computed(() => {
  const last = computedData.value.at(-1)
  const beforeLast = computedData.value.at(-2)

  if (!last || !beforeLast)
    return null

  const diff = last.y - beforeLast.y

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

  return {
    value: `${last.y.toFixed(2)} (${props.configuration.variable.unit})`,
    icon,
    ago: useTimeAgo(last.x, TIME_AGO_DEFAULT_MESSAGES),
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
          {{ YLabel }} en {{ configuration.location.name }} <div
            v-if="currentValue"
            class="inline-flex items-center gap-2"
          >
            <UButton
              variant="ghost"
              size="xs"
              :loading="data.status.value === 'pending'"
              trailing-icon="i-heroicons:arrow-path"
              @click="data.refresh()"
            >
              ({{ currentValue.ago.value }})
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

    <template #footer>
      <div class="flex justify-end gap-4">
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
            Descargar datos
          </UButton>
        </div>
      </div>
    </template>
  </UCard>
</template>
