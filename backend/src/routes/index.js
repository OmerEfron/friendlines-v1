const express = require('express');
const healthRoute = require('./health');
const editionsRoute = require('./editions');
const articlesRoute = require('./articles');
const telegramRoute = require('./telegram');

module.exports = function mountRoutes(app) {
  const api = express.Router();
  healthRoute(api);
  editionsRoute(api);
  articlesRoute(api);
  app.use('/api', api);

  const webhook = express.Router();
  telegramRoute(webhook);
  app.use('/webhook', webhook);
};
