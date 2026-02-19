const {
  validateWebhookSecret,
  extractMessage,
  extractCallbackQuery,
} = require('../src/telegram/webhook');
const {
  countTrailingReporterMessages,
  countReporterQuestionsInCurrentInteraction,
  buildClarifyingQuestionFallback,
} = require('../src/telegram/source-initiated');
const {
  hasActiveSourceInitiatedConversation,
} = require('../src/telegram/session-handler');

describe('webhook validation', () => {
  it('accepts when no secret configured', () => {
    const req = { get: () => undefined };
    expect(validateWebhookSecret(req)).toBe(true);
  });

  it('rejects when secret configured and header missing', () => {
    const config = require('../src/config');
    const orig = config.telegramWebhookSecret;
    config.telegramWebhookSecret = 'my-secret';
    try {
      const req = { get: () => undefined };
      expect(validateWebhookSecret(req)).toBe(false);
    } finally {
      config.telegramWebhookSecret = orig;
    }
  });

  it('accepts when header matches secret', () => {
    const config = require('../src/config');
    const orig = config.telegramWebhookSecret;
    config.telegramWebhookSecret = 'my-secret';
    try {
      const req = { get: (h) => (h === 'X-Telegram-Bot-Api-Secret-Token' ? 'my-secret' : undefined) };
      expect(validateWebhookSecret(req)).toBe(true);
    } finally {
      config.telegramWebhookSecret = orig;
    }
  });
});

describe('payload parsing', () => {
  it('extracts message from valid update', () => {
    const req = {
      body: {
        message: {
          chat: { id: 123 },
          from: { first_name: 'Test' },
          text: 'Hello',
        },
      },
    };
    expect(extractMessage(req)).toEqual({
      chatId: 123,
      from: { first_name: 'Test' },
      text: 'Hello',
    });
  });

  it('returns null when no message', () => {
    expect(extractMessage({ body: {} })).toBeNull();
    expect(extractMessage({ body: { message: null } })).toBeNull();
  });

  it('returns null when message has no text', () => {
    const req = { body: { message: { chat: { id: 1 }, from: {} } } };
    expect(extractMessage(req)).toBeNull();
  });
});

describe('callback query extraction', () => {
  it('extracts end_now callback', () => {
    const req = {
      body: {
        callback_query: {
          id: 'cb-1',
          message: { chat: { id: 456 } },
          from: { first_name: 'User' },
          data: 'end_now',
        },
      },
    };
    expect(extractCallbackQuery(req)).toEqual({
      id: 'cb-1',
      chatId: 456,
      from: { first_name: 'User' },
      data: 'end_now',
    });
  });

  it('returns null when no callback_query', () => {
    expect(extractCallbackQuery({ body: {} })).toBeNull();
  });

  it('extracts preview_publish and start_over callbacks', () => {
    expect(
      extractCallbackQuery({
        body: {
          callback_query: {
            id: 'cb-pub',
            message: { chat: { id: 789 } },
            from: { first_name: 'U' },
            data: 'preview_publish',
          },
        },
      })
    ).toEqual({
      id: 'cb-pub',
      chatId: 789,
      from: { first_name: 'U' },
      data: 'preview_publish',
    });
    expect(
      extractCallbackQuery({
        body: {
          callback_query: {
            id: 'cb-start',
            message: { chat: { id: 111 } },
            from: {},
            data: 'start_over',
          },
        },
      })
    ).toEqual({ id: 'cb-start', chatId: 111, from: {}, data: 'start_over' });
  });

  it('returns null when callback data is not a known action', () => {
    const req = {
      body: {
        callback_query: {
          id: 'cb-1',
          message: { chat: { id: 1 } },
          from: {},
          data: 'other_action',
        },
      },
    };
    expect(extractCallbackQuery(req)).toBeNull();
  });
});

describe('clarifying question cap', () => {
  it('counts trailing reporter messages', () => {
    expect(countTrailingReporterMessages([])).toBe(0);
    expect(countTrailingReporterMessages([{ role: 'user' }])).toBe(0);
    expect(countTrailingReporterMessages([{ role: 'reporter' }])).toBe(1);
    expect(countTrailingReporterMessages([{ role: 'user' }, { role: 'reporter' }, { role: 'reporter' }])).toBe(2);
    expect(countTrailingReporterMessages([{ role: 'reporter' }, { role: 'user' }])).toBe(0);
  });

  it('counts reporter questions in current interaction (alternating pattern)', () => {
    const messages = [
      { role: 'user', content: 'I got promoted' },
      { role: 'reporter', content: 'When did this happen?' },
      { role: 'user', content: 'Yesterday' },
      { role: 'reporter', content: 'How do you feel?' },
      { role: 'user', content: 'Great' },
      { role: 'reporter', content: 'Any other details?' },
    ];
    expect(countReporterQuestionsInCurrentInteraction(messages)).toBe(3);
  });

  it('counts reporter questions until outcome message', () => {
    const messages = [
      { role: 'user', content: 'Old event' },
      { role: 'reporter', content: 'Published as Brief: "Old Story"' },
      { role: 'user', content: 'New event' },
      { role: 'reporter', content: 'When did this happen?' },
      { role: 'user', content: 'Today' },
      { role: 'reporter', content: 'Any details?' },
    ];
    expect(countReporterQuestionsInCurrentInteraction(messages)).toBe(2);
  });

  it('returns 0 when last message is outcome', () => {
    const messages = [
      { role: 'user', content: 'Event' },
      { role: 'reporter', content: 'When?' },
      { role: 'user', content: 'Today' },
      { role: 'reporter', content: 'Not published: insufficient detail' },
    ];
    expect(countReporterQuestionsInCurrentInteraction(messages)).toBe(0);
  });

  it('builds clarifying question for short content', () => {
    expect(buildClarifyingQuestionFallback('hi', [])).toBe(
      'Could you share a bit more context?'
    );
  });

  it('returns null when already asked context', () => {
    const recent = [
      { role: 'user', content: 'x' },
      { role: 'reporter', content: 'Could you share a bit more context?' },
    ];
    expect(buildClarifyingQuestionFallback('hello world', recent)).toBeNull();
  });

  it('asks when for content without temporal cue', () => {
    expect(buildClarifyingQuestionFallback('I got a promotion at work', [])).toBe(
      'When did this happen?'
    );
  });
});

describe('source-initiated conversation state detection', () => {
  it('detects active conversation when last message is reporter question', () => {
    const messages = [
      { role: 'user', content: 'Event' },
      { role: 'reporter', content: 'When did this happen?' },
    ];
    expect(hasActiveSourceInitiatedConversation(messages)).toBe(true);
  });

  it('detects no active conversation when last message is outcome', () => {
    const messages = [
      { role: 'user', content: 'Event' },
      { role: 'reporter', content: 'Published as Brief: "Story"' },
    ];
    expect(hasActiveSourceInitiatedConversation(messages)).toBe(false);
  });

  it('detects no active conversation when last message is user', () => {
    const messages = [
      { role: 'reporter', content: 'Question?' },
      { role: 'user', content: 'Answer' },
    ];
    expect(hasActiveSourceInitiatedConversation(messages)).toBe(false);
  });

  it('detects no active conversation when messages empty', () => {
    expect(hasActiveSourceInitiatedConversation([])).toBe(false);
  });

  it('detects no active conversation for "Not published" outcome', () => {
    const messages = [
      { role: 'user', content: 'Event' },
      { role: 'reporter', content: 'Not published: insufficient substance' },
    ];
    expect(hasActiveSourceInitiatedConversation(messages)).toBe(false);
  });
});
