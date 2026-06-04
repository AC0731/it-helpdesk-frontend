import { render, screen } from '@testing-library/react'

import StatusBadge from './StatusBadge'

describe('StatusBadge', () => {
  it('renders a readable status label', () => {
    render(<StatusBadge value="in_progress" />)

    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })

  it('renders a readable priority label', () => {
    render(<StatusBadge value="urgent" type="priority" />)

    expect(screen.getByText('Urgent')).toBeInTheDocument()
  })
})