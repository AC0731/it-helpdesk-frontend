import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import AIInsightPanel from './AIInsightPanel'

const insight = {
  provider: 'local_rules',
  summary: 'Diagnostics were reviewed for google.com.',
  risk_level: 'low',
  probable_causes: [
    'The target appears reachable.',
    'Traceroute may be restricted by the server.'
  ],
  recommended_next_steps: [
    'Confirm the target value.',
    'Review open ports.',
    'Escalate if the issue repeats.'
  ]
}

describe('AIInsightPanel', () => {
  it('shows the empty AI insight state', () => {
    render(
      <AIInsightPanel
        insight={null}
        error=""
        loading={false}
        onGenerateInsight={() => {}}
      />
    )

    expect(screen.getByText('AI Insight')).toBeInTheDocument()
    expect(screen.getByText(/generate an AI troubleshooting insight/i)).toBeInTheDocument()
  })

  it('calls the generate insight handler', async () => {
    const user = userEvent.setup()
    const handleGenerateInsight = vi.fn()

    render(
      <AIInsightPanel
        insight={null}
        error=""
        loading={false}
        onGenerateInsight={handleGenerateInsight}
      />
    )

    await user.click(screen.getByRole('button', { name: /generate ai insight/i }))

    expect(handleGenerateInsight).toHaveBeenCalledOnce()
  })

  it('renders an AI insight result', () => {
    render(
      <AIInsightPanel
        insight={insight}
        error=""
        loading={false}
        onGenerateInsight={() => {}}
      />
    )

    expect(screen.getByText('local_rules')).toBeInTheDocument()
    expect(screen.getByText('Low Risk')).toBeInTheDocument()
    expect(screen.getByText('Diagnostics were reviewed for google.com.')).toBeInTheDocument()
    expect(screen.getByText('The target appears reachable.')).toBeInTheDocument()
    expect(screen.getByText('Review open ports.')).toBeInTheDocument()
  })

  it('shows API errors', () => {
    render(
      <AIInsightPanel
        insight={null}
        error="API error"
        loading={false}
        onGenerateInsight={() => {}}
      />
    )

    expect(screen.getByText('API error')).toBeInTheDocument()
  })
})