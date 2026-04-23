import { useState } from 'react'
import axios from 'axios'
import { Activity, Server, AlertCircle, CheckCircle, Terminal } from 'lucide-react'
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
      const response = await axios.post('http://127.0.0.1:8000/api/diagnostics', {
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
      const response = await axios.post('http://127.0.0.1:8000/api/ticket', {
        user_id: "Agent_007",
        target: results.target,
        ping_data: results.results.ping,
        traceroute_data: results.results.traceroute
      })
      setTicketStatus(response.ticket_id)
    } catch (err) {
      setTicketStatus('Error generating ticket.')
    }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <Server className="icon-large" />
        <h1>IT Support Diagnostic Portal</h1>
      </header>

      <main className="dashboard-main">
        {/* Search Panel */}
        <div className="panel search-panel">
          <h2>Run Network Diagnostics</h2>
          <p>Enter a domain or IP address to run automated Ping and Traceroute.</p>
          
          <form onSubmit={runDiagnostics} className="search-form">
            <input 
              type="text" 
              placeholder="e.g., github.com or 8.8.8.8" 
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Running Tests...' : 'Execute Diagnostics'}
              {!loading && <Activity className="icon-small" />}
            </button>
          </form>

          {error && (
            <div className="error-banner">
              <AlertCircle className="icon-small" /> {error}
            </div>
          )}
        </div>

        {/* Results Panel */}
        {results && (
          <div className="panel results-panel">
            <div className="results-header">
              <h2>Diagnostic Results for: <span>{results.target}</span></h2>
              <button onClick={generateTicket} className="btn-secondary">
                Generate Support Ticket
              </button>
            </div>

            {ticketStatus && (
              <div className="success-banner">
                <CheckCircle className="icon-small" /> Ticket created successfully: {ticketStatus}
              </div>
            )}

            <div className="terminal-window">
              <div className="terminal-header">
                <Terminal className="icon-small" /> Command Line Output
              </div>
              <div className="terminal-body">
                <h3>--- PING RESULTS ---</h3>
                <pre>{results.results.ping}</pre>
                
                <h3>--- TRACEROUTE RESULTS ---</h3>
                <pre>{results.results.traceroute}</pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App