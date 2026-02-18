const express = require('express');
const cors = require('cors');
const config = require('./config');
const mountRoutes = require('./routes');

const app = express();

const corsOrigin = config.frontendUrl
  ? { origin: config.frontendUrl }
  : { origin: true };

app.use(cors(corsOrigin));
app.use(express.json());

mountRoutes(app);

module.exports = app;
