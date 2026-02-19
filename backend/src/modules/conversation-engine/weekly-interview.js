const { chatCompletion } = require('../../ai/client');
const { getOpenThreads } = require('../thread-manager');
const config = require('../../config');

const TARGET_QUESTIONS = 6;

const OPENING_PROMPT = `You are a journalist conducting a weekly reflective interview with ${config.userName} for a personal news network.
Generate exactly ONE thoughtful question to open the interview. Focus on: highlights of the week, notable decisions, themes that emerged, or ongoing storylines.
Be concise (under 20 words). Professional, warm but not casual. Respond with the question only—no preamble.`;

const FOLLOW_UP_PROMPT = `You are a journalist conducting a weekly reflective interview with ${config.userName}. The interviewee just shared: "{userContent}"

Recent exchange:
{context}

Generate exactly ONE follow-up question to go deeper or shift to a related angle. Concise (under 20 words). Professional tone. Respond with the question only.`;

async function getContinuityContext() {
  const threads = await getOpenThreads();
  const threadTitles = threads.slice(0, 5).map((t) => t.title).join(', ');
  if (!threadTitles) return '';
  return `Open storylines: ${threadTitles}.`;
}

async function generateOpeningQuestion() {
  const continuity = await getContinuityContext();
  const system = continuity
    ? `Context: ${continuity}\n${OPENING_PROMPT}`
    : OPENING_PROMPT;
  const response = await chatCompletion(
    [
      { role: 'system', content: system },
      { role: 'user', content: 'Generate the opening question.' },
    ],
    { temperature: 0.6 }
  );
  const q = response.trim().replace(/^["']|["']$/g, '');
  return q && q.length <= 150 ? q : 'What stood out most this week?';
}

async function generateFollowUpQuestion(userContent, recentMessages) {
  const context = recentMessages
    .slice(-8)
    .map((m) => `[${m.role}]: ${m.content}`)
    .join('\n');
  const prompt = FOLLOW_UP_PROMPT.replace('{userContent}', userContent).replace(
    '{context}',
    context || '(none)'
  );
  const response = await chatCompletion(
    [
      { role: 'system', content: 'You respond with a single question only.' },
      { role: 'user', content: prompt },
    ],
    { temperature: 0.5 }
  );
  const q = response.trim().replace(/^["']|["']$/g, '');
  return q && q.length <= 150 ? q : 'Anything else worth reflecting on?';
}

module.exports = {
  TARGET_QUESTIONS,
  generateOpeningQuestion,
  generateFollowUpQuestion,
};
