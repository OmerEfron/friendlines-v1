const { getTierRange } = require('./prompts');

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function validateArticleOutput(tier, headline, body) {
  const issues = [];
  if (!headline || headline.length < 5) {
    issues.push('headline too short');
  }
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

module.exports = { countWords, validateArticleOutput };
