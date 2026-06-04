const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed'
}

const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent'
}

export default function StatusBadge({ value, type = 'status' }) {
  const normalizedValue = value || 'unknown'
  const labelMap = type === 'priority' ? PRIORITY_LABELS : STATUS_LABELS
  const label = labelMap[normalizedValue] || normalizedValue

  return (
    <span className={`status-badge ${type}-${normalizedValue}`}>
      {label}
    </span>
  )
}