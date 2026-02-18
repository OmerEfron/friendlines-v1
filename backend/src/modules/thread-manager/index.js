const threadsDb = require('../../db/threads');
const eventsDb = require('../../db/events');

const MAX_TITLE_LENGTH = 80;

function normalizeTitle(raw) {
  if (!raw || typeof raw !== 'string') return 'Untitled';
  const trimmed = raw.trim().replace(/\s+/g, ' ');
  if (!trimmed) return 'Untitled';
  const firstSentence = trimmed.split(/[.!?]/)[0].trim() || trimmed;
  const truncated =
    firstSentence.length > MAX_TITLE_LENGTH
      ? firstSentence.slice(0, MAX_TITLE_LENGTH - 3) + '...'
      : firstSentence;
  return truncated || 'Untitled';
}

async function createOrGetThread(title, importanceScore = null) {
  const normalized = normalizeTitle(title);
  const existing = await threadsDb.getOpenThreads();
  const match = existing.find(
    (t) => t.title.toLowerCase() === normalized.toLowerCase()
  );
  if (match) {
    if (importanceScore != null) {
      return threadsDb.updateThread(match.id, {
        importance_score: importanceScore,
      });
    }
    return match;
  }
  return threadsDb.createThread(normalized, importanceScore);
}

async function addEvent(threadId, summary, sentiment = null, significanceScore = null) {
  return eventsDb.createEvent(threadId, summary, sentiment, significanceScore);
}

async function closeThread(threadId) {
  return threadsDb.updateThread(threadId, { status: 'closed' });
}

async function updateImportance(threadId, score) {
  return threadsDb.updateThread(threadId, { importance_score: score });
}

module.exports = {
  createOrGetThread,
  addEvent,
  closeThread,
  updateImportance,
  normalizeTitle,
  getOpenThreads: threadsDb.getOpenThreads,
  getThread: threadsDb.getThread,
  getEventsByThreadId: eventsDb.getEventsByThreadId,
};
