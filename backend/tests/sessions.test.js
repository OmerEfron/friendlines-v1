const {
  MODE_DAILY,
  MODE_WEEKLY_INTERVIEW,
  STATUS_ACTIVE,
  STATUS_ENDED,
  endActiveSessionForUser,
} = require('../src/db/sessions');

describe('sessions constants', () => {
  it('exports expected mode and status values', () => {
    expect(MODE_DAILY).toBe('daily');
    expect(MODE_WEEKLY_INTERVIEW).toBe('weekly_interview');
    expect(STATUS_ACTIVE).toBe('active');
    expect(STATUS_ENDED).toBe('ended');
  });
});

describe('endActiveSessionForUser', () => {
  it('is exported and is a function', () => {
    expect(typeof endActiveSessionForUser).toBe('function');
  });
});
