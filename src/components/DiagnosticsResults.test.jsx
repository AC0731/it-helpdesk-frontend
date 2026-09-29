import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import DiagnosticsResults from './DiagnosticsResults'

const mockResults = {
  target: 'google.com',
  resolved_ip: '8.8.8.8',
  request_id: 'CASE-42',
  results: {
    ping: 'Ping OK',
    traceroute: 'Traceroute OK',
    ports: {
      80: 'Open',
      443: 'Open',
      22: 'Closed'
    }
  }
}

function renderDiagnosticsResults(overrides = {}) {
  const props = {
    results: mockResults,
    ticketStatus: '',
    ticketError: '',
    ticketLoading: false,
    ticketPriority: 'medium',
    onTicketPriorityChange: () => {},
    onGenerateTicket: () => {},
    ...overrides
  }

  render(<DiagnosticsResults {...props} />)

  return props
}

describe('DiagnosticsResults', () => {
  it('renders diagnostic output and port results', () => {
    renderDiagnosticsResults()

    expect(screen.getByText('google.com')).toBeInTheDocument()
    expect(screen.getByText('8.8.8.8')).toBeInTheDocument()
    expect(screen.getByText('CASE-42')).toBeInTheDocument()
    expect(screen.getByText('Port 80: Open')).toBeInTheDocument()
    expect(screen.getByText('Port 22: Closed')).toBeInTheDocument()
    expect(screen.getByText('Ping OK')).toBeInTheDocument()
    expect(screen.getByText('Traceroute OK')).toBeInTheDocument()
  })

  it('calls ticket creation handler when button is clicked', async () => {
    const user = userEvent.setup()
    const handleGenerateTicket = vi.fn()

    renderDiagnosticsResults({
      onGenerateTicket: handleGenerateTicket
    })

    await user.click(screen.getByRole('button', { name: /generate support ticket/i }))

    expect(handleGenerateTicket).toHaveBeenCalledOnce()
  })

  it('allows ticket priority to be changed before creation', async () => {
    const user = userEvent.setup()
    const handlePriorityChange = vi.fn()

    renderDiagnosticsResults({
      onTicketPriorityChange: handlePriorityChange
    })

    await user.selectOptions(screen.getByLabelText(/ticket priority/i), 'urgent')

    expect(handlePriorityChange).toHaveBeenCalledWith('urgent')
  })

  it('shows ticket success message', () => {
    renderDiagnosticsResults({
      ticketStatus: 'TKT-123'
    })

    expect(screen.getByText('Ticket Created: TKT-123')).toBeInTheDocument()
  })
})