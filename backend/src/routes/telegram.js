const { handleWebhook } = require('../telegram/webhook');

module.exports = function telegramRoute(router) {
  router.post('/telegram', (req, res) => {
    handleWebhook(req, res);
  });
};
