import AIInsightPanel from './AIInsightPanel'
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
  aiInsight = null,
  aiError = '',
  aiLoading = false,
  aiSaving = false,
  aiSaveStatus = '',
  aiSaveError = '',
  savedInsightId = '',
  onTicketPriorityChange,
  onGenerateTicket,
  onGenerateAiInsight = () => {},
  onSaveAiInsight = () => {}
}) {
  if (!results) {
    return null
  }

  return (
    <section className="panel results-panel fade-in">
      <div className="results-header">
        <div>
          <p className="eyebrow-label">Diagnostic Result</p>
          <h2>
            Target: <span className="text-accent">{results.target}</span>
          </h2>
        </div>

        <div className="ticket-create-controls">
          <label className="field-group compact-field" htmlFor="ticket-priority">
            <span>Ticket priority</span>
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
          </label>

          <button
            onClick={onGenerateTicket}
            className="btn-secondary action-button ticket-submit-button"
            aria-label="Generate support ticket"
            disabled={ticketLoading}
          >
            {ticketLoading ? 'Creating...' : 'Generate Ticket'}
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

      <AIInsightPanel
        insight={aiInsight}
        error={aiError}
        loading={aiLoading}
        saving={aiSaving}
        savedInsightId={savedInsightId}
        saveStatus={aiSaveStatus}
        saveError={aiSaveError}
        onGenerateInsight={onGenerateAiInsight}
        onSaveInsight={onSaveAiInsight}
      />
    </section>
  )
}