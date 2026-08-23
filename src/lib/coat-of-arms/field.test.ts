import { describe, expect, it } from 'vitest';
import { getCoatAsset } from './assets';
import { fieldRegionDivisionLinePath } from './field-division-line';
import { buildFieldSvg } from './field';
import { getFieldRegionIds, getFieldRegionPath, resolveFieldRegions } from './field-regions';
import type { CoatField } from './types';

describe('shield field SVG', () => {
  it('clips a per-pale field to the selected shield path', () => {
    const fieldSvg = buildFieldSvg(
      { division: 'per-pale', colors: ['#B11F24', '#F5E6A1'], pattern: 'solid' },
      'M50 0 L100 18 V62 C100 84 78 97 50 110 C22 97 0 84 0 62 V18 Z',
    );

    expect(fieldSvg).toContain('clipPath');
    expect(fieldSvg).toContain('#B11F24');
    expect(fieldSvg).toContain('#F5E6A1');
  });

  it('renders independently styled per-pale regions instead of reusing the legacy field palette', () => {
    const fieldSvg = buildFieldSvg(
      {
        division: 'per-pale',
        colors: ['#111111', '#222222'],
        pattern: 'solid',
        regions: {
          dexter: { colors: ['#B11F24', '#F5E6A1'], pattern: 'dots', patternScale: 1 },
          sinister: { colors: ['#1855A5', '#FFFFFF'], pattern: 'checks', patternScale: 0.5 },
        },
      } as never,
      'M0 0 H100 V110 H0 Z',
    );

    expect(fieldSvg).toContain('data-field-region="dexter"');
    expect(fieldSvg).toContain('data-field-region="sinister"');
    expect(fieldSvg).toContain('fill="#B11F24"');
    expect(fieldSvg).toContain('fill="#1855A5"');
    expect(fieldSvg).toContain('data-field-region-pattern-scale="0.5"');
    expect(fieldSvg).not.toContain('#111111');
  });

  it('clips independently patterned per-pale regions to the configured wavy division line', () => {
    const divisionLine = { style: 'wavy' as const, frequency: 3, amplitude: 7 };
    const fieldSvg = buildFieldSvg(
      {
        division: 'per-pale',
        colors: ['#111111', '#222222'],
        pattern: 'solid',
        divisionLine,
        regions: {
          dexter: { colors: ['#B11F24', '#F5E6A1'], pattern: 'dots', patternScale: 1 },
          sinister: { colors: ['#1855A5', '#FFFFFF'], pattern: 'checks', patternScale: 1 },
        },
      } as never,
      'M0 0 H100 V110 H0 Z',
    );

    const dexterClipPath = fieldRegionDivisionLinePath('per-pale', 'dexter', divisionLine);
    expect(fieldSvg).toContain(`<path d="${dexterClipPath}"`);
    expect(fieldSvg).not.toContain('M0 0H50V110');
    expect(fieldSvg).toContain('data-field-region-pattern="dots"');
    expect(fieldSvg).toContain('data-field-region-pattern="checks"');
    expect(fieldSvg).toContain('data-field-division-line-style="wavy"');
    expect(fieldSvg).toContain('data-field-division-line-frequency="3"');
    expect(fieldSvg).toContain('data-field-division-line-amplitude="7"');
  });

  it.each([
    ['solid', ['overall']],
    ['per-pale', ['dexter', 'sinister']],
    ['per-fess', ['chief', 'base']],
    ['per-bend', ['bend-upper', 'bend-lower']],
    ['per-bend-sinister', ['bend-sinister-upper', 'bend-sinister-lower']],
    ['per-chevron', ['chevron-chief', 'chevron-base']],
    ['quarterly', ['q1', 'q2', 'q3', 'q4']],
    ['gyronny', ['gyron-1', 'gyron-2', 'gyron-3', 'gyron-4', 'gyron-5', 'gyron-6', 'gyron-7', 'gyron-8']],
    ['tierced-per-pale', ['tierced-pale-1', 'tierced-pale-2', 'tierced-pale-3']],
    ['tierced-per-fess', ['tierced-fess-1', 'tierced-fess-2', 'tierced-fess-3']],
    ['per-saltire', ['saltire-chief', 'saltire-dexter', 'saltire-base', 'saltire-sinister']],
    ['barry', ['bar-1', 'bar-2', 'bar-3', 'bar-4', 'bar-5']],
    ['paly', ['paly-1', 'paly-2', 'paly-3', 'paly-4', 'paly-5']],
    ['bendy', ['bend-1', 'bend-2', 'bend-3', 'bend-4', 'bend-5']],
  ] as const)('exposes stable independent regions for the %s division', (division, expectedRegionIds) => {
    expect(getFieldRegionIds(division)).toEqual(expectedRegionIds);
  });

  it.each([
    ['per-fess', 'chief', 'base'],
    ['per-bend', 'bend-upper', 'bend-lower'],
    ['per-chevron', 'chevron-chief', 'chevron-base'],
    ['quarterly', 'q1', 'q4'],
    ['gyronny', 'gyron-1', 'gyron-8'],
    ['tierced-per-pale', 'tierced-pale-1', 'tierced-pale-3'],
    ['per-saltire', 'saltire-chief', 'saltire-sinister'],
    ['barry', 'bar-1', 'bar-5'],
    ['paly', 'paly-1', 'paly-5'],
    ['bendy', 'bend-1', 'bend-5'],
  ] as const)('clips separately authored regions for %s to their true geometry', (division, firstRegionId, lastRegionId) => {
    const fieldSvg = buildFieldSvg(
      {
        division,
        colors: ['#111111', '#222222'],
        pattern: 'solid',
        regions: {
          [firstRegionId]: { colors: ['#B11F24'], pattern: 'solid' },
          [lastRegionId]: { colors: ['#1855A5'], pattern: 'solid' },
        },
      } as never,
      'M0 0 H100 V110 H0 Z',
    );

    expect(fieldSvg).toContain(`data-field-region="${firstRegionId}"`);
    expect(fieldSvg).toContain(`data-field-region="${lastRegionId}"`);
    expect(fieldSvg).toContain(`<path d="${getFieldRegionPath(firstRegionId)}" fill="#B11F24"/>`);
    expect(fieldSvg).toContain(`<path d="${getFieldRegionPath(lastRegionId)}" fill="#1855A5"/>`);
  });

  it('derives missing quarterly regions from the legacy palette and pattern without mutating the field', () => {
    const legacyField: CoatField = {
      division: 'quarterly',
      colors: ['#B11F24', '#F5E6A1'],
      pattern: 'dots',
      regions: { q1: { colors: ['#1855A5'], pattern: 'solid' } },
    };

    const regions = resolveFieldRegions(legacyField);

    expect(regions).toEqual([
      { id: 'q1', style: { colors: ['#1855A5'], pattern: 'solid', patternScale: 1 } },
      { id: 'q2', style: { colors: ['#F5E6A1', '#F5E6A1'], pattern: 'dots', patternScale: 1 } },
      { id: 'q3', style: { colors: ['#F5E6A1', '#F5E6A1'], pattern: 'dots', patternScale: 1 } },
      { id: 'q4', style: { colors: ['#B11F24', '#F5E6A1'], pattern: 'dots', patternScale: 1 } },
    ]);
    const firstQuarterRegion = legacyField.regions?.q1;
    if (!firstQuarterRegion) throw new Error('Expected legacy test field to include q1');
    expect(firstQuarterRegion.colors).toEqual(['#1855A5']);
  });

  it('renders checkered fields with an accent color', () => {
    const fieldSvg = buildFieldSvg(
      { division: 'solid', colors: ['#B11F24', '#F5E6A1'], pattern: 'checks' },
      'M0 0 H100 V110 H0 Z',
    );

    expect(fieldSvg).toContain('fill="#F5E6A1"');
    expect(fieldSvg).toContain('rect');
  });

  it('renders extended divisions and variations with the chosen two-colour field', () => {
    const fieldSvg = buildFieldSvg(
      { division: 'gyronny', colors: ['#B11F24', '#F5E6A1'], pattern: 'lozengy' } as never,
      'M0 0 H100 V110 H0 Z',
    );

    expect(fieldSvg).toContain('polygon');
    expect(fieldSvg).toContain('#F5E6A1');
  });

  it.each([
    ['per-saltire', 'masoned', 'polygon', 'stroke'],
    ['barry', 'honeycomb', 'rect', 'polygon'],
    ['paly', 'fretty', 'rect', 'path'],
    ['bendy', 'scales', 'path', 'circle'],
  ] as const)('renders the %s division and %s variation', (division, pattern, divisionMarkup, patternMarkup) => {
    const fieldSvg = buildFieldSvg(
      { division, colors: ['#B11F24', '#F5E6A1'], pattern },
      'M0 0 H100 V110 H0 Z',
    );

    expect(fieldSvg).toContain(divisionMarkup);
    expect(fieldSvg).toContain(patternMarkup);
  });

  it.each([
    ['chevronelly', 'M-20 20L0 0L20 20'],
    ['vair', 'data-field-pattern="vair"'],
    ['vair-in-pointe', 'data-field-pattern="vair-in-pointe"'],
    ['vair-in-pale', 'data-field-pattern="vair-in-pale"'],
    ['paly-bendy', 'data-field-pattern="paly-bendy"'],
    ['barry-bendy', 'data-field-pattern="barry-bendy"'],
    ['gyronny', 'data-field-pattern="gyronny"'],
    ['papelonny', 'data-field-pattern="papelonny"'],
    ['seme', 'data-field-pattern="seme"'],
  ] as const)('renders the target %s field pattern', (pattern, expectedMarkup) => {
    const fieldSvg = buildFieldSvg(
      { division: 'solid', colors: ['#B11F24', '#F5E6A1'], pattern } as never,
      'M0 0 H100 V110 H0 Z',
    );

    expect(fieldSvg).toContain(expectedMarkup);
  });

  it('renders every requested heraldic pattern configuration instead of using the fixed legacy overlays', () => {
    const shieldPath = 'M0 0 H100 V110 H0 Z';

    expect(buildFieldSvg({ division: 'solid', colors: ['#B11F24', '#F5E6A1'], pattern: 'stripes', patternConfig: { count: 6, direction: 'horizontal' } } as never, shieldPath)).toContain('data-field-pattern-config="count:6;direction:horizontal"');
    expect(buildFieldSvg({ division: 'solid', colors: ['#B11F24', '#F5E6A1'], pattern: 'masoned', patternConfig: { rows: 7, bricks: 6 } } as never, shieldPath)).toContain('data-field-pattern-config="rows:7;bricks:6"');
    expect(buildFieldSvg({ division: 'solid', colors: ['#B11F24', '#F5E6A1'], pattern: 'checks', patternConfig: { rows: 6 } } as never, shieldPath)).toContain('data-field-pattern-config="rows:6"');
    expect(buildFieldSvg({ division: 'solid', colors: ['#B11F24', '#F5E6A1'], pattern: 'lozengy', patternConfig: { columns: 6 } } as never, shieldPath)).toContain('data-field-pattern-config="columns:6"');
    expect(buildFieldSvg({ division: 'solid', colors: ['#B11F24', '#F5E6A1'], pattern: 'chevronelly', patternConfig: { count: 5 } } as never, shieldPath)).toContain('data-field-pattern-config="count:5"');
    expect(buildFieldSvg({ division: 'solid', colors: ['#B11F24', '#F5E6A1'], pattern: 'vair', patternConfig: { rows: 5 } } as never, shieldPath)).toContain('data-field-pattern-config="rows:5"');
    expect(buildFieldSvg({ division: 'solid', colors: ['#B11F24', '#F5E6A1'], pattern: 'gyronny', patternConfig: { count: 10 } } as never, shieldPath)).toContain('data-field-pattern-config="count:10"');
    expect(buildFieldSvg({ division: 'solid', colors: ['#B11F24', '#F5E6A1'], pattern: 'seme', patternConfig: { count: 6, symbolSize: 7 } } as never, shieldPath)).toContain('data-field-pattern-config="count:6;symbolSize:7"');
  });

  it('validates field and independent-region pattern configuration before rendering SVG', () => {
    const shieldPath = 'M0 0 H100 V110 H0 Z';

    expect(() => buildFieldSvg({ division: 'solid', colors: ['#B11F24', '#F5E6A1'], pattern: 'stripes', patternConfig: { count: 1, direction: 'sideways' } } as never, shieldPath)).toThrow('Invalid field pattern configuration');
    expect(() => buildFieldSvg({ division: 'per-pale', colors: ['#B11F24', '#F5E6A1'], pattern: 'solid', regions: { dexter: { colors: ['#B11F24', '#F5E6A1'], pattern: 'seme', patternConfig: { symbolSize: 0 } } } } as never, shieldPath)).toThrow('Invalid field region pattern configuration dexter');
    expect(() => buildFieldSvg({ division: 'per-fess', colors: ['#B11F24', '#F5E6A1'], pattern: 'solid', regions: { dexter: { colors: ['#B11F24'], pattern: 'solid' } } } as never, shieldPath)).toThrow('Invalid field region dexter for division per-fess');
    expect(() => buildFieldSvg({ division: 'bendy', colors: ['#B11F24', '#F5E6A1'], pattern: 'solid', regions: { 'bend-1': { colors: ['#B11F24'], pattern: 'solid', patternScale: 5 } } } as never, shieldPath)).toThrow('Invalid field region pattern scale bend-1: 5');
    expect(() => buildFieldSvg({
      division: 'quarterly',
      colors: ['#B11F24', '#F5E6A1'],
      pattern: 'solid',
      regions: { q1: { colors: ['#B11F24'], pattern: 'solid' } },
      divisionLine: { style: 'wavy', frequency: 3, amplitude: 7 },
    } as never, shieldPath)).toThrow('Field regions do not support a configurable division line: quarterly');
  });

  it('rejects field colors that can inject SVG markup', () => {
    expect(() =>
      buildFieldSvg(
        { division: 'solid', colors: ['#B11F24" onload="alert(1)'], pattern: 'solid' },
        'M0 0 H100 V110 H0 Z',
      ),
    ).toThrow('Invalid field color');
  });

  it('rejects shield paths containing non-path markup', () => {
    expect(() =>
      buildFieldSvg(
        { division: 'solid', colors: ['#B11F24'], pattern: 'solid' },
        'M0 0 H100 V110 H0 Z"/><script/>',
      ),
    ).toThrow('Invalid shield path');
  });

  it('rejects a malformed shield path that only contains a move command', () => {
    expect(() =>
      buildFieldSvg(
        { division: 'solid', colors: ['#B11F24'], pattern: 'solid' },
        'M',
      ),
    ).toThrow('Invalid shield path: M');
  });

  it('rejects an unsupported arc command in an otherwise allowed-character shield path', () => {
    expect(() =>
      buildFieldSvg(
        { division: 'solid', colors: ['#B11F24'], pattern: 'solid' },
        'M0 0 A 1 1 Z',
      ),
    ).toThrow('Invalid shield path: M0 0 A 1 1 Z');
  });

  it('accepts the independently authored local heater shield path', () => {
    const shield = getCoatAsset('heater-shield');
    if (shield.kind !== 'shield') {
      throw new Error(`Expected shield asset, received ${shield.kind}`);
    }

    expect(() =>
      buildFieldSvg(
        { division: 'solid', colors: ['#B11F24'], pattern: 'solid' },
        shield.svgPath,
      ),
    ).not.toThrow();
  });

  it.each([
    ['slashes', 'solid'],
    ['solid', 'plaid'],
  ])('rejects the runtime field value %s', (division, pattern) => {
    expect(() =>
      buildFieldSvg(
        { division, colors: ['#B11F24', '#F5E6A1'], pattern } as never,
        'M0 0 H100 V110 H0 Z',
      ),
    ).toThrow(division === 'solid' ? pattern : division);
  });

  it('rejects a runtime field value that is not a field object', () => {
    expect(() => buildFieldSvg(null as never, 'M0 0 H100 V110 H0 Z')).toThrow(
      'Invalid coat field: null',
    );
  });

  it.each(['stripes', 'dots', 'checks'] as const)(
    'rejects the %s pattern without an accent color',
    (pattern) => {
      expect(() =>
        buildFieldSvg(
          { division: 'solid', colors: ['#B11F24'], pattern },
          'M0 0 H100 V110 H0 Z',
        ),
      ).toThrow(pattern);
    },
  );

  it('builds deterministic SVG for identical default inputs', () => {
    const firstField = buildFieldSvg(
      { division: 'solid', colors: ['#B11F24'], pattern: 'solid' },
      'M0 0 H100 V110 H0 Z',
    );
    const secondField = buildFieldSvg(
      { division: 'solid', colors: ['#B11F24'], pattern: 'solid' },
      'M0 0 H100 V110 H0 Z',
    );
    expect(firstField).toBe(secondField);
  });

  it('uses caller-supplied stable layer ids to avoid composed-field clip collisions', () => {
    const firstField = buildFieldSvg(
      { division: 'solid', colors: ['#B11F24'], pattern: 'solid' },
      'M0 0 H100 V110 H0 Z',
      { clipPathId: 'shield-layer-a' },
    );
    const secondField = buildFieldSvg(
      { division: 'solid', colors: ['#B11F24'], pattern: 'solid' },
      'M0 0 H100 V110 H0 Z',
      { clipPathId: 'shield-layer-b' },
    );

    expect(firstField).toContain('clipPath id="shield-layer-a"');
    expect(secondField).toContain('clipPath id="shield-layer-b"');
  });

  it('rejects an unsafe caller-supplied clip path id', () => {
    expect(() =>
      buildFieldSvg(
        { division: 'solid', colors: ['#B11F24'], pattern: 'solid' },
        'M0 0 H100 V110 H0 Z',
        { clipPathId: '' },
      ),
    ).toThrow('Invalid clip path id: ');
  });

  it.each([
    [null, 'null'],
    ['not-an-options-object', 'not-an-options-object'],
  ])('rejects the invalid field SVG options value %s', (options, rejectedValue) => {
    expect(() =>
      buildFieldSvg(
        { division: 'solid', colors: ['#B11F24'], pattern: 'solid' },
        'M0 0 H100 V110 H0 Z',
        options as never,
      ),
    ).toThrow(`Invalid field SVG options: ${rejectedValue}`);
  });
});
