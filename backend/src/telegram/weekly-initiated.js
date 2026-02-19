const { sendMessageWithEndButton } = require('./index');
const { insertMessage } = require('../db/messages');
const {
  createSession,
  getActiveSessionByUserId,
  incrementAskedCount,
  endActiveSessionForUser,
  MODE_WEEKLY_INTERVIEW,
} = require('../db/sessions');
const { generateOpeningQuestion } = require('../modules/conversation-engine/weekly-interview');
const { TARGET_QUESTIONS } = require('../modules/conversation-engine/weekly-interview');

async function startForUser(userId, chatId) {
  await endActiveSessionForUser(userId);

  const today = new Date().toISOString().slice(0, 10);
  const session = await createSession(userId, MODE_WEEKLY_INTERVIEW, TARGET_QUESTIONS, today);

  let opener;
  try {
    opener = await generateOpeningQuestion();
  } catch (err) {
    console.warn('Weekly opening question failed:', err.message);
    opener = 'What stood out most this week?';
  }

  await sendMessageWithEndButton(chatId, opener);
  await insertMessage(userId, 'reporter', opener);
  await incrementAskedCount(session.id);
}

module.exports = { startForUser };
