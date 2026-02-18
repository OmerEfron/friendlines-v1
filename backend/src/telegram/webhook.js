const sourceInitiated = require('./source-initiated');
const sessionHandler = require('./session-handler');
const weeklyInitiated = require('./weekly-initiated');
const { getOrCreateUserByTelegramChatId, getUserIdByTelegramChatId } = require('../db/users');
const { insertMessage } = require('../db/messages');
const { answerCallbackQuery } = require('./index');
const config = require('../config');

const CLARIFYING_QUESTION_CAP = 3;

function validateWebhookSecret(req) {
  if (!config.telegramWebhookSecret) return true;
  const token = req.get('X-Telegram-Bot-Api-Secret-Token');
  return token === config.telegramWebhookSecret;
}

function extractMessage(req) {
  const update = req.body;
  if (!update || !update.message) return null;
  const msg = update.message;
  const text = msg.text || msg.caption || '';
  if (!text.trim()) return null;
  return {
    chatId: msg.chat?.id,
    from: msg.from,
    text: text.trim(),
  };
}

function extractCallbackQuery(req) {
  const update = req.body;
  if (!update || !update.callback_query) return null;
  const q = update.callback_query;
  if (q.data !== 'end_now') return null;
  return {
    id: q.id,
    chatId: q.message?.chat?.id,
    from: q.from,
  };
}

async function handleCallbackQuery(callback) {
  try {
    await answerCallbackQuery(callback.id, { text: 'Ending conversation...' });
    let userId = await getUserIdByTelegramChatId(callback.chatId);
    if (!userId && callback.from) {
      userId = await getOrCreateUserByTelegramChatId(
        callback.chatId,
        callback.from.first_name || 'User'
      );
    }
    if (!userId) return;

    const handled = await sessionHandler.handleEndNow({
      userId,
      chatId: callback.chatId,
    });
    if (!handled) {
      const { sendMessage } = require('./index');
      await sendMessage(callback.chatId, 'No active conversation to end.');
    }
  } catch (err) {
    console.error('Callback query handler error:', err);
  }
}

async function handleMessage(message) {
  const userId = await getOrCreateUserByTelegramChatId(
    message.chatId,
    message.from?.first_name || 'User'
  );

  const text = message.text.trim();
  if (text === '/weekly_interview' || text === '/weekly') {
    await weeklyInitiated.startForUser(userId, message.chatId);
    return;
  }

  await insertMessage(userId, 'user', text);

  const sessionHandled = await sessionHandler.handleSessionReply({
    userId,
    chatId: message.chatId,
    content: text,
  });
  if (sessionHandled) return;

  await sourceInitiated.handle({
    userId,
    chatId: message.chatId,
    content: message.text,
    clarifyingCap: CLARIFYING_QUESTION_CAP,
  });
}

async function handleWebhook(req, res) {
  if (!validateWebhookSecret(req)) {
    res.status(403).json({ error: 'Invalid webhook secret' });
    return;
  }

  const callback = extractCallbackQuery(req);
  if (callback) {
    res.sendStatus(200);
    handleCallbackQuery(callback);
    return;
  }

  const message = extractMessage(req);
  if (!message) {
    res.sendStatus(200);
    return;
  }

  res.sendStatus(200);

  try {
    await handleMessage(message);
  } catch (err) {
    console.error('Webhook handler error:', err);
  }
}

module.exports = {
  handleWebhook,
  validateWebhookSecret,
  extractMessage,
  extractCallbackQuery,
};
