import { apiClient } from './client'

export async function createSupportTicket({ userId, target, pingData, tracerouteData }) {
  const response = await apiClient.post('/api/ticket', {
    user_id: userId,
    target,
    ping_data: pingData,
    traceroute_data: tracerouteData,
    priority: 'medium'
  })

  return response.data
}