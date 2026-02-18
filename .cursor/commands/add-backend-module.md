# Add Backend Module or Endpoint

Add a new Express module or API endpoint following FriendLines backend architecture.

1. Place code in the appropriate module:
   - Conversation Engine: webhooks, messages, chat limits, follow-ups
   - Thread Manager: open topics, importance, narrative continuity
   - Editorial Analyzer: significance, tier, publish decision
   - Article Generator: structured articles, editorial guidelines
   - Edition Builder: group by date, Top Story, finalize edition
2. Use async handlers; propagate errors to centralized error middleware.
3. Add input validation where applicable.
4. Do not introduce new top-level modules without explicit PRODUCT.md alignment.
