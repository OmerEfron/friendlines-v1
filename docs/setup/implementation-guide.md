# FriendLines V1 Implementation Guide

## Environment Variables

Create a `.env` file in the project root or set these before running:

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Backend server port (default: 3000) | No |
| `DATABASE_URL` | PostgreSQL connection string (e.g. `postgres://user:pass@localhost:5432/friendlines`) | Yes (for DB) |
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather | Yes (for Telegram) |
| `TELEGRAM_WEBHOOK_SECRET` | Secret for `X-Telegram-Bot-Api-Secret-Token` webhook validation | Recommended |
| `OPENAI_API_KEY` | OpenAI API key for editorial and article generation | Yes (for AI) |
| `VITE_API_BASE` | Frontend API base URL (default: empty, uses proxy in dev) | No |

## Database Migrations

From the backend directory:

```bash
cd backend

# Apply all pending migrations
DATABASE_URL=postgres://localhost:5432/friendlines npm run migrate up

# Create a new migration
npm run migrate:create my_migration_name

# Rollback one migration
npm run migrate down
```

## Running the Application

1. **Backend:** `npm run start:backend` (from project root)
2. **Frontend:** `npm run start:frontend` (from project root)

The frontend dev server proxies `/api` and `/webhook` to the backend (localhost:3000).

## Telegram Webhook Setup

1. Expose your backend via HTTPS (e.g. ngrok, Render).
2. Set the webhook:
   ```
   POST https://api.telegram.org/bot<TOKEN>/setWebhook
   Body: { "url": "https://your-domain.com/webhook/telegram", "secret_token": "<TELEGRAM_WEBHOOK_SECRET>" }
   ```

## Scheduler (Reporter-Initiated Sessions)

The backend runs reporter-initiated sessions at 09:00, 14:00, and 20:00 UTC. Configure timezone in `backend/src/scheduler/index.js` if needed.

Ensure the backend process stays running; cron jobs run in-process.
