const TIER_RANGES = {
  1: { min: 600, max: 900 },
  2: { min: 300, max: 500 },
  3: { min: 80, max: 180 },
};

function getTierRange(tier) {
  const r = TIER_RANGES[tier];
  if (!r) throw new Error(`Invalid tier: ${tier}`);
  return r;
}

function buildArticlePrompt(tier, eventSummary, messageContext) {
  const { min, max } = getTierRange(tier);
  const context = messageContext
    .map((m) => `[${m.role}]: ${m.content}`)
    .join('\n');
  return `You are a journalist for a personal news network. Write a structured news article.
Tone: Ynet-style newsroom—structured, professional, impactful. No exaggeration, clickbait, therapy, or forced humor.
Word count: ${min}-${max} words exactly.

Event: ${eventSummary}
Context:
${context}

Include: framing (why it matters), continuity (connections to past), context (background), perspective (light analysis).
Output JSON only:
{"headline": "...", "subheadline": "...", "body": "..."}`;
}

module.exports = { buildArticlePrompt, getTierRange, TIER_RANGES };
