# 📰 FriendLines V1

**Product & Architecture Document**  
**Version:** 1.0 (Solo MVP)

## 1. Product Overview

FriendLines is a private, AI-powered personal newsroom—a media layer that covers an individual’s life.

- **Core Principle:**  
  Instead of sharing posts, the user becomes the subject.  
  An AI journalist starts brief, purposeful conversations, tracks storylines, identifies significant moments, and generates structured news articles about the user's life.

**FriendLines is _not_:**
- Social media
- A journaling app
- A chatbot
- A therapy tool

**FriendLines _is_:**
- A personal news network reporting your life as it happens.

---

## 2. Vision

**Category:**  
_Personal Media Layer_

Just as CNN covers global news and Ynet covers national news, FriendLines contextualizes and archives your personal events as news.

**V1 Hypothesis:**  
*Will users genuinely enjoy reading their life as structured news coverage?*

---

## 3. V1 Scope (Solo Mode Only)

**Included in V1:**
- Single user
- Single AI journalist
- Telegram-based conversational intake
- Minimalist web-based news edition
- Daily publications
- Weekly interview feature
- Article archive

**Explicitly _Not_ Included:**
- Social/sharing features
- Circles
- Multi-user support
- Integrations (WhatsApp, calendar, etc.)
- Advanced analytics
- Role or notification systems (except Telegram)

---

## 4. Core Experience

### 4.1 Two-Way Newsroom Model

**Modes of Interaction:**

#### A. Reporter-Initiated
- AI journalist starts a conversation 3× daily:
  - Morning Angle
  - Midday Follow-up (if open threads exist)
  - Evening Wrap
- Each session is:
  - 2–5 messages total
  - Focussed and context-aware
  - Not therapeutic or casual

#### B. Source-Initiated (“Leak”)
- User can send updates at any time
- AI will:
  - Assess importance
  - Ask up to 3 clarifying questions
  - Classify the event
  - Update running threads
  - Decide on future publication

---

## 5. Editorial Model

### 5.1 Importance Tiers

All events are ranked for coverage:

- **Tier 1 – Feature Story (600–900 words):**
  - Turning points
  - Major decisions
  - Emotional shifts
  - Weekly interviews

- **Tier 2 – Main Story (300–500 words):**
  - Significant meetings
  - Progress updates
  - Notable events

- **Tier 3 – Brief (80–180 words):**
  - Minor updates
  - Observations
  - Short developments

_Not every conversation yields a published story._

### 5.2 Writing Style (Hebrew/Israeli Newsroom Tone)

**Editorial requirements:**
- Structured, professional, impactful (Ynet newsroom tone)
- No exaggeration, clickbait, therapy, or forced humor

**Articles must feature:**
- Framing (why it matters)
- Continuity (connections to past events)
- Context (background info)
- Perspective (light analysis)

---

## 6. Web Experience (Minimalist News Site)

### Homepage (Today’s Edition)
- Header (FriendLines | Date | Edition #)
- Top Story (prominent)
- 1–2 Briefs
- Optional: “Developing Stories” sidebar

### Article Page
- Headline
- Sub-headline
- Full article
- Link to related thread

### Archive Page
- Chronological list by date

**Design:**  
Minimalist, newsroom-inspired, clean typography.

---

## 7. Technical Architecture (React + Express)

### 7.1 High-Level Flow

```
Telegram Bot
      ↓
Express Backend (API + News Engine)
      ↓
PostgreSQL Database
      ↓
React Frontend (Web Edition)
```

### 7.2 Backend (Express)

Monolithic backend with clear module separation:

1. **Conversation Engine:**
   - Handles Telegram webhooks, stores messages, manages chat limits, and generates follow-ups

2. **Thread Manager:**
   - Tracks open topics, updates importance, ensures narrative continuity

3. **Editorial Analyzer:**
   - Evaluates significance, assigns publication tier, and makes publish decisions

4. **Article Generator:**
   - Creates structured articles and enforces editorial guidelines

5. **Edition Builder:**
   - Groups articles by date, assigns Top Story, finalizes daily edition

### 7.3 Frontend (React)

- Single Page App
- Fetches edition via backend API
- Routes:
  - `/` (Today)
  - `/archive`
  - `/article/:id`
- No SSR required for V1

---

## 8. Database Model (V1 Minimal)

**Tables & Key Fields:**

- **users**
  - id, name, language

- **messages**
  - id, user_id, role (user/reporter), content, timestamp

- **threads**
  - id, title, status (open/closed), importance_score, created_at

- **events**
  - id, thread_id, summary, sentiment, significance_score

- **articles**
  - id, date, tier, headline, body, related_thread_id

- **editions**
  - id, date

---

## 9. AI Architecture

- **Prompt 1:** Reporter Agent – Generates brief, contextual questions
- **Prompt 2:** Editorial Analyzer – Evaluates importance, continuity, publication decision, tier
- **Prompt 3:** Article Writer – Produces structured news article

Each prompt:
- Follows strict tone rules
- Maintains length limits
- Avoids exaggeration

---

## 10. Scheduling

**Automated Tasks:**
- 09:00 Morning initiation
- 14:00 Conditional follow-up
- 20:00 Evening wrap & publish check

_Implementation: Node cron, server scheduler, or external cron trigger._

---

## 11. Success Criteria (30-Day Validation)

**Success if:**
- User opens the daily edition
- Articles are enjoyable/engaging
- Writing is newsroom-level and structured
- Narrative continuity is maintained
- User revisits the archive

**Failure if:**
- Articles feel repetitive
- Tone is artificial
- Conversations are forced
- Reading feels gimmicky

---

## 12. Future (Beyond V1)

_Potential expansions if V1 succeeds:_

- Multi-user circles
- Couple mode
- Public/private story layers
- Multi-reporter newsroom
- Advanced milestone detection
- External data integrations

---

## 13. Product Philosophy

FriendLines aims for honest, structured coverage—**not** unnecessary drama.