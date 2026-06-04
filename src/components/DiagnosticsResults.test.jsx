import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import DiagnosticsResults from './DiagnosticsResults'

const mockResults = {
  target: 'google.com',
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

describe('DiagnosticsResults', () => {
  it('renders diagnostic output and port results', () => {
    render(
      <DiagnosticsResults
        results={mockResults}
        ticketStatus=""
        ticketError=""
        ticketLoading={false}
        onGenerateTicket={() => {}}
      />
    )

    expect(screen.getByText('google.com')).toBeInTheDocument()
    expect(screen.getByText('Port 80: Open')).toBeInTheDocument()
    expect(screen.getByText('Port 22: Closed')).toBeInTheDocument()
    expect(screen.getByText('Ping OK')).toBeInTheDocument()
    expect(screen.getByText('Traceroute OK')).toBeInTheDocument()
  })

  it('calls ticket creation handler when button is clicked', async () => {
    const user = userEvent.setup()
    const handleGenerateTicket = vi.fn()

    render(
      <DiagnosticsResults
        results={mockResults}
        ticketStatus=""
        ticketError=""
        ticketLoading={false}
        onGenerateTicket={handleGenerateTicket}
      />
    )

    await user.click(screen.getByRole('button', { name: /generate support ticket/i }))

    expect(handleGenerateTicket).toHaveBeenCalledOnce()
  })

  it('shows ticket success message', () => {
    render(
      <DiagnosticsResults
        results={mockResults}
        ticketStatus="TKT-123"
        ticketError=""
        ticketLoading={false}
        onGenerateTicket={() => {}}
      />
    )

    expect(screen.getByText('Ticket Created: TKT-123')).toBeInTheDocument()
  })
})