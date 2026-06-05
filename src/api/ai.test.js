import { generateAiInsight } from './ai'
import { apiClient } from './client'

vi.mock('./client', () => ({
  apiClient: {
    post: vi.fn()
  }
}))

describe('generateAiInsight', () => {
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
})