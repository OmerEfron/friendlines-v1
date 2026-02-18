const { sendMessage } = require('./index');
const { insertMessage } = require('../db/messages');
const { getOpenThreads } = require('../modules/thread-manager');
const { pool } = require('../db/pool');

const MESSAGES_MIN = 2;
const MESSAGES_MAX = 5;

async function getActiveTelegramChatIds() {
  const r = await pool.query(
    'SELECT id, telegram_chat_id FROM users WHERE telegram_chat_id IS NOT NULL'
  );
  return r.rows.map((row) => ({ userId: row.id, chatId: Number(row.telegram_chat_id) }));
}

async function run() {
  const recipients = await getActiveTelegramChatIds();
  if (recipients.length === 0) return;

  const openThreads = await getOpenThreads();
  const messages = buildSessionMessages(openThreads);

  for (const { chatId, userId } of recipients) {
    for (const text of messages) {
      await sendMessage(chatId, text);
      await insertMessage(userId, 'reporter', text);
    }
  }
}

function buildSessionMessages(openThreads) {
  const count = Math.min(
    MESSAGES_MAX,
    Math.max(MESSAGES_MIN, openThreads.length + 1)
  );
  const messages = [];
  if (openThreads.length === 0) {
    messages.push('Good morning. Anything new to report today?');
  } else {
    messages.push(`Following up on ${openThreads.length} open thread(s).`);
    for (let i = 0; i < Math.min(openThreads.length, count - 1); i++) {
      messages.push(`About "${openThreads[i].title}": any developments?`);
    }
  }
  return messages.slice(0, count);
}

module.exports = { run, getActiveTelegramChatIds, buildSessionMessages };
