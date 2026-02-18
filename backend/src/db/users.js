const { pool } = require('./pool');

async function getOrCreateUserByTelegramChatId(telegramChatId, name = 'User') {
  const existing = await pool.query(
    'SELECT id FROM users WHERE telegram_chat_id = $1',
    [String(telegramChatId)]
  );
  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }
  const insert = await pool.query(
    'INSERT INTO users (name, telegram_chat_id) VALUES ($1, $2) RETURNING id',
    [name, String(telegramChatId)]
  );
  return insert.rows[0].id;
}

async function getUserIdByTelegramChatId(telegramChatId) {
  const r = await pool.query(
    'SELECT id FROM users WHERE telegram_chat_id = $1',
    [String(telegramChatId)]
  );
  return r.rows.length > 0 ? r.rows[0].id : null;
}

module.exports = { getOrCreateUserByTelegramChatId, getUserIdByTelegramChatId };
