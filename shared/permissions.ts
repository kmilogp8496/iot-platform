import { RolesDefinition } from '~/utils/constants'

export const PERMISSIONS_DEFINITION = {
  LOCATIONS: 'locations',
  PROJECTS: 'projects',
  SENSORS: 'sensors',
  THINGS_DATA: 'thingsData',
  VARIABLES: 'variables',
  SENSORS_CONFIGURATION: 'sensorConfiguration',
  SENSORS_ACTUATORS: 'actuators',
} as const

export const USER_PERMISSIONS = {
  CREATE: {
    [PERMISSIONS_DEFINITION.SENSORS]: [RolesDefinition.ADMIN, RolesDefinition.USER],
    [PERMISSIONS_DEFINITION.VARIABLES]: [RolesDefinition.ADMIN, RolesDefinition.USER],
    [PERMISSIONS_DEFINITION.PROJECTS]: [RolesDefinition.ADMIN, RolesDefinition.USER],
    [PERMISSIONS_DEFINITION.LOCATIONS]: [RolesDefinition.ADMIN, RolesDefinition.USER],
    [PERMISSIONS_DEFINITION.SENSORS_CONFIGURATION]: [RolesDefinition.ADMIN, RolesDefinition.USER],
    [PERMISSIONS_DEFINITION.SENSORS_ACTUATORS]: [RolesDefinition.ADMIN, RolesDefinition.USER],
    [PERMISSIONS_DEFINITION.THINGS_DATA]: [RolesDefinition.SENSOR],
  },
  UPDATE: {
    [PERMISSIONS_DEFINITION.SENSORS]: [RolesDefinition.ADMIN, RolesDefinition.USER],
    [PERMISSIONS_DEFINITION.VARIABLES]: [RolesDefinition.ADMIN, RolesDefinition.USER],
    [PERMISSIONS_DEFINITION.PROJECTS]: [RolesDefinition.ADMIN, RolesDefinition.USER],
    [PERMISSIONS_DEFINITION.LOCATIONS]: [RolesDefinition.ADMIN, RolesDefinition.USER],
    [PERMISSIONS_DEFINITION.SENSORS_ACTUATORS]: [RolesDefinition.ADMIN, RolesDefinition.USER],
    [PERMISSIONS_DEFINITION.SENSORS_CONFIGURATION]: [RolesDefinition.ADMIN, RolesDefinition.USER],
  },
  DELETE: {
    [PERMISSIONS_DEFINITION.SENSORS]: [RolesDefinition.ADMIN, RolesDefinition.USER],
    [PERMISSIONS_DEFINITION.PROJECTS]: [RolesDefinition.ADMIN, RolesDefinition.USER],
    [PERMISSIONS_DEFINITION.LOCATIONS]: [RolesDefinition.ADMIN, RolesDefinition.USER],
    [PERMISSIONS_DEFINITION.SENSORS_ACTUATORS]: [RolesDefinition.ADMIN, RolesDefinition.USER],
    [PERMISSIONS_DEFINITION.SENSORS_CONFIGURATION]: [RolesDefinition.ADMIN, RolesDefinition.USER],
  },
} as const

export type UserPermissionsKeys = keyof typeof USER_PERMISSIONS
export type Permissions<T extends UserPermissionsKeys> = keyof (typeof USER_PERMISSIONS)[T]
