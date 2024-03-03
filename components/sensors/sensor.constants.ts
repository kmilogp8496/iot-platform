import { z } from 'zod'

export const sensorsFormSchema = z.object({
  name: z.string().min(1, 'Campo requerido'),
  description: z.string(),
  project: z.object({
    id: z.number({ required_error: 'Campo requerido' }),
  }, {
    required_error: 'Campo requerido',
  }),
  variables: z.array(
    z.object({
      id: z.number({ required_error: 'Valor incorrecto' }),
    }),
  ),
})
