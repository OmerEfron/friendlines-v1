const {
  sendMessage,
  sendMessageWithEndButton,
  sendMessageWithPreviewButtons,
  sendChatAction,
} = require('./index');
const { insertMessage, getRecentMessagesByUserId } = require('../db/messages');
const {
  getActiveSessionByUserId,
  endSession,
  endActiveSessionForUser,
  createSession,
  incrementAskedCount,
  MODE_DAILY,
  MODE_WEEKLY_INTERVIEW,
} = require('../db/sessions');
const { processForPublication } = require('../modules/conversation-engine/pipeline');
const { generateClarifyingQuestion } = require('../modules/conversation-engine/clarifying');
const { generateFollowUpQuestion } = require('../modules/conversation-engine/weekly-interview');
const { createArticle } = require('../db/articles');

const TIER_LABELS = { 1: 'Feature', 2: 'Main', 3: 'Brief' };
const TARGET_QUESTIONS_DAILY = 5;

const MODE_OPENINGS = {
  daily: ['Anything new to report today?', 'What should we cover?', 'Any updates worth noting?'],
  breaking: ["What's the latest? Give me the headline."],
  leak: ["What's the scoop?"],
  gossip: ["What's the buzz?"],
};

const drafts = new Map();

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

async function runPublicationPipelineDraft(userId, chatId, recent) {
  const ctx = recent.map((m) => ({ role: m.role, content: m.content }));
  const eventSummary = ctx.filter((m) => m.role === 'user').map((m) => m.content).join(' ');
  if (!eventSummary.trim()) {
    await sendMessage(chatId, 'No content to publish. Share something first.');
    return false;
  }

  try {
    await sendChatAction(chatId, 'typing');
    const result = await processForPublication({
      eventSummary,
      messageContext: ctx,
      forcePublish: true,
      draftOnly: true,
    });

    if (!result.headline || !result.body) {
      await sendMessage(chatId, 'Could not generate an article. Please try again with more detail.');
      return false;
    }

    const label = TIER_LABELS[result.tier] || `Tier ${result.tier}`;
    const preview = `${result.headline}\n\n${result.body}\n\n(${label} — Review before publishing)`;
    drafts.set(userId, {
      date: new Date().toISOString().slice(0, 10),
      tier: result.tier,
      headline: result.headline,
      body: result.body,
      threadId: result.threadId,
    });
    await sendMessageWithPreviewButtons(chatId, preview);
    await insertMessage(userId, 'reporter', `[Draft ready] ${result.headline}`);
    return true;
  } catch (err) {
    console.error('Session draft pipeline error:', err);
    await sendMessage(chatId, 'Processing encountered an issue. Please try again.');
    await insertMessage(userId, 'reporter', 'Processing encountered an issue. Please try again.');
    return false;
  }
}

async function getNextQuestion(userContent, recentMessages, mode = 'daily') {
  const ctx = recentMessages.map((m) => ({ role: m.role, content: m.content }));
  const clarifyingMode = ['daily', 'breaking', 'leak', 'gossip'].includes(mode)
    ? 'daily'
    : mode;
  if (clarifyingMode === 'weekly_interview') {
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
    await runPublicationPipelineDraft(userId, chatId, recent);
    return true;
  }

  const nextQuestion = await getNextQuestion(content, recent, session.mode);
  await sendMessageWithEndButton(chatId, nextQuestion);
  await insertMessage(userId, 'reporter', nextQuestion);
  await incrementAskedCount(session.id);
  return true;
}

function clearDraftForUser(userId) {
  drafts.delete(userId);
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
    return runPublicationPipelineDraft(userId, chatId, recent);
  }

  const recent = await getRecentMessagesByUserId(userId, 50);
  if (hasActiveSourceInitiatedConversation(recent)) {
    return runPublicationPipelineDraft(userId, chatId, recent);
  }

  return false;
}

async function forceStartSession(userId, chatId, mode = MODE_DAILY) {
  await endActiveSessionForUser(userId);
  drafts.delete(userId);

  const today = new Date().toISOString().slice(0, 10);
  const targetCount = mode === MODE_WEEKLY_INTERVIEW ? 5 : TARGET_QUESTIONS_DAILY;
  await createSession(userId, mode, targetCount, today);

  const openings = MODE_OPENINGS[mode] || MODE_OPENINGS.daily;
  const opener = Array.isArray(openings)
    ? openings[Math.floor(Math.random() * openings.length)]
    : openings[0] || MODE_OPENINGS.daily[0];

  await sendMessageWithEndButton(chatId, opener);
  await insertMessage(userId, 'reporter', opener);

  const session = await getActiveSessionByUserId(userId);
  if (session) await incrementAskedCount(session.id);
}

async function handleDraftAction(userId, chatId, action) {
  const draft = drafts.get(userId);
  if (!draft) {
    await sendMessage(chatId, 'No draft pending.');
    return true;
  }

  if (action === 'preview_discard') {
    drafts.delete(userId);
    await sendMessage(chatId, 'Draft discarded.');
    return true;
  }

  if (action === 'preview_publish') {
    try {
      await createArticle(
        draft.date,
        draft.tier,
        draft.headline,
        draft.body,
        draft.threadId
      );
      drafts.delete(userId);
      const label = TIER_LABELS[draft.tier] || `Tier ${draft.tier}`;
      await sendMessage(chatId, `Published as ${label}: "${draft.headline}"`);
    } catch (err) {
      console.error('Draft publish error:', err);
      await sendMessage(chatId, 'Failed to publish. Please try again.');
    }
    return true;
  }

  return false;
}

module.exports = {
  handleSessionReply,
  handleEndNow,
  handleDraftAction,
  forceStartSession,
  clearDraftForUser,
  hasActiveSourceInitiatedConversation,
  runPublicationPipeline,
  formatOutcomeMessage,
};
