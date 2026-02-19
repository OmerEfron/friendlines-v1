const { parseEditorialResponse } = require('../src/modules/editorial-analyzer');

describe('parseEditorialResponse', () => {
  it('parses valid JSON and returns tier, shouldPublish, rationale', () => {
    const text = '{"tier": 1, "shouldPublish": true, "rationale": "Strong lead"}';
    const r = parseEditorialResponse(text);
    expect(r).toEqual({ tier: 1, shouldPublish: true, rationale: 'Strong lead' });
  });

  it('strips markdown code fence', () => {
    const text = '```json\n{"tier": 2, "shouldPublish": false, "rationale": "N/A"}\n```';
    const r = parseEditorialResponse(text);
    expect(r).toEqual({ tier: 2, shouldPublish: false, rationale: 'N/A' });
  });

  it('allows null tier', () => {
    const text = '{"tier": null, "shouldPublish": false, "rationale": "Skip"}';
    const r = parseEditorialResponse(text);
    expect(r).toEqual({ tier: null, shouldPublish: false, rationale: 'Skip' });
  });

  it('throws for invalid tier', () => {
    expect(() => parseEditorialResponse('{"tier": 5}')).toThrow(/Invalid tier/);
    expect(() => parseEditorialResponse('{"tier": 0}')).toThrow(/Invalid tier/);
  });

  it('throws for invalid JSON', () => {
    expect(() => parseEditorialResponse('not json')).toThrow();
  });
});
