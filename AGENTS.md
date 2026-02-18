# FriendLines Agent Instructions

## Project Context
FriendLines is a personal news network—an AI journalist reports the user's life as structured news. See [PRODUCT.md](PRODUCT.md) for full scope.

## Priorities
1. **Scope:** V1 is solo, Telegram-only, minimal web edition. No social, multi-user, or out-of-scope integrations.
2. **Editorial:** Ynet-style tone—structured, professional, no exaggeration or therapy.
3. **Architecture:** Telegram → Express → PostgreSQL → React. Respect module boundaries.

## When Editing
- Git: Conventional commits; no force push or push without explicit user request.
- Backend: Place code in the correct module (Conversation Engine, Thread Manager, Editorial Analyzer, Article Generator, Edition Builder).
- Frontend: Routes `/`, `/archive`, `/article/:id`; no SSR.
- DB: Align with V1 schema; migrations backward-safe.
- Tests: Follow testing rules; run before claiming completion.

## Commands
Use `/` to access project commands: code review, run tests, write tests, check guardrails, add modules/routes.
