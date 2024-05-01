export function getCloudflareCompletion(body: object) {
  const config = useRuntimeConfig()
  return $fetch.raw(`https://api.cloudflare.com/client/v4/accounts/${config.aiClientId}/ai/run/@cf/meta/llama-2-7b-chat-int8`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${config.aiApiKey}`,
    },
    body,
  })
}
