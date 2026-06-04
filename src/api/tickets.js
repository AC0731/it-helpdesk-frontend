import { apiClient } from './client'

export async function createSupportTicket({
  userId,
  target,
  pingData,
  tracerouteData,
  priority = 'medium'
}) {
  const response = await apiClient.post('/api/ticket', {
    user_id: userId,
    target,
    ping_data: pingData,
    traceroute_data: tracerouteData,
    priority
  })

  return response.data
}

export async function listSupportTickets({ status = '', limit = 50 } = {}) {
  const params = {
    limit
  }

  if (status) {
    params.status = status
  }

  const response = await apiClient.get('/api/tickets', {
    params
  })

  return response.data
}

export async function getSupportTicket(ticketId) {
  const response = await apiClient.get(`/api/tickets/${ticketId}`)

  return response.data
}

export async function getTicketAnalytics() {
  const response = await apiClient.get('/api/tickets/analytics')

  return response.data
}

export async function updateSupportTicketStatus(ticketId, status) {
  const response = await apiClient.patch(`/api/tickets/${ticketId}`, {
    status
  })

  return response.data
}