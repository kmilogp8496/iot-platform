import { z } from 'zod'

export const locationsFormSchema = z.object({
  name: z.string().min(1, 'Campo requerido'),
  project: z.object({
    id: z.number({ required_error: 'Campo requerido' }),
  }, {
    required_error: 'Campo requerido',
  }),
})
