const { chatCompletion } = require('../../ai/client');
const { buildEditorialPrompt } = require('./prompts');

const VALID_TIERS = [1, 2, 3];

function parseEditorialResponse(text) {
  const stripped = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const parsed = JSON.parse(stripped);
  const tier = parsed.tier;
  const shouldPublish = Boolean(parsed.shouldPublish);
  const rationale = String(parsed.rationale || '');
  if (tier !== null && !VALID_TIERS.includes(tier)) {
    throw new Error(`Invalid tier: ${tier}`);
  }
  return { tier, shouldPublish, rationale };
}

async function analyze({ eventSummary, messageContext }) {
  const prompt = buildEditorialPrompt(eventSummary, messageContext);
  const messages = [
    { role: 'system', content: 'You respond with valid JSON only. No markdown or extra text.' },
    { role: 'user', content: prompt },
  ];
  const response = await chatCompletion(messages, { temperature: 0.3 });
  return parseEditorialResponse(response);
}

module.exports = { analyze, parseEditorialResponse };
