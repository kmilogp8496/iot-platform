import { objectPick } from '@vueuse/core'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { Sensors } from '~/server/database/schemas/sensors.schema'
import { SensorsConfigurations } from '~/server/database/schemas/sensorsConfiguration.schema'
import { processedNumber } from '~/server/utils/api'
import { getCloudflareCompletion } from '~/server/integrations/cloudflareAi'
import { variables } from '~/server/database/schemas/variables.schema'

// const exampleRepsonse = {
//   result: '_result',
//   table: 0,
//   _start: '2024-03-22T19:35:57.148442853Z',
//   _stop: '2024-03-22T22:22:37.148442853Z',
//   _time: '2024-03-22T19:39:02.988775997Z',
//   _value: 22.53000069,
//   _field: 'BME280',
//   _measurement: 'Temperatura',
//   location: 'Salón',
//   locationID: '1',
//   project: 'Casa',
//   projectID: '11',
//   sensorID: '8',
//   unit: 'ªC',
//   variable: 'Temperatura',
//   variableID: '4',
// }

interface InfluxResponsePoint {
  result: '_result' // Ni idea
  table: number // Número de tabla donde va el dato, a nadie le importa esto sinceramente
  _start: string // Inicio del rango de tiempo de la consulta
  _stop: string // Fin del rango de tiempo de la consulta
  _time: string // Tiempo de la medición
  _value: number // Valor de la medición
  _field: string // El campo del punto insertado, probablemente se cambie en el futuro
  _measurement: string
  location: string
  locationID: string
  project: string
  projectID: string
  sensorID: string
  unit: string
  variable: string
  variableID: string
}

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const readClient = useInfluxReadClient()
  const config = useRuntimeConfig()

  const configurationId = await getNumericIdFromRouteParams(event, 'configurationId')

  const query = await getValidatedQuery(event, z.object({
    from: processedNumber.default(10000000),
  }).parse)

  const db = useDB()

  const configuration = (await db.select({
    id: SensorsConfigurations.id,
    variable: {
      name: variables.name,
      unit: variables.unit,
    },
  })
    .from(SensorsConfigurations)
    .where(
      eq(SensorsConfigurations.id, configurationId),
    )
    .innerJoin(variables, eq(SensorsConfigurations.variable, variables.id))
    .innerJoin(Sensors, and(
      eq(Sensors.id, SensorsConfigurations.sensor),
      eq(Sensors.createdBy, user.id),
    ))).at(0)

  if (!configuration) {
    throw createError({
      status: 404,
      message: 'Configuración no encontrada',
    })
  }

  const fluxQuery = /* sql */ `from(bucket: "${config.influxDatabase}")
                                  |> range(start: -${query.from}ms)
                                  |> filter(fn: (r) => r.configurationID == "${configuration.id}")`

  const rows = readClient.iterateRows(fluxQuery)

  const result: Pick<InfluxResponsePoint, '_value' | '_time'>[] = []

  for await (const row of rows) {
    const tableObject = row.tableMeta.toObject(row.values) as InfluxResponsePoint
    result.push(objectPick(tableObject, ['_value', '_time']))
  }

  const response = await getCloudflareCompletion({
    messages: [
      { role: 'system', content: `Eres un experto en Internet de las cosas, y te van a hacer preguntas acerca del comportamiento de un sensor.` },
      { role: 'system', content: `A continuación están los datos en formato JSON: ${JSON.stringify(result)}` },
      { role: 'system', content: 'Tu deber es ayudar al usuario a entender más acerca de patrones en los datos de este sensor.' },
      { role: 'system', content: `La variable medida es ${configuration.variable.name} y la unidad es ${configuration.variable.unit || 'ninguna'}` },
      { role: 'system', content: 'Si tienes menos de dos datos o dos posibles valores, responde que no tienes suficientes valores para realizar un análisis.' },
      { role: 'system', content: 'Tu respuesta debe ser concisa y lo más breve posible. No debes repetir las cosas y debes responder en lenguaje español castellano.' },

      { role: 'user', content: '¿Qué patrones se identifican en estos resultados?' },
    ],
  })

  return (response._data as any).result.response
})
