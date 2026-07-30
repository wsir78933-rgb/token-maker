import { describe, expect, it } from 'vitest';
import { createCoatIdentity } from './name-generator';

describe('local coat identity generator', () => {
  it('creates deterministic English and Chinese project names and mottos from injected randomness', () => {
    expect(createCoatIdentity('en', () => 0)).toEqual({ projectName: 'House Alder', motto: 'Courage in service' });
    expect(createCoatIdentity('zh', () => 0)).toEqual({ projectName: '青松纹章', motto: '勇毅守信' });
  });

  it('rejects invalid random sources and received random values', () => {
    expect(() => createCoatIdentity('en', null as never)).toThrow('random value source');
    expect(() => createCoatIdentity('en', () => 1)).toThrow('random value');
  });
});
