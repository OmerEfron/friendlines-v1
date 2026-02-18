/**
 * Thread manager tests.
 */
const { normalizeTitle } = require('../src/modules/thread-manager');

describe('normalizeTitle', () => {
  it('uses first sentence and truncates when over limit', () => {
    const long = 'This is a very long title that definitely exceeds the maximum allowed character limit of eighty. And more text.';
    const result = normalizeTitle(long);
    expect(result.length).toBeLessThanOrEqual(80);
    expect(result.endsWith('...')).toBe(true);
  });

  it('normalizes whitespace', () => {
    expect(normalizeTitle('  many   spaces  ')).toBe('many spaces');
  });

  it('returns Untitled for empty input', () => {
    expect(normalizeTitle('')).toBe('Untitled');
    expect(normalizeTitle('   ')).toBe('Untitled');
    expect(normalizeTitle(null)).toBe('Untitled');
  });

  it('uses first sentence before period', () => {
    expect(normalizeTitle('First sentence. Second sentence.')).toBe('First sentence');
  });

  it('keeps short titles intact', () => {
    expect(normalizeTitle('Short title')).toBe('Short title');
  });
});
