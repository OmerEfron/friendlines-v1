const { chatCompletion } = require('../../ai/client');
const { buildArticlePrompt, PROMPT_VERSION } = require('./prompts');
const { validateArticleOutput } = require('./guardrails');

const MAX_RETRIES = 2;

function parseArticleResponse(text) {
  const stripped = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const parsed = JSON.parse(stripped);
  return {
    headline: String(parsed.headline || '').trim(),
    subheadline: String(parsed.subheadline || '').trim(),
    body: String(parsed.body || '').trim(),
  };
}

function buildRetryInstruction(issues) {
  const toneIssues = issues.filter((i) =>
    /forbidden tone|headline|structure/i.test(i)
  );
  const wordIssues = issues.filter((i) => /words|minimum|maximum|length/i.test(i));
  const parts = [];
  if (toneIssues.length) {
    parts.push(
      `Remove these violations: ${toneIssues.join('; ')}. Use neutral newsroom tone.`
    );
  }
  if (wordIssues.length) {
    parts.push(`Adjust length: ${wordIssues.join('; ')}.`);
  }
  return parts.length ? parts.join(' ') : `Fix: ${issues.join('. ')}`;
}

async function generate({ tier, eventSummary, messageContext }) {
  const prompt = buildArticlePrompt(tier, eventSummary, messageContext);
  const messages = [
    {
      role: 'system',
      content: 'You respond with valid JSON only. No markdown or extra text.',
    },
    { role: 'user', content: prompt },
  ];

  let lastError;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await chatCompletion(messages, {
        temperature: 0.6,
        max_tokens: 1500,
      });
      const { headline, subheadline, body } = parseArticleResponse(response);
      const { valid, issues } = validateArticleOutput(tier, headline, body);
      if (valid) {
        return { headline, subheadline, body };
      }
      lastError = new Error(`Guardrail failed: ${issues.join('; ')}`);
      if (attempt < MAX_RETRIES) {
        messages.push({ role: 'assistant', content: response });
        messages.push({
          role: 'user',
          content: buildRetryInstruction(issues),
        });
      }
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

module.exports = {
  generate,
  parseArticleResponse,
  validateArticleOutput,
  buildRetryInstruction,
  PROMPT_VERSION,
};
