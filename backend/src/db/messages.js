const { pool } = require('./pool');

async function insertMessage(userId, role, content) {
  const r = await pool.query(
    'INSERT INTO messages (user_id, role, content) VALUES ($1, $2, $3) RETURNING id, timestamp',
    [userId, role, content]
  );
  return r.rows[0];
}

async function getRecentMessagesByUserId(userId, limit = 20) {
  const r = await pool.query(
    'SELECT id, role, content, timestamp FROM messages WHERE user_id = $1 ORDER BY timestamp DESC LIMIT $2',
    [userId, limit]
  );
  return r.rows.reverse();
}

async function countClarifyingQuestionsInSession(userId, sinceTimestamp) {
  const r = await pool.query(
    'SELECT COUNT(*)::int as c FROM messages WHERE user_id = $1 AND role = $2 AND timestamp >= $3',
    [userId, 'reporter', sinceTimestamp]
  );
  return r.rows[0].c;
}

module.exports = {
  insertMessage,
  getRecentMessagesByUserId,
  countClarifyingQuestionsInSession,
};
