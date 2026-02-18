const sourceInitiated = require('./source-initiated');
const { getOrCreateUserByTelegramChatId } = require('../db/users');
const { insertMessage } = require('../db/messages');
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

async function handleWebhook(req, res) {
  if (!validateWebhookSecret(req)) {
    res.status(403).json({ error: 'Invalid webhook secret' });
    return;
  }

  const message = extractMessage(req);
  if (!message) {
    res.sendStatus(200);
    return;
  }

  res.sendStatus(200);

  try {
    const userId = await getOrCreateUserByTelegramChatId(
      message.chatId,
      message.from?.first_name || 'User'
    );
    await insertMessage(userId, 'user', message.text);

    await sourceInitiated.handle({
      userId,
      chatId: message.chatId,
      content: message.text,
      clarifyingCap: CLARIFYING_QUESTION_CAP,
    });
  } catch (err) {
    console.error('Webhook handler error:', err);
  }
}

module.exports = { handleWebhook, validateWebhookSecret, extractMessage };
