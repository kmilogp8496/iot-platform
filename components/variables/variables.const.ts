import { z } from 'zod'

export const variablesSchema = z.object({
  name: z.string().min(1, 'Campo requerido'),
  description: z.string(),
  unit: z.string(),
})
