const { pool } = require('./pool');

const MODE_DAILY = 'daily';
const MODE_WEEKLY_INTERVIEW = 'weekly_interview';
const STATUS_ACTIVE = 'active';
const STATUS_ENDED = 'ended';

async function createSession(userId, mode, targetCount, sessionDate) {
  const r = await pool.query(
    `INSERT INTO conversation_sessions (user_id, mode, status, asked_count, target_count, session_date)
     VALUES ($1, $2, $3, 0, $4, $5)
     RETURNING id, user_id, mode, status, asked_count, target_count, session_date, created_at`,
    [userId, mode, STATUS_ACTIVE, targetCount, sessionDate]
  );
  return r.rows[0];
}

async function getActiveSessionByUserId(userId) {
  const r = await pool.query(
    `SELECT id, user_id, mode, status, asked_count, target_count, session_date, created_at
     FROM conversation_sessions
     WHERE user_id = $1 AND status = $2
     ORDER BY created_at DESC LIMIT 1`,
    [userId, STATUS_ACTIVE]
  );
  return r.rows[0] || null;
}

async function getActiveSessionByUserIdAndDate(userId, sessionDate) {
  const r = await pool.query(
    `SELECT id, user_id, mode, status, asked_count, target_count, session_date, created_at
     FROM conversation_sessions
     WHERE user_id = $1 AND session_date = $2 AND status = $3
     ORDER BY created_at DESC LIMIT 1`,
    [userId, sessionDate, STATUS_ACTIVE]
  );
  return r.rows[0] || null;
}

async function incrementAskedCount(sessionId) {
  await pool.query(
    `UPDATE conversation_sessions
     SET asked_count = asked_count + 1, updated_at = current_timestamp
     WHERE id = $1`,
    [sessionId]
  );
}

async function endSession(sessionId) {
  await pool.query(
    `UPDATE conversation_sessions SET status = $1, updated_at = current_timestamp WHERE id = $2`,
    [STATUS_ENDED, sessionId]
  );
}

async function hasActiveSessionForDate(userId, sessionDate) {
  const r = await pool.query(
    `SELECT 1 FROM conversation_sessions
     WHERE user_id = $1 AND session_date = $2 AND status = $3`,
    [userId, sessionDate, STATUS_ACTIVE]
  );
  return r.rows.length > 0;
}

async function endActiveSessionForUser(userId) {
  const session = await getActiveSessionByUserId(userId);
  if (session) {
    await endSession(session.id);
    return true;
  }
  return false;
}

module.exports = {
  MODE_DAILY,
  MODE_WEEKLY_INTERVIEW,
  STATUS_ACTIVE,
  STATUS_ENDED,
  createSession,
  getActiveSessionByUserId,
  getActiveSessionByUserIdAndDate,
  incrementAskedCount,
  endSession,
  endActiveSessionForUser,
  hasActiveSessionForDate,
};
