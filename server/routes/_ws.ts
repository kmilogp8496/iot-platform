import type { Peer } from 'crossws'
import { z } from 'zod'
import { RolesDefinition } from '~/utils/constants'

export const webSocketPeers = new Map<number, { authenticated: boolean, peer: Peer }>()

const loginResponseSchema = z.object({
  user: z.object({ role: z.string(), id: z.number() }),
})

async function getLoggedSensor(cookie: string) {
  const response = await $fetch('/api/_auth/session', {
    headers: {
      cookie,
    },
  })

  const loginResponse = loginResponseSchema.safeParse(response)

  if (loginResponse.success && loginResponse.data.user.role === RolesDefinition.SENSOR)
    return loginResponse.data.user
}

export default defineWebSocketHandler({
  async open(peer) {
    try {
      // @ts-expect-error Cookie should exist in headers of the peer
      const loggedSensor = await getLoggedSensor(peer.headers.cookie)

      if (loggedSensor)
        webSocketPeers.set(loggedSensor.id, { authenticated: true, peer })
    }
    catch {
      console.error('[ws] open', peer)
    }
  },
  async message(peer, message) {
    if (message.text().includes('ping'))
      peer.send('pong')
  },

  close(peer, event) {
    // eslint-disable-next-line no-console
    console.info('[ws] close', peer, event)
  },

  error(peer, error) {
    console.error('[ws] error', peer, error)
  },
})
