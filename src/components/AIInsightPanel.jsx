import { BrainCircuit, Sparkles } from 'lucide-react'

import AlertBanner from './AlertBanner'

function formatRiskLevel(value) {
  if (!value) {
    return 'Unknown'
  }

  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function AIInsightPanel({
  insight,
  error,
  loading,
  onGenerateInsight
}) {
  return (
    <section className="ai-insight-panel">
      <div className="ai-insight-header">
        <div>
          <p className="eyebrow-label">AI Troubleshooting</p>
          <h3>
            <BrainCircuit className="icon-small" />
            AI Insight
          </h3>
          <p>
            Generate a concise support summary, likely causes, risk level, and next steps from the diagnostic result.
          </p>
        </div>

        <button
          type="button"
          className="btn-secondary"
          onClick={onGenerateInsight}
          disabled={loading}
        >
          <Sparkles className="icon-small" />
          {loading ? 'Generating...' : 'Generate AI Insight'}
        </button>
      </div>

      <AlertBanner message={error} />

      {insight ? (
        <div className="ai-insight-content">
          <div className="ai-insight-summary">
            <span className="ai-provider-pill">{insight.provider}</span>
            <span className={`risk-pill risk-${insight.risk_level}`}>
              {formatRiskLevel(insight.risk_level)} Risk
            </span>
          </div>

          <div>
            <p className="ai-insight-label">Summary</p>
            <p className="ai-insight-text">{insight.summary}</p>
          </div>

          <div className="ai-insight-grid">
            <div>
              <p className="ai-insight-label">Probable Causes</p>
              <ul>
                {(insight.probable_causes || []).map((cause) => (
                  <li key={cause}>{cause}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="ai-insight-label">Recommended Next Steps</p>
              <ol>
                {(insight.recommended_next_steps || []).map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      ) : (
        <div className="ai-insight-empty">
          Run diagnostics, then generate an AI troubleshooting insight for the current result.
        </div>
      )}
    </section>
  )
}