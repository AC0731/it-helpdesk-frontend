import { render, screen, waitFor } from '@testing-library/react'

import TicketAnalytics from './TicketAnalytics'
import { getTicketAnalytics } from '../api/tickets'

vi.mock('../api/tickets', () => ({
  getTicketAnalytics: vi.fn()
}))

vi.mock('../api/client', () => ({
  getApiErrorMessage: () => 'API error'
}))

const analyticsResponse = {
  total: 4,
  by_status: {
    open: 1,
    in_progress: 1,
    resolved: 1,
    closed: 1
  },
  by_priority: {
    low: 1,
    medium: 1,
    high: 1,
    urgent: 1
  },
  high_priority_total: 2
}

describe('TicketAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders ticket analytics from the backend analytics endpoint', async () => {
    getTicketAnalytics.mockResolvedValue(analyticsResponse)

    render(<TicketAnalytics refreshKey={0} />)

    await waitFor(() => {
      expect(screen.getByText('Ticket Analytics')).toBeInTheDocument()
    })

    expect(getTicketAnalytics).toHaveBeenCalledOnce()

    expect(screen.getByText('Total Tickets')).toBeInTheDocument()
    expect(screen.getByText('Open')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Resolved')).toBeInTheDocument()
    expect(screen.getByText('Closed')).toBeInTheDocument()
    expect(screen.getByText('High Priority')).toBeInTheDocument()

    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getAllByText('1')).toHaveLength(4)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('shows an API error if analytics cannot be loaded', async () => {
    getTicketAnalytics.mockRejectedValue(new Error('Failed'))

    render(<TicketAnalytics refreshKey={0} />)

    await waitFor(() => {
      expect(screen.getByText('API error')).toBeInTheDocument()
    })
  })
})