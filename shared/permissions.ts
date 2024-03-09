const PERMISSIONS_DEFINITION = {
  SENSORS: 'sensors',
  VARIABLES: 'variables',
} as const

const USER_PERMISSIONS = {
  CREATE: {
    [PERMISSIONS_DEFINITION.SENSORS]: [RolesDefinition.GUEST],
    [PERMISSIONS_DEFINITION.VARIABLES]: [RolesDefinition.GUEST, RolesDefinition.USER],
  },
  UPDATE: {
    [PERMISSIONS_DEFINITION.SENSORS]: [RolesDefinition.GUEST],
  },
  DELETE: {
    [PERMISSIONS_DEFINITION.SENSORS]: [RolesDefinition.GUEST],
  },
} as const

type UserPermissionsKeys = keyof typeof USER_PERMISSIONS
type Permissions<T extends UserPermissionsKeys> = keyof (typeof USER_PERMISSIONS)[T]

export function usePermissions() {
  const session = useUserSession()
  const can = <T extends UserPermissionsKeys, K extends Permissions<T>>(action: T, permission: K) => {
    if (!session.loggedIn.value || !session.user.value?.role)
      return false

    const notAllowedRoles = USER_PERMISSIONS[action][permission]
    if (!notAllowedRoles)
      return false

    // @ts-expect-error - TS doesn't understand that notAllowedRoles is a Roles array
    return notAllowedRoles.includes(session.user.value.role)
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
