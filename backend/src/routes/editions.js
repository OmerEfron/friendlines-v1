const { buildEditionForDate } = require('../modules/edition-builder');
const { listEditionsWithPreview } = require('../db/editions');

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

module.exports = function editionsRoute(router) {
  router.get('/editions/today', async (req, res) => {
    try {
      const today = formatDate(new Date());
      const edition = await buildEditionForDate(today);
      res.json(edition);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/editions/:date', async (req, res) => {
    try {
      const { date } = req.params;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        res.status(400).json({ error: 'Invalid date format (YYYY-MM-DD)' });
        return;
      }
      const edition = await buildEditionForDate(date);
      res.json(edition);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/editions', async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit, 10) || 30, 100);
      const editions = await listEditionsWithPreview(limit);
      res.json({ editions });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};
