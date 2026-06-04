import { X } from 'lucide-react'

import AlertBanner from './AlertBanner'
import StatusBadge from './StatusBadge'

function formatDate(value) {
  if (!value) {
    return 'Not available'
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}

export default function TicketDetailModal({ ticket, loading, error, onClose }) {
  if (!ticket && !loading && !error) {
    return null
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={handleBackdropClick}
    >
      <section
        className="ticket-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-detail-title"
      >
        <div className="ticket-detail-header">
          <div>
            <p className="eyebrow-label">Ticket Record</p>
            <h2 id="ticket-detail-title">Full Ticket Details</h2>
          </div>

          <button
            type="button"
            className="modal-close-button"
            aria-label="Close ticket details"
            onClick={onClose}
          >
            <X className="icon-small" />
          </button>
        </div>

        {loading ? (
          <div className="ticket-detail-loading">
            Loading ticket details...
          </div>
        ) : (
          <>
            <AlertBanner message={error} />

            {ticket ? (
              <div className="ticket-detail-content">
                <div className="ticket-detail-summary">
                  <div>
                    <p className="ticket-detail-label">Ticket ID</p>
                    <h3>{ticket.ticket_id}</h3>
                  </div>

                  <div className="ticket-badge-row">
                    <StatusBadge value={ticket.status} />
                    <StatusBadge value={ticket.priority} type="priority" />
                  </div>
                </div>

                <div className="ticket-detail-grid">
                  <div>
                    <p className="ticket-detail-label">Target</p>
                    <p>{ticket.target}</p>
                  </div>

                  <div>
                    <p className="ticket-detail-label">Created</p>
                    <p>{formatDate(ticket.created_at)}</p>
                  </div>

                  <div>
                    <p className="ticket-detail-label">Updated</p>
                    <p>{formatDate(ticket.updated_at)}</p>
                  </div>

                  <div>
                    <p className="ticket-detail-label">User</p>
                    <p>{ticket.user_id}</p>
                  </div>
                </div>

                <div>
                  <p className="ticket-detail-label">Summary</p>
                  <p className="ticket-detail-text">{ticket.summary}</p>
                </div>

                <div className="ticket-detail-terminal">
                  <h4>Ping Output</h4>
                  <pre>{ticket.ping_data || 'No ping output saved.'}</pre>
                </div>

                <div className="ticket-detail-terminal">
                  <h4>Traceroute Output</h4>
                  <pre>{ticket.traceroute_data || 'No traceroute output saved.'}</pre>
                </div>
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  )
}