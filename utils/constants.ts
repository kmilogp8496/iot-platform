export const RolesDefinition = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  GUEST: 'GUEST',
} as const

export type UserRoles = typeof RolesDefinition[keyof typeof RolesDefinition]
