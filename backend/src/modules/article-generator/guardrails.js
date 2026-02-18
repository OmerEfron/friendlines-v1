const { getTierRange } = require('./prompts');

const TONE_PATTERNS = {
  clickbait: /\b(you won't believe|shocking|mind.?blowing)\b/i,
  therapy: /\b(how do you feel|it's ok to feel|you should talk|venting)\b/i,
  casual: /\b(lol|omg|btw|tbh|idk|guess what)\b/i,
  exaggeration: /\b(worst ever|best ever|everyone knows|no one ever)\b/i,
};

function countWords(text) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function validateEditorialTone(body) {
  const issues = [];
  const combined = String(body || '');
  for (const [name, pattern] of Object.entries(TONE_PATTERNS)) {
    if (pattern.test(combined)) {
      issues.push(`forbidden tone: ${name}`);
    }
  }
  return { valid: issues.length === 0, issues };
}

function validateStructure(headline, subheadline, body) {
  const issues = [];
  if (!headline || headline.length < 5) {
    issues.push('headline too short');
  }
  if (headline && headline.length > 120) {
    issues.push('headline too long');
  }
  const bodyLen = countWords(body);
  if (bodyLen < 50) {
    issues.push('body insufficient length');
  }
  return { valid: issues.length === 0, issues };
}

function validateArticleOutput(tier, headline, body) {
  const issues = [];
  const structure = validateStructure(headline, null, body);
  issues.push(...structure.issues);
  const tone = validateEditorialTone(body);
  issues.push(...tone.issues);
  const wordCount = countWords(body);
  const { min, max } = getTierRange(tier);
  if (wordCount < min) {
    issues.push(`body ${wordCount} words, minimum ${min}`);
  }
  if (wordCount > max) {
    issues.push(`body ${wordCount} words, maximum ${max}`);
  }
  return { valid: issues.length === 0, issues };
}

module.exports = {
  countWords,
  validateArticleOutput,
  validateEditorialTone,
  validateStructure,
  TONE_PATTERNS,
};
