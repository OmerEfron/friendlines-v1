const { truncateTables } = require('../helpers/db');
const {
  getOrCreateEdition,
  listEditions,
  listEditionsWithPreview,
  getEditionByDate,
} = require('../../src/db/editions');
const { createArticle } = require('../../src/db/articles');

const runIntegration = process.env.INTEGRATION_TESTS === '1';
const describeIntegration = runIntegration ? describe : describe.skip;

describeIntegration('DB editions integration', () => {
  const testDate = '2025-02-19';

  beforeEach(async () => {
    await truncateTables();
  });

  it('getOrCreateEdition creates and returns edition', async () => {
    const ed = await getOrCreateEdition(testDate);
    expect(ed).toBeDefined();
    expect(ed.date).toBe(testDate);
    expect(ed.id).toBeDefined();
  });

  it('getOrCreateEdition returns existing on conflict', async () => {
    const a = await getOrCreateEdition(testDate);
    const b = await getOrCreateEdition(testDate);
    expect(a.id).toBe(b.id);
  });

  it('listEditions returns editions desc by date', async () => {
    await getOrCreateEdition('2025-02-18');
    await getOrCreateEdition('2025-02-19');
    const list = await listEditions(10);
    expect(list.length).toBe(2);
    expect(list[0].date).toBe('2025-02-19');
  });

  it('listEditionsWithPreview includes articleCount and topStoryHeadline', async () => {
    const ed = await getOrCreateEdition(testDate);
    await createArticle(testDate, 1, 'Lead Story', 'Body content here. '.repeat(20), null);
    await createArticle(testDate, 2, 'Brief', 'Brief body. '.repeat(10), null);
    const list = await listEditionsWithPreview(10);
    expect(list.length).toBe(1);
    expect(list[0].articleCount).toBe(2);
    expect(list[0].topStoryHeadline).toBe('Lead Story');
  });
});
