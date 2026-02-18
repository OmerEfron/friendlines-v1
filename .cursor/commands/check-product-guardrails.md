# Check Product Guardrails

Verify that the current changes do not violate FriendLines V1 scope or identity.

1. Scan staged and unstaged diffs for:
   - Social/sharing features, circles, multi-user support
   - WhatsApp/calendar integrations, advanced analytics
   - Therapy, casual chat, or non-editorial tone in prompts or copy
   - SSR or routes beyond `/`, `/archive`, `/article/:id`
2. Confirm backend changes stay within: Conversation Engine, Thread Manager, Editorial Analyzer, Article Generator, Edition Builder.
3. Report any violations with file and line references; suggest aligned alternatives.
