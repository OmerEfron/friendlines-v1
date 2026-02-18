const { getOrCreateEdition } = require('../../db/editions');
const { getArticlesByDate } = require('../../db/articles');

async function buildEditionForDate(date) {
  const edition = await getOrCreateEdition(date);
  const articles = await getArticlesByDate(date);
  const sorted = [...articles].sort((a, b) => a.tier - b.tier);
  const topStory = sorted[0] || null;
  const briefs = sorted.slice(1);
  return {
    id: edition.id,
    date: edition.date,
    topStory,
    briefs,
  };
}

module.exports = { buildEditionForDate };
