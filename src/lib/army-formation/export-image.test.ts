import { describe, expect, it } from 'vitest';

import {
  buildArmyFormationSvg,
  type ArmyFormationImagePiece,
  type ArmyFormationImageScene,
} from '@/lib/army-formation/export-image';

const SPEAR_ICON =
  '<svg width="50" height="30" viewBox="0 0 50 30"><path d="M0 0h50v30z"/></svg>';

function spearPiece(
  pieceOverrides: Partial<ArmyFormationImagePiece> = {},
): ArmyFormationImagePiece {
  return {
    iconSvgMarkup: SPEAR_ICON,
    x: 125,
    y: 80,
    rotationDegrees: 37,
    backgroundColor: '#e74c3c',
    ...pieceOverrides,
  };
}

function battlefieldScene(
  pieces: ArmyFormationImagePiece[],
  sceneOverrides: Partial<ArmyFormationImageScene> = {},
): ArmyFormationImageScene {
  return {
    widthPx: 800,
    heightPx: 600,
    fieldBackgroundColor: '#102030',
    backgroundImageUrl: '',
    pieces,
    ...sceneOverrides,
  };
}

describe('buildArmyFormationSvg', () => {
  it('把棋子坐标、旋转和底色写进完整战场 SVG', () => {
    const svg = buildArmyFormationSvg(
      battlefieldScene([spearPiece()], {
        backgroundImageUrl: 'https://example.com/field.png?x=1&y=2',
      }),
    );

    expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg" ')).toBe(true);
    expect(svg.endsWith('</svg>')).toBe(true);
    expect(svg).toContain('width="800"');
    expect(svg).toContain('height="600"');
    expect(svg).toContain('aria-label="Army formation creator"');
    expect(svg).toContain('<rect width="800" height="600" fill="#102030"/>');
    expect(svg).toContain(
      'href="https://example.com/field.png?x=1&amp;y=2"',
    );
    expect(svg).toContain(
      '<g transform="translate(125 80) rotate(37 25 15)"><rect width="50" height="30" fill="#e74c3c"/>',
    );
    expect(svg).toContain('<path d="M0 0h50v30z"/>');
    expect(svg.indexOf('fill="#102030"')).toBeLessThan(svg.indexOf('fill="#e74c3c"'));
  });

  it('按数组顺序画出每个棋子，空背景图不生成 image', () => {
    const svg = buildArmyFormationSvg(
      battlefieldScene([
        spearPiece({ x: 125, y: 80, rotationDegrees: 37, backgroundColor: '#e74c3c' }),
        spearPiece({ x: 0, y: 220, rotationDegrees: -90, backgroundColor: '#ffffff' }),
      ]),
    );

    const firstPiece = svg.indexOf('translate(125 80) rotate(37 25 15)');
    const secondPiece = svg.indexOf('translate(0 220) rotate(-90 25 15)');
    expect(firstPiece).toBeGreaterThan(-1);
    expect(secondPiece).toBeGreaterThan(firstPiece);
    expect(svg).toContain('fill="#ffffff"');
    expect(svg).not.toContain('<image');
  });

  it('图标没写宽高时用 viewBox，再没有就用 50×30', () => {
    const viewBoxScene = battlefieldScene([
      spearPiece({
        iconSvgMarkup: '<svg viewBox="0 0 80 40"><circle cx="4" cy="5" r="6"/></svg>',
        x: 10,
        y: 12,
        rotationDegrees: 0,
        backgroundColor: '#abcdef',
      }),
    ]);
    const fragmentScene = battlefieldScene([
      spearPiece({
        iconSvgMarkup: '<path d="M1 2"/>',
        backgroundColor: '#111111',
      }),
    ]);

    const viewBoxSvg = buildArmyFormationSvg(viewBoxScene);
    const fragmentSvg = buildArmyFormationSvg(fragmentScene);

    expect(viewBoxSvg).toContain(
      '<g transform="translate(10 12) rotate(0 40 20)"><rect width="80" height="40" fill="#abcdef"/>',
    );
    expect(viewBoxSvg).toContain('<svg width="80" height="40" viewBox="0 0 80 40">');
    expect(viewBoxSvg).toContain('<circle cx="4" cy="5" r="6"/>');
    expect(fragmentSvg).toContain(
      '<rect width="50" height="30" fill="#111111"/>',
    );
    expect(fragmentSvg).toContain('<path d="M1 2"/>');
  });

  it('去掉图标上的 xml 声明，避免嵌进战场后变成坏文档', () => {
    const svg = buildArmyFormationSvg(
      battlefieldScene([
        spearPiece({
          iconSvgMarkup:
            '<?xml version="1.0" encoding="UTF-8"?><svg width="12" height="8"><rect width="12" height="8"/></svg>',
        }),
      ]),
    );

    expect(svg).not.toContain('<?xml');
    expect(svg).toContain('<svg width="12" height="8">');
  });

  it('宽或高不是有限正数时，错误里带上原来的宽和高', () => {
    const scene = battlefieldScene([]);

    expect(() =>
      buildArmyFormationSvg({ ...scene, widthPx: 0, heightPx: 600 }),
    ).toThrow(
      'Army formation creator image size must use finite positive widthPx and heightPx. widthPx=0 heightPx=600',
    );
    expect(() =>
      buildArmyFormationSvg({
        ...scene,
        widthPx: -15,
        heightPx: Number.POSITIVE_INFINITY,
      }),
    ).toThrow('widthPx=-15 heightPx=Infinity');
    expect(() =>
      buildArmyFormationSvg({
        ...scene,
        widthPx: Number.NaN,
        heightPx: -0,
      }),
    ).toThrow('widthPx=NaN heightPx=-0');
    expect(() =>
      buildArmyFormationSvg({
        ...scene,
        widthPx: '800' as unknown as number,
        heightPx: 600,
      }),
    ).toThrow('widthPx="800" heightPx=600');
  });

  it('旋转不是有限数字时，错误里带上原值', () => {
    expect(() =>
      buildArmyFormationSvg(
        battlefieldScene([
          spearPiece({ rotationDegrees: 10 }),
          spearPiece({ rotationDegrees: Number.NaN }),
        ]),
      ),
    ).toThrow(
      'Army formation creator piece rotationDegrees must be a finite number. pieceIndex=1 rotationDegrees=NaN',
    );
    expect(() =>
      buildArmyFormationSvg(
        battlefieldScene([spearPiece({ rotationDegrees: Number.NEGATIVE_INFINITY })]),
      ),
    ).toThrow('rotationDegrees=-Infinity');
    expect(() =>
      buildArmyFormationSvg(
        battlefieldScene([
          spearPiece({ rotationDegrees: '45' as unknown as number }),
        ]),
      ),
    ).toThrow('rotationDegrees="45"');
  });
});
