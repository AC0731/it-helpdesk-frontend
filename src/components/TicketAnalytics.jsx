import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, BarChart3, CheckCircle, Clock, Inbox, ListChecks } from 'lucide-react'

import { getApiErrorMessage } from '../api/client'
import { listSupportTickets } from '../api/tickets'
import AlertBanner from './AlertBanner'

function buildAnalytics(tickets) {
  return tickets.reduce(
    (totals, ticket) => {
      totals.total += 1

      if (ticket.status === 'open') {
        totals.open += 1
      }

      if (ticket.status === 'in_progress') {
        totals.inProgress += 1
      }

      if (ticket.status === 'resolved') {
        totals.resolved += 1
      }

      if (ticket.status === 'closed') {
        totals.closed += 1
      }

      if (ticket.priority === 'high' || ticket.priority === 'urgent') {
        totals.highPriority += 1
      }

      return totals
    },
    {
      total: 0,
      open: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0,
      highPriority: 0
    }
  )
}

function AnalyticsCard({ icon: Icon, label, value, helper }) {
  return (
    <article className="analytics-card">
      <div className="analytics-card-icon">
        <Icon className="icon-small" />
      </div>

      <div>
        <p className="analytics-card-label">{label}</p>
        <p className="analytics-card-value">{value}</p>
        <p className="analytics-card-helper">{helper}</p>
      </div>
    </article>
  )
}

export default function TicketAnalytics({ refreshKey }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const analytics = useMemo(() => buildAnalytics(tickets), [tickets])

  useEffect(() => {
    let isActive = true

    async function fetchAnalytics() {
      try {
        const response = await listSupportTickets({
          limit: 100
        })

        if (!isActive) {
          return
        }

        setTickets(response.tickets || [])
        setError('')
      } catch (err) {
        if (!isActive) {
          return
        }

        setError(getApiErrorMessage(err))
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    fetchAnalytics()

    return () => {
      isActive = false
    }
  }, [refreshKey])

  return (
    <section className="panel analytics-panel fade-in">
      <div className="analytics-header">
        <p className="eyebrow-label">Queue Overview</p>
        <h2>Ticket Analytics</h2>
        <p>
          Monitor support workload, active follow-ups, and priority pressure from the persistent ticket queue.
        </p>
      </div>

      <AlertBanner message={error} />

      {loading ? (
        <div className="analytics-loading">
          <BarChart3 className="icon-small spinner" />
          Loading analytics...
        </div>
      ) : (
        <div className="analytics-grid">
          <AnalyticsCard
            icon={Inbox}
            label="Total Tickets"
            value={analytics.total}
            helper="All tracked tickets"
          />

          <AnalyticsCard
            icon={Clock}
            label="Open"
            value={analytics.open}
            helper="Waiting for triage"
          />

          <AnalyticsCard
            icon={ListChecks}
            label="In Progress"
            value={analytics.inProgress}
            helper="Actively being handled"
          />

          <AnalyticsCard
            icon={CheckCircle}
            label="Resolved"
            value={analytics.resolved}
            helper="Completed tickets"
          />

          <AnalyticsCard
            icon={BarChart3}
            label="Closed"
            value={analytics.closed}
            helper="Archived workflow"
          />

          <AnalyticsCard
            icon={AlertTriangle}
            label="High Priority"
            value={analytics.highPriority}
            helper="High or urgent tickets"
          />
        </div>
      )}
    </section>
  )
}