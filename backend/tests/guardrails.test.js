/**
 * Article generator guardrails tests.
 */
const {
  validateArticleOutput,
  validateEditorialTone,
  validateStructure,
  countWords,
} = require('../src/modules/article-generator/guardrails');

describe('validateEditorialTone', () => {
  it('passes neutral newsroom text', () => {
    const body = 'The decision was announced Monday. Sources declined to comment.';
    expect(validateEditorialTone(body).valid).toBe(true);
  });

  it('flags clickbait patterns', () => {
    const body = 'You won\'t believe what happened next.';
    expect(validateEditorialTone(body).valid).toBe(false);
    expect(validateEditorialTone(body).issues.some((i) => i.includes('clickbait'))).toBe(true);
  });

  it('flags therapy language', () => {
    const body = 'How do you feel about this? Maybe you should talk to someone.';
    expect(validateEditorialTone(body).valid).toBe(false);
    expect(validateEditorialTone(body).issues.some((i) => i.includes('therapy'))).toBe(true);
  });

  it('flags casual language', () => {
    const body = 'So yeah lol he said btw it was crazy.';
    expect(validateEditorialTone(body).valid).toBe(false);
  });
});

describe('validateStructure', () => {
  it('passes valid headline and body', () => {
    const fiftyWords = Array(55).fill('word').join(' ');
    expect(validateStructure('Valid Headline', null, fiftyWords).valid).toBe(true);
  });

  it('flags short headline', () => {
    expect(validateStructure('Hi', null, 'Body text').valid).toBe(false);
  });

  it('flags insufficient body', () => {
    expect(validateStructure('Good Headline', null, 'Short').valid).toBe(false);
  });
});

describe('validateArticleOutput', () => {
  it('validates tier 3 word count', () => {
    const body = Array(90).fill('word').join(' ');
    const r = validateArticleOutput(3, 'Good Headline', body);
    expect(r.valid).toBe(true);
  });

  it('flags tier 3 body too short', () => {
    const r = validateArticleOutput(3, 'Headline', 'Short body.');
    expect(r.valid).toBe(false);
    expect(r.issues.some((i) => i.includes('minimum'))).toBe(true);
  });
});

describe('countWords', () => {
  it('counts words correctly', () => {
    expect(countWords('one two three')).toBe(3);
    expect(countWords('  spaced   words  ')).toBe(2);
    expect(countWords('')).toBe(0);
  });
});
