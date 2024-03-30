import type { ActuatorConfiguration, SensorConfiguration } from '~/pages/sensors/[id].vue'

export function generateSensorConfigurationId(item: SensorConfiguration) {
  return [
    'SENSOR_CONFIGURATION',
    cPlusPlusLize(item.name),
    'FOR_VARIABLE',
    cPlusPlusLize(item.variable.name ?? ''),
    'AT_LOCATION',
    cPlusPlusLize(item.location.name ?? ''),
  ].join('_')
}

export function generateSensorFile(configurations: SensorConfiguration[], sensor: { id: number, username: string }) {
  const text = [
    '#ifndef _IOT_PLATFORM_SENSOR_H_',
    '#define _IOT_PLATFORM_SENSOR_H_',
    '',
    `#define SENSOR_ID ${sensor.id}`,
    `#define SENSOR_NAME "${sensor.username}"`,
    '#define SENSOR_PASSWORD "[YOUR_SENSOR_PASSWORD]"',
    '',
    configurations.map((item) => {
      return `#define ${generateSensorConfigurationId(item)} "${item.id}"`
    }).join('\n'),
    '#endif',
  ].join('\n')
  return text
}

function cPlusPlusLize(text: string) {
  return text.replaceAll(' ', '_').toUpperCase().normalize('NFD').replace(/[\u0300-\u036F]/g, '')
}
