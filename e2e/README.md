# FriendLines E2E Tests

Playwright tests run against a live app. **Start backend and frontend before running e2e.**

## Prerequisites

1. Backend running: `npm run start:dev:backend` (or `npm run start:backend`)
2. Frontend running: `npm run start:frontend`
3. Backend API available at `http://localhost:3000`, frontend at `http://localhost:5173`

## Run E2E

```bash
# From repo root
npm run test:e2e
```

Or with a custom base URL:

```bash
PLAYWRIGHT_BASE_URL=http://localhost:5173 npx playwright test
```

## Tests

- **smoke.spec.js** – Brand, nav links, basic navigation
- **navigation.spec.js** – Home, archive, article page flows
