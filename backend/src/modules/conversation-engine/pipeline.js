const threadManager = require('../thread-manager');
const editorialAnalyzer = require('../editorial-analyzer');
const articleGenerator = require('../article-generator');
const { createArticle } = require('../../db/articles');
const { PROMPT_VERSION: editorialVersion } = require('../editorial-analyzer/prompts');
const { PROMPT_VERSION: articleVersion } = require('../article-generator/prompts');

const DEFAULT_FORCE_TIER = 3;

async function processForPublication({ eventSummary, messageContext, forcePublish = false, draftOnly = false } = {}) {
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
    forcePublish,
  };
  console.log('[pipeline] editorial:', JSON.stringify(logCtx));

  let effectiveTier = tier;
  let effectivePublish = shouldPublish;

  if (forcePublish && (!shouldPublish || !tier)) {
    effectiveTier = DEFAULT_FORCE_TIER;
    effectivePublish = true;
    console.log('[pipeline] forcePublish override: tier=', effectiveTier);
  }

  if (!effectivePublish || !effectiveTier) {
    return {
      published: false,
      tier: null,
      rationale: rationale || 'Insufficient substance for publication.',
      articleId: null,
      threadId: thread.id,
      headline: null,
      body: null,
      subheadline: null,
    };
  }

  const { headline, subheadline, body } = await articleGenerator.generate({
    tier: effectiveTier,
    eventSummary,
    messageContext,
  });

  if (draftOnly) {
    return {
      published: false,
      tier: effectiveTier,
      rationale: rationale || null,
      articleId: null,
      threadId: thread.id,
      headline,
      subheadline,
      body: [subheadline, body].filter(Boolean).join('\n\n'),
      draftOnly: true,
    };
  }

  const today = new Date().toISOString().slice(0, 10);
  const article = await createArticle(
    today,
    effectiveTier,
    headline,
    [subheadline, body].filter(Boolean).join('\n\n'),
    thread.id
  );

  console.log('[pipeline] published:', {
    articleId: article.id,
    articlePrompt: articleVersion,
    tier: effectiveTier,
    headline: (headline || '').slice(0, 60),
  });

  return {
    published: true,
    tier: effectiveTier,
    rationale: rationale || null,
    articleId: article.id,
    threadId: thread.id,
    headline,
  };
}

module.exports = { processForPublication };
