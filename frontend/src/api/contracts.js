/**
 * API request contracts - placeholder.
 * No actual fetch logic. Defines expected endpoints and payload shapes.
 *
 * GET /api/health -> { status: 'ok' }
 * GET /api/editions/today -> { date, topStory, briefs, developingStories }
 * GET /api/editions/:date -> edition
 * GET /api/articles/:id -> { id, date, tier, headline, body, relatedThreadId }
 */

export const API_ENDPOINTS = {
  health: '/api/health',
  editionToday: '/api/editions/today',
  edition: (date) => `/api/editions/${date}`,
  article: (id) => `/api/articles/${id}`,
};
