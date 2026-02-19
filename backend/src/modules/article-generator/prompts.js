const config = require('../../config');

const TIER_RANGES = {
  1: { min: 600, max: 900 },
  2: { min: 300, max: 500 },
  3: { min: 80, max: 180 },
};

const PROMPT_VERSION = 'v1';

const ANTI_PATTERNS = `
Avoid: exaggeration, clickbait, therapy language, forced humor, casual chat, dramatic framing.`;

const STRUCTURE_GUIDE = `
- Framing: Why it matters (lead paragraph).
- Continuity: Connections to past events or ongoing storylines.
- Context: Background and relevant facts.
- Perspective: Light analysis, not opinion.`;

function getTierRange(tier) {
  const r = TIER_RANGES[tier];
  if (!r) throw new Error(`Invalid tier: ${tier}`);
  return r;
}

function buildArticlePrompt(tier, eventSummary, messageContext) {
  const { min, max } = getTierRange(tier);
  const context = messageContext
    .slice(-10)
    .map((m) => `[${m.role}]: ${m.content}`)
    .join('\n');
  const subject = config.userName;
  return `You are a journalist for a personal news network. The subject of coverage is ${subject}. Write a structured news article about their life.
Tone: Ynet-style newsroom—structured, professional, impactful.${ANTI_PATTERNS}
Word count: ${min}-${max} words exactly (body only).

Event: ${eventSummary}
Context (recent exchange):
${context}
${STRUCTURE_GUIDE}

Output JSON only:
{"headline": "...", "subheadline": "...", "body": "..."}`;
}

module.exports = {
  buildArticlePrompt,
  getTierRange,
  TIER_RANGES,
  PROMPT_VERSION,
  ANTI_PATTERNS,
  STRUCTURE_GUIDE,
};
