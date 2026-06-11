import { useEffect, useState } from 'react'
import { BrainCircuit, RefreshCw, Trash2, X } from 'lucide-react'

import { getApiErrorMessage } from '../api/client'
import { deleteAiInsight, listAiInsights } from '../api/ai'
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
  const [deleteError, setDeleteError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [pendingDeleteInsight, setPendingDeleteInsight] = useState(null)

  function refreshInsights() {
    setLoading(true)
    setReloadKey((currentKey) => currentKey + 1)
  }

  function openDeleteModal(insight) {
    setDeleteError('')
    setPendingDeleteInsight(insight)
  }

  function closeDeleteModal() {
    if (deletingId) {
      return
    }

    setPendingDeleteInsight(null)
  }

  async function handleDeleteInsight() {
    if (!pendingDeleteInsight) {
      return
    }

    setDeletingId(pendingDeleteInsight.id)
    setDeleteError('')

    try {
      await deleteAiInsight(pendingDeleteInsight.id)

      setInsights((currentInsights) => (
        currentInsights.filter((insight) => insight.id !== pendingDeleteInsight.id)
      ))

      setPendingDeleteInsight(null)
    } catch (err) {
      setDeleteError(getApiErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
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
          className="btn-outline action-button"
          onClick={refreshInsights}
          disabled={loading}
        >
          <RefreshCw className={`icon-small ${loading ? 'spinner' : ''}`} />
          Refresh
        </button>
      </div>

      <AlertBanner message={error} />
      <AlertBanner message={deleteError} />

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

              <div className="saved-ai-card-footer">
                <button
                  type="button"
                  className="btn-danger action-button"
                  onClick={() => openDeleteModal(insight)}
                  disabled={deletingId === insight.id}
                >
                  <Trash2 className="icon-small" />
                  {deletingId === insight.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {pendingDeleteInsight ? (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={closeDeleteModal}
        >
          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-insight-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="confirm-modal-header">
              <div>
                <p className="eyebrow-label">Confirm Delete</p>
                <h2 id="delete-insight-title">Delete saved insight?</h2>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={closeDeleteModal}
                aria-label="Close delete confirmation"
                disabled={Boolean(deletingId)}
              >
                <X className="icon-small" />
              </button>
            </div>

            <p className="confirm-modal-copy">
              This will remove the saved troubleshooting insight for{' '}
              <strong>{pendingDeleteInsight.target}</strong>. The diagnostic result and tickets will not be deleted.
            </p>

            <div className="confirm-modal-actions">
              <button
                type="button"
                className="btn-outline action-button"
                onClick={closeDeleteModal}
                disabled={Boolean(deletingId)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn-danger action-button"
                onClick={handleDeleteInsight}
                disabled={Boolean(deletingId)}
              >
                <Trash2 className="icon-small" />
                {deletingId ? 'Deleting...' : 'Delete Insight'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}