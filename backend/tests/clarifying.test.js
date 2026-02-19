const { buildClarifyingPrompt, PROMPT_VERSION } = require('../src/modules/conversation-engine/clarifying');

describe('buildClarifyingPrompt', () => {
  it('includes user content', () => {
    const p = buildClarifyingPrompt('Met with Sarah', []);
    expect(p).toContain('Met with Sarah');
    expect(p).toContain('(none)');
  });

  it('includes recent messages as context', () => {
    const msgs = [
      { role: 'user', content: 'Had coffee' },
      { role: 'reporter', content: 'Where?' },
    ];
    const p = buildClarifyingPrompt('Downtown cafe', msgs);
    expect(p).toContain('[user]: Had coffee');
    expect(p).toContain('[reporter]: Where?');
  });

  it('limits to last 6 messages', () => {
    const msgs = Array(10)
      .fill(0)
      .map((_, i) => ({ role: 'user', content: `msg${i}` }));
    const p = buildClarifyingPrompt('x', msgs);
    expect(p).not.toContain('msg0');
    expect(p).toContain('msg9');
    expect(p).toContain('msg4');
  });
});

describe('PROMPT_VERSION', () => {
  it('is defined', () => {
    expect(PROMPT_VERSION).toBeDefined();
  });
});
