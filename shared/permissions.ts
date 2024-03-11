import type { UserSessionComposable } from '#auth-utils'
import { RolesDefinition } from '~/utils/constants'

export const PERMISSIONS_DEFINITION = {
  LOCATIONS: 'locations',
  PROJECTS: 'projects',
  SENSORS: 'sensors',
  THINGS_DATA: 'thingsData',
  VARIABLES: 'variables',
} as const

export const USER_PERMISSIONS = {
  CREATE: {
    [PERMISSIONS_DEFINITION.SENSORS]: [RolesDefinition.ADMIN, RolesDefinition.USER],
    [PERMISSIONS_DEFINITION.VARIABLES]: [RolesDefinition.ADMIN],
    [PERMISSIONS_DEFINITION.PROJECTS]: [RolesDefinition.ADMIN],
    [PERMISSIONS_DEFINITION.THINGS_DATA]: [RolesDefinition.SENSOR],
    [PERMISSIONS_DEFINITION.LOCATIONS]: [RolesDefinition.ADMIN, RolesDefinition.USER],
  },
  UPDATE: {
    [PERMISSIONS_DEFINITION.SENSORS]: [RolesDefinition.ADMIN, RolesDefinition.USER],
    [PERMISSIONS_DEFINITION.PROJECTS]: [RolesDefinition.ADMIN, RolesDefinition.USER],
    [PERMISSIONS_DEFINITION.LOCATIONS]: [RolesDefinition.ADMIN, RolesDefinition.USER],
  },
  DELETE: {
    [PERMISSIONS_DEFINITION.SENSORS]: [RolesDefinition.ADMIN, RolesDefinition.USER],
    [PERMISSIONS_DEFINITION.PROJECTS]: [RolesDefinition.ADMIN, RolesDefinition.USER],
    [PERMISSIONS_DEFINITION.LOCATIONS]: [RolesDefinition.ADMIN, RolesDefinition.USER],
  },
} as const

export type UserPermissionsKeys = keyof typeof USER_PERMISSIONS
export type Permissions<T extends UserPermissionsKeys> = keyof (typeof USER_PERMISSIONS)[T]

export function usePermissions(session: UserSessionComposable) {
  const can = <T extends UserPermissionsKeys, K extends Permissions<T>>(action: T, permission: K) => {
    if (!session.loggedIn.value || !session.user.value?.role)
      return false

    const allowedRoles = USER_PERMISSIONS[action][permission]
    if (!allowedRoles)
      return false

    // @ts-expect-error - TS doesn't understand that notAllowedRoles is a Roles array
    return allowedRoles.includes(session.user.value.role)
  }

  const canCreate = (permission: Permissions<'CREATE'>) => can('CREATE', permission)
  const canUpdate = (permission: Permissions<'UPDATE'>) => can('UPDATE', permission)
  const canDelete = (permission: Permissions<'DELETE'>) => can('DELETE', permission)

  return {
    canCreate,
    canDelete,
    canUpdate,
  }
}
