# Code Review Checklist

Review the selected or changed code against FriendLines standards.

## Functionality
- [ ] Code aligns with PRODUCT.md scope (no social, multi-user, or out-of-scope features)
- [ ] Edge cases and errors are handled appropriately
- [ ] No obvious logic errors

## Architecture
- [ ] Backend: Respects module boundaries (Conversation Engine, Thread Manager, Editorial Analyzer, Article Generator, Edition Builder)
- [ ] Frontend: Routes `/`, `/archive`, `/article/:id`; no SSR
- [ ] DB: Matches V1 schema (users, messages, threads, events, articles, editions)

## Editorial (if applicable)
- [ ] Tone: Structured, professional; no exaggeration, therapy, or forced humor
- [ ] Article tiers and word limits respected

## Quality
- [ ] Files under ~300 lines; modular structure
- [ ] Async handlers propagate errors to centralized error middleware
- [ ] No hardcoded secrets or sensitive data
