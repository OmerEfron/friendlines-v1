/**
 * DB test helpers. Used by integration tests in Phase 2+.
 * Provides lifecycle utilities for test DB setup/teardown.
 */
const { pool } = require('../../src/db/pool');

async function truncateTables(tables = ['editions', 'users', 'threads']) {
  if (tables.length === 0) return;
  const sql = `TRUNCATE TABLE ${tables.join(', ')} RESTART IDENTITY CASCADE`;
  await pool.query(sql);
}

async function withCleanDb(fn) {
  try {
    await truncateTables();
    return await fn();
  } finally {
    // Leave pool connected; individual tests may need to clean
  }
}

module.exports = {
  truncateTables,
  withCleanDb,
};
