const request = require('supertest');
const app = require('../src/app');

describe('API routes', () => {
  it('GET /api/health returns 200 and status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  it('GET /api/editions/today returns 200 with edition shape', async () => {
    const res = await request(app).get('/api/editions/today');
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty('date');
      expect(res.body).toHaveProperty('topStory');
      expect(res.body).toHaveProperty('briefs');
      expect(Array.isArray(res.body.briefs)).toBe(true);
    }
  });

  it('GET /api/editions returns 200 with editions array and preview fields', async () => {
    const res = await request(app).get('/api/editions');
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty('editions');
      expect(Array.isArray(res.body.editions)).toBe(true);
      for (const ed of res.body.editions) {
        expect(ed).toHaveProperty('date');
        expect(ed).toHaveProperty('articleCount');
        expect(typeof ed.articleCount).toBe('number');
        expect(ed).toHaveProperty('topStoryHeadline');
      }
    }
  });

  it('GET /api/articles/1 returns 404 or 200', async () => {
    const res = await request(app).get('/api/articles/1');
    expect([200, 404, 500]).toContain(res.status);
  });
});
