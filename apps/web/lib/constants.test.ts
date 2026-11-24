import { describe, it, expect } from 'vitest';
import { QUICK_ACTIONS } from './constants';

describe('Constants & Domain Safety', () => {
  it('defines 4 essential quick clinical actions', () => {
    expect(QUICK_ACTIONS).toHaveLength(4);
    const ids = QUICK_ACTIONS.map((a) => a.id);
    expect(ids).toContain('understand');
    expect(ids).toContain('prevent');
    expect(ids).toContain('learn');
    expect(ids).toContain('summarize');
  });

  it('ensures each quick action has a non-empty medical prompt', () => {
    for (const action of QUICK_ACTIONS) {
      expect(action.prompt.length).toBeGreaterThan(15);
      expect(action.subtitle.length).toBeGreaterThan(0);
    }
  });
});
