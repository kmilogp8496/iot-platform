import { z } from 'zod'

export const signLabels = [
  {
    label: 'Mayor o igual',
    value: 'gte',
  },
  {
    label: 'Menor o igual',
    value: 'lte',
  },
  {
    label: 'Igual',
    value: 'eq',
  },
  {
    label: 'Diferente',
    value: 'neq',
  },
  {
    label: 'Mayor',
    value: 'gt',
  },
  {
    label: 'Menor',
    value: 'lt',
  },
] as const satisfies { label: string, value: string }[]

export const sign = ['gte', 'lte', 'eq', 'neq', 'gt', 'lt'] as const

export const notificationConfigurationFormSchema = z.object({
  name: z.string().min(1, 'Campo requerido'),
  sensorConfiguration: z.object({
    id: z.number({ required_error: 'Campo requerido' }),
  }, {
    required_error: 'Campo requerido',
  }),
  sign: z.enum(sign),
  threshold: z.number(),
})
