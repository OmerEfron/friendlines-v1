# V1 Schema Contract

Blueprint for initial migrations. No SQL execution—schema design only.

## Tables

### users
- `id` (PK)
- `name`
- `language`

### messages
- `id` (PK)
- `user_id` (FK → users)
- `role` (user | reporter)
- `content`
- `timestamp`

### threads
- `id` (PK)
- `title`
- `status` (open | closed)
- `importance_score`
- `created_at`

### events
- `id` (PK)
- `thread_id` (FK → threads)
- `summary`
- `sentiment`
- `significance_score`

### articles
- `id` (PK)
- `date`
- `tier` (1 | 2 | 3)
- `headline`
- `body`
- `related_thread_id` (FK → threads, nullable)

### editions
- `id` (PK)
- `date`

## Rollback

Each migration must have a reversible down step. Order migrations so dependencies are dropped before parents.
