<script lang="ts" setup>
import type { InferPaginationItem } from '~/utils/typing.ts'

const notifications = useFetch('/api/notifications')

export type NotificationItem = InferPaginationItem<typeof notifications>

const session = useUserSession()

const permissions = usePermissions(session)

const columns = useTableColumns<NotificationItem>([
  {
    key: 'name',
    label: 'Nombre',
  },
  {
    key: 'description',
    label: 'Descripción',
  },
  {
    key: 'message',
    label: 'Mensaje',
  },
  {
    key: 'level',
    label: 'Nivel',
  },
  {
    key: 'type',
    label: 'Tipo',
  },
  {
    key: 'createdAt',
    label: 'Creado en',
    transform: value => new Date(value.createdAt!).toLocaleDateString(),
  },
  {
    key: 'actions',
    label: 'Acciones',
    hidden: !permissions.canUpdate('notifications') && !permissions.canDelete('notifications'),
  },
])

const loadingTest = ref(new Set<number>())

const onTest = async (notification: NotificationItem) => {
  loadingTest.value.add(notification.id)
  try {
    const response = await $fetch.raw(`/api/notifications/${notification.id}/test`, {
      method: 'POST',
    })
    console.log(response)
    displaySuccessNotification({
      title: 'Notificación enviada',
      description: 'La notificación ha sido enviada correctamente',
    })
  }
  catch {
    displayErrorNotification({
      title: 'Notificación fallida',
      description: 'Ha fallado la prueba de la notificación, por favor revisa la url de la notificación',
    })
  }
  finally {
    loadingTest.value.delete(notification.id)
  }
}
</script>

<template>
  <div>
    <div class="flex mb-4 gap-4 items-center">
      <PageTitle title="Notificaciones" />
      <BaseSpacer />
      <UButton
        icon="material-symbols:sync-rounded"
        :loading="notifications.status.value === 'pending'"
        @click="notifications.refresh()"
      >
        Actualizar
      </UButton>
      <NotificationsCreateDialog @created="notifications.refresh()" />
    </div>
    <AsyncTable
      :total="notifications.data.value?.total ?? 0"
      :loading="notifications.pending.value"
      :rows="notifications.data.value?.results ?? []"
      :columns="columns"
    >
      <template #actions-data="{ row }">
        <LazyNotificationsEditDialog
          v-if="permissions.canUpdate('notifications')"
          :item="row"
          @edited="notifications.refresh()"
        />
        <UButton
          v-if="permissions.canUpdate('notifications')"
          variant="ghost"
          size="xs"
          :icon="ICONS.sensorConfiguration"
          :to="`/notifications/${row.id}`"
        />
        <UTooltip text="Probar notificación">
          <UButton
            variant="ghost"
            size="xs"
            :icon="ICONS.test"
            :loading="loadingTest.has(row.id)"
            @click="onTest(row)"
          />
        </UTooltip>
        <LazyNotificationsDeleteButton
          v-if="permissions.canDelete('notifications')"
          :notification="row"
          @deleted="notifications.refresh()"
        />
      </template>
    </AsyncTable>
  </div>
</template>
