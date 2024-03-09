import type { UserSessionComposable } from '#auth-utils'
import { RolesDefinition } from '~/utils/constants'

export const PERMISSIONS_DEFINITION = {
  SENSORS: 'sensors',
  VARIABLES: 'variables',
  PROJECTS: 'projects',
} as const

export const USER_PERMISSIONS = {
  CREATE: {
    [PERMISSIONS_DEFINITION.SENSORS]: [RolesDefinition.GUEST],
    [PERMISSIONS_DEFINITION.VARIABLES]: [RolesDefinition.GUEST, RolesDefinition.USER],
    [PERMISSIONS_DEFINITION.PROJECTS]: [RolesDefinition.GUEST],
  },
  UPDATE: {
    [PERMISSIONS_DEFINITION.SENSORS]: [RolesDefinition.GUEST],
    [PERMISSIONS_DEFINITION.PROJECTS]: [RolesDefinition.GUEST],
  },
  DELETE: {
    [PERMISSIONS_DEFINITION.SENSORS]: [RolesDefinition.GUEST],
    [PERMISSIONS_DEFINITION.PROJECTS]: [RolesDefinition.GUEST],
  },
} as const

export type UserPermissionsKeys = keyof typeof USER_PERMISSIONS
export type Permissions<T extends UserPermissionsKeys> = keyof (typeof USER_PERMISSIONS)[T]

export function usePermissions(session: UserSessionComposable) {
  const can = <T extends UserPermissionsKeys, K extends Permissions<T>>(action: T, permission: K) => {
    if (!session.loggedIn.value || !session.user.value?.role)
      return false

    const notAllowedRoles = USER_PERMISSIONS[action][permission]
    if (!notAllowedRoles)
      return false

    // @ts-expect-error - TS doesn't understand that notAllowedRoles is a Roles array
    return !notAllowedRoles.includes(session.user.value.role)
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
