const { truncateTables } = require('../helpers/db');
const { getOrCreateEdition } = require('../../src/db/editions');
const {
  createArticle,
  getArticle,
  getArticlesByDate,
} = require('../../src/db/articles');

const runIntegration = process.env.INTEGRATION_TESTS === '1';
const describeIntegration = runIntegration ? describe : describe.skip;

describeIntegration('DB articles integration', () => {
  const testDate = '2025-02-19';

  beforeEach(async () => {
    await truncateTables();
  });

  it('createArticle and getArticle roundtrip', async () => {
    await getOrCreateEdition(testDate);
    const created = await createArticle(testDate, 1, 'Headline', 'Body text. '.repeat(10), null);
    expect(created.id).toBeDefined();
    expect(created.headline).toBe('Headline');

    const found = await getArticle(created.id);
    expect(found.headline).toBe('Headline');
    expect(found.tier).toBe(1);
  });

  it('getArticlesByDate returns articles ordered by tier', async () => {
    await getOrCreateEdition(testDate);
    await createArticle(testDate, 3, 'Brief', 'Brief. '.repeat(15), null);
    await createArticle(testDate, 1, 'Lead', 'Lead. '.repeat(100), null);
    const list = await getArticlesByDate(testDate);
    expect(list.length).toBe(2);
    expect(list[0].tier).toBe(1);
    expect(list[1].tier).toBe(3);
  });

  it('getArticle returns null for missing id', async () => {
    const found = await getArticle(99999);
    expect(found).toBeNull();
  });
});
