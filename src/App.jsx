import { useState } from 'react'
import axios from 'axios'
import { Activity, Server, AlertCircle, CheckCircle, Terminal, Loader2 } from 'lucide-react'
import './App.css'

function App() {
  const [target, setTarget] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ticketStatus, setTicketStatus] = useState('')

  const runDiagnostics = async (e) => {
    e.preventDefault()
    if (!target) return
    
    setLoading(true)
    setError('')
    setResults(null)
    setTicketStatus('')

    try {
      const response = await axios.post('https://it-support-api-g0b4.onrender.com/api/diagnostics', {
        target: target
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
      const response = await axios.post('https://it-support-api-g0b4.onrender.com/api/ticket', {
        user_id: "Agent_007",
        target: results.target,
        ping_data: results.results.ping,
        traceroute_data: results.results.traceroute
      })
      // Fixed: response.data.ticket_id
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

            {/* --- NEW PORT SCANNER UI --- */}
            {results.results.ports && (
              <div className="port-scanner-section" style={{ marginBottom: '1.5rem', background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Open Ports Check
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {Object.entries(results.results.ports).map(([port, status]) => (
                    <span 
                      key={port} 
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        backgroundColor: status === 'Open' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: status === 'Open' ? 'var(--btn-success)' : '#ef4444',
                        border: `1px solid ${status === 'Open' ? 'var(--btn-success)' : '#ef4444'}`
                      }}
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
                <h3 className="terminal-title">--- PING RESULTS ---</h3>
                <pre>{results.results.ping}</pre>
                
                <h3 className="terminal-title">--- TRACEROUTE RESULTS ---</h3>
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