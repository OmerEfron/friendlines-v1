const { OpenAI } = require('openai');
const config = require('../config');

let client = null;

function getClient() {
  if (!config.openaiApiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  if (!client) {
    client = new OpenAI({ apiKey: config.openaiApiKey });
  }
  return client;
}

async function chatCompletion(messages, options = {}) {
  const openai = getClient();
  const res = await openai.chat.completions.create({
    model: options.model || 'gpt-4o-mini',
    messages,
    temperature: options.temperature ?? 0.5,
    max_tokens: options.max_tokens ?? 2000,
  });
  const content = res.choices[0]?.message?.content;
  if (!content) throw new Error('Empty completion');
  return content;
}

module.exports = { getClient, chatCompletion };
