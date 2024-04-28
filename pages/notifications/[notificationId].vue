<script lang="ts" setup>
import type { NotificationByIdResponse } from '~/server/api/notifications/[id].get'
import type { NotificationConfigurationsResponse } from '~/server/api/notifications/configurations/index.get'
import type { PaginatedResponse } from '~/server/utils/api'

const route = useRoute()

const notification = useFetch<NotificationByIdResponse>(`/api/notifications/${route.params.notificationId}`, {
  onResponseError() {
    navigateTo('/notifications')
  },
})

export type NotificationConfiguration = NotificationConfigurationsResponse['results'][number]

const notificationConfiguration = useFetch<PaginatedResponse<NotificationConfiguration>>('/api/notifications/configurations/', {
  query: {
    notificationId: route.params.notificationId,
    limit: 10,
  },
  onResponseError(error) {
    if (error.response.status === 404) {
      navigateTo('/notifications')
    }
  },
})

const session = useUserSession()

const permissions = usePermissions(session)

const sensorConfigurationTableColumns = useTableColumns<NotificationConfiguration>([
  {
    key: 'name',
    label: 'Nombre',
  },
  {
    key: 'sign',
    label: 'Condición',
    transform: value => mapSignToLabel(value.sign) + ' ' + value.threshold,
  },
  {
    key: 'sensorConfiguration.name',
    label: 'Configuración del sensor',
  },
  {
    key: 'createdAt',
    label: 'Creado en',
    transform: value => new Date(value.createdAt).toLocaleDateString(),
  },
  {
    key: 'actions',
    label: 'Acciones',
    hidden: !permissions.canUpdate('notifications') && !permissions.canDelete('notifications'),
  },
])

const mapSignToLabel = (sign: string) => {
  switch (sign) {
    case 'gte':
      return 'Mayor o igual que'
    case 'lte':
      return 'Menor o igual que'
    case 'gt':
      return 'Mayor que'
    case 'lt':
      return 'Menor que'
    case 'eq':
      return 'Igual a'
    default:
      return ''
  }
}
</script>

<template>
  <div>
    <div class="flex mb-4 gap-4 items-center">
      <PageTitle :title="`Configuración de ${notification.data.value?.name ?? ''}`" />
      <BaseSpacer />
      <UButton
        :icon="ICONS.refresh"
        :loading="notificationConfiguration.status.value === 'pending'"
        @click="notificationConfiguration.refresh()"
      >
        Actualizar
      </UButton>
      <NotificationsConfigurationCreateDialog
        v-if="notification.data.value"
        :notification-id="notification.data.value.id"
        @created="notificationConfiguration.refresh()"
      />
    </div>
    <AsyncTable
      :total="notificationConfiguration.data.value?.total ?? 0"
      :loading="notificationConfiguration.pending.value"
      :rows="notificationConfiguration.data.value?.results ?? []"
      :columns="sensorConfigurationTableColumns"
    >
      <template #actions-data="{ row }">
        <LazyNotificationsConfigurationEditDialog
          v-if="permissions.canUpdate('notifications')"
          :key="row.id"
          :item="row"
          :notification="notification.data.value!"
          @edited="notificationConfiguration.refresh()"
        />
        <LazyNotificationsConfigurationDeleteButton
          v-if="permissions.canDelete('notifications')"
          :key="row.id"
          :notification-configuration="row"
          @deleted="notificationConfiguration.refresh()"
        />
      </template>
    </AsyncTable>
  </div>
</template>
