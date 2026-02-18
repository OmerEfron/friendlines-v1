const { validateWebhookSecret, extractMessage } = require('../src/telegram/webhook');
const {
  countTrailingReporterMessages,
  buildClarifyingQuestionFallback,
} = require('../src/telegram/source-initiated');

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

describe('clarifying question cap', () => {
  it('counts trailing reporter messages', () => {
    expect(countTrailingReporterMessages([])).toBe(0);
    expect(countTrailingReporterMessages([{ role: 'user' }])).toBe(0);
    expect(countTrailingReporterMessages([{ role: 'reporter' }])).toBe(1);
    expect(countTrailingReporterMessages([{ role: 'user' }, { role: 'reporter' }, { role: 'reporter' }])).toBe(2);
    expect(countTrailingReporterMessages([{ role: 'reporter' }, { role: 'user' }])).toBe(0);
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
