const request = require('supertest');
const { fixtureEdition, fixtureEditionPreview, fixtureArticle } = require('./helpers/fixtures');

const mockBuildEditionForDate = jest.fn();
const mockListEditionsWithPreview = jest.fn();
const mockGetArticle = jest.fn();

jest.mock('../src/modules/edition-builder', () => ({ buildEditionForDate: (...a) => mockBuildEditionForDate(...a) }));
jest.mock('../src/db/editions', () => ({ listEditionsWithPreview: (...a) => mockListEditionsWithPreview(...a) }));
jest.mock('../src/db/articles', () => ({ getArticle: (...a) => mockGetArticle(...a) }));

const app = require('../src/app');

describe('API routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/health returns 200 and status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  it('GET /api/editions/today returns 200 with edition shape', async () => {
    const edition = fixtureEdition({ topStory: fixtureArticle({ id: 1 }), briefs: [] });
    mockBuildEditionForDate.mockResolvedValue(edition);

    const res = await request(app).get('/api/editions/today');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('date');
    expect(res.body).toHaveProperty('topStory');
    expect(res.body).toHaveProperty('briefs');
    expect(Array.isArray(res.body.briefs)).toBe(true);
  });

  it('GET /api/editions returns 200 with editions array and preview fields', async () => {
    const previews = [fixtureEditionPreview({ articleCount: 2, topStoryHeadline: 'Lead' })];
    mockListEditionsWithPreview.mockResolvedValue(previews);

    const res = await request(app).get('/api/editions');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('editions');
    expect(Array.isArray(res.body.editions)).toBe(true);
    for (const ed of res.body.editions) {
      expect(ed).toHaveProperty('date');
      expect(ed).toHaveProperty('articleCount');
      expect(typeof ed.articleCount).toBe('number');
      expect(ed).toHaveProperty('topStoryHeadline');
    }
  });

  it('GET /api/articles/:id returns 200 when article exists', async () => {
    const article = fixtureArticle({ id: 5 });
    mockGetArticle.mockResolvedValue(article);

    const res = await request(app).get('/api/articles/5');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 5, headline: expect.any(String), body: expect.any(String) });
  });

  it('GET /api/articles/:id returns 404 when article not found', async () => {
    mockGetArticle.mockResolvedValue(null);

    const res = await request(app).get('/api/articles/999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('GET /api/articles/invalid returns 400', async () => {
    const res = await request(app).get('/api/articles/invalid');
    expect(res.status).toBe(400);
  });
});
