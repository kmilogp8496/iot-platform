import { Point } from '@influxdata/influxdb-client'

export default defineEventHandler(async () => {
  const writeClient = useInfluxWriteClient()
  const points
    = [
      new Point('temperatura')
        .tag('location', 'Portland')
        .intField('outside', Math.random() * 30 + Math.random() * 10 - Math.random() * 10),
      new Point('temperatura')
        .tag('location', 'Klamath')
        .intField('inside', Math.random() * 30 + Math.random() * 10 - Math.random() * 10),
      new Point('temperatura')
        .tag('location', 'Portland')
        .intField('inside', Math.random() * 30 + Math.random() * 10 - Math.random() * 10),
      new Point('temperatura')
        .tag('location', 'Klamath')
        .intField('outside', Math.random() * 30 + Math.random() * 10 - Math.random() * 10),
    ]

  writeClient.writePoints(points)
  writeClient.flush()

  return null
})
