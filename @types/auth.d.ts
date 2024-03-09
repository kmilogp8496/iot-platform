import type { User as SelectUser } from '../server/database/schemas/users.schema'

declare module '#auth-utils' {
  interface User extends SelectUser {
    role: SelectUser['role'] | 'SENSOR'
  }

  interface UserSession {
    user?: User
    loggedAt?: Date
  }
}
export {}
