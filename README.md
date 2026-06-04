# IT Support Diagnostic Portal - Frontend

A production-minded React + Vite frontend for an IT support operations dashboard.

The app lets support agents run backend-powered network diagnostics, review ping/traceroute/port scan results, create support tickets, view persistent ticket history, filter ticket status, and update ticket progress from a dashboard UI.

## Project Purpose

This project was built as a portfolio-ready full-stack application to demonstrate practical frontend engineering, API integration, testing, CI, deployment configuration, and IT support workflow design.

It connects to a FastAPI backend that performs diagnostic checks, validates public targets, stores diagnostic runs, and manages persistent support tickets.

## Live Demo

Frontend:

    https://it-support-diagnostic-portal.vercel.app

Backend API:

    https://it-support-api-g0b4.onrender.com

API Docs:

    https://it-support-api-g0b4.onrender.com/docs

## Features

- Public domain/IP diagnostic form
- Backend-powered ping and reachability results
- Backend-powered traceroute or fallback messaging
- Open/closed port scan display
- Support ticket creation from diagnostic results
- Persistent ticket dashboard
- Ticket status filtering
- Ticket status update actions
- Ticket priority and status badges
- Loading, error, empty, and success states
- Responsive dark-mode dashboard
- API client abstraction with Axios
- Component-based React architecture
- Automated frontend tests
- GitHub Actions CI workflow
- Vercel-ready deployment configuration

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

    AC0731/it-helpdesk-frontend

Backend repo:

    AC0731/it-helpdesk-backend

The backend is built with FastAPI and provides the diagnostic and ticket APIs used by this frontend.

## API Endpoints Used

    POST /api/diagnostics
    GET /api/diagnostics/history
    POST /api/ticket
    GET /api/tickets
    GET /api/tickets/{ticket_id}
    PATCH /api/tickets/{ticket_id}

## Screenshots

Screenshots are stored in the `screenshots` folder and show the main frontend workflows:

- Diagnostic form
- Diagnostic results
- Ticket dashboard
- Ticket created success state
- Ticket status update flow
- Backend validation error state

## Environment Variables

Create a local `.env.local` file in the project root:

    VITE_API_BASE_URL=http://127.0.0.1:8000

For production, use:

    VITE_API_BASE_URL=https://it-support-api-g0b4.onrender.com

Never commit `.env.local`.

Use `.env.example` as the safe template.

## Run Locally

Install dependencies:

    npm install

Start the development server:

    npm run dev

The app will run at:

    http://localhost:5173

## Local Full-Stack Testing

Start the backend first:

    cd C:\Users\akank\it-helpdesk-backend
    .\venv\Scripts\Activate.ps1
    uvicorn app.main:app --reload

Then start the frontend:

    cd C:\Users\akank\it-helpdesk-frontend
    npm run dev

Manual smoke test:

- Load the dashboard.
- Run diagnostics with `google.com`.
- Run diagnostics with `8.8.8.8`.
- Confirm local/internal targets show clean validation errors.
- Generate a support ticket.
- Confirm the ticket appears in the dashboard.
- Change ticket status to In Progress.
- Change ticket status to Resolved.
- Test ticket status filters.

## Scripts

    npm run dev
    npm run build
    npm run preview
    npm run lint
    npm test
    npm run test:watch

## Testing

Run linting:

    npm run lint

Run automated tests:

    npm test

Run production build:

    npm run build

Current test coverage includes:

- Status badge rendering
- Diagnostics form behavior
- Diagnostics results rendering
- Ticket dashboard loading and empty states
- Ticket status update behavior

## CI

This project includes a GitHub Actions workflow that runs on pull requests and pushes to `main`.

The workflow checks:

- dependency installation
- linting
- automated frontend tests
- production build

## Deployment

This frontend is prepared for deployment on Vercel.

Production environment variable:

    VITE_API_BASE_URL=https://it-support-api-g0b4.onrender.com

After changing environment variables in Vercel, redeploy the project so the value is included in the production build.

More details are available in:

    docs/deployment.md

## Architecture Notes

The frontend is organized into API modules, reusable components, and a dashboard page.

More details are available in:

    docs/architecture.md

## Notes About Ping and Traceroute

Some deployed server environments do not provide system-level `ping` or `traceroute` commands.

When those commands are unavailable, the backend returns clean fallback messages instead of raw server errors. The app can still display DNS/reachability information, TCP checks, port scan results, and support ticket workflows.

## Roadmap

Completed foundation:

- Frontend diagnostic dashboard
- Backend API integration
- Persistent ticket dashboard
- Ticket status updates
- Component refactor
- Automated frontend tests
- Frontend CI workflow
- Vercel deployment setup

Next improvements:

- Authentication
- Role-based ticket assignment
- Ticket detail page
- Analytics dashboard
- AI-assisted troubleshooting summaries

## Author

Akanksha Chavda  
GitHub: AC0731