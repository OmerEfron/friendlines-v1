/**
 * Shared test fixtures for backend tests.
 * Use in unit and integration tests for deterministic data shapes.
 */

const today = () => new Date().toISOString().slice(0, 10);

function fixtureEdition(overrides = {}) {
  return {
    id: 1,
    date: today(),
    topStory: null,
    briefs: [],
    ...overrides,
  };
}

function fixtureArticle(overrides = {}) {
  return {
    id: 1,
    date: today(),
    headline: 'Test headline',
    tier: 1,
    body: 'Test body paragraph.',
    ...overrides,
  };
}

function fixtureEditionPreview(overrides = {}) {
  return {
    id: 1,
    date: today(),
    articleCount: 0,
    topStoryHeadline: null,
    ...overrides,
  };
}

module.exports = {
  today,
  fixtureEdition,
  fixtureArticle,
  fixtureEditionPreview,
};
