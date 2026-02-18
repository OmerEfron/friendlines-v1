/**
 * Health check route - placeholder.
 */
module.exports = function healthRoute(router) {
  router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });
};
