import { apiClient } from './client'

export async function generateAiInsight({
  target,
  pingData,
  tracerouteData,
  ports
}) {
  const response = await apiClient.post('/api/ai/insight', {
    target,
    ping_data: pingData,
    traceroute_data: tracerouteData,
    ports
  })

  return response.data
}