const app = require('./app');
const config = require('./config');
const scheduler = require('./scheduler');

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`FriendLines backend listening on port ${config.port}`);
  scheduler.start();
});
