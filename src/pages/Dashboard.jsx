import { useState } from 'react'
import { BrainCircuit, Network, ShieldCheck, TicketCheck } from 'lucide-react'

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

function DashboardWelcomePanel() {
  return (
    <section className="panel welcome-panel fade-in">
      <div className="welcome-hero">
        <p className="eyebrow-label">Support Workflow</p>
        <h2>Run diagnostics, create tickets, and review troubleshooting insights.</h2>
        <p>
          Start with a public domain or IP address. The dashboard will show reachability,
          route, port, ticket, and insight workflows after the diagnostic run completes.
        </p>
      </div>

      <div className="workflow-grid">
        <article className="workflow-card">
          <Network className="icon-small text-accent" />
          <h3>Network Diagnostics</h3>
          <p>Run backend-powered reachability, route, DNS, and port checks.</p>
        </article>

        <article className="workflow-card">
          <BrainCircuit className="icon-small text-accent" />
          <h3>Troubleshooting Insight</h3>
          <p>Generate a concise summary with probable causes and next steps.</p>
        </article>

        <article className="workflow-card">
          <TicketCheck className="icon-small text-accent" />
          <h3>Support Tickets</h3>
          <p>Create prioritized tickets and track progress through the queue.</p>
        </article>

        <article className="workflow-card">
          <ShieldCheck className="icon-small text-accent" />
          <h3>Safe Inputs</h3>
          <p>Public target validation and redaction keep the workflow controlled.</p>
        </article>
      </div>

      <div className="welcome-note">
        <strong>Try:</strong> <span>google.com</span> or <span>8.8.8.8</span>
      </div>
    </section>
  )
}

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
  const [savedInsightId, setSavedInsightId] = useState('')
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
    setSavedInsightId('')

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
    setSavedInsightId('')

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
    if (!results || !aiInsight || savedInsightId) {
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

      const newSavedInsightId = String(response.insight.id)

      setSavedInsightId(newSavedInsightId)
      setAiSaveStatus(`#${newSavedInsightId}`)
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
        <section className="diagnostics-column">
          <DiagnosticsForm
            target={target}
            error={error}
            loading={loading}
            onTargetChange={setTarget}
            onSubmit={runDiagnostics}
          />

          {results ? (
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
              savedInsightId={savedInsightId}
              onTicketPriorityChange={setTicketPriority}
              onGenerateTicket={generateTicket}
              onGenerateAiInsight={generateInsight}
              onSaveAiInsight={saveInsight}
            />
          ) : (
            <DashboardWelcomePanel />
          )}
        </section>

        <aside className="operations-column">
          <TicketAnalytics refreshKey={ticketRefreshKey} />
          <SavedAIInsightsPanel refreshKey={aiHistoryRefreshKey} />
          <TicketDashboard refreshKey={ticketRefreshKey} />
        </aside>
      </main>
    </div>
  )
}