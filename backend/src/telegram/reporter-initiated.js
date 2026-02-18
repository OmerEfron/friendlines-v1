const { sendMessageWithEndButton } = require('./index');
const { insertMessage } = require('../db/messages');
const {
  createSession,
  hasActiveSessionForDate,
  getActiveSessionByUserIdAndDate,
  incrementAskedCount,
  MODE_DAILY,
} = require('../db/sessions');
const { pool } = require('../db/pool');

const TARGET_QUESTIONS_MIN = 4;
const TARGET_QUESTIONS_MAX = 5;

async function getActiveTelegramChatIds() {
  const r = await pool.query(
    'SELECT id, telegram_chat_id FROM users WHERE telegram_chat_id IS NOT NULL'
  );
  return r.rows.map((row) => ({ userId: row.id, chatId: Number(row.telegram_chat_id) }));
}

function getTargetCount() {
  return Math.floor(
    Math.random() * (TARGET_QUESTIONS_MAX - TARGET_QUESTIONS_MIN + 1)
  ) + TARGET_QUESTIONS_MIN;
}

const SESSION_OPENINGS = [
  'Anything new to report today?',
  'What should we cover?',
  'Any updates worth noting?',
];

async function run() {
  const recipients = await getActiveTelegramChatIds();
  if (recipients.length === 0) return;

  const today = new Date().toISOString().slice(0, 10);

  for (const { chatId, userId } of recipients) {
    const hasSession = await hasActiveSessionForDate(userId, today);
    if (hasSession) continue;

    const targetCount = getTargetCount();
    await createSession(userId, MODE_DAILY, targetCount, today);

    const opener =
      SESSION_OPENINGS[Math.floor(Math.random() * SESSION_OPENINGS.length)];
    await sendMessageWithEndButton(chatId, opener);
    await insertMessage(userId, 'reporter', opener);

    const session = await getActiveSessionByUserIdAndDate(userId, today);
    if (session) await incrementAskedCount(session.id);
  }
}

module.exports = { run, getActiveTelegramChatIds };