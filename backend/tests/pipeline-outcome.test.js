/**
 * Outcome feedback and pipeline contract tests.
 */
const { formatOutcomeMessage } = require('../src/telegram/source-initiated');

describe('formatOutcomeMessage', () => {
  it('formats published outcome with tier and headline', () => {
    const result = formatOutcomeMessage({
      published: true,
      tier: 1,
      headline: 'Test Headline',
    });
    expect(result).toContain('Published');
    expect(result).toContain('Feature');
    expect(result).toContain('Test Headline');
  });

  it('formats not-published outcome with rationale', () => {
    const result = formatOutcomeMessage({
      published: false,
      rationale: 'Insufficient substance.',
    });
    expect(result).toContain('Not published');
    expect(result).toContain('Insufficient substance');
  });

  it('handles tier 2 and 3 labels', () => {
    expect(formatOutcomeMessage({ published: true, tier: 2, headline: 'H' })).toContain('Main');
    expect(formatOutcomeMessage({ published: true, tier: 3, headline: 'H' })).toContain('Brief');
  });
});
