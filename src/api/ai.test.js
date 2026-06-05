import { generateAiInsight, listAiInsights, saveAiInsight } from './ai'
import { apiClient } from './client'

vi.mock('./client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn()
  }
}))

describe('AI API helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('posts diagnostic data to the AI insight endpoint', async () => {
    apiClient.post.mockResolvedValue({
      data: {
        target: 'google.com',
        insight: {
          provider: 'local_rules',
          summary: 'Reviewed.'
        }
      }
    })

    const response = await generateAiInsight({
      target: 'google.com',
      pingData: 'Ping OK',
      tracerouteData: 'Trace OK',
      ports: {
        80: 'Open'
      }
    })

    expect(apiClient.post).toHaveBeenCalledWith('/api/ai/insight', {
      target: 'google.com',
      ping_data: 'Ping OK',
      traceroute_data: 'Trace OK',
      ports: {
        80: 'Open'
      }
    })

    expect(response.insight.provider).toBe('local_rules')
  })

  it('saves AI insight diagnostic data', async () => {
    apiClient.post.mockResolvedValue({
      data: {
        status: 'success',
        insight: {
          id: 1,
          target: 'google.com'
        }
      }
    })

    const response = await saveAiInsight({
      target: 'google.com',
      pingData: 'Ping OK',
      tracerouteData: 'Trace OK',
      ports: {
        443: 'Open'
      }
    })

    expect(apiClient.post).toHaveBeenCalledWith('/api/ai/insight/save', {
      target: 'google.com',
      ping_data: 'Ping OK',
      traceroute_data: 'Trace OK',
      ports: {
        443: 'Open'
      }
    })

    expect(response.insight.id).toBe(1)
  })

  it('lists saved AI insights', async () => {
    apiClient.get.mockResolvedValue({
      data: {
        count: 1,
        insights: [
          {
            id: 1,
            target: 'google.com'
          }
        ]
      }
    })

    const response = await listAiInsights({
      limit: 8
    })

    expect(apiClient.get).toHaveBeenCalledWith('/api/ai/insights', {
      params: {
        limit: 8
      }
    })

    expect(response.count).toBe(1)
  })
})