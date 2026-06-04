import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import TicketDetailModal from './TicketDetailModal'

const ticket = {
  ticket_id: 'TKT-123',
  user_id: 'Demo Agent',
  target: 'google.com',
  status: 'open',
  priority: 'medium',
  summary: 'Diagnostic ticket created for google.com.',
  ping_data: 'Ping OK',
  traceroute_data: 'Traceroute OK',
  created_at: '2026-06-04T09:00:00.000Z',
  updated_at: '2026-06-04T09:10:00.000Z'
}

describe('TicketDetailModal', () => {
  it('renders complete ticket details', () => {
    render(
      <TicketDetailModal
        ticket={ticket}
        loading={false}
        error=""
        onClose={() => {}}
      />
    )

    expect(screen.getByRole('dialog', { name: /full ticket details/i })).toBeInTheDocument()
    expect(screen.getByText('TKT-123')).toBeInTheDocument()
    expect(screen.getByText('google.com')).toBeInTheDocument()
    expect(screen.getByText('Demo Agent')).toBeInTheDocument()
    expect(screen.getByText('Ping OK')).toBeInTheDocument()
    expect(screen.getByText('Traceroute OK')).toBeInTheDocument()
  })

  it('calls close handler from the close button', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()

    render(
      <TicketDetailModal
        ticket={ticket}
        loading={false}
        error=""
        onClose={handleClose}
      />
    )

    await user.click(screen.getByRole('button', { name: /close ticket details/i }))

    expect(handleClose).toHaveBeenCalledOnce()
  })

  it('shows loading state', () => {
    render(
      <TicketDetailModal
        ticket={null}
        loading={true}
        error=""
        onClose={() => {}}
      />
    )

    expect(screen.getByText('Loading ticket details...')).toBeInTheDocument()
  })
})