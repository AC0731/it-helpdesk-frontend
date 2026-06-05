import { useState } from 'react'

import { generateAiInsight, saveAiInsight } from '../api/ai'
import { executeDiagnostics } from '../api/diagnostics'
import { getApiErrorMessage } from '../api/client'
import { createSupportTicket } from '../api/tickets'
import DashboardHeader from '../components/DashboardHeader'
import DiagnosticsForm from '../components/DiagnosticsForm'
import DiagnosticsResults from '../components/DiagnosticsResults'
import SavedAIInsightsPanel from '../components/SavedAIInsightsPanel'
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
  const [ticketPriority, setTicketPriority] = useState('medium')
  const [ticketRefreshKey, setTicketRefreshKey] = useState(0)
  const [aiInsight, setAiInsight] = useState(null)
  const [aiError, setAiError] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSaving, setAiSaving] = useState(false)
  const [aiSaveStatus, setAiSaveStatus] = useState('')
  const [aiSaveError, setAiSaveError] = useState('')
  const [aiHistoryRefreshKey, setAiHistoryRefreshKey] = useState(0)

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
    setAiInsight(null)
    setAiError('')
    setAiSaveStatus('')
    setAiSaveError('')

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
        tracerouteData: results.results.traceroute,
        priority: ticketPriority
      })

      setTicketStatus(ticket.ticket_id)
      setTicketRefreshKey((currentKey) => currentKey + 1)
    } catch (err) {
      setTicketError(getApiErrorMessage(err))
    } finally {
      setTicketLoading(false)
    }
  }

  async function generateInsight() {
    if (!results) {
      return
    }

    setAiLoading(true)
    setAiError('')
    setAiSaveStatus('')
    setAiSaveError('')

    try {
      const response = await generateAiInsight({
        target: results.target,
        pingData: results.results.ping,
        tracerouteData: results.results.traceroute,
        ports: results.results.ports
      })

      setAiInsight(response.insight)
    } catch (err) {
      setAiError(getApiErrorMessage(err))
    } finally {
      setAiLoading(false)
    }
  }

  async function saveInsight() {
    if (!results || !aiInsight) {
      return
    }

    setAiSaving(true)
    setAiSaveStatus('')
    setAiSaveError('')

    try {
      const response = await saveAiInsight({
        target: results.target,
        pingData: results.results.ping,
        tracerouteData: results.results.traceroute,
        ports: results.results.ports
      })

      setAiSaveStatus(`#${response.insight.id}`)
      setAiHistoryRefreshKey((currentKey) => currentKey + 1)
    } catch (err) {
      setAiSaveError(getApiErrorMessage(err))
    } finally {
      setAiSaving(false)
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

          <SavedAIInsightsPanel refreshKey={aiHistoryRefreshKey} />

          <TicketDashboard refreshKey={ticketRefreshKey} />
        </div>

        <DiagnosticsResults
          results={results}
          ticketStatus={ticketStatus}
          ticketError={ticketError}
          ticketLoading={ticketLoading}
          ticketPriority={ticketPriority}
          aiInsight={aiInsight}
          aiError={aiError}
          aiLoading={aiLoading}
          aiSaving={aiSaving}
          aiSaveStatus={aiSaveStatus}
          aiSaveError={aiSaveError}
          onTicketPriorityChange={setTicketPriority}
          onGenerateTicket={generateTicket}
          onGenerateAiInsight={generateInsight}
          onSaveAiInsight={saveInsight}
        />
      </main>
    </div>
  )
}