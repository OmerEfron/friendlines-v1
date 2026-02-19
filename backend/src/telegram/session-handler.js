const { sendMessage, sendMessageWithEndButton, sendChatAction } = require('./index');
const { insertMessage, getRecentMessagesByUserId } = require('../db/messages');
const {
  getActiveSessionByUserId,
  endSession,
  incrementAskedCount,
} = require('../db/sessions');
const { processForPublication } = require('../modules/conversation-engine/pipeline');
const { generateClarifyingQuestion } = require('../modules/conversation-engine/clarifying');
const { generateFollowUpQuestion } = require('../modules/conversation-engine/weekly-interview');

const TIER_LABELS = { 1: 'Feature', 2: 'Main', 3: 'Brief' };

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
    console.error('Session publication pipeline error:', err);
    const fallback = 'Processing encountered an issue. Please try again.';
    await sendMessage(chatId, fallback);
    await insertMessage(userId, 'reporter', fallback);
  }
}

async function getNextQuestion(userContent, recentMessages, mode = 'daily') {
  const ctx = recentMessages.map((m) => ({ role: m.role, content: m.content }));
  if (mode === 'weekly_interview') {
    try {
      const q = await generateFollowUpQuestion(userContent, ctx);
      if (q) return q;
    } catch (err) {
      console.warn('Weekly interview question failed:', err.message);
    }
    return 'Anything else worth reflecting on?';
  }
  try {
    const question = await generateClarifyingQuestion(userContent, ctx);
    if (question) return question;
  } catch (err) {
    console.warn('AI question failed:', err.message);
  }
  if (userContent.length < 10) return 'Could you share a bit more context?';
  if (!userContent.match(/when|where|who|what|how|why/i)) return 'When did this happen?';
  return 'Anything else worth noting?';
}

async function handleSessionReply({ userId, chatId, content }) {
  const session = await getActiveSessionByUserId(userId);
  if (!session) return false;

  const recent = await getRecentMessagesByUserId(userId, 50);
  if (session.asked_count >= session.target_count) {
    await endSession(session.id);
    await runPublicationPipeline(userId, chatId, recent);
    return true;
  }

  const nextQuestion = await getNextQuestion(content, recent, session.mode);
  await sendMessageWithEndButton(chatId, nextQuestion);
  await insertMessage(userId, 'reporter', nextQuestion);
  await incrementAskedCount(session.id);
  return true;
}

function hasActiveSourceInitiatedConversation(messages) {
  if (messages.length === 0) return false;
  const lastMsg = messages[messages.length - 1];
  if (lastMsg.role !== 'reporter') return false;
  const isOutcome = lastMsg.content.includes('Published') || lastMsg.content.includes('Not published');
  return !isOutcome;
}

async function handleEndNow({ userId, chatId }) {
  const session = await getActiveSessionByUserId(userId);
  if (session) {
    await endSession(session.id);
    const recent = await getRecentMessagesByUserId(userId, 50);
    await runPublicationPipeline(userId, chatId, recent);
    return true;
  }

  const recent = await getRecentMessagesByUserId(userId, 50);
  if (hasActiveSourceInitiatedConversation(recent)) {
    await runPublicationPipeline(userId, chatId, recent);
    return true;
  }

  return false;
}

module.exports = {
  handleSessionReply,
  handleEndNow,
  hasActiveSourceInitiatedConversation,
  runPublicationPipeline,
  formatOutcomeMessage,
};
