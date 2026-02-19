# FriendLines Testing Guide

## Overview

FriendLines uses a test pyramid:

- **Unit tests**: Pure logic, guards, parsing, prompts (no DB/network).
- **Integration tests**: API routes with real PostgreSQL, DB modules.
- **E2E tests**: Full user flows via Playwright (browser).

## Environment

### Backend

- `NODE_ENV=test` is set automatically by Jest.
- `DATABASE_URL`: Use a separate test DB for integration tests (e.g. `friendlines_test`).
- No AI/Telegram keys needed for unit tests; mocks are used.

### Frontend

- Vitest runs with `jsdom` environment.
- API calls are mocked (no live backend required for unit/integration).

### E2E

- Playwright runs against a running app. Start backend + frontend manually before e2e.
- See `e2e/README.md` for preconditions.

## Running Tests

```bash
# From repo root – runs all workspaces
npm test

# Backend only
npm run test -w backend

# Frontend only
npm run test -w frontend

# E2E (requires app running)
npm run test:e2e
```

## Conventions

- Backend: `backend/tests/**/*.test.js` (Jest).
- Frontend: `**/*.test.{js,jsx}` (Vitest).
- E2E: `e2e/**/*.spec.js` (Playwright).
- Keep each test file under ~300 lines; split into smaller files if needed.
