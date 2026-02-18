const threadManager = require('../thread-manager');
const editorialAnalyzer = require('../editorial-analyzer');
const articleGenerator = require('../article-generator');
const { createArticle } = require('../../db/articles');

async function processForPublication({ eventSummary, messageContext }) {
  const thread = await threadManager.createOrGetThread(eventSummary);
  await threadManager.addEvent(thread.id, eventSummary);

  const { tier, shouldPublish } = await editorialAnalyzer.analyze({
    eventSummary,
    messageContext,
  });

  if (!shouldPublish || !tier) {
    return { published: false, threadId: thread.id };
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

  return { published: true, articleId: article.id, threadId: thread.id };
}

module.exports = { processForPublication };
