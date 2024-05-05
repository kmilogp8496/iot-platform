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

export function generateActuatorConfigurationId(item: ActuatorConfiguration) {
  return [
    'ACTUATOR_CONFIGURATION',
    cPlusPlusLize(item.name),
    'FOR_VARIABLE',
    cPlusPlusLize(item.variable.name ?? ''),
    'AT_LOCATION',
    cPlusPlusLize(item.location.name ?? ''),
  ].join('_')
}

export function generateSensorFile(configurations: SensorConfiguration[], actuatorConfigurations: ActuatorConfiguration[], sensor: { id: number, username: string }) {
  const text = [
    '#ifndef _IOT_PLATFORM_SENSOR_H_',
    '#define _IOT_PLATFORM_SENSOR_H_',
    '',
    `#define API_URL "${window.location.host}"`,
    `#define API_PORT ${window.location.port || 443}`,
    '',
    `#define SENSOR_ID ${sensor.id}`,
    `#define SENSOR_NAME "${sensor.username}"`,
    '#define SENSOR_PASSWORD "[YOUR_SENSOR_PASSWORD]"',
    '',
    configurations.map((item) => {
      return `#define ${generateSensorConfigurationId(item)} "${item.id}"`
    }).join('\n'),
    '',
    actuatorConfigurations.map((item) => {
      return `#define ${generateActuatorConfigurationId(item)} "${item.sensorConfiguration.id}"`
    }).join('\n'),
    '#endif',
  ].join('\n')
  return text
}

function cPlusPlusLize(text: string) {
  return text.replaceAll(' ', '_').toUpperCase().normalize('NFD').replace(/[\u0300-\u036F]/g, '')
}
