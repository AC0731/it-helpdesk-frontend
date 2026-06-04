export default function PortScannerResults({ ports }) {
  if (!ports) {
    return null
  }

  return (
    <div className="port-scanner-section">
      <h3 className="section-label">Open Ports Check</h3>

      <div className="port-list">
        {Object.entries(ports).map(([port, status]) => (
          <span
            key={port}
            className={`port-badge ${status === 'Open' ? 'port-open' : 'port-closed'}`}
          >
            Port {port}: {status}
          </span>
        ))}
      </div>
    </div>
  )
}