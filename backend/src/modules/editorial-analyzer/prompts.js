function buildEditorialPrompt(eventSummary, messageContext) {
  const context = messageContext
    .map((m) => `[${m.role}]: ${m.content}`)
    .join('\n');
  return `You are an editorial analyst for a personal news network. Assess whether this event warrants publication and at what tier.

Event summary: ${eventSummary}
Conversation context:
${context}

Tiers:
- Tier 1 (600-900 words): Turning points, major decisions, emotional shifts, weekly interviews
- Tier 2 (300-500 words): Significant meetings, progress updates, notable events
- Tier 3 (80-180 words): Minor updates, observations, short developments
- No publication: Routine, trivial, or insufficient substance

Respond with JSON only:
{"tier": 1|2|3|null, "shouldPublish": boolean, "rationale": "brief reason"}
No exaggeration, therapy, or casual tone. Newsroom style.`;
}

module.exports = { buildEditorialPrompt };
