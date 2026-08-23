import { describe, expect, it } from 'vitest';
import { fieldRegionDivisionLinePath } from './field-division-line';
import { getFieldRegionIds, getFieldRegionPath } from './field-regions';
import type { FieldDivision, FieldDivisionLine } from './types';

const straightDivisionLine: FieldDivisionLine = { style: 'straight', frequency: 4, amplitude: 8 };
const wavyDivisionLine: FieldDivisionLine = { style: 'wavy', frequency: 3, amplitude: 7 };

const lineStyleDivisions = ['per-pale', 'per-fess', 'per-bend', 'per-bend-sinister'] as const satisfies readonly FieldDivision[];

describe('fieldRegionDivisionLinePath', () => {
  it.each(lineStyleDivisions)('matches the authored straight clip for every %s region', (division) => {
    for (const regionId of getFieldRegionIds(division)) {
      expect(fieldRegionDivisionLinePath(division, regionId, straightDivisionLine)).toBe(getFieldRegionPath(regionId));
    }
  });

  it('builds a closed wavy per-pale dexter path that differs from the straight clip', () => {
    const straightPath = fieldRegionDivisionLinePath('per-pale', 'dexter', straightDivisionLine);
    const wavyPath = fieldRegionDivisionLinePath('per-pale', 'dexter', wavyDivisionLine);

    expect(wavyPath).not.toBe(straightPath);
    expect(wavyPath.startsWith('M')).toBe(true);
    expect(wavyPath).toContain('Z');
    expect(wavyPath.endsWith('Z')).toBe(true);
  });

  it('clips overall to the full field even when a wavy division line is configured', () => {
    expect(fieldRegionDivisionLinePath('per-pale', 'overall', wavyDivisionLine)).toBe(getFieldRegionPath('overall'));
    expect(fieldRegionDivisionLinePath('per-pale', 'overall', wavyDivisionLine)).toBe('M0 0H100V110H0Z');
  });

  it('throws the unsupported division and regionId', () => {
    expect(() => fieldRegionDivisionLinePath('quarterly', 'dexter', straightDivisionLine)).toThrow(
      'Unsupported field division line region dexter for division quarterly',
    );
    expect(() => fieldRegionDivisionLinePath('per-pale', 'q1', straightDivisionLine)).toThrow(
      'Unsupported field division line region q1 for division per-pale',
    );
  });

  it("throws the unknown style including 'bogus'", () => {
    expect(() => fieldRegionDivisionLinePath(
      'per-pale',
      'dexter',
      { style: 'bogus', frequency: 3, amplitude: 7 } as never,
    )).toThrow('bogus');
  });

  it('throws the actual invalid frequency or amplitude', () => {
    expect(() => fieldRegionDivisionLinePath(
      'per-pale',
      'dexter',
      { style: 'wavy', frequency: Number.NaN, amplitude: 7 },
    )).toThrow('NaN');
    expect(() => fieldRegionDivisionLinePath(
      'per-pale',
      'dexter',
      { style: 'wavy', frequency: 0, amplitude: 7 },
    )).toThrow('0');
    expect(() => fieldRegionDivisionLinePath(
      'per-pale',
      'dexter',
      { style: 'wavy', frequency: 31, amplitude: 7 },
    )).toThrow('31');
    expect(() => fieldRegionDivisionLinePath(
      'per-pale',
      'dexter',
      { style: 'wavy', frequency: 3, amplitude: Number.POSITIVE_INFINITY },
    )).toThrow('Infinity');
    expect(() => fieldRegionDivisionLinePath(
      'per-pale',
      'dexter',
      { style: 'wavy', frequency: 3, amplitude: 21 },
    )).toThrow('21');
  });
});
