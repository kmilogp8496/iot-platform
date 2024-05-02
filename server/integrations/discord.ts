export function sendDiscordNotification(url: string, body: object) {
  return $fetch.raw(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body,
  })
}

export async function sendDiscordThresholdNotification(url: string,
  notification: {
    name: string
    message: string
  },
  configurationsByNotification: {
    variable: { name: string, unit: string }
    sensorConfiguration: { id: number, lastValue: string | null }
    sensor: { name: string }
    location: { name: string } }[],
  date = new Date(),
) {
  let discordMarkdownContent = `# ${notification.name}
:rotating_light: :rotating_light: :rotating_light:
## ${notification.message}
`

  discordMarkdownContent += configurationsByNotification.map((v) => {
    return `**${v.sensor.name}** en **${v.location.name}** \n${v.variable.name}: ${v.sensorConfiguration.lastValue} ${v.variable.unit}`
  }).join('\n')

  discordMarkdownContent += `
**Fecha y hora**: ${date.toLocaleString()}`

  await sendDiscordNotification(url, { content: discordMarkdownContent })
}
