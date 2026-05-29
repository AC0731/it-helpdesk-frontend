import { useState } from 'react'
import axios from 'axios'
import { Activity, Server, AlertCircle, CheckCircle, Terminal, Loader2 } from 'lucide-react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://it-support-api-g0b4.onrender.com'

function App() {
  const [target, setTarget] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ticketStatus, setTicketStatus] = useState('')

  const runDiagnostics = async (e) => {
    e.preventDefault()

    if (!target.trim()) {
      setError('Please enter a domain or IP address.')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)
    setTicketStatus('')

    try {
      const response = await axios.post(`${API_BASE_URL}/api/diagnostics`, {
        target: target.trim()
      })

      setResults(response.data)
    } catch (err) {
      setError('Failed to connect to the backend server. Is your Python API running?')
    } finally {
      setLoading(false)
    }
  }

  const generateTicket = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/ticket`, {
        user_id: 'Demo Agent',
        target: results.target,
        ping_data: results.results.ping,
        traceroute_data: results.results.traceroute
      })

      setTicketStatus(response.data.ticket_id)
    } catch (err) {
      setTicketStatus('Error generating ticket.')
    }
  }


  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-title">
          <Server className="icon-large text-accent" />
          <h1>IT Support Diagnostic Portal</h1>
        </div>
        <span className="system-status">System Online</span>
      </header>

      <main className="dashboard-main">
        <section className="panel search-panel">
          <div className="panel-header">
            <h2>Network Diagnostics</h2>
            <p>Enter a domain or IP address to run automated Ping, Traceroute, and Port Scans.</p>
          </div>
          
          <form onSubmit={runDiagnostics} className="search-form">
            <input 
              type="text" 
              placeholder="e.g., github.com or 8.8.8.8" 
              value={target}
              onChange={(e) => setTarget(e.target.value)}
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

          {error && (
            <div className="alert error-banner">
              <AlertCircle className="icon-small" /> {error}
            </div>
          )}
        </section>

        {results && (
          <section className="panel results-panel fade-in">
            <div className="results-header">
              <h2>Target: <span className="text-accent">{results.target}</span></h2>
              <button onClick={generateTicket} className="btn-secondary">
                Generate Support Ticket
              </button>
            </div>

            {ticketStatus && (
              <div className="alert success-banner fade-in">
                <CheckCircle className="icon-small" /> Ticket Created: {ticketStatus}
              </div>
            )}

            {/* --- PORT SCANNER UI --- */}
            {results.results.ports && (
              <div className="port-scanner-section">
                <h3 className="section-label">Open Ports Check</h3>

                <div className="port-list">
                  {Object.entries(results.results.ports).map(([port, status]) => (
                    <span
                      key={port}
                      className={`port-badge ${status === 'Open' ? 'port-open' : 'port-closed'}`}
                    >
                      Port {port}: {status}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-dots">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
                <span><Terminal className="icon-small" /> console</span>
              </div>
              <div className="terminal-body">
                <h3 className="terminal-title">--- REACHABILITY CHECK ---</h3>
                <pre>{results.results.ping}</pre>
                
                <h3 className="terminal-title">--- ROUTE DIAGNOSTIC STATUS ---</h3>
                <pre>{results.results.traceroute}</pre>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App