import { Server } from 'lucide-react'

export default function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <div className="header-title">
        <Server className="icon-large text-accent" />
        <h1>IT Support Diagnostic Portal</h1>
      </div>

      <span className="system-status">System Online</span>
    </header>
  )
}