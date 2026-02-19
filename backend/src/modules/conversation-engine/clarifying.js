const { chatCompletion } = require('../../ai/client');
const config = require('../../config');

const PROMPT_VERSION = 'v1';

function buildClarifyingPrompt(userContent, recentMessages) {
  const context = recentMessages
    .slice(-6)
    .map((m) => `[${m.role}]: ${m.content}`)
    .join('\n');
  const subject = config.userName;
  return `You are a journalist for a personal news network gathering facts about ${subject}. The source just shared: "${userContent}"

Recent exchange:
${context || '(none)'}

Generate exactly ONE short clarifying question to extract a key fact for a news article. Focus on: when, where, who, what, why, or concrete details. Be concise (under 15 words). Newsroom tone—professional, not chatty.

Respond with plain text only—the question itself, nothing else.`;
}

async function generateClarifyingQuestion(userContent, recentMessages) {
  const prompt = buildClarifyingPrompt(userContent, recentMessages);
  const messages = [
    { role: 'system', content: 'You respond with a single clarifying question. No preamble or quotes.' },
    { role: 'user', content: prompt },
  ];
  const response = await chatCompletion(messages, { temperature: 0.4 });
  const question = response.trim().replace(/^["']|["']$/g, '');
  if (!question || question.length > 120) return null;
  return question;
}

module.exports = {
  generateClarifyingQuestion,
  buildClarifyingPrompt,
  PROMPT_VERSION,
};
