import { Activity, Loader2 } from 'lucide-react'

import AlertBanner from './AlertBanner'

export default function DiagnosticsForm({
  target,
  error,
  loading,
  onTargetChange,
  onSubmit
}) {
  return (
    <section className="panel search-panel">
      <div className="panel-header">
        <h2>Network Diagnostics</h2>
        <p>Enter a domain or public IP address to run automated Ping, Traceroute, and Port Scans.</p>
      </div>

      <form onSubmit={onSubmit} className="search-form">
        <input
          type="text"
          placeholder="e.g., github.com or 8.8.8.8"
          value={target}
          onChange={(event) => onTargetChange(event.target.value)}
          className="search-input"
        />

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="icon-small spinner" />
              Running Tests...
            </>
          ) : (
            <>
              Execute Diagnostics
              <Activity className="icon-small" />
            </>
          )}
        </button>
      </form>

      <AlertBanner message={error} />
    </section>
  )
}