# Database

PostgreSQL. Migrations in `migrations/`.

## Migration Convention

- Filename: `YYYYMMDDHHMMSS_descriptive_name.sql`
- Each migration: `UP` and `DOWN` sections, or separate `up/` and `down/` files per tool.
- Keep migrations backward-safe; avoid destructive changes without explicit versioning.

## V1 Schema Contract

| Table | Key Fields |
|-------|------------|
| users | id, name, language |
| messages | id, user_id, role (user/reporter), content, timestamp |
| threads | id, title, status (open/closed), importance_score, created_at |
| events | id, thread_id, summary, sentiment, significance_score |
| articles | id, date, tier, headline, body, related_thread_id |
| editions | id, date |

## Running Migrations

From backend: `npm run migrate up` (requires `DATABASE_URL`). Create: `npm run migrate:create <name>`. Rollback: `npm run migrate down`.
