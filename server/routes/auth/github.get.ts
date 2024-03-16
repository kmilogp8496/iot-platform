import { eq } from 'drizzle-orm'
import type { InsertUser } from '~/server/database/schemas/users.schema'
import { users } from '~/server/database/schemas/users.schema'
import { RolesDefinition } from '~/utils/constants'

interface GithubUserSession {
  login: string // username
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: ''
  url: string // profile url
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: false
  name: string
  company: null | string
  blog: string
  location: string | null
  email: string
  hireable: string | null
  bio: string | null
  twitter_username: null | string
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

interface GithubTokensSession {
  access_token: string
  token_type: string
  scope: string
}

export default oauth.githubEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user }: { user: GithubUserSession, tokens: GithubTokensSession }) {
    const db = useDB()
    let dbUser = (await db.select().from(users).where(eq(users.email, user.email))).at(0)

    if (!dbUser) {
      const newUser: InsertUser = {
        email: user.email,
        firstName: user.name,
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
