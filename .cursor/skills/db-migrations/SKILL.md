---
name: db-migrations
description: Create and run PostgreSQL migrations for FriendLines V1 schema. Use when adding tables, columns, or schema changes for users, messages, threads, events, articles, or editions.
---

# DB Migrations

## V1 Schema
- **users:** id, name, language
- **messages:** id, user_id, role (user/reporter), content, timestamp
- **threads:** id, title, status (open/closed), importance_score, created_at
- **events:** id, thread_id, summary, sentiment, significance_score
- **articles:** id, date, tier, headline, body, related_thread_id
- **editions:** id, date

## Discipline
- Keep migrations backward-safe
- Avoid destructive changes without explicit versioning and rollback plan
