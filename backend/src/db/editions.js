const { pool } = require('./pool');

async function getOrCreateEdition(date) {
  const r = await pool.query(
    'INSERT INTO editions (date) VALUES ($1) ON CONFLICT (date) DO NOTHING RETURNING id, date',
    [date]
  );
  if (r.rows.length > 0) return r.rows[0];
  const sel = await pool.query('SELECT id, date FROM editions WHERE date = $1', [date]);
  return sel.rows[0];
}

async function getEditionByDate(date) {
  const r = await pool.query('SELECT id, date FROM editions WHERE date = $1', [date]);
  return r.rows[0] || null;
}

async function listEditions(limit = 30) {
  const r = await pool.query(
    'SELECT id, date FROM editions ORDER BY date DESC LIMIT $1',
    [limit]
  );
  return r.rows;
}

async function listEditionsWithPreview(limit = 30) {
  const editions = await listEditions(limit);
  const results = [];
  for (const ed of editions) {
    const articles = await pool.query(
      'SELECT id, headline, tier FROM articles WHERE date = $1 ORDER BY tier ASC',
      [ed.date]
    );
    const rows = articles.rows;
    const topStory = rows[0] || null;
    results.push({
      id: ed.id,
      date: ed.date,
      articleCount: rows.length,
      topStoryHeadline: topStory?.headline || null,
    });
  }
  return results;
}

module.exports = {
  getOrCreateEdition,
  getEditionByDate,
  listEditions,
  listEditionsWithPreview,
};
