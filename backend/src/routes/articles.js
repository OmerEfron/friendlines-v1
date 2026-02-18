const { getArticle } = require('../db/articles');

module.exports = function articlesRoute(router) {
  router.get('/articles/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid article id' });
        return;
      }
      const article = await getArticle(id);
      if (!article) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      res.json(article);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};
