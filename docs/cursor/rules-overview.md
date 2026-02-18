# FriendLines Cursor Configuration Overview

## Purpose

Project rules, commands, skills, and agent instructions provide persistent context for the AI agent. They enforce FriendLines V1 product identity, architecture boundaries, and stack-specific patterns so that generated or edited code stays aligned with PRODUCT.md.

---

## Rules (`.cursor/rules/`)

### Rule Layering

```
core-product-guardrails.mdc (alwaysApply: true)
git-operations.mdc (alwaysApply: true)
         │
         ├── frontend-react-js.mdc     (frontend/**/*.{js,jsx})
         ├── backend-express-js.mdc    (backend/**/*.{js,mjs,cjs})
         ├── database-postgres.mdc     (db/**/*.sql, backend/**/migrations/**)
         ├── telegram-bot.mdc          (backend/**/telegram/**/*)
         ├── testing-rules.mdc         (**/*.test.js, **/*.spec.js, __tests__/**)
         └── generic-js-fallback.mdc   (**/*.{js,jsx,sql})
```

- **Always-on:** Core product guardrails apply to every session.
- **File-scoped:** Other rules attach when the open or edited file matches their glob pattern.
- **Fallback:** Generic JS rule covers early-stage or un-scoped files.

### Rule Inventory

| Rule | Scope | Intent |
|------|--------|--------|
| `core-product-guardrails.mdc` | Always | FriendLines identity, V1 scope, editorial constraints, architecture |
| `git-operations.mdc` | Always | Git commits, safety (no force push without request), branch discipline |
| `frontend-react-js.mdc` | `frontend/**/*.{js,jsx}` | React SPA, hooks, routes, data flow |
| `backend-express-js.mdc` | `backend/**/*.{js,mjs,cjs}` | Express modules, async/errors, middleware |
| `database-postgres.mdc` | `db/**/*.sql`, `backend/**/migrations/**` | V1 schema, migration discipline |
| `telegram-bot.mdc` | `backend/**/telegram/**` | Webhooks, message limits, thread integration |
| `testing-rules.mdc` | `**/*.test.js`, `**/*.spec.js`, `__tests__/**` | Test structure, assertions, coverage focus |
| `generic-js-fallback.mdc` | `**/*.{js,jsx,sql}` | Baseline conventions for un-scoped files |

---

## Commands (`.cursor/commands/`)

Type `/` in chat to run these slash commands:

| Command | Purpose |
|---------|---------|
| `/plan` | Plan a new feature or bug fix; outline scope, impact, steps, and relevant follow-up commands |
| `/run-tests-and-fix` | Run test suite and fix failing tests |
| `/code-review` | FriendLines-focused code review checklist |
| `/write-tests` | Add tests for a module, component, or API |
| `/check-product-guardrails` | Verify changes don't violate PRODUCT.md scope |
| `/add-backend-module` | Add endpoint following backend module boundaries |
| `/add-frontend-route` | Add route/page following React SPA conventions |
| `/light-review-diffs` | Quick review of git diffs for high-severity issues |

---

## Skills (`.cursor/skills/`)

Project skills teach the agent domain-specific workflows. Applied automatically when relevant.

| Skill | Trigger | Purpose |
|-------|---------|---------|
| `editorial-review` | Reviewing articles, prompts, content | Editorial tone, tier limits, required elements |
| `api-dev` | Backend/API work | Module boundaries, async/error conventions |
| `telegram-workflow` | Telegram bot integration | Reporter/source flows, message limits |
| `db-migrations` | Schema changes | V1 schema, migration discipline |

---

## Agents (AGENTS.md)

- **Root:** [AGENTS.md](../../AGENTS.md) – High-level instructions, priorities, command pointers.
- **Nested:** Add `AGENTS.md` in `backend/` or `frontend/` when those dirs exist for area-specific guidance.

---

## Maintenance Workflow

1. **Rules:** Use Cursor Settings > Rules, Commands > New Cursor Rule, or create `.mdc` in `.cursor/rules/` with frontmatter.
2. **Commands:** Add `.md` files to `.cursor/commands/` with clear instructions.
3. **Skills:** Create `skill-name/SKILL.md` in `.cursor/skills/` with frontmatter (`name`, `description`).
4. **Conflicts:** Prefer more specific globs; keep core guardrails always-on.
