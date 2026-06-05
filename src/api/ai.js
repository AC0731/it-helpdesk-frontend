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

export async function saveAiInsight({
  ticketId = '',
  target,
  pingData,
  tracerouteData,
  ports
}) {
  const payload = {
    target,
    ping_data: pingData,
    traceroute_data: tracerouteData,
    ports
  }

  if (ticketId) {
    payload.ticket_id = ticketId
  }

  const response = await apiClient.post('/api/ai/insight/save', payload)

  return response.data
}

export async function listAiInsights({ ticketId = '', limit = 10 } = {}) {
  const params = {
    limit
  }

  if (ticketId) {
    params.ticket_id = ticketId
  }

  const response = await apiClient.get('/api/ai/insights', {
    params
  })

  return response.data
}