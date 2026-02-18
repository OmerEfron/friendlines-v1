# Plan New Feature or Bug Fix

Create a structured plan before implementation. The user will provide the feature description or bug report.

## 1. Clarify Scope
- **Feature:** What is the goal? Which user flow or system behavior changes?
- **Bug:** What is broken? Steps to reproduce? Expected vs actual behavior?
- **Boundary check:** Does this fit FriendLines V1 scope? If unsure, run `/check-product-guardrails` after outlining changes.

## 2. Identify Impact
- **Backend:** Conversation Engine, Thread Manager, Editorial Analyzer, Article Generator, Edition Builder—which module(s)?
- **Frontend:** Routes affected? New components? Changes to `/`, `/archive`, `/article/:id`?
- **Database:** Schema changes? New or modified tables per V1 model?
- **Telegram:** Webhook, message flow, or editorial logic changes?

## 3. Outline Steps
- Ordered implementation steps
- Dependencies between steps
- Any migrations or config first

## 4. Call Out Relevant Commands
When the plan is ready, reference which commands to use for execution:
- **Backend work** → `/add-backend-module`
- **Frontend work** → `/add-frontend-route`
- **Tests** → `/write-tests` then `/run-tests-and-fix`
- **Before merge** → `/code-review`, `/check-product-guardrails`

## Output Format
Produce a concise plan (bullets or numbered list) with clear phases. End with "Next: run [relevant commands] when ready to implement."
