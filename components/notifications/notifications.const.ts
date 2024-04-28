import { z } from 'zod'

export const notificationLevels = ['info', 'warning', 'error'] as const satisfies string[]
export const notificationTypes = ['slack', 'discord', 'http'] as const satisfies string[]

export const notificationsSchema = z.object({
  name: z.string().min(1, 'Campo requerido'),
  message: z.string().min(1, 'Campo requerido'),
  description: z.string(),
  level: z.enum(notificationLevels),
  type: z.enum(notificationTypes),
  url: z.string().url(),
})
