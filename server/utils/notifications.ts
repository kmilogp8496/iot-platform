import { eq, inArray } from 'drizzle-orm'
import { NotificationConfigurations } from '../database/schemas/notificationConfigurations.schema'
import { SensorsConfigurations } from '../database/schemas/sensorsConfiguration.schema'
import { Notifications } from '../database/schemas/notifications.schema'

export const sendNotifications = async (db: DB, sensorConfigurations: number[], requestBody: Record<number, number>) => {
  const notificationIds = await db.selectDistinct({ notification: NotificationConfigurations.notification }).from(NotificationConfigurations).where(inArray(NotificationConfigurations.sensorConfiguration, sensorConfigurations))

  if (notificationIds.length === 0) {
    return
  }

  const notificationConfigurations = await db.select({
    lastValue: SensorsConfigurations.lastValue,
    sign: NotificationConfigurations.sign,
    threshold: NotificationConfigurations.threshold,
    notification: NotificationConfigurations.notification,
    notificationName: Notifications.name,
    notificationMessage: Notifications.message,
  }).from(NotificationConfigurations).where(
    inArray(NotificationConfigurations.notification, notificationIds.map(n => n.notification)),
  )
    .leftJoin(SensorsConfigurations, eq(SensorsConfigurations.id, NotificationConfigurations.sensorConfiguration))
    .leftJoin(Notifications, eq(Notifications.id, NotificationConfigurations.notification))

  const groupedByNotification = new Map<number, boolean[]>()

  for (const notificationConfiguration of notificationConfigurations) {
    const notification = groupedByNotification.get(notificationConfiguration.notification) ?? []
    const threshold = parseFloat(notificationConfiguration.threshold)

    if (Number.isNaN(threshold)) {
      notification.push(false)
      groupedByNotification.set(notificationConfiguration.notification, notification)
    }

    switch (notificationConfiguration.sign) {
      case 'eq':
        notification.push(threshold === requestBody[notificationConfiguration.notification])
        break
      case 'neq':
        notification.push(threshold !== requestBody[notificationConfiguration.notification])
        break
      case 'gt':
        notification.push(threshold < requestBody[notificationConfiguration.notification])
        break
      case 'gte':
        notification.push(threshold <= requestBody[notificationConfiguration.notification])
        break
      case 'lt':
        notification.push(threshold > requestBody[notificationConfiguration.notification])
        break
      case 'lte':
        notification.push(threshold >= requestBody[notificationConfiguration.notification])
        break

      default:
        notification.push(false)
        break
    }

    groupedByNotification.set(notificationConfiguration.notification, notification)
  }

  const date = new Date()

  for (const notification of groupedByNotification) {
    if (notification[1].some(n => !n)) {
      continue
    }

    const variables = notificationConfigurations.filter(n => n.notification === notification[0])

    $fetch('https://hooks.slack.com/services/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', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: variables[0].notificationName,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'plain_text',
              text: variables[0].notificationMessage,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: 'Variables: ' + variables.map(v => '- ' + v.lastValue).join('\n'),
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: '*Fecha* ' + date.toLocaleDateString('es-ES'),
            },
            {
              type: 'mrkdwn',
              text: '*Hora* ' + date.toLocaleTimeString('es-ES'),
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '<https://iot.kmilo.dev/|Consultar>',
          },
        },
      ],
    })
  }
}
