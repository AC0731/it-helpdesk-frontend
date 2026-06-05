import { useEffect, useState } from 'react'
import { Eye, RefreshCw, Search, Ticket } from 'lucide-react'

import { getApiErrorMessage } from '../api/client'
import { getSupportTicket, listSupportTickets, updateSupportTicketStatus } from '../api/tickets'
import AlertBanner from './AlertBanner'
import StatusBadge from './StatusBadge'
import TicketDetailModal from './TicketDetailModal'

const STATUS_FILTERS = [
  { label: 'All statuses', value: '' },
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' }
]

const PRIORITY_FILTERS = [
  { label: 'All priorities', value: '' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' }
]

const NEXT_STATUS_OPTIONS = [
  { label: 'Mark In Progress', value: 'in_progress' },
  { label: 'Mark Resolved', value: 'resolved' },
  { label: 'Close Ticket', value: 'closed' }
]

function formatDate(value) {
  if (!value) {
    return 'Not available'
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}

export default function TicketDashboard({ refreshKey }) {
  const [tickets, setTickets] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [updatingTicketId, setUpdatingTicketId] = useState('')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [error, setError] = useState('')

  function refreshTickets() {
    setLoading(true)
    setReloadKey((currentKey) => currentKey + 1)
  }

  function handleStatusFilterChange(event) {
    setLoading(true)
    setStatusFilter(event.target.value)
  }

  function handlePriorityFilterChange(event) {
    setLoading(true)
    setPriorityFilter(event.target.value)
  }

  function handleSearchSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setSubmittedSearch(searchQuery.trim())
  }

  function clearFilters() {
    setLoading(true)
    setStatusFilter('')
    setPriorityFilter('')
    setSearchQuery('')
    setSubmittedSearch('')
  }

  function closeTicketDetails() {
    setSelectedTicket(null)
    setDetailError('')
    setDetailLoading(false)
  }

  async function handleOpenTicketDetails(ticketId) {
    setSelectedTicket(null)
    setDetailError('')
    setDetailLoading(true)

    try {
      const ticket = await getSupportTicket(ticketId)
      setSelectedTicket(ticket)
    } catch (err) {
      setDetailError(getApiErrorMessage(err))
    } finally {
      setDetailLoading(false)
    }
  }

  async function handleStatusUpdate(ticketId, status) {
    setUpdatingTicketId(ticketId)
    setError('')

    try {
      await updateSupportTicketStatus(ticketId, status)
      refreshTickets()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setUpdatingTicketId('')
    }
  }

  useEffect(() => {
    let isActive = true

    async function fetchTickets() {
      try {
        const response = await listSupportTickets({
          status: statusFilter,
          priority: priorityFilter,
          search: submittedSearch,
          limit: 50
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

    fetchTickets()

    return () => {
      isActive = false
    }
  }, [refreshKey, reloadKey, statusFilter, priorityFilter, submittedSearch])

  return (
    <section className="panel ticket-dashboard-panel fade-in">
      <div className="ticket-dashboard-header">
        <div>
          <p className="eyebrow-label">Support Queue</p>
          <h2>Ticket Dashboard</h2>
          <p className="ticket-dashboard-description">
            Review recent support tickets, track status, and keep diagnostic follow-up work organized.
          </p>
        </div>

        <button
          type="button"
          className="btn-outline"
          onClick={refreshTickets}
          disabled={loading}
        >
          <RefreshCw className={`icon-small ${loading ? 'spinner' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="ticket-toolbar ticket-filter-grid">
        <div>
          <label htmlFor="ticket-status-filter">Status</label>

          <select
            id="ticket-status-filter"
            className="status-filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            {STATUS_FILTERS.map((filter) => (
              <option key={filter.label} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ticket-priority-filter">Priority</label>

          <select
            id="ticket-priority-filter"
            className="status-filter"
            value={priorityFilter}
            onChange={handlePriorityFilterChange}
          >
            {PRIORITY_FILTERS.map((filter) => (
              <option key={filter.label} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>

        <form className="ticket-search-form" onSubmit={handleSearchSubmit}>
          <label htmlFor="ticket-search">Search</label>

          <div className="ticket-search-row">
            <input
              id="ticket-search"
              className="ticket-search-input"
              type="search"
              placeholder="Ticket, target, user, or summary"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />

            <button type="submit" className="btn-mini">
              <Search className="icon-small" />
              Search
            </button>
          </div>
        </form>

        <button type="button" className="btn-mini clear-filters-button" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      <AlertBanner message={error} />

      {loading && tickets.length === 0 ? (
        <div className="ticket-empty-state">
          <RefreshCw className="icon-small spinner" />
          Loading support tickets...
        </div>
      ) : tickets.length === 0 ? (
        <div className="ticket-empty-state">
          <Ticket className="icon-large text-accent" />
          <h3>No tickets found</h3>
          <p>Try changing the filters or generate a support ticket from diagnostic results.</p>
        </div>
      ) : (
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <article className="ticket-card" key={ticket.ticket_id}>
              <div className="ticket-card-main">
                <div className="ticket-card-title-row">
                  <h3>{ticket.ticket_id}</h3>

                  <div className="ticket-badge-row">
                    <StatusBadge value={ticket.status} />
                    <StatusBadge value={ticket.priority} type="priority" />
                  </div>
                </div>

                <p className="ticket-target">{ticket.target}</p>
                <p className="ticket-summary">{ticket.summary}</p>

                <div className="ticket-meta">
                  <span>Created {formatDate(ticket.created_at)}</span>
                  <span>Updated {formatDate(ticket.updated_at)}</span>
                </div>
              </div>

              <div className="ticket-actions">
                <button
                  type="button"
                  className="btn-mini"
                  onClick={() => handleOpenTicketDetails(ticket.ticket_id)}
                >
                  <Eye className="icon-small" />
                  View Details
                </button>

                {NEXT_STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="btn-mini"
                    disabled={
                      updatingTicketId === ticket.ticket_id ||
                      ticket.status === option.value
                    }
                    onClick={() => handleStatusUpdate(ticket.ticket_id, option.value)}
                  >
                    {updatingTicketId === ticket.ticket_id ? 'Updating...' : option.label}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}

      <TicketDetailModal
        ticket={selectedTicket}
        loading={detailLoading}
        error={detailError}
        onClose={closeTicketDetails}
      />
    </section>
  )
}