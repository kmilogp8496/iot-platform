import { useInfluxReadClient } from '../utils/influxDB'

export default defineEventHandler(async () => {
  const readClient = useInfluxReadClient()

  const fluxQuery = /*  */`from(bucket: "casa")
 |> range(start: -10m)
 |> filter(fn: (r) => r._measurement == "temperatura")`

  const rows = readClient.iterateRows(fluxQuery)

  const result = []

  for await (const row of rows) {
    const tableObject = row.tableMeta.toObject(row.values)
    result.push(tableObject)
  }

  return result
})
