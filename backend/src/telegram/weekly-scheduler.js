const { getActiveTelegramChatIds } = require('./reporter-initiated');
const { startForUser } = require('./weekly-initiated');
const { getActiveSessionByUserId } = require('../db/sessions');

async function run() {
  const recipients = await getActiveTelegramChatIds();
  if (recipients.length === 0) return;

  for (const { chatId, userId } of recipients) {
    const active = await getActiveSessionByUserId(userId);
    if (active) continue;

    try {
      await startForUser(userId, chatId);
    } catch (err) {
      console.error('Weekly interview start failed for user', userId, err);
    }
  }
}

module.exports = { run };
