export const sendSlackNotification = async (url: string, body: object) =>
  await $fetch.raw(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body,
  })

export async function sendSlackThresholdNotification(url: string,
  notification: {
    name: string
    message: string
  },
  configurationsByNotification: {
    variable: { name: string, unit: string }
    sensorConfiguration: { id: number, lastValue: number | null }
    sensor: { name: string }
    location: { name: string } }[],
  date = new Date(),
) {
  const body = {
    text: notification.name,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: ':rotating_light: ' + notification.name + ' :rotating_light:',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'plain_text',
            text: notification.message,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Variables involucradas*',
        },
      },
      {
        type: 'section',
        fields: [
          ...configurationsByNotification.map(v => ({
            type: 'plain_text',
            text: `${v.sensor.name} en ${v.location.name} \n ${v.variable.name}: ${v.sensorConfiguration.lastValue} ${v.variable.unit}\n`,
          })),
        ],
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Fecha*  ${date.toLocaleDateString('es-ES')}, ${date.toLocaleTimeString('es-ES')}`,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '<https://iot.kmilo.dev/dashboard|Consultar>',
        },
      },
    ],
  }

  await sendSlackNotification(url, body)
}
