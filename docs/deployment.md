# Frontend Deployment Guide

This document explains how to deploy the IT Support Diagnostic Portal frontend.

## Platform

The frontend is designed for Vercel deployment.

## Required Environment Variable

Set this environment variable in the Vercel project:

    VITE_API_BASE_URL=https://it-support-api-g0b4.onrender.com

For local development, use:

    VITE_API_BASE_URL=http://127.0.0.1:8000

## Deployment Checklist

Before deploying:

- Confirm the backend API is deployed and reachable.
- Confirm the backend `/health` endpoint returns a successful response.
- Confirm `VITE_API_BASE_URL` points to the correct backend API.
- Confirm frontend lint passes.
- Confirm frontend tests pass.
- Confirm production build passes.

Local verification commands:

    npm run lint
    npm test
    npm run build

## Vercel Setup

1. Import the GitHub repository into Vercel.
2. Select the frontend repository.
3. Add the production environment variable.
4. Deploy from the `main` branch.
5. After deployment, test the live app manually.

## Manual Smoke Test

After deployment, confirm:

- The dashboard loads.
- The ticket dashboard loads.
- Diagnostics work with a public target like `google.com`.
- Diagnostics work with a public IP like `8.8.8.8`.
- Local/internal targets show a clean backend validation error.
- Support ticket creation works.
- New tickets appear in the ticket dashboard.
- Ticket status updates work.
- Ticket filters work.