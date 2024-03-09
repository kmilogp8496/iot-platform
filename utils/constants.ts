export const RolesDefinition = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  GUEST: 'GUEST',
  SENSOR: 'SENSOR',
} as const

export type UserRoles = typeof RolesDefinition[keyof typeof RolesDefinition]
