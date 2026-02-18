---
name: api-dev
description: Develop Express API and backend modules for FriendLines. Use when adding endpoints, refactoring backend logic, or implementing Conversation Engine, Thread Manager, Editorial Analyzer, Article Generator, or Edition Builder.
---

# API Development

## Module Boundaries
| Module | Responsibility |
|--------|----------------|
| Conversation Engine | Webhooks, messages, chat limits, follow-ups |
| Thread Manager | Open topics, importance, narrative continuity |
| Editorial Analyzer | Significance, tier, publish decision |
| Article Generator | Structured articles, editorial guidelines |
| Edition Builder | Group by date, Top Story, finalize edition |

## Conventions
- Async handlers; rejections bubble to error middleware
- Central error handler: `(err, req, res, next) => { res.status(err.status ?? 500).send(...) }`
- No new top-level modules without PRODUCT.md alignment
