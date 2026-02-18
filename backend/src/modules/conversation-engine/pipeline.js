const threadManager = require('../thread-manager');
const editorialAnalyzer = require('../editorial-analyzer');
const articleGenerator = require('../article-generator');
const { createArticle } = require('../../db/articles');
const { PROMPT_VERSION: editorialVersion } = require('../editorial-analyzer/prompts');
const { PROMPT_VERSION: articleVersion } = require('../article-generator/prompts');

async function processForPublication({ eventSummary, messageContext }) {
  const thread = await threadManager.createOrGetThread(eventSummary);
  await threadManager.addEvent(thread.id, eventSummary);

  const { tier, shouldPublish, rationale } = await editorialAnalyzer.analyze({
    eventSummary,
    messageContext,
  });

  const logCtx = {
    threadId: thread.id,
    editorialPrompt: editorialVersion,
    tier,
    shouldPublish,
    rationale: (rationale || '').slice(0, 80),
  };
  console.log('[pipeline] editorial:', JSON.stringify(logCtx));

  if (!shouldPublish || !tier) {
    return {
      published: false,
      tier: null,
      rationale: rationale || 'Insufficient substance for publication.',
      articleId: null,
      threadId: thread.id,
      headline: null,
    };
  }

  const { headline, subheadline, body } = await articleGenerator.generate({
    tier,
    eventSummary,
    messageContext,
  });

  const today = new Date().toISOString().slice(0, 10);
  const article = await createArticle(
    today,
    tier,
    headline,
    [subheadline, body].filter(Boolean).join('\n\n'),
    thread.id
  );

  console.log('[pipeline] published:', {
    articleId: article.id,
    articlePrompt: articleVersion,
    tier,
    headline: (headline || '').slice(0, 60),
  });

  return {
    published: true,
    tier,
    rationale: rationale || null,
    articleId: article.id,
    threadId: thread.id,
    headline,
  };
}

module.exports = { processForPublication };
