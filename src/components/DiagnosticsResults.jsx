import AlertBanner from './AlertBanner'
import PortScannerResults from './PortScannerResults'
import TerminalOutput from './TerminalOutput'

export default function DiagnosticsResults({
  results,
  ticketStatus,
  ticketError,
  ticketLoading,
  onGenerateTicket
}) {
  if (!results) {
    return null
  }

  return (
    <section className="panel results-panel fade-in">
      <div className="results-header">
        <h2>
          Target: <span className="text-accent">{results.target}</span>
        </h2>

        <button
          onClick={onGenerateTicket}
          className="btn-secondary"
          disabled={ticketLoading}
        >
          {ticketLoading ? 'Creating Ticket...' : 'Generate Support Ticket'}
        </button>
      </div>

      <AlertBanner
        message={ticketStatus ? `Ticket Created: ${ticketStatus}` : ''}
        type="success"
      />

      <AlertBanner message={ticketError} />

      <PortScannerResults ports={results.results.ports} />

      <TerminalOutput
        ping={results.results.ping}
        traceroute={results.results.traceroute}
      />
    </section>
  )
}