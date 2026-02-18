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

async function sendMessage(chatId, text) {
  const client = getBot();
  return client.sendMessage(chatId, text);
}

module.exports = { getBot, sendMessage };
