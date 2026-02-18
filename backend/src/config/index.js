/**
 * Environment configuration for FriendLines backend.
 */
module.exports = {
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL || 'postgres://localhost:5432/friendlines',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  telegramWebhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET,
  openaiApiKey: process.env.OPENAI_API_KEY,
  frontendUrl: process.env.FRONTEND_URL,
};
