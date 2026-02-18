# Pre-Merge Quality Sequence

1. **Tests:** `npm test` (from root, runs workspace tests)
2. **Guardrails:** Run `/check-product-guardrails`
3. **Code review:** Run `/code-review`

## Blueprint Validation

- [ ] All V1 routes exist: `/`, `/archive`, `/article/:id`
- [ ] Backend modules exist: Conversation Engine, Thread Manager, Editorial Analyzer, Article Generator, Edition Builder
- [ ] Telegram flow contracts defined
- [ ] Schema contract aligns with V1 tables
