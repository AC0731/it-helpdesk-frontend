import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import TicketDashboard from './TicketDashboard'
import { getSupportTicket, listSupportTickets, updateSupportTicketStatus } from '../api/tickets'

vi.mock('../api/tickets', () => ({
  getSupportTicket: vi.fn(),
  listSupportTickets: vi.fn(),
  updateSupportTicketStatus: vi.fn()
}))

vi.mock('../api/client', () => ({
  getApiErrorMessage: () => 'API error'
}))

const mockTicket = {
  id: 1,
  ticket_id: 'TKT-123',
  user_id: 'Demo Agent',
  target: 'google.com',
  status: 'open',
  priority: 'medium',
  summary: 'Diagnostic ticket created for google.com.',
  ping_data: 'Ping OK',
  traceroute_data: 'Traceroute OK',
  created_at: '2026-06-04T09:00:00.000Z',
  updated_at: '2026-06-04T09:00:00.000Z'
}

describe('TicketDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders tickets returned by the backend', async () => {
    listSupportTickets.mockResolvedValue({
      count: 1,
      tickets: [mockTicket]
    })

    render(<TicketDashboard refreshKey={0} />)

    await waitFor(() => {
      expect(screen.getByText('TKT-123')).toBeInTheDocument()
    })

    expect(screen.getByText('google.com')).toBeInTheDocument()
    expect(screen.getAllByText('Open').length).toBeGreaterThan(0)
    expect(screen.getByText('Medium')).toBeInTheDocument()
  })

  it('shows an empty state when no tickets exist', async () => {
    listSupportTickets.mockResolvedValue({
      count: 0,
      tickets: []
    })

    render(<TicketDashboard refreshKey={0} />)

    await waitFor(() => {
      expect(screen.getByText('No tickets found')).toBeInTheDocument()
    })
  })

  it('opens the ticket detail modal', async () => {
    const user = userEvent.setup()

    listSupportTickets.mockResolvedValue({
      count: 1,
      tickets: [mockTicket]
    })

    getSupportTicket.mockResolvedValue(mockTicket)

    render(<TicketDashboard refreshKey={0} />)

    await waitFor(() => {
      expect(screen.getByText('TKT-123')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /view details/i }))

    await waitFor(() => {
      expect(getSupportTicket).toHaveBeenCalledWith('TKT-123')
    })

    expect(screen.getByRole('dialog', { name: /full ticket details/i })).toBeInTheDocument()
    expect(screen.getByText('Ping OK')).toBeInTheDocument()
  })

  it('updates ticket status from the dashboard', async () => {
    const user = userEvent.setup()

    listSupportTickets.mockResolvedValue({
      count: 1,
      tickets: [mockTicket]
    })

    updateSupportTicketStatus.mockResolvedValue({
      status: 'success',
      ticket: {
        ...mockTicket,
        status: 'in_progress'
      }
    })

    render(<TicketDashboard refreshKey={0} />)

    await waitFor(() => {
      expect(screen.getByText('TKT-123')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /mark in progress/i }))

    expect(updateSupportTicketStatus).toHaveBeenCalledWith('TKT-123', 'in_progress')
  })
})