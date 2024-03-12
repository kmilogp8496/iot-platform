import { z } from 'zod'

export const sensorsConfigurationFormSchema = z.object({
  name: z.string().min(1, 'Campo requerido'),
  description: z.string(),
  location: z.object({
    id: z.number({ required_error: 'Campo requerido' }),
  }, {
    required_error: 'Campo requerido',
  }),
  variable: z.object({
    id: z.number({ required_error: 'Campo requerido' }),
  }, {
    required_error: 'Campo requerido',
  }),
})
