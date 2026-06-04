import { useEffect, useState } from 'react'
import { AlertTriangle, BarChart3, CheckCircle, Clock, Inbox, ListChecks } from 'lucide-react'

import { getApiErrorMessage } from '../api/client'
import { getTicketAnalytics } from '../api/tickets'
import AlertBanner from './AlertBanner'

const emptyAnalytics = {
  total: 0,
  by_status: {
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0
  },
  by_priority: {
    low: 0,
    medium: 0,
    high: 0,
    urgent: 0
  },
  high_priority_total: 0
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
  const [analytics, setAnalytics] = useState(emptyAnalytics)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    async function fetchAnalytics() {
      try {
        const response = await getTicketAnalytics()

        if (!isActive) {
          return
        }

        setAnalytics({
          ...emptyAnalytics,
          ...response,
          by_status: {
            ...emptyAnalytics.by_status,
            ...(response.by_status || {})
          },
          by_priority: {
            ...emptyAnalytics.by_priority,
            ...(response.by_priority || {})
          }
        })
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
            value={analytics.by_status.open}
            helper="Waiting for triage"
          />

          <AnalyticsCard
            icon={ListChecks}
            label="In Progress"
            value={analytics.by_status.in_progress}
            helper="Actively being handled"
          />

          <AnalyticsCard
            icon={CheckCircle}
            label="Resolved"
            value={analytics.by_status.resolved}
            helper="Completed tickets"
          />

          <AnalyticsCard
            icon={BarChart3}
            label="Closed"
            value={analytics.by_status.closed}
            helper="Archived workflow"
          />

          <AnalyticsCard
            icon={AlertTriangle}
            label="High Priority"
            value={analytics.high_priority_total}
            helper="High or urgent tickets"
          />
        </div>
      )}
    </section>
  )
}