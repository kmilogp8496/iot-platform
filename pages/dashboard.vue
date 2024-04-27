<script lang="ts" setup>
import type { NotNull } from '~/utils/typing'

const title = ref('Dashboard')

useHead({
  title,
})

const session = useUserSession()
const projects = await useFetch('/api/projects')

const project = ref(projects.data.value?.results[0]?.id)

watch(project, () => {
  if (!project.value)
    return

  title.value = `Dashboard - ${projects.data.value?.results.find(p => p.id === project.value)!.name}`
})

const permissions = usePermissions(session)

export type SensorConfigurationByProject = InferResponse<NotNull<typeof sensorsConfigurations>>[number]

const sensorsConfigurations = project.value
  ? useFetch(`/api/sensorsConfiguration/projects/${project.value}`)
  : null
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="inline-flex items-center gap-4 pb-4">
      <span class="text-sm">
        Proyecto:
      </span>
      <USelectMenu
        v-model="project"
        :options="projects.data.value?.results ?? []"
        value-attribute="id"
        option-attribute="name"
        placeholder="Proyecto"
      />
    </div>

    <div
      v-if="!sensorsConfigurations || !sensorsConfigurations.data.value?.length"
      class="space-y-10 flex-grow flex-col justify-center inline-flex"
    >
      <div
        class="text-center text-gray-600 dark:text-gray-300 text-xl px-4"
      >
        Nada que ver por el momento. Para ver información, necesitas al menos un sensor configurado.
      </div>
      <div class="flex justify-center gap-4">
        <UButton
          v-if="permissions.canCreate('projects')"
          leading-:icon="ICONS.create"
          trailing-icon="i-heroicons-chart-bar"
          to="/projects"
          variant="soft"
        >
          Crear proyecto
        </UButton>
        <UButton
          v-if="permissions.canCreate('sensors')"
          leading-:icon="ICONS.create"
          trailing-icon="i-cbi-motion-sensor-temperature"
          to="/sensors"
          variant="soft"
        >
          Crear sensor
        </UButton>
      </div>
    </div>
    <div
      v-else
      class="grid grid-cols-1 lg:grid-cols-2 gap-4"
    >
      <DashboardCard
        v-for="configuration in sensorsConfigurations.data.value"
        :key="configuration.id"
        :configuration="configuration"
      />
    </div>
  </div>
</template>

<style>

</style>
