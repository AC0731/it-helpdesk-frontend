import { useEffect, useState } from 'react'
import { BrainCircuit, RefreshCw } from 'lucide-react'

import { getApiErrorMessage } from '../api/client'
import { listAiInsights } from '../api/ai'
import AlertBanner from './AlertBanner'

function formatDate(value) {
  if (!value) {
    return 'Not available'
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}

function formatRiskLevel(value) {
  if (!value) {
    return 'Unknown'
  }

  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function SavedAIInsightsPanel({ refreshKey }) {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [error, setError] = useState('')

  function refreshInsights() {
    setLoading(true)
    setReloadKey((currentKey) => currentKey + 1)
  }

  useEffect(() => {
    let isActive = true

    async function fetchInsights() {
      try {
        const response = await listAiInsights({
          limit: 8
        })

        if (!isActive) {
          return
        }

        setInsights(response.insights || [])
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

    fetchInsights()

    return () => {
      isActive = false
    }
  }, [refreshKey, reloadKey])

  return (
    <section className="panel saved-ai-panel fade-in">
      <div className="saved-ai-header">
        <div>
          <p className="eyebrow-label">AI History</p>
          <h2>Saved AI Insights</h2>
          <p>
            Review recently saved troubleshooting summaries generated from diagnostic data.
          </p>
        </div>

        <button
          type="button"
          className="btn-outline"
          onClick={refreshInsights}
          disabled={loading}
        >
          <RefreshCw className={`icon-small ${loading ? 'spinner' : ''}`} />
          Refresh
        </button>
      </div>

      <AlertBanner message={error} />

      {loading && insights.length === 0 ? (
        <div className="saved-ai-empty">
          <RefreshCw className="icon-small spinner" />
          Loading saved AI insights...
        </div>
      ) : insights.length === 0 ? (
        <div className="saved-ai-empty">
          <BrainCircuit className="icon-large text-accent" />
          <h3>No saved AI insights yet</h3>
          <p>Generate and save an AI insight from diagnostic results to populate this history.</p>
        </div>
      ) : (
        <div className="saved-ai-list">
          {insights.map((insight) => (
            <article className="saved-ai-card" key={insight.id}>
              <div className="saved-ai-card-header">
                <div>
                  <h3>{insight.target}</h3>
                  <p>{formatDate(insight.created_at)}</p>
                </div>

                <div className="ai-insight-summary">
                  <span className="ai-provider-pill">{insight.provider}</span>
                  <span className={`risk-pill risk-${insight.risk_level}`}>
                    {formatRiskLevel(insight.risk_level)}
                  </span>
                </div>
              </div>

              <p className="saved-ai-summary">{insight.summary}</p>

              {insight.ticket_id ? (
                <p className="saved-ai-ticket">Linked ticket: {insight.ticket_id}</p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}