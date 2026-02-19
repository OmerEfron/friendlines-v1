const { sendMessageWithStartOverButton } = require('./index');
const { insertMessage, getLastUserMessageTimestamp } = require('../db/messages');
const { getActiveSessionByUserId } = require('../db/sessions');
const { pool } = require('../db/pool');

const COOLDOWN_HOURS_MS = 3 * 60 * 60 * 1000;
const PROMPT = 'Anything to report lately?';

async function getActiveTelegramChatIds() {
  const r = await pool.query(
    'SELECT id, telegram_chat_id FROM users WHERE telegram_chat_id IS NOT NULL'
  );
  return r.rows.map((row) => ({ userId: row.id, chatId: Number(row.telegram_chat_id) }));
}

async function run() {
  const recipients = await getActiveTelegramChatIds();
  if (recipients.length === 0) return;

  const now = Date.now();

  for (const { chatId, userId } of recipients) {
    const activeSession = await getActiveSessionByUserId(userId);
    if (activeSession) continue;

    const lastUserMsg = await getLastUserMessageTimestamp(userId);
    if (lastUserMsg) {
      const elapsed = now - new Date(lastUserMsg).getTime();
      if (elapsed < COOLDOWN_HOURS_MS) continue;
    }

    try {
      await sendMessageWithStartOverButton(chatId, PROMPT);
      await insertMessage(userId, 'reporter', PROMPT);
    } catch (err) {
      console.error('Reporter prompt failed for user', userId, err);
    }
  }
}

module.exports = { run, getActiveTelegramChatIds };