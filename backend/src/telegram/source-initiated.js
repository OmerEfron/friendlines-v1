const { sendMessage, sendMessageWithEndButton, sendChatAction } = require('./index');
const { insertMessage, getRecentMessagesByUserId } = require('../db/messages');
const { processForPublication } = require('../modules/conversation-engine/pipeline');
const { generateClarifyingQuestion } = require('../modules/conversation-engine/clarifying');

const CLARIFYING_CAP = 3;

const TIER_LABELS = { 1: 'Feature', 2: 'Main', 3: 'Brief' };

function countTrailingReporterMessages(messages) {
  let count = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'reporter') count++;
    else break;
  }
  return count;
}

function countReporterQuestionsInCurrentInteraction(messages) {
  let count = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === 'reporter') {
      const isOutcome = msg.content.includes('Published') || msg.content.includes('Not published');
      if (isOutcome) break;
      count++;
    }
  }
  return count;
}

async function handle({ userId, chatId, content, clarifyingCap = CLARIFYING_CAP }) {
  const recent = await getRecentMessagesByUserId(userId, 50);
  const beforeCurrentUser = recent.slice(0, -1);
  const reporterQuestionCount = countReporterQuestionsInCurrentInteraction(beforeCurrentUser);

  if (reporterQuestionCount >= clarifyingCap) {
    await runPublicationPipeline(userId, chatId, recent);
    return;
  }

  const clarifyingQuestion = await getClarifyingQuestion(content, recent);
  if (!clarifyingQuestion) {
    await runPublicationPipeline(userId, chatId, recent);
    return;
  }

  await sendMessageWithEndButton(chatId, clarifyingQuestion);
  await insertMessage(userId, 'reporter', clarifyingQuestion);
}

async function getClarifyingQuestion(userContent, recentMessages) {
  const fallback = buildClarifyingQuestionFallback(userContent, recentMessages);
  if (!fallback) return null;

  const ctx = recentMessages.map((m) => ({ role: m.role, content: m.content }));
  try {
    const aiQuestion = await generateClarifyingQuestion(userContent, ctx);
    if (aiQuestion) return aiQuestion;
  } catch (err) {
    console.warn('AI clarifying question failed, using fallback:', err.message);
  }
  return fallback;
}

function formatOutcomeMessage(result) {
  if (result.published) {
    const label = TIER_LABELS[result.tier] || `Tier ${result.tier}`;
    return `Published as ${label}: "${result.headline}"`;
  }
  return `Not published: ${result.rationale}`;
}

async function runPublicationPipeline(userId, chatId, recent) {
  const ctx = recent.map((m) => ({ role: m.role, content: m.content }));
  const eventSummary = ctx.filter((m) => m.role === 'user').map((m) => m.content).join(' ');
  if (!eventSummary.trim()) return;

  try {
    await sendChatAction(chatId, 'typing');
    const result = await processForPublication({ eventSummary, messageContext: ctx });
    const outcomeText = formatOutcomeMessage(result);
    await sendMessage(chatId, outcomeText);
    await insertMessage(userId, 'reporter', outcomeText);
  } catch (err) {
    console.error('Publication pipeline error:', err);
    const fallback =
      'Processing your message encountered an issue. Please try again.';
    await sendMessage(chatId, fallback);
    await insertMessage(userId, 'reporter', fallback);
  }
}

function buildClarifyingQuestionFallback(userContent, recentMessages) {
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

module.exports = {
  handle,
  countTrailingReporterMessages,
  countReporterQuestionsInCurrentInteraction,
  buildClarifyingQuestionFallback,
  getClarifyingQuestion,
  formatOutcomeMessage,
  runPublicationPipeline,
};
