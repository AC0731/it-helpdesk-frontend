import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import DiagnosticsForm from './DiagnosticsForm'

describe('DiagnosticsForm', () => {
  it('renders the diagnostics form and submits the typed target', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn((event) => event.preventDefault())
    const handleTargetChange = vi.fn()

    render(
      <DiagnosticsForm
        target=""
        error=""
        loading={false}
        onTargetChange={handleTargetChange}
        onSubmit={handleSubmit}
      />
    )

    await user.type(screen.getByPlaceholderText('e.g., github.com or 8.8.8.8'), 'google.com')
    await user.click(screen.getByRole('button', { name: /execute diagnostics/i }))

    expect(handleTargetChange).toHaveBeenCalled()
    expect(handleSubmit).toHaveBeenCalled()
  })

  it('shows an error message when one is provided', () => {
    render(
      <DiagnosticsForm
        target=""
        error="Please enter a domain or public IP address."
        loading={false}
        onTargetChange={() => {}}
        onSubmit={() => {}}
      />
    )

    expect(screen.getByText('Please enter a domain or public IP address.')).toBeInTheDocument()
  })

  it('shows loading state while diagnostics are running', () => {
    render(
      <DiagnosticsForm
        target="google.com"
        error=""
        loading={true}
        onTargetChange={() => {}}
        onSubmit={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: /running tests/i })).toBeDisabled()
  })
})