import { apiClient } from './client'

export async function executeDiagnostics(target) {
  const response = await apiClient.post('/api/diagnostics', {
    target
  })

  return response.data
}