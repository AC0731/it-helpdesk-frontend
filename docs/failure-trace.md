# Full-stack request trace

SupportOps carries a diagnostic request reference across the UI and backend so a support case is traceable without exposing internal exception detail.

## Normal path

1. User enters a public target.
2. Backend assigns or preserves `X-Request-ID`.
3. Target validation and DNS pinning run inside the bounded diagnostic execution path.
4. Response returns `request_id`, `diagnostic_id`, `resolved_ip`, and results.
5. The UI shows the pinned address and request reference.
6. Ticket creation sends the same request reference.
7. The saved ticket summary records the source diagnostic request.

## Failure states shown to the user

- blocked target: validation reason + request reference
- capacity full: retry-later message + request reference
- diagnostic timeout: timeout message + request reference
- database persistence failure: saved-state warning + request reference
- unexpected server error: generic message + request reference

The frontend does not echo arbitrary 5xx backend details.

## Limits

This is application-level correlation, not distributed tracing. There is no OpenTelemetry collector or cross-service trace backend in the portfolio deployment. The request ID is intentionally simple and sufficient for the current two-service architecture.
