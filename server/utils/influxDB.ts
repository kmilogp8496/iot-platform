import { InfluxDB } from '@influxdata/influxdb-client'

export function useInfluxWriteClient() {
  const config = useRuntimeConfig()
  const client = new InfluxDB({ url: config.influxHost, token: config.influxToken })

  return client.getWriteApi(config.influxOrganization, config.influxDatabase, 'ns')
}

export function useInfluxReadClient() {
  const config = useRuntimeConfig()
  const client = new InfluxDB({ url: config.influxHost, token: config.influxToken })

  return client.getQueryApi(config.influxOrganization)
}
