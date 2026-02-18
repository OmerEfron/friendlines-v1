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

const SESSION_OPENINGS = [
  'Anything new to report today?',
  'What should we cover?',
  'Any updates worth noting?',
];

const THREAD_PROMPTS = [
  (title) => `Following up: "${title}"—any new developments?`,
  (title) => `Still tracking "${title}". Any progress to add?`,
  (title) => `About "${title}": anything change since we last spoke?`,
];

function buildSessionMessages(openThreads) {
  const count = Math.min(
    MESSAGES_MAX,
    Math.max(MESSAGES_MIN, openThreads.length + 1)
  );
  const messages = [];
  if (openThreads.length === 0) {
    const opener = SESSION_OPENINGS[Math.floor(Math.random() * SESSION_OPENINGS.length)];
    messages.push(opener);
  } else {
    const plural = openThreads.length > 1 ? 's' : '';
    messages.push(`Following up on ${openThreads.length} open thread${plural}.`);
    for (let i = 0; i < Math.min(openThreads.length, count - 1); i++) {
      const thread = openThreads[i];
      const promptFn = THREAD_PROMPTS[i % THREAD_PROMPTS.length];
      messages.push(promptFn(thread.title));
    }
  }
  return messages.slice(0, count);
}

module.exports = { run, getActiveTelegramChatIds, buildSessionMessages };
