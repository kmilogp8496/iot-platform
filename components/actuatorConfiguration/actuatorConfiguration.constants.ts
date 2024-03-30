import { z } from 'zod'

export const actuatorConfigurationFormSchema = z.object({
  name: z.string().min(1, 'Campo requerido'),
  description: z.string(),
  sensorConfiguration: z.object({
    id: z.number({ required_error: 'Campo requerido' }),
  }, {
    required_error: 'Campo requerido',
  }),
})
