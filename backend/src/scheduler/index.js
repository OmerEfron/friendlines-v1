const cron = require('node-cron');
const reporterInitiated = require('../telegram/reporter-initiated');
const weeklyScheduler = require('../telegram/weekly-scheduler');

function start() {
  cron.schedule('0 */3 * * *', () => reporterInitiated.run(), { timezone: 'UTC' });
  cron.schedule('0 10 * * 0', () => weeklyScheduler.run(), { timezone: 'UTC' });
}

module.exports = { start };
