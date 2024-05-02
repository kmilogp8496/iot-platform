export function sendHTTPNotification(url: string, body: object) {
  return $fetch.raw(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body,
  })
}

export async function sendHTTPThresholdNotification(url: string,
  notification: {
    name: string
    message: string
  },
  configurationsByNotification: {
    variable: { name: string, unit: string }
    sensorConfiguration: { id: number, lastValue: string | null }
    sensor: { name: string }
    location: { name: string }
  }[],
  date = new Date(),
) {
  const body = {
    notification: {
      name: notification.name,
      message: notification.message,
    },
    configurations: configurationsByNotification.map(c => ({
      sensor: c.sensor.name,
      location: c.location.name,
      variable: c.variable.name,
      value: c.sensorConfiguration.lastValue,
      unit: c.variable.unit,
    })),
    date: date.toISOString(),
  }

  return sendHTTPNotification(url, body)
}
