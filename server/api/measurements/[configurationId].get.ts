import { objectPick } from '@vueuse/core'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { sensors } from '~/server/database/schemas/sensors.schema'
import { sensorsConfigurations } from '~/server/database/schemas/sensorsConfiguration.schema'
import { processedNumber } from '~/server/utils/api'

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

export default defineCachedEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const readClient = useInfluxReadClient()
  const config = useRuntimeConfig()

  const configurationId = await getNumericIdFromRouteParams(event, 'configurationId')

  const query = await getValidatedQuery(event, z.object({
    from: processedNumber.default(10000000),
  }).parse)

  const db = useDB()

  const configuration = (await db.select({
    id: sensorsConfigurations.id,
  })
    .from(sensorsConfigurations)
    .where(
      eq(sensorsConfigurations.id, configurationId),
    ).innerJoin(sensors, and(
      eq(sensors.id, sensorsConfigurations.sensor),
      eq(sensors.createdBy, user.id),
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

  return result
}, {
  maxAge: 5 * 60,
})
