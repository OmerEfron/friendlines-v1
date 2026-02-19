/**
 * DB test helpers. Used by integration tests in Phase 2+.
 * Provides lifecycle utilities for test DB setup/teardown.
 */
const { pool } = require('../../src/db/pool');

async function truncateTables(tables = ['messages', 'events', 'conversation_sessions', 'articles', 'editions', 'threads', 'users']) {
  for (const table of tables) {
    await pool.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
  }
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
