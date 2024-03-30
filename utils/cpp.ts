import type { SensorConfiguration } from '~/pages/sensors/[id].vue'

export function generateSensorId(item: SensorConfiguration) {
  return [
    'SENSOR',
    cPlusPlusLize(item.name),
    cPlusPlusLize(item.variable.name ?? ''),
    cPlusPlusLize(item.location.name ?? ''),
  ].join('_')
}

export function generateSensorConfigurationFile(items: SensorConfiguration[], sensor: { id: number, username: string }) {
  const text = [
    '#ifndef _IOT_PLATFORM_SENSOR_H_',
    '#define _IOT_PLATFORM_SENSOR_H_',
    '',
    `#define SENSOR_ID ${sensor.id}`,
    `#define SENSOR_NAME "${sensor.username}"`,
    '#define SENSOR_PASSWORD "[YOUR_SENSOR_PASSWORD]"',
    '',
    items.map((item) => {
      const configurationDefinition = generateSensorId(item)

      return `#define ${configurationDefinition} "${item.id}"`
    }).join('\n'),
    '#endif',
  ].join('\n')
  return text
}

function cPlusPlusLize(text: string) {
  return text.replaceAll(' ', '_').toUpperCase().normalize('NFD').replace(/[\u0300-\u036F]/g, '')
}
