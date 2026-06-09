import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import SavedAIInsightsPanel from './SavedAIInsightsPanel'
import { deleteAiInsight, listAiInsights } from '../api/ai'

vi.mock('../api/ai', () => ({
  deleteAiInsight: vi.fn(),
  listAiInsights: vi.fn()
}))

vi.mock('../api/client', () => ({
  getApiErrorMessage: () => 'API error'
}))

const savedInsight = {
  id: 1,
  ticket_id: null,
  target: 'google.com',
  provider: 'local_rules',
  risk_level: 'low',
  summary: 'Diagnostics were reviewed for google.com.',
  probable_causes: ['The target appears reachable.'],
  recommended_next_steps: ['Review open ports.'],
  created_at: '2026-06-05T09:00:00.000Z'
}

describe('SavedAIInsightsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders saved AI insights', async () => {
    listAiInsights.mockResolvedValue({
      count: 1,
      insights: [savedInsight]
    })

    render(<SavedAIInsightsPanel refreshKey={0} />)

    await waitFor(() => {
      expect(screen.getByText('Saved AI Insights')).toBeInTheDocument()
    })

    expect(screen.getByText('google.com')).toBeInTheDocument()
    expect(screen.getByText('Diagnostics were reviewed for google.com.')).toBeInTheDocument()
    expect(screen.getByText('local_rules')).toBeInTheDocument()
  })

  it('shows empty state when no insights exist', async () => {
    listAiInsights.mockResolvedValue({
      count: 0,
      insights: []
    })

    render(<SavedAIInsightsPanel refreshKey={0} />)

    await waitFor(() => {
      expect(screen.getByText('No saved AI insights yet')).toBeInTheDocument()
    })
  })

  it('refreshes saved AI insights', async () => {
    const user = userEvent.setup()

    listAiInsights.mockResolvedValue({
      count: 1,
      insights: [savedInsight]
    })

    render(<SavedAIInsightsPanel refreshKey={0} />)

    await waitFor(() => {
      expect(screen.getByText('google.com')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /refresh/i }))

    expect(listAiInsights).toHaveBeenCalledTimes(2)
  })

  it('opens and closes the custom delete modal', async () => {
    const user = userEvent.setup()

    listAiInsights.mockResolvedValue({
      count: 1,
      insights: [savedInsight]
    })

    render(<SavedAIInsightsPanel refreshKey={0} />)

    await waitFor(() => {
      expect(screen.getByText('google.com')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /^delete$/i }))

    expect(screen.getByRole('dialog', { name: /delete saved insight/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(screen.queryByRole('dialog', { name: /delete saved insight/i })).not.toBeInTheDocument()
  })

  it('deletes a saved AI insight after confirmation', async () => {
    const user = userEvent.setup()

    listAiInsights.mockResolvedValue({
      count: 1,
      insights: [savedInsight]
    })

    deleteAiInsight.mockResolvedValue({
      status: 'success',
      deleted_id: 1
    })

    render(<SavedAIInsightsPanel refreshKey={0} />)

    await waitFor(() => {
      expect(screen.getByText('google.com')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /^delete$/i }))
    await user.click(screen.getByRole('button', { name: /delete insight/i }))

    expect(deleteAiInsight).toHaveBeenCalledWith(1)

    await waitFor(() => {
      expect(screen.queryByText('google.com')).not.toBeInTheDocument()
    })
  })

  it('shows API errors', async () => {
    listAiInsights.mockRejectedValue(new Error('Failed'))

    render(<SavedAIInsightsPanel refreshKey={0} />)

    await waitFor(() => {
      expect(screen.getByText('API error')).toBeInTheDocument()
    })
  })
})