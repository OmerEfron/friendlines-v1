const { sendMessage } = require('./index');
const { insertMessage, getRecentMessagesByUserId } = require('../db/messages');
const { processForPublication } = require('../modules/conversation-engine/pipeline');

const CLARIFYING_CAP = 3;

function countTrailingReporterMessages(messages) {
  let count = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'reporter') count++;
    else break;
  }
  return count;
}

async function handle({ userId, chatId, content, clarifyingCap = CLARIFYING_CAP }) {
  const recent = await getRecentMessagesByUserId(userId, 50);
  const trailingReporter = countTrailingReporterMessages(recent);

  if (trailingReporter >= clarifyingCap) {
    await runPublicationPipeline(userId, chatId, recent);
    return;
  }

  const clarifyingQuestion = buildClarifyingQuestion(content, recent);
  if (!clarifyingQuestion) {
    await runPublicationPipeline(userId, chatId, recent);
    return;
  }

  await sendMessage(chatId, clarifyingQuestion);
  await insertMessage(userId, 'reporter', clarifyingQuestion);
}

async function runPublicationPipeline(userId, chatId, recent) {
  try {
    const ctx = recent.map((m) => ({ role: m.role, content: m.content }));
    const eventSummary = ctx.filter((m) => m.role === 'user').map((m) => m.content).join(' ');
    if (!eventSummary.trim()) return;
    await processForPublication({ eventSummary, messageContext: ctx });
  } catch (err) {
    console.error('Publication pipeline error:', err);
  }
}

function buildClarifyingQuestion(userContent, recentMessages) {
  if (userContent.length < 10) {
    return 'Could you share a bit more context?';
  }
  const lastReporter = [...recentMessages].reverse().find((m) => m.role === 'reporter');
  if (lastReporter?.content?.includes('context')) {
    return null;
  }
  if (!userContent.match(/when|where|who|what|how|why/i)) {
    return 'When did this happen?';
  }
  return null;
}

module.exports = { handle, countTrailingReporterMessages, buildClarifyingQuestion };
