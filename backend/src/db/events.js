const { pool } = require('./pool');

async function createEvent(threadId, summary, sentiment = null, significanceScore = null) {
  const r = await pool.query(
    'INSERT INTO events (thread_id, summary, sentiment, significance_score) VALUES ($1, $2, $3, $4) RETURNING id, thread_id, summary, sentiment, significance_score',
    [threadId, summary, sentiment, significanceScore]
  );
  return r.rows[0];
}

async function getEventsByThreadId(threadId) {
  const r = await pool.query(
    'SELECT id, thread_id, summary, sentiment, significance_score FROM events WHERE thread_id = $1 ORDER BY id',
    [threadId]
  );
  return r.rows;
}

module.exports = { createEvent, getEventsByThreadId };
