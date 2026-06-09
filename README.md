# SupportOps AI Diagnostic Portal - Frontend

React + Vite frontend for a support operations dashboard that connects to a FastAPI diagnostic backend.

The app lets support agents run public target diagnostics, review reachability output, create support tickets, track ticket status, review ticket analytics, generate troubleshooting insights, and save insight history for later review.

## Live Demo

Frontend:

```text
https://it-support-diagnostic-portal.vercel.app
```

Backend API:

```text
https://it-support-api-g0b4.onrender.com
```

Backend API Docs:

```text
https://it-support-api-g0b4.onrender.com/docs
```

## Project Purpose

This project was built as a full-stack portfolio application focused on IT support operations.

It demonstrates:

- React component architecture
- API integration with Axios
- diagnostic workflow UI
- support ticket workflow UI
- saved troubleshooting insight history
- responsive dashboard design
- loading, empty, success, and error states
- frontend test coverage
- CI checks through GitHub Actions
- production deployment with Vercel

The frontend connects to a FastAPI backend that performs diagnostics, validates public targets, stores diagnostic and ticket records, generates troubleshooting insights, and exposes saved insight history.

## Core Features

- Public domain/IP diagnostic form
- Backend-powered reachability results
- Traceroute output or clean fallback messaging
- Port scan result display
- Support ticket creation from diagnostic results
- Ticket priority selection before ticket creation
- Persistent ticket dashboard
- Ticket status, priority, and search filters
- Ticket status update actions
- Ticket analytics summary
- Ticket detail modal
- Troubleshooting insight panel
- Saved insight history panel
- Refreshable ticket and insight history sections
- Responsive dark-mode interface
- Reusable API helper modules
- Reusable React components
- Automated frontend tests
- GitHub Actions CI workflow
- Vercel deployment configuration

## Tech Stack

- React
- Vite
- JavaScript
- Axios
- Lucide React
- CSS variables
- Vitest
- Testing Library
- ESLint
- GitHub Actions
- Vercel

## Repository Pair

This frontend is part of a full-stack project.

Frontend repo:

```text
AC0731/it-helpdesk-frontend
```

Backend repo:

```text
AC0731/it-helpdesk-backend
```

The backend is built with FastAPI and provides the diagnostic, ticket, analytics, and insight APIs used by this frontend.

## API Endpoints Used

```text
POST /api/diagnostics
GET /api/diagnostics/history
POST /api/ticket
GET /api/tickets
GET /api/tickets/{ticket_id}
PATCH /api/tickets/{ticket_id}
GET /api/tickets/analytics
POST /api/ai/insight
POST /api/ai/insight/save
GET /api/ai/insights
```

## Main Workflow

1. Enter a public domain or IP address.
2. Run diagnostics through the backend.
3. Review reachability, route, and port scan results.
4. Generate a troubleshooting insight from the diagnostic result.
5. Save the insight for review history.
6. Choose ticket priority.
7. Create a support ticket from the diagnostic output.
8. Track tickets through the dashboard.
9. Filter tickets by status, priority, or search query.
10. Update ticket status as work progresses.

## Screenshots

Screenshots are stored in the `screenshots` folder and show the main frontend workflows:

- Diagnostic form
- Diagnostic results
- Troubleshooting insight panel
- Saved insight history
- Ticket creation
- Ticket dashboard
- Ticket analytics
- Ticket detail modal
- Ticket status update flow
- Backend validation error state

## Environment Variables

Create a local `.env.local` file in the project root:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000
```

For production, use:

```text
VITE_API_BASE_URL=https://it-support-api-g0b4.onrender.com
```

Never commit `.env.local`.

Use `.env.example` as the safe template.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The app will run at:

```text
http://localhost:5173
```

## Local Full-Stack Testing

Start the backend first:

```powershell
cd C:\Users\akank\it-helpdesk-backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

Then start the frontend:

```powershell
cd C:\Users\akank\it-helpdesk-frontend
npm run dev
```

Manual smoke test:

- Load the dashboard.
- Run diagnostics with `google.com`.
- Run diagnostics with `8.8.8.8`.
- Confirm local/internal targets show clean validation errors.
- Generate a troubleshooting insight.
- Save the insight.
- Confirm saved insight history refreshes.
- Select ticket priority.
- Generate a support ticket.
- Confirm the ticket appears in the dashboard.
- Open the ticket detail modal.
- Change ticket status to In Progress.
- Change ticket status to Resolved.
- Test status, priority, and search filters.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm test
npm run test:watch
```

## Testing

Run linting:

```bash
npm run lint
```

Run automated tests:

```bash
npm test
```

Run production build:

```bash
npm run build
```

Current automated coverage includes:

- Status badge rendering
- Diagnostics form behavior
- Diagnostics results rendering
- Ticket priority selection
- Ticket dashboard loading and empty states
- Ticket status updates
- Ticket filtering behavior
- Ticket analytics rendering
- Ticket detail modal behavior
- Troubleshooting insight panel behavior
- Saved insight history behavior
- AI API helper behavior

## CI

This project includes a GitHub Actions workflow that runs on pull requests and pushes to `main`.

The workflow checks:

- dependency installation
- linting
- automated frontend tests
- production build

## Deployment

This frontend is deployed on Vercel.

Production environment variable:

```text
VITE_API_BASE_URL=https://it-support-api-g0b4.onrender.com
```

After changing environment variables in Vercel, redeploy the project so the value is included in the production build.

More details are available in:

```text
docs/deployment.md
```

## Architecture Notes

The frontend is organized into API modules, reusable components, and a dashboard page.

Main structure:

```text
src/api
src/components
src/pages
src/assets
```

The API layer keeps backend calls separated from UI components. Components focus on rendering, user interaction, loading states, and error handling.

More details are available in:

```text
docs/architecture.md
```

## Notes About Ping and Traceroute

Some deployed server environments do not provide system-level `ping` or `traceroute` commands.

When those commands are unavailable, the backend returns clean fallback messages instead of raw server errors. The frontend displays those responses clearly so the diagnostic workflow still works in local and hosted environments.

## Portfolio Highlights

This project demonstrates practical frontend work beyond a static UI:

- full-stack API integration
- production deployment
- real workflow state management
- reusable component structure
- automated tests
- CI checks
- error handling
- responsive UI design
- support operations use case
- AI-assisted troubleshooting workflow connected through a backend-only API key design

## Author

Akanksha Chavda  
GitHub: AC0731