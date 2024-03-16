import type { UserSessionComposable } from '#auth-utils'
import { type Permissions, USER_PERMISSIONS, type UserPermissionsKeys } from '~/shared/permissions'

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
