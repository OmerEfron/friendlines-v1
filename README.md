# FriendLines V1

Personal news network—an AI journalist reports your life as structured news.

## Architecture

```
Telegram Bot → Express Backend → PostgreSQL → React Frontend
```

## Project Structure

- `backend/` — Express API, modules (Conversation Engine, Thread Manager, Editorial Analyzer, Article Generator, Edition Builder), Telegram webhooks
- `frontend/` — React SPA, routes: `/`, `/archive`, `/article/:id`
- `docs/` — Documentation

## Conventions

- **Scripts:** `install:all`, `lint`, `test`, `start:backend`, `start:frontend`
- **Env keys:** `PORT`, `DATABASE_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `OPENAI_API_KEY`
- **Directory ownership:** Backend modules under `backend/src/modules/`, Telegram under `backend/src/telegram/`

## Setup

1. Copy `.env.example` to `.env` and fill values.
2. Run `npm install`.
3. Run migrations (see `backend/db/README.md`).
4. Start backend: `npm run start:backend`
5. Start frontend: `npm run start:frontend`

## V1 Scope

Single user, Telegram intake, daily editions, weekly interviews, article archive. No social, multi-user, or out-of-scope integrations. See [docs/scope/v1-boundaries-checklist.md](docs/scope/v1-boundaries-checklist.md).
