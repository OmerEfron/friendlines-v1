const threadsDb = require('../../db/threads');
const eventsDb = require('../../db/events');

async function createOrGetThread(title, importanceScore = null) {
  const existing = await threadsDb.getOpenThreads();
  const match = existing.find(
    (t) => t.title.toLowerCase() === title.toLowerCase()
  );
  if (match) {
    if (importanceScore != null) {
      return threadsDb.updateThread(match.id, { importance_score: importanceScore });
    }
    return match;
  }
  return threadsDb.createThread(title, importanceScore);
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
  getOpenThreads: threadsDb.getOpenThreads,
  getThread: threadsDb.getThread,
  getEventsByThreadId: eventsDb.getEventsByThreadId,
};
