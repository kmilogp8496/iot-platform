<script setup lang="ts">
import { VisAxis, VisLine, VisXYContainer } from '@unovis/vue'
import type { UnwrapRef } from 'vue'
import type { SensorConfigurationByProject } from '~/pages/dashboard.vue'

const props = defineProps<{
  configuration: SensorConfigurationByProject
}>()

const fromOptions = [
  { label: '1 hora', value: 1 * 60 * 60 * 1000 },
  { label: '3 horas', value: 3 * 60 * 60 * 1000 },
  { label: '6 horas', value: 6 * 60 * 60 * 1000 },
  { label: '12 horas', value: 12 * 60 * 60 * 1000 },
  { label: '1 día', value: 24 * 60 * 60 * 1000 },
  { label: '2 días', value: 2 * 24 * 60 * 60 * 1000 },
  { label: '3 días', value: 3 * 24 * 60 * 60 * 1000 },
  { label: '7 días', value: 7 * 24 * 60 * 60 * 1000 },
  { label: '15 días', value: 15 * 24 * 60 * 60 * 1000 },
]

const from = ref(fromOptions[0].value)

const data = useFetch(`/api/measurements/${props.configuration.id}`, {
  params: {
    from,
  },
})

function tickFormat(d: number) {
  return new Date(d).toLocaleTimeString()
}

type DataPoint = UnwrapRef<typeof computedData>[number]

const computedData = computed(() => {
  return data.data.value?.map(d => ({
    y: d._value,
    x: new Date(d._time).valueOf(),
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
    ago: useTimeAgo(last.x, TIME_AGO_DEFAULT_MESSAGES).value,
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
</script>

<template>
  <UCard>
    <template #header>
      <slot name="title">
        <div class="text-lg sm:text-xl font-bold flex items-center justify-between">
          {{ computedTitle }}
          <div v-if="currentValue" class="font-medium text-gray-700 dark:text-gray-300">
            {{ currentValue.value }} <UIcon v-if="currentValue.icon" :name="currentValue.icon" />
          </div>
        </div>
        <div class="font-extralight text-base sm:text-lg flex justify-between items-center">
          {{ YLabel }} en {{ configuration.location.name }} <div v-if="currentValue" class="text-xs">
            ({{ currentValue.ago }})
          </div>
        </div>
      </slot>
    </template>

    <VisXYContainer class="transition-opacity duration-500" :class="{ 'opacity-20': data.status.value === 'pending' }">
      <VisLine color="#038eb7" :data="computedData" :x="(d: DataPoint) => d.x" :y="(d: DataPoint) => d.y" />
      <VisAxis type="x" :tick-format="tickFormat" />
      <VisAxis type="y" />
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
          <UButton size="sm" icon="i-mdi-file-download-outline" @click="onGenerateCsv">
            Descargar datos
          </UButton>
        </div>
      </div>
    </template>
  </UCard>
</template>
