import { describe, expect, it } from 'vitest';

import { getTarotSpread, TAROT_SPREADS } from './spreads';

const EXPECTED_SPREADS = [
  ['celtic-cross', 10],
  ['cross-and-triangle', 9],
  ['tetraktys', 10],
  ['planetary', 8],
  ['astrological', 13],
  ['relationship', 9],
  ['star-guide', 6],
  ['birthday', 9],
  ['mandala', 9],
  ['dream-exploration', 3],
  ['tree-of-life', 10],
  ['past-life', 8],
  ['true-love', 7],
  ['never-too-late', 9],
  ['annual', 13],
] as const;

describe('tarot spread definitions', () => {
  it('exposes the 15 source spreads with the measured card counts', () => {
    expect(TAROT_SPREADS.map((spread) => [spread.id, spread.positions.length])).toEqual(
      EXPECTED_SPREADS,
    );
    expect(TAROT_SPREADS).toHaveLength(15);
    expect(TAROT_SPREADS.reduce((total, spread) => total + spread.positions.length, 0)).toBe(133);
  });

  it('keeps position numbers continuous and all copy and coordinates complete', () => {
    for (const spread of TAROT_SPREADS) {
      expect(spread.name.en, spread.id).not.toBe('');
      expect(spread.name.zh, spread.id).not.toBe('');
      expect(spread.description.en, spread.id).not.toBe('');
      expect(spread.description.zh, spread.id).not.toBe('');
      expect(spread.positions.map((position) => position.number), spread.id).toEqual(
        Array.from({ length: spread.positions.length }, (_, index) => index + 1),
      );

      for (const position of spread.positions) {
        expect(position.label.en, `${spread.id}:${position.number}`).not.toBe('');
        expect(position.label.zh, `${spread.id}:${position.number}`).not.toBe('');
        expect(position.description.en, `${spread.id}:${position.number}`).not.toBe('');
        expect(position.description.zh, `${spread.id}:${position.number}`).not.toBe('');
        expect(Number.isFinite(position.x), `${spread.id}:${position.number}:x`).toBe(true);
        expect(Number.isFinite(position.y), `${spread.id}:${position.number}:y`).toBe(true);
      }
    }
  });

  it('keeps only the Celtic Cross crossing card fixed at 90 degrees', () => {
    const fixedPositions = TAROT_SPREADS.flatMap((spread) =>
      spread.positions
        .filter((position) => position.fixedRotationDeg !== undefined)
        .map((position) => ({ id: spread.id, number: position.number, rotation: position.fixedRotationDeg })),
    );

    expect(fixedPositions).toEqual([{ id: 'celtic-cross', number: 2, rotation: 90 }]);
  });

  it('keeps the annual spread mapped to January through December and an overall card', () => {
    const annual = getTarotSpread('annual');

    expect(annual.positions.slice(0, 12).map((position) => position.label.en)).toEqual([
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]);
    expect(annual.positions[12].label.en).toBe('Overall year');
  });

  it('retrieves a spread by id and reports an unknown id in the error', () => {
    expect(getTarotSpread('celtic-cross')).toBe(TAROT_SPREADS[0]);
    expect(() => getTarotSpread('missing-spread')).toThrowError('Unknown tarot spread id: missing-spread');
    expect(() => getTarotSpread('')).toThrowError('Unknown tarot spread id: ');
  });
});
