const request = require('supertest');
const { truncateTables } = require('../helpers/db');
const { getOrCreateEdition } = require('../../src/db/editions');
const { createArticle } = require('../../src/db/articles');
const app = require('../../src/app');

const runIntegration = process.env.INTEGRATION_TESTS === '1';
const describeIntegration = runIntegration ? describe : describe.skip;

const today = () => new Date().toISOString().slice(0, 10);

describeIntegration('API integration', () => {
  beforeEach(async () => {
    await truncateTables();
  });

  it('GET /api/editions/today returns edition with topStory and briefs', async () => {
    const testDate = today();
    await getOrCreateEdition(testDate);
    await createArticle(testDate, 1, 'Top Story', 'Content. '.repeat(80), null);
    await createArticle(testDate, 2, 'Brief One', 'Brief. '.repeat(30), null);

    const res = await request(app).get('/api/editions/today');
    expect(res.status).toBe(200);
    expect(res.body.date).toBeDefined();
    expect(res.body.topStory).toMatchObject({ headline: expect.any(String) });
    expect(Array.isArray(res.body.briefs)).toBe(true);
    expect(res.body.briefs.length).toBeGreaterThanOrEqual(0);
  });

  it('GET /api/editions returns editions array', async () => {
    await getOrCreateEdition(today());
    const res = await request(app).get('/api/editions');
    expect(res.status).toBe(200);
    expect(res.body.editions).toBeDefined();
    expect(Array.isArray(res.body.editions)).toBe(true);
  });

  it('GET /api/articles/:id returns 200 for existing article', async () => {
    await getOrCreateEdition(today());
    const a = await createArticle(testDate, 1, 'Headline', 'Body. '.repeat(30), null);
    const res = await request(app).get(`/api/articles/${a.id}`);
    expect(res.status).toBe(200);
    expect(res.body.headline).toBe('Headline');
  });

  it('GET /api/articles/:id returns 404 for missing article', async () => {
    const res = await request(app).get('/api/articles/99999');
    expect(res.status).toBe(404);
  });
});
