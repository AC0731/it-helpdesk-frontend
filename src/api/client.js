import axios from 'axios'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://it-support-api-g0b4.onrender.com'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
})

function getRequestReference(error) {
  const requestId = error?.response?.headers?.['x-request-id']
  return requestId ? ` Reference: ${requestId}.` : ''
}

export function getApiErrorMessage(error) {
  const status = error?.response?.status
  const detail = error?.response?.data?.detail
  const reference = getRequestReference(error)

  if (error?.code === 'ECONNABORTED') {
    return `The request timed out before the backend completed the operation.${reference}`
  }

  if (status === 429) {
    return `${typeof detail === 'string' ? detail : 'Request limit reached. Please retry shortly.'}${reference}`
  }

  if (status === 504) {
    return `Diagnostic execution timed out before completion.${reference}`
  }

  if (
    status === 503 &&
    typeof detail === 'string' &&
    [
      'Diagnostic capacity is currently full. Retry shortly.',
      'Diagnostics completed but could not be saved.'
    ].includes(detail)
  ) {
    return `${detail}${reference}`
  }

  if (status >= 500) {
    return `The backend could not complete the request. Please retry or use the request reference for troubleshooting.${reference}`
  }

  if (typeof detail === 'string') {
    return `${detail}${reference}`
  }

  return `Failed to connect to the backend server. Please check the API connection.${reference}`
}
