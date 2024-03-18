import { eq } from 'drizzle-orm'
import type { InsertUser } from '~/server/database/schemas/users.schema'
import { users } from '~/server/database/schemas/users.schema'
import { RolesDefinition } from '~/utils/constants'

interface GoogleAuthTokens {
  access_token: string
  expires_in: number
  scope: string
  token_type: string
  id_token: string
}

interface GoogleUserSession {
  sub: string
  picture: string
  email: string
  email_verified: boolean
}

export default oauth.googleEventHandler({
  config: {
    scope: ['email'],
  },
  async onSuccess(event, { user }: { user: GoogleUserSession, tokens: GoogleAuthTokens }) {
    if (!user.email_verified)
      return sendRedirect(event, '/home?error=email-not-verified')

    const db = useDB()
    let dbUser = (await db.select().from(users).where(eq(users.email, user.email))).at(0)

    if (!dbUser) {
      const newUser: InsertUser = {
        email: user.email,
        role: RolesDefinition.USER,
      }

      dbUser = (await db.insert(users).values(newUser).returning()).at(0)
    }

    await setUserSession(event, {
      user: dbUser,
      loggedAt: new Date(),
    })
    return sendRedirect(event, '/dashboard')
  },
  onError(event, error) {
    console.error('Github OAuth error:', error)
    return sendRedirect(event, '/home?error=github-oauth-failed')
  },
})
