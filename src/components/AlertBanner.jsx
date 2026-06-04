import { AlertCircle, CheckCircle } from 'lucide-react'

export default function AlertBanner({ message, type = 'error' }) {
  if (!message) {
    return null
  }

  const isSuccess = type === 'success'
  const Icon = isSuccess ? CheckCircle : AlertCircle
  const className = isSuccess ? 'success-banner' : 'error-banner'

  return (
    <div className={`alert ${className} fade-in`}>
      <Icon className="icon-small" />
      {message}
    </div>
  )
}