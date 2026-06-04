import { useState } from 'react'

import { executeDiagnostics } from '../api/diagnostics'
import { getApiErrorMessage } from '../api/client'
import { createSupportTicket } from '../api/tickets'
import DashboardHeader from '../components/DashboardHeader'
import DiagnosticsForm from '../components/DiagnosticsForm'
import DiagnosticsResults from '../components/DiagnosticsResults'
import TicketAnalytics from '../components/TicketAnalytics'
import TicketDashboard from '../components/TicketDashboard'

export default function Dashboard() {
  const [target, setTarget] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ticketStatus, setTicketStatus] = useState('')
  const [ticketError, setTicketError] = useState('')
  const [ticketLoading, setTicketLoading] = useState(false)
  const [ticketRefreshKey, setTicketRefreshKey] = useState(0)

  async function runDiagnostics(event) {
    event.preventDefault()

    const normalizedTarget = target.trim()

    if (!normalizedTarget) {
      setError('Please enter a domain or public IP address.')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)
    setTicketStatus('')
    setTicketError('')

    try {
      const diagnosticResults = await executeDiagnostics(normalizedTarget)
      setResults(diagnosticResults)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  async function generateTicket() {
    if (!results) {
      return
    }

    setTicketLoading(true)
    setTicketStatus('')
    setTicketError('')

    try {
      const ticket = await createSupportTicket({
        userId: 'Demo Agent',
        target: results.target,
        pingData: results.results.ping,
        tracerouteData: results.results.traceroute
      })

      setTicketStatus(ticket.ticket_id)
      setTicketRefreshKey((currentKey) => currentKey + 1)
    } catch (err) {
      setTicketError(getApiErrorMessage(err))
    } finally {
      setTicketLoading(false)
    }
  }

  return (
    <div className="dashboard-container">
      <DashboardHeader />

      <main className="dashboard-main">
        <div className="dashboard-sidebar">
          <DiagnosticsForm
            target={target}
            error={error}
            loading={loading}
            onTargetChange={setTarget}
            onSubmit={runDiagnostics}
          />

          <TicketAnalytics refreshKey={ticketRefreshKey} />

          <TicketDashboard refreshKey={ticketRefreshKey} />
        </div>

        <DiagnosticsResults
          results={results}
          ticketStatus={ticketStatus}
          ticketError={ticketError}
          ticketLoading={ticketLoading}
          onGenerateTicket={generateTicket}
        />
      </main>
    </div>
  )
}