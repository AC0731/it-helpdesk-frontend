import AlertBanner from './AlertBanner'
import PortScannerResults from './PortScannerResults'
import TerminalOutput from './TerminalOutput'

const PRIORITY_OPTIONS = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' }
]

export default function DiagnosticsResults({
  results,
  ticketStatus,
  ticketError,
  ticketLoading,
  ticketPriority,
  onTicketPriorityChange,
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

        <div className="ticket-create-controls">
          <label className="priority-select-label" htmlFor="ticket-priority">
            Ticket priority
          </label>

          <select
            id="ticket-priority"
            className="priority-select"
            value={ticketPriority}
            onChange={(event) => onTicketPriorityChange(event.target.value)}
            disabled={ticketLoading}
          >
            {PRIORITY_OPTIONS.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>

          <button
            onClick={onGenerateTicket}
            className="btn-secondary"
            disabled={ticketLoading}
          >
            {ticketLoading ? 'Creating Ticket...' : 'Generate Support Ticket'}
          </button>
        </div>
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