# Telegram Flow Contracts

Blueprint only. No implementation logic.

## Reporter-Initiated

- **Trigger:** Scheduled 3× daily (09:00, 14:00, 20:00)
- **Flow:** Conversation Engine → Thread Manager (open threads)
- **Limit:** 2–5 messages per session
- **Handoff to:** Editorial Analyzer for publish decision

## Source-Initiated ("Leak")

- **Trigger:** User sends message at any time
- **Flow:** Webhook receives message → Conversation Engine
- **Actions:** Assess importance, up to 3 clarifying questions, classify event, update threads
- **Handoff to:** Thread Manager, Editorial Analyzer

## Payload Contract (Telegram Update)

```
{ message: { from, chat, text }, ... }
```

## Boundaries

- No therapy, casual chat, or non-editorial tone
- Integrate with Thread Manager and Editorial Analyzer
