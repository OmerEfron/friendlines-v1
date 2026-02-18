const TelegramBot = require('node-telegram-bot-api');
const config = require('../config');

let bot = null;

function getBot() {
  if (!config.telegramBotToken) {
    throw new Error('TELEGRAM_BOT_TOKEN not configured');
  }
  if (!bot) {
    bot = new TelegramBot(config.telegramBotToken, { polling: false });
  }
  return bot;
}

async function sendMessage(chatId, text, options = {}) {
  const client = getBot();
  return client.sendMessage(chatId, text, options);
}

const END_NOW_BUTTON = {
  reply_markup: {
    inline_keyboard: [[{ text: 'End now', callback_data: 'end_now' }]],
  },
};

async function sendMessageWithEndButton(chatId, text) {
  return sendMessage(chatId, text, END_NOW_BUTTON);
}

async function sendChatAction(chatId, action = 'typing') {
  const client = getBot();
  return client.sendChatAction(chatId, action);
}

async function answerCallbackQuery(callbackQueryId, options = {}) {
  const client = getBot();
  return client.answerCallbackQuery(callbackQueryId, options);
}

module.exports = {
  getBot,
  sendMessage,
  sendMessageWithEndButton,
  sendChatAction,
  answerCallbackQuery,
};
