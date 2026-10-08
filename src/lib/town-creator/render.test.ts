import { describe, expect, it } from 'vitest';
import sharp from 'sharp';

import type { TownDocument } from './types';
import { buildTownSceneMarkup, buildTownSvg } from './render';

function makeTownDocument(): TownDocument {
  return {
    version: 1,
    width: 320,
    height: 240,
    backgroundColor: '#f8f4ec',
    backgroundImageUrl: '',
    activeLayer: 'middle',
    layers: [
      {
        id: 'lower',
        visible: true,
        objects: [
          {
            id: 'lower-house',
            assetId: 'buildings-house-01-cottage',
            material: 'wood',
            x: 8,
            y: 16,
            width: 64,
            height: 64,
            rotationDegrees: 0,
          },
        ],
      },
      {
        id: 'middle',
        visible: true,
        objects: [
          {
            id: 'middle-road',
            assetId: 'roads-road1',
            material: 'neutral',
            x: 32,
            y: 128,
            width: 192,
            height: 64,
            rotationDegrees: 37,
          },
          {
            id: 'middle-ground',
            assetId: 'terrain-grass1',
            material: 'neutral',
            x: 0,
            y: 0,
            width: 160,
            height: 128,
            rotationDegrees: 0,
          },
        ],
      },
      {
        id: 'upper',
        visible: true,
        objects: [
          {
            id: 'upper-house',
            assetId: 'buildings-house-01-cottage',
            material: 'stone',
            x: 192,
            y: 32,
            width: 80,
            height: 80,
            rotationDegrees: 17,
          },
        ],
      },
    ],
  };
}

describe('town scene renderer', () => {
  it('renders visible layers in fixed lower, middle, upper order', () => {
    const markup = buildTownSceneMarkup(makeTownDocument());

    const lowerIndex = markup.indexOf('data-town-layer-id="lower"');
    const middleIndex = markup.indexOf('data-town-layer-id="middle"');
    const upperIndex = markup.indexOf('data-town-layer-id="upper"');

    expect(lowerIndex).toBeGreaterThan(-1);
    expect(lowerIndex).toBeLessThan(middleIndex);
    expect(middleIndex).toBeLessThan(upperIndex);
  });

  it('omits hidden layers and preserves native repeat dimensions for line and tile assets', () => {
    const document = makeTownDocument();
    document.layers = document.layers.map((layer) => (
      layer.id === 'upper' ? { ...layer, visible: false } : layer
    ));

    const markup = buildTownSceneMarkup(document);

    expect(markup).not.toContain('data-town-layer-id="upper"');
    expect(markup).toContain(
      '<pattern id="town-pattern-1" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse" x="0" y="0" width="128" height="64" patternTransform="translate(32 128)">',
    );
    expect(markup).toContain(
      '<pattern id="town-pattern-2" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse" x="0" y="0" width="64" height="64" patternTransform="translate(0 0)">',
    );
    expect(markup).toContain('data-town-resize-mode="line"');
    expect(markup).toContain('data-town-resize-mode="tile"');
    expect(markup).toContain('preserveAspectRatio="none"');
  });

  it('fills a non-periodic tile placement when read back from a real PNG raster', async () => {
    const source = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#e85d75"/></svg>',
    ).toString('base64');
    const baseDocument = makeTownDocument();
    const document: TownDocument = {
      ...baseDocument,
      backgroundColor: '#000000',
      layers: baseDocument.layers.map((layer) => ({
        ...layer,
        objects: layer.id === 'middle'
          ? [{
            id: 'offset-tile',
            assetId: 'terrain-grass1',
            material: 'neutral',
            x: 203,
            y: 177,
            width: 100,
            height: 50,
            rotationDegrees: 0,
          }]
          : [],
      })),
    };
    const svg = buildTownSvg(document, {
      '/town-creator/svg/terrain/terrain-grass1--neutral.svg': `data:image/svg+xml;base64,${source}`,
    });
    const { data: pixelBytes, info: imageMetadata } = await sharp(Buffer.from(svg))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixelAt = (x: number, y: number): readonly number[] => {
      const offset = (y * imageMetadata.width + x) * imageMetadata.channels;
      return Array.from(pixelBytes.subarray(offset, offset + imageMetadata.channels));
    };
    expect(imageMetadata.width).toBe(320);
    expect(imageMetadata.height).toBe(240);
    expect(pixelAt(204, 178)).toEqual(expect.arrayContaining([232, 93, 117, 255]));
    expect(pixelAt(250, 200)).toEqual(expect.arrayContaining([232, 93, 117, 255]));
    expect(pixelAt(302, 226)).toEqual(expect.arrayContaining([232, 93, 117, 255]));
    expect(pixelAt(202, 176)).toEqual(expect.arrayContaining([0, 0, 0, 255]));
  });

  it('uses regular image rendering, material variants, and object rotation', () => {
    const markup = buildTownSceneMarkup(makeTownDocument());

    expect(markup).toContain('buildings-house-01-cottage--wood.svg');
    expect(markup).toContain('buildings-house-01-cottage--stone.svg');
    expect(markup).toContain('transform="rotate(17 232 72)"');
    expect(markup).toContain('preserveAspectRatio="xMidYMid meet"');
  });

  it('applies asset and background overrides, with XML escaping on fallback URLs', () => {
    const document = makeTownDocument();
    document.backgroundImageUrl = 'https://example.test/bg?x=1&label="two"';
    const roadSvg = '/town-creator/svg/roads/roads-road1--neutral.svg';
    const markup = buildTownSceneMarkup(document, {
      [roadSvg]: 'data:image/svg+xml;base64,cm9hZA==',
    });

    expect(markup).toContain('href="data:image/svg+xml;base64,cm9hZA=="');
    expect(markup).toContain(
      'href="https://example.test/bg?x=1&amp;label=&quot;two&quot;"',
    );
  });

  it('builds a pixel-sized SVG with a matching viewBox', () => {
    const svg = buildTownSvg(makeTownDocument());

    expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
    expect(svg).toContain('width="320" height="240" viewBox="0 0 320 240"');
    expect(svg).toContain('data-town-svg="true"');
    expect(svg.match(/<svg\b/g)).toHaveLength(1);
  });

  it('fails fast for an unknown asset', () => {
    const document = makeTownDocument();
    document.layers = document.layers.map((layer) => (
      layer.id === 'middle'
        ? {
          ...layer,
          objects: [{
            ...layer.objects[0],
            assetId: 'missing-town-asset',
          }],
        }
        : layer
    ));

    expect(() => buildTownSceneMarkup(document)).toThrow('Unknown town asset id: "missing-town-asset".');
  });
});
