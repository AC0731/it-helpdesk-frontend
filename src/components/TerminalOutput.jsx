import { Terminal } from 'lucide-react'

export default function TerminalOutput({ ping, traceroute }) {
  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot dot-red"></span>
          <span className="dot dot-yellow"></span>
          <span className="dot dot-green"></span>
        </div>

        <span>
          <Terminal className="icon-small" /> console
        </span>
      </div>

      <div className="terminal-body">
        <h3 className="terminal-title">--- REACHABILITY CHECK ---</h3>
        <pre>{ping}</pre>

        <h3 className="terminal-title">--- ROUTE DIAGNOSTIC STATUS ---</h3>
        <pre>{traceroute}</pre>
      </div>
    </div>
  )
}