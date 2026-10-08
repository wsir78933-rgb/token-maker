import { describe, expect, it } from 'vitest';

import {
  addConstellation,
  addConstellationStar,
  bringConstellationToFront,
  clearConstellationObjects,
  createDefaultConstellationProject,
  removeConstellationBackgroundImage,
  removeConstellationObject,
  resizeConstellationCanvas,
  setConstellationBackgroundColor,
  setConstellationBackgroundImage,
  setConstellationTransparentBase,
  transformConstellationObject,
} from './state';

describe('constellation project state', () => {
  it('adds, transforms, fronts, removes, and clears objects without mutating the source', () => {
    const originalProject = createDefaultConstellationProject();
    const withConstellation = addConstellation(originalProject, 'image-1', 'constellation-1');
    const withStar = addConstellationStar(withConstellation, 'star-1');
    const transformed = transformConstellationObject(withStar, 'constellation-1', {
      x: 120,
      y: 80,
      width: 196,
      height: 186,
    });
    const fronted = bringConstellationToFront(transformed, 'constellation-1');
    const removed = removeConstellationObject(fronted, 'star-1');
    const cleared = clearConstellationObjects(removed);

    expect(originalProject.objects).toEqual([]);
    expect(withConstellation.objects[0]?.rotation).toBe(0);
    expect(withStar.objects[1]?.rotation).toBe(0);
    expect(transformed.objects[0]).toMatchObject({
      x: 120,
      y: 80,
      width: 196,
      height: 186,
      rotation: 0,
    });
    expect(fronted.objects.at(-1)?.id).toBe('constellation-1');
    expect(removed.objects).toHaveLength(1);
    expect(cleared.objects).toEqual([]);
  });

  it('preserves background while changing canvas and background settings', () => {
    const initialProject = createDefaultConstellationProject();
    const withColor = setConstellationBackgroundColor(initialProject, '#123456');
    const withTransparency = setConstellationTransparentBase(withColor, true);
    const withImage = setConstellationBackgroundImage(
      withTransparency,
      '/background.png',
      1200,
      800,
    );
    const resized = resizeConstellationCanvas(withImage, 1200, 800);
    const withoutImage = removeConstellationBackgroundImage(resized);

    expect(withImage.background).toEqual({
      color: '#123456',
      transparent: true,
      imageUrl: '/background.png',
      imageWidth: 1200,
      imageHeight: 800,
    });
    expect(resized.width).toBe(1200);
    expect(resized.height).toBe(800);
    expect(withoutImage.background.imageUrl).toBeNull();
    expect(withoutImage.background.color).toBe('#123456');
    expect(withoutImage.background.transparent).toBe(true);
  });

  it('fails fast at project boundaries', () => {
    const project = createDefaultConstellationProject();
    expect(() => addConstellation(project, 'line-62', 'object-1')).toThrow(
      'Unknown constellation asset id',
    );
    expect(() => addConstellation(project, 'line-1', 'object-1')).not.toThrow();
    expect(() => resizeConstellationCanvas(project, 4097, 600)).toThrow(
      'must be an integer from 1 to 4096',
    );
    expect(() => setConstellationBackgroundColor(project, 'blue')).toThrow(
      '3- or 6-digit hexadecimal color',
    );
    expect(() => setConstellationBackgroundImage(project, '//remote.test/a.png', 10, 10)).toThrow(
      'must not be protocol-relative',
    );
    expect(() => setConstellationBackgroundImage(project, 'http://remote.test/a.png', 10, 10)).toThrow(
      'same-origin root path or an absolute https URL',
    );
    expect(() => setConstellationBackgroundImage(project, 'relative.png', 10, 10)).toThrow(
      'same-origin root path or an absolute https URL',
    );
  });

  it('keeps an existing angle when drag or scale omits rotation, and resets only for explicit 0', () => {
    const placed = transformConstellationObject(
      addConstellation(createDefaultConstellationProject(), 'image-1', 'constellation-1'),
      'constellation-1',
      { x: 12.25, y: 8.5, width: 98.5, height: 93.25 },
    );
    const rotated = transformConstellationObject(placed, 'constellation-1', {
      x: 12.25,
      y: 8.5,
      width: 98.5,
      height: 93.25,
      rotation: -90,
    });
    const storedWithUnnormalizedAngle = {
      ...rotated,
      objects: [{ ...rotated.objects[0], rotation: 450 }],
    };

    const dragged = transformConstellationObject(storedWithUnnormalizedAngle, 'constellation-1', {
      x: 40,
      y: 18,
      width: 98.5,
      height: 93.25,
    });
    const resized = transformConstellationObject(dragged, 'constellation-1', {
      x: 40,
      y: 18,
      width: 120,
      height: 110.5,
    });
    const fronted = bringConstellationToFront(
      addConstellationStar(resized, 'star-1'),
      'constellation-1',
    );
    const preservedThroughUndefined = transformConstellationObject(fronted, 'constellation-1', {
      x: 40,
      y: 18,
      width: 120,
      height: 110.5,
      rotation: undefined,
    });
    const reset = transformConstellationObject(preservedThroughUndefined, 'constellation-1', {
      x: 40,
      y: 18,
      width: 120,
      height: 110.5,
      rotation: 0,
    });

    expect(rotated.objects[0]).toEqual({
      id: 'constellation-1',
      kind: 'constellation',
      assetId: 'image-1',
      x: 12.25,
      y: 8.5,
      width: 98.5,
      height: 93.25,
      rotation: 270,
    });
    expect(storedWithUnnormalizedAngle.objects[0]?.rotation).toBe(450);
    expect(dragged.objects[0]).toMatchObject({
      x: 40,
      y: 18,
      width: 98.5,
      height: 93.25,
      rotation: 90,
    });
    expect(resized.objects[0]).toMatchObject({
      x: 40,
      y: 18,
      width: 120,
      height: 110.5,
      rotation: 90,
    });
    expect(fronted.objects.at(-1)).toMatchObject({ id: 'constellation-1', rotation: 90 });
    expect(preservedThroughUndefined.objects.at(-1)?.rotation).toBe(90);
    expect(reset.objects.at(-1)).toMatchObject({
      x: 40,
      y: 18,
      width: 120,
      height: 110.5,
      rotation: 0,
    });
  });

  it('rejects illegal rotation values without changing position or the source project', () => {
    const placed = transformConstellationObject(
      addConstellation(createDefaultConstellationProject(), 'image-1', 'constellation-1'),
      'constellation-1',
      { x: 12.25, y: 8.5, width: 98.5, height: 93.25, rotation: 33.5 },
    );
    const illegalRotations = [
      { rotation: null, received: 'null' },
      { rotation: '45', received: '"45"' },
      { rotation: Number.NaN, received: 'NaN' },
      { rotation: Number.POSITIVE_INFINITY, received: 'Infinity' },
      { rotation: Number.NEGATIVE_INFINITY, received: '-Infinity' },
    ];

    for (const illegalRotation of illegalRotations) {
      const beforeProjectText = JSON.stringify(placed);
      expect(() =>
        transformConstellationObject(placed, 'constellation-1', {
          x: 1,
          y: 2,
          width: 30,
          height: 40,
          rotation: illegalRotation.rotation as never,
        }),
      ).toThrow(`Received ${illegalRotation.received}`);
      expect(JSON.stringify(placed)).toBe(beforeProjectText);
      expect(placed.objects[0]).toMatchObject({
        x: 12.25,
        y: 8.5,
        width: 98.5,
        height: 93.25,
        rotation: 33.5,
      });
    }

    const corruptProject = {
      ...placed,
      objects: [{ ...placed.objects[0], rotation: Number.NaN }],
    };
    expect(() =>
      transformConstellationObject(corruptProject, 'constellation-1', {
        x: 12.25,
        y: 8.5,
        width: 98.5,
        height: 93.25,
      }),
    ).toThrow('Received NaN');
    expect(() =>
      transformConstellationObject(placed, 'constellation-1', {
        x: 12.25,
        y: 8.5,
        width: 98.5,
        height: 93.25,
        spin: 15,
      } as never),
    ).toThrow('Unknown ["spin"]');
  });
});
