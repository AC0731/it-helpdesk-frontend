import { render, screen, waitFor } from '@testing-library/react'

import TicketAnalytics from './TicketAnalytics'
import { listSupportTickets } from '../api/tickets'

vi.mock('../api/tickets', () => ({
  listSupportTickets: vi.fn()
}))

vi.mock('../api/client', () => ({
  getApiErrorMessage: () => 'API error'
}))

const tickets = [
  {
    ticket_id: 'TKT-1',
    status: 'open',
    priority: 'medium'
  },
  {
    ticket_id: 'TKT-2',
    status: 'in_progress',
    priority: 'high'
  },
  {
    ticket_id: 'TKT-3',
    status: 'resolved',
    priority: 'urgent'
  },
  {
    ticket_id: 'TKT-4',
    status: 'closed',
    priority: 'low'
  }
]

describe('TicketAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders ticket analytics from the backend ticket list', async () => {
    listSupportTickets.mockResolvedValue({
      count: tickets.length,
      tickets
    })

    render(<TicketAnalytics refreshKey={0} />)

    await waitFor(() => {
      expect(screen.getByText('Ticket Analytics')).toBeInTheDocument()
    })

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
    listSupportTickets.mockRejectedValue(new Error('Failed'))

    render(<TicketAnalytics refreshKey={0} />)

    await waitFor(() => {
      expect(screen.getByText('API error')).toBeInTheDocument()
    })
  })
})