/**
 * Verifies module and contract existence.
 */
describe('modules exist', () => {
  it('loads all backend modules', () => {
    const modules = [
      '../src/modules/conversation-engine',
      '../src/modules/thread-manager',
      '../src/modules/editorial-analyzer',
      '../src/modules/article-generator',
      '../src/modules/edition-builder',
      '../src/telegram',
    ];
    for (const m of modules) {
      expect(() => require(m)).not.toThrow();
    }
  });

  it('loads contracts', () => {
    expect(() => require('../src/modules/contracts')).not.toThrow();
  });
});
