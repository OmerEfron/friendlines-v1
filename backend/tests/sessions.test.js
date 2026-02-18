const {
  MODE_DAILY,
  MODE_WEEKLY_INTERVIEW,
  STATUS_ACTIVE,
  STATUS_ENDED,
} = require('../src/db/sessions');

describe('sessions constants', () => {
  it('exports expected mode and status values', () => {
    expect(MODE_DAILY).toBe('daily');
    expect(MODE_WEEKLY_INTERVIEW).toBe('weekly_interview');
    expect(STATUS_ACTIVE).toBe('active');
    expect(STATUS_ENDED).toBe('ended');
  });
});
