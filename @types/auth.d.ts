import type { User as SelectUser } from '../server/database/schemas/users.schema'

declare module '#auth-utils' {
  interface User extends SelectUser {}

  interface UserSession {
    user?: User
    loggedAt?: Date
  }
}
export {}
