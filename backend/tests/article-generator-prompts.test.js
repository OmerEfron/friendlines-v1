const { getTierRange, buildArticlePrompt } = require('../src/modules/article-generator/prompts');

describe('getTierRange', () => {
  it('returns tier 1 range 600-900', () => {
    expect(getTierRange(1)).toEqual({ min: 600, max: 900 });
  });

  it('returns tier 2 range 300-500', () => {
    expect(getTierRange(2)).toEqual({ min: 300, max: 500 });
  });

  it('returns tier 3 range 80-180', () => {
    expect(getTierRange(3)).toEqual({ min: 80, max: 180 });
  });

  it('throws for invalid tier', () => {
    expect(() => getTierRange(0)).toThrow(/Invalid tier/);
    expect(() => getTierRange(4)).toThrow(/Invalid tier/);
  });
});

describe('buildArticlePrompt', () => {
  it('includes tier word range in prompt', () => {
    const p = buildArticlePrompt(1, 'Event summary', []);
    expect(p).toContain('600');
    expect(p).toContain('900');
  });

  it('includes event summary and message context', () => {
    const p = buildArticlePrompt(2, 'Meeting at noon', [{ role: 'user', content: 'Yes' }]);
    expect(p).toContain('Meeting at noon');
    expect(p).toContain('[user]: Yes');
  });

  it('uses last 10 messages for context', () => {
    const msgs = Array(15)
      .fill(0)
      .map((_, i) => ({ role: 'user', content: `m${i}` }));
    const p = buildArticlePrompt(3, 'e', msgs);
    expect(p).not.toContain('m0');
    expect(p).toContain('m14');
  });
});
