const cron = require('node-cron');
const reporterInitiated = require('../telegram/reporter-initiated');
const weeklyScheduler = require('../telegram/weekly-scheduler');

function start() {
  cron.schedule('0 9 * * *', () => reporterInitiated.run(), { timezone: 'UTC' });
  cron.schedule('0 14 * * *', () => reporterInitiated.run(), { timezone: 'UTC' });
  cron.schedule('0 20 * * *', () => reporterInitiated.run(), { timezone: 'UTC' });
  cron.schedule('0 10 * * 0', () => weeklyScheduler.run(), { timezone: 'UTC' });
}

module.exports = { start };
