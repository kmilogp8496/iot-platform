import type { Peer } from 'crossws'
import { z } from 'zod'
import { ThingsPostBodySchema } from '../api/things/index.post'
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
    const text = message.text()
    console.log('[ws] message', peer, text)
    if (text.includes('ping')) {
      peer.send('pong')
      return
    }
    try {
      const data = JSON.parse(text)

      if (!ThingsPostBodySchema.safeParse(data).success) {
        peer.send('Invalid data')
        console.error('[ws] message', peer, 'Invalid data', data)
      }

      const response = await $fetch.raw('/api/things', {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
          // @ts-expect-error Cookie should exist in headers of the peer
          'cookie': peer.headers.cookie,
        },
      })

      if (response.ok) {
        peer.send('OK!')
        return
      }

      peer.send('Error!')
      console.error('[ws] message', peer, response)
    }
    catch (error) {
      console.error('[ws] message', peer, error)
    }
  },

  close(peer, event) {
    console.info('[ws] close', peer, event)
  },

  error(peer, error) {
    console.error('[ws] error', peer, error)
  },
})
