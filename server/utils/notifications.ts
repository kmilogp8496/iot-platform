import { eq, inArray } from 'drizzle-orm'
import { NotificationConfigurations } from '../database/schemas/notificationConfigurations.schema'
import { SensorsConfigurations } from '../database/schemas/sensorsConfiguration.schema'
import type { notificationType } from '../database/schemas/notifications.schema'
import { Notifications } from '../database/schemas/notifications.schema'
import { variables } from '../database/schemas/variables.schema'
import { Sensors } from '../database/schemas/sensors.schema'
import { Locations } from '../database/schemas/locations.schema'
import { sendSlackThresholdNotification } from '../integrations/slack'
import { sendDiscordThresholdNotification } from '../integrations/discord'
import { sendHTTPThresholdNotification } from '../integrations/http'

export const sendNotifications = async (db: DB, sensorConfigurations: number[]) => {
  const notificationIds = await db.selectDistinct({ notification: NotificationConfigurations.notification })
    .from(NotificationConfigurations)
    .where(
      inArray(NotificationConfigurations.sensorConfiguration, sensorConfigurations),
    )

  if (notificationIds.length === 0) {
    return
  }

  const notificationConfigurations = await db.select({
    variable: {
      name: variables.name,
      unit: variables.unit,
    },
    sign: NotificationConfigurations.sign,
    sensorConfiguration: {
      id: SensorsConfigurations.id,
      lastValue: SensorsConfigurations.lastValue,
    },
    sensor: {
      name: Sensors.name,
    },
    location: {
      name: Locations.name,
    },
    threshold: NotificationConfigurations.threshold,
    notification: {
      id: NotificationConfigurations.notification,
      name: Notifications.name,
      message: Notifications.message,
      type: Notifications.type,
      url: Notifications.url,
    },
  }).from(NotificationConfigurations).where(
    inArray(NotificationConfigurations.notification, notificationIds.map(n => n.notification)),
  )
    .innerJoin(SensorsConfigurations, eq(SensorsConfigurations.id, NotificationConfigurations.sensorConfiguration))
    .innerJoin(Notifications, eq(Notifications.id, NotificationConfigurations.notification))
    .innerJoin(variables, eq(variables.id, SensorsConfigurations.variable))
    .innerJoin(Sensors, eq(Sensors.id, SensorsConfigurations.sensor))
    .innerJoin(Locations, eq(Locations.id, SensorsConfigurations.location))

  const groupedByNotification = new Map<number, boolean[]>()

  for (const notificationConfiguration of notificationConfigurations) {
    const notification = groupedByNotification.get(notificationConfiguration.notification.id) ?? []
    const threshold = parseFloat(notificationConfiguration.threshold)
    const lastValue = parseFloat(String(notificationConfiguration.sensorConfiguration.lastValue))

    if (
      Number.isNaN(threshold)
      || Number.isNaN(lastValue)
    ) {
      notification.push(false)
      groupedByNotification.set(notificationConfiguration.notification.id, notification)
      continue
    }

    switch (notificationConfiguration.sign) {
      case 'eq':
        notification.push(threshold === lastValue)
        break
      case 'neq':
        notification.push(threshold !== lastValue)
        break
      case 'gt':
        notification.push(threshold < lastValue)
        break
      case 'gte':
        notification.push(threshold <= lastValue)
        break
      case 'lt':
        notification.push(threshold > lastValue)
        break
      case 'lte':
        notification.push(threshold >= lastValue)
        break

      default:
        notification.push(false)
        break
    }

    groupedByNotification.set(notificationConfiguration.notification.id, notification)
  }

  for (const [notificationId, checks] of groupedByNotification) {
    if (checks.some(n => !n)) {
      continue
    }

    const configurationsByNotification = notificationConfigurations.filter(n => n.notification.id === notificationId)
    const notification = configurationsByNotification[0].notification
    const handler = getNotificationHandlerByType(notification.type)
    handler?.(notification.url, notification, configurationsByNotification).catch(console.error)
  }
}

export function getNotificationHandlerByType(type: (typeof notificationType.enumValues)[number]) {
  switch (type) {
    case 'slack':
      return sendSlackThresholdNotification
    case 'discord':
      return sendDiscordThresholdNotification
    case 'http':
      return sendHTTPThresholdNotification

    default:
      return null
  }
}
