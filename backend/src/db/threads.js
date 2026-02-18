const { pool } = require('./pool');

async function createThread(title, importanceScore = null) {
  const r = await pool.query(
    'INSERT INTO threads (title, status, importance_score) VALUES ($1, $2, $3) RETURNING id, title, status, importance_score, created_at',
    [title, 'open', importanceScore]
  );
  return r.rows[0];
}

async function getThread(id) {
  const r = await pool.query(
    'SELECT id, title, status, importance_score, created_at FROM threads WHERE id = $1',
    [id]
  );
  return r.rows[0] || null;
}

async function getOpenThreads() {
  const r = await pool.query(
    'SELECT id, title, status, importance_score, created_at FROM threads WHERE status = $1 ORDER BY importance_score DESC NULLS LAST',
    ['open']
  );
  return r.rows;
}

async function updateThread(id, updates) {
  const set = [];
  const values = [];
  let i = 1;
  if (updates.status !== undefined) {
    set.push(`status = $${i++}`);
    values.push(updates.status);
  }
  if (updates.importance_score !== undefined) {
    set.push(`importance_score = $${i++}`);
    values.push(updates.importance_score);
  }
  if (set.length === 0) return getThread(id);
  values.push(id);
  await pool.query(
    `UPDATE threads SET ${set.join(', ')} WHERE id = $${i}`,
    values
  );
  return getThread(id);
}

module.exports = {
  createThread,
  getThread,
  getOpenThreads,
  updateThread,
};
