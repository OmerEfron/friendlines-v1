const config = require('../../config');
const PROMPT_VERSION = 'v1';

const RUBRIC = `
Significance: Does this change something meaningful (decision, outcome, relationship, goal)?
Continuity: Does it connect to past events or ongoing storylines?
Substance: Enough concrete detail for a news article (who, what, when, where, why)?
Exclusions: Routine chatter, trivial updates, therapy-seeking, vague one-liners → no publication.`;

function buildEditorialPrompt(eventSummary, messageContext) {
  const context = messageContext
    .map((m) => `[${m.role}]: ${m.content}`)
    .join('\n');
  const subject = config.userName;
  return `You are an editorial analyst for a personal news network covering ${subject}. Assess whether this event warrants publication and at what tier.
${RUBRIC}

Event summary: ${eventSummary}
Conversation context:
${context}

Tiers (strict):
- 1 (600-900 words): Turning points, major decisions, emotional shifts, weekly interviews
- 2 (300-500 words): Significant meetings, progress updates, notable events
- 3 (80-180 words): Minor updates, observations, short developments
- null + shouldPublish=false: Routine, trivial, insufficient substance, or exclusions above

Output contract: Valid JSON only, no markdown.
{"tier": 1|2|3|null, "shouldPublish": boolean, "rationale": "brief reason (one sentence)"}`;
}

module.exports = { buildEditorialPrompt, PROMPT_VERSION, RUBRIC };
