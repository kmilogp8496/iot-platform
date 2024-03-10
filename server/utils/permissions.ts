import type { H3Event } from 'h3'
import type { UserSession } from '#auth-utils'
import { type Permissions, USER_PERMISSIONS, type UserPermissionsKeys } from '~/shared/permissions'

function can<T extends UserPermissionsKeys>(session: UserSession, action: T, permission: Permissions<T>) {
  if (!session.user)
    return false

  const allowedRoles = USER_PERMISSIONS[action][permission]
  if (!allowedRoles)
    return false

  // @ts-expect-error - TS doesn't understand that notAllowedRoles is a Roles array
  return allowedRoles.includes(session.user.role)
}

export async function useEventPermissions(event: H3Event) {
  const session = await getUserSession(event)

  return {
    can: (action: UserPermissionsKeys, permission: Permissions<UserPermissionsKeys>) => can(session, action, permission),
    canCreate: (permission: Permissions<'CREATE'>) => can(session, 'CREATE', permission),
    canUpdate: (permission: Permissions<'UPDATE'>) => can(session, 'UPDATE', permission),
    canDelete: (permission: Permissions<'DELETE'>) => can(session, 'DELETE', permission),
  }
}

export async function requireEventPermission<T extends UserPermissionsKeys>(event: H3Event, permissions: [T, Permissions<T>][]) {
  const session = await getUserSession(event)

  for (const [action, permission] of permissions) {
    if (!can(session, action, permission)) {
      throw createError({
        statusCode: 403,
        message: 'No tienes permisos para realizar esta acción',
      })
    }
  }

  return session
}
