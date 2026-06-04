# Frontend Architecture

The frontend is a React + Vite application for an IT support diagnostic dashboard.

## Structure

    src/
      api/
        client.js
        diagnostics.js
        tickets.js

      components/
        AlertBanner.jsx
        DashboardHeader.jsx
        DiagnosticsForm.jsx
        DiagnosticsResults.jsx
        PortScannerResults.jsx
        StatusBadge.jsx
        TerminalOutput.jsx
        TicketDashboard.jsx

      pages/
        Dashboard.jsx

      test/
        setup.js

## API Layer

API calls are isolated in the `src/api` folder.

- `client.js` configures the Axios client and shared API error handling.
- `diagnostics.js` handles diagnostic requests.
- `tickets.js` handles ticket creation, ticket listing, and status updates.

## Component Layer

The dashboard is split into focused components:

- `DiagnosticsForm` handles target input and diagnostic submission.
- `DiagnosticsResults` displays diagnostic output and ticket creation.
- `TicketDashboard` displays persistent support tickets, filters, and status updates.
- `StatusBadge` renders status and priority labels.
- `TerminalOutput` displays ping and traceroute output.
- `PortScannerResults` displays open and closed port results.

## Page Layer

`Dashboard.jsx` coordinates page-level state and passes data to child components.

## Testing

The frontend uses Vitest and Testing Library.

Test coverage currently includes:

- Status badge rendering
- Diagnostics form behavior
- Diagnostics results rendering
- Ticket dashboard loading, empty state, and status updates

Run tests with:

    npm test