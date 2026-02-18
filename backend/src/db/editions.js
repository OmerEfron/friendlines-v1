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

module.exports = { getOrCreateEdition, getEditionByDate, listEditions };
