const { pool } = require('./pool');

async function createArticle(date, tier, headline, body, relatedThreadId = null) {
  const r = await pool.query(
    'INSERT INTO articles (date, tier, headline, body, related_thread_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, date, tier, headline, body, related_thread_id',
    [date, tier, headline, body, relatedThreadId]
  );
  return r.rows[0];
}

async function getArticle(id) {
  const r = await pool.query(
    'SELECT id, date, tier, headline, body, related_thread_id FROM articles WHERE id = $1',
    [id]
  );
  return r.rows[0] || null;
}

async function getArticlesByDate(date) {
  const r = await pool.query(
    'SELECT id, date, tier, headline, body, related_thread_id FROM articles WHERE date = $1 ORDER BY tier ASC',
    [date]
  );
  return r.rows;
}

module.exports = { createArticle, getArticle, getArticlesByDate };
