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

const CALLBACK_ACTIONS = ['end_now', 'start_over', 'preview_publish', 'preview_discard'];

function extractCallbackQuery(req) {
  const update = req.body;
  if (!update || !update.callback_query) return null;
  const q = update.callback_query;
  if (!CALLBACK_ACTIONS.includes(q.data)) return null;
  return {
    id: q.id,
    chatId: q.message?.chat?.id,
    from: q.from,
    data: q.data,
  };
}

async function handleCallbackQuery(callback) {
  const { sendMessage } = require('./index');
  try {
    let userId = await getUserIdByTelegramChatId(callback.chatId);
    if (!userId && callback.from) {
      userId = await getOrCreateUserByTelegramChatId(
        callback.chatId,
        callback.from.first_name || 'User'
      );
    }
    if (!userId) return;

    if (callback.data === 'preview_publish' || callback.data === 'preview_discard') {
      await answerCallbackQuery(callback.id, { text: 'Processing...' });
      await sessionHandler.handleDraftAction(userId, callback.chatId, callback.data);
      return;
    }

    if (callback.data === 'start_over') {
      await answerCallbackQuery(callback.id, { text: 'Starting fresh...' });
      await sessionHandler.forceStartSession(userId, callback.chatId, 'daily');
      return;
    }

    await answerCallbackQuery(callback.id, { text: 'Ending conversation...' });
    const handled = await sessionHandler.handleEndNow({
      userId,
      chatId: callback.chatId,
    });
    if (!handled) {
      await sendMessage(callback.chatId, 'No active conversation to end.');
    }
  } catch (err) {
    console.error('Callback query handler error:', err);
  }
}

const MODE_COMMANDS = {
  '/start': 'daily',
  '/reset': 'daily',
  '/breaking': 'breaking',
  '/leak': 'leak',
  '/gossip': 'gossip',
};

async function handleMessage(message) {
  const userId = await getOrCreateUserByTelegramChatId(
    message.chatId,
    message.from?.first_name || 'User'
  );

  const text = message.text.trim();
  if (text === '/weekly_interview' || text === '/weekly' || text === '/interview') {
    sessionHandler.clearDraftForUser(userId);
    await weeklyInitiated.startForUser(userId, message.chatId);
    return;
  }

  const mode = MODE_COMMANDS[text];
  if (mode) {
    await sessionHandler.forceStartSession(userId, message.chatId, mode);
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
