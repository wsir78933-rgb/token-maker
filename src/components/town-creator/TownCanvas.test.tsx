// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { SiteLocale } from '@/lib/site-locale';
import type { TownDocument, TownLayerId, TownObject, TownObjectPatch } from '@/lib/town-creator/types';

import { TownCanvas } from './TownCanvas';

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
        objects: [{
          id: 'lower-house',
          assetId: 'buildings-house-01-cottage',
          material: 'wood',
          x: 8,
          y: 16,
          width: 64,
          height: 64,
          rotationDegrees: 0,
        }],
      },
      {
        id: 'middle',
        visible: true,
        objects: [
          {
            id: 'middle-road',
            assetId: 'roads-road1',
            material: 'neutral',
            x: 40,
            y: 80,
            width: 128,
            height: 64,
            rotationDegrees: 0,
          },
          {
            id: 'middle-house',
            assetId: 'buildings-house-01-cottage',
            material: 'stone',
            x: 120,
            y: 20,
            width: 64,
            height: 64,
            rotationDegrees: 45,
          },
        ],
      },
      {
        id: 'upper',
        visible: false,
        objects: [{
          id: 'hidden-house',
          assetId: 'buildings-house-01-cottage',
          material: 'clay',
          x: 220,
          y: 120,
          width: 64,
          height: 64,
          rotationDegrees: 0,
        }],
      },
    ],
  };
}

function setStageBounds(stage: HTMLElement, width = 320, height = 240): void {
  Object.defineProperty(stage, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      bottom: height,
      height,
      left: 0,
      right: width,
      top: 0,
      width,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }),
  });
}

function renderCanvas(
  document: TownDocument,
  options: {
    locale?: SiteLocale;
    selectedObjectId?: string | null;
    snapEnabled?: boolean;
    resizeEnabled?: boolean;
    onSelectObject?: (id: string | null) => void;
    onSelectObjectInLayer?: (objectId: string, layerId: TownLayerId) => void;
    onUpdateObject?: (id: string, patch: TownObjectPatch) => void;
  } = {},
) {
  const onSelectObject = options.onSelectObject ?? vi.fn();
  const onSelectObjectInLayer = options.onSelectObjectInLayer ?? vi.fn();
  const onUpdateObject = options.onUpdateObject ?? vi.fn();
  const rendered = render(
    <TownCanvas
      document={document}
      selectedObjectId={options.selectedObjectId ?? null}
      snapEnabled={options.snapEnabled ?? true}
      resizeEnabled={options.resizeEnabled ?? false}
      locale={options.locale ?? 'en'}
      onSelectObject={onSelectObject}
      onSelectObjectInLayer={onSelectObjectInLayer}
      onUpdateObject={onUpdateObject}
    />,
  );
  const stage = screen.getByRole('application');
  setStageBounds(stage);

  function rerenderCanvas(
    nextDocument: TownDocument,
    nextSelectedObjectId: string | null = options.selectedObjectId ?? null,
  ): HTMLElement {
    rendered.rerender(
      <TownCanvas
        document={nextDocument}
        selectedObjectId={nextSelectedObjectId}
        snapEnabled={options.snapEnabled ?? true}
        resizeEnabled={options.resizeEnabled ?? false}
        locale={options.locale ?? 'en'}
        onSelectObject={onSelectObject}
        onSelectObjectInLayer={onSelectObjectInLayer}
        onUpdateObject={onUpdateObject}
      />,
    );
    const nextStage = screen.getByRole('application');
    setStageBounds(nextStage);
    return nextStage;
  }

  return { ...rendered, onSelectObject, onSelectObjectInLayer, onUpdateObject, stage, rerenderCanvas };
}

function rotateTestPoint(point: { x: number; y: number }, center: { x: number; y: number }, degrees: number) {
  const radians = degrees * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const x = point.x - center.x;
  const y = point.y - center.y;
  return {
    x: center.x + x * cos - y * sin,
    y: center.y + x * sin + y * cos,
  };
}

function getTestObjectCenter(object: TownObject) {
  return { x: object.x + object.width / 2, y: object.y + object.height / 2 };
}

function getTestHandleLocalPoint(object: TownObject, handle: string) {
  return {
    x: handle.includes('w') ? object.x : handle.includes('e') ? object.x + object.width : object.x + object.width / 2,
    y: handle.includes('n') ? object.y : handle.includes('s') ? object.y + object.height : object.y + object.height / 2,
  };
}

function getTestOppositeWorldPoint(object: TownObject, handle: string) {
  const localPoint = {
    x: handle.includes('w') ? object.x + object.width : handle.includes('e') ? object.x : object.x + object.width / 2,
    y: handle.includes('n') ? object.y + object.height : handle.includes('s') ? object.y : object.y + object.height / 2,
  };
  return rotateTestPoint(localPoint, getTestObjectCenter(object), object.rotationDegrees);
}

function readPointerDownError(target: Element, pointerId: number): Error | null {
  const reported: Error[] = [];
  const onWindowError = (event: Event) => {
    if (!(event instanceof ErrorEvent)) {
      return;
    }
    event.preventDefault();
    if (event.error instanceof Error) {
      reported.push(event.error);
    }
  };
  window.addEventListener('error', onWindowError);
  try {
    fireEvent.pointerDown(target, {
      button: 0,
      clientX: 4,
      clientY: 4,
      pointerId,
      pointerType: 'mouse',
    });
  } finally {
    window.removeEventListener('error', onWindowError);
  }
  if (reported.length > 1) {
    throw new Error(
      `Town canvas pointer down reported ${reported.length} errors: ${reported.map((error) => error.message).join(' | ')}.`,
    );
  }
  return reported[0] ?? null;
}

function appendTownObjectHit(
  container: HTMLElement,
  objectId: string,
  layerId: string | null,
): SVGElement {
  const svg = container.querySelector('svg');
  if (!(svg instanceof SVGSVGElement)) {
    throw new Error('Town svg is missing from the rendered scene.');
  }

  const objectElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  objectElement.setAttribute('data-town-object-id', objectId);
  if (layerId !== null) {
    objectElement.setAttribute('data-town-layer-id', layerId);
  }
  svg.appendChild(objectElement);
  return objectElement;
}

function replaceMiddleObjects(document: TownDocument, objects: readonly TownObject[]): TownDocument {
  return {
    ...document,
    layers: document.layers.map((layer) => layer.id === 'middle' ? { ...layer, objects } : layer),
  };
}

const HANDLE_HIT_SCREEN_PX = 44;
const SMALL_TILE_VIEW_SCALE = 42 / 64;

type PublishedHandleBox = {
  handle: string;
  centerX: number;
  centerY: number;
};

function readCssPx(value: string, label: string): number {
  if (!value.endsWith('px')) {
    throw new Error(`${label} must be a px length, received ${JSON.stringify(value)}.`);
  }

  const parsed = Number(value.slice(0, -2));
  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a finite px length, received ${JSON.stringify(value)}.`);
  }

  return parsed;
}

function readDisplayScale(stage: HTMLElement): number {
  const rawScale = stage.style.getPropertyValue('--town-display-scale');
  const displayScale = Number(rawScale);
  if (!Number.isFinite(displayScale) || displayScale <= 0) {
    throw new Error(`Town stage published an invalid display scale ${JSON.stringify(rawScale)}.`);
  }

  return displayScale;
}

function readPublishedHandleBoxes(
  selection: HTMLElement,
  object: Pick<TownObject, 'width' | 'height'>,
  displayScale: number,
): PublishedHandleBox[] {
  return Array.from(selection.querySelectorAll<HTMLElement>('[data-town-handle]')).map((element) => {
    const handle = element.getAttribute('data-town-handle');
    if (handle === null || handle.length === 0) {
      throw new Error('Town resize handle is missing data-town-handle.');
    }
    if (element.style.width !== '' || element.style.height !== '') {
      throw new Error(`Town ${handle} handle overrides the stylesheet hit size with ${element.style.width} by ${element.style.height}.`);
    }

    const anchorX = readCssPx(element.style.left, `${handle} handle left`);
    const anchorY = readCssPx(element.style.top, `${handle} handle top`);
    return {
      handle,
      centerX: (anchorX - object.width / 2) * displayScale,
      centerY: (anchorY - object.height / 2) * displayScale,
    };
  });
}

function nearestPublishedHandleDistance(
  boxes: readonly PublishedHandleBox[],
  point: { x: number; y: number },
): number {
  const first = boxes[0];
  if (first === undefined) {
    throw new Error('Town handle distance was asked for an empty handle list.');
  }

  return boxes.reduce((nearest, box) => Math.min(
    nearest,
    Math.hypot(point.x - box.centerX, point.y - box.centerY),
  ), Math.hypot(point.x - first.centerX, point.y - first.centerY));
}

function readHandleViewportPoint(
  object: TownObject,
  box: PublishedHandleBox,
  displayScale: number,
  frameInset: number,
): { x: number; y: number } {
  const unrotated = {
    x: object.x + object.width / 2 + box.centerX / displayScale,
    y: object.y + object.height / 2 + box.centerY / displayScale,
  };
  const rotated = rotateTestPoint(unrotated, getTestObjectCenter(object), object.rotationDegrees);
  return {
    x: frameInset + rotated.x * displayScale,
    y: frameInset + rotated.y * displayScale,
  };
}

function requirePublishedHandle(boxes: readonly PublishedHandleBox[], handle: string): PublishedHandleBox {
  const box = boxes.find((candidate) => candidate.handle === handle);
  if (box === undefined) {
    throw new Error(`Town handle ${handle} is missing. Found ${boxes.map((candidate) => candidate.handle).join(', ')}.`);
  }

  return box;
}

function restoreElementProperty(
  prototype: object,
  name: 'clientWidth' | 'clientHeight',
  previous: PropertyDescriptor | undefined,
): void {
  if (previous) {
    Object.defineProperty(prototype, name, previous);
    return;
  }

  Reflect.deleteProperty(prototype, name);
}

function withElementClientSize(width: number, height: number, run: () => void): void {
  const prototype = HTMLElement.prototype;
  const previousWidth = Object.getOwnPropertyDescriptor(prototype, 'clientWidth');
  const previousHeight = Object.getOwnPropertyDescriptor(prototype, 'clientHeight');
  Object.defineProperty(prototype, 'clientWidth', {
    configurable: true,
    get() {
      return width;
    },
  });
  Object.defineProperty(prototype, 'clientHeight', {
    configurable: true,
    get() {
      return height;
    },
  });
  try {
    run();
  } finally {
    restoreElementProperty(prototype, 'clientWidth', previousWidth);
    restoreElementProperty(prototype, 'clientHeight', previousHeight);
  }
}

function makeViewportDocument(objects: readonly TownObject[]): TownDocument {
  const base = makeTownDocument();
  return {
    ...base,
    width: 1200,
    height: 635,
    activeLayer: 'middle',
    layers: base.layers.map((layer) => (
      layer.id === 'middle'
        ? { ...layer, visible: true, objects: [...objects] }
        : { ...layer, objects: [] }
    )),
  };
}

function renderSelectedObject(
  object: TownObject,
  options: { snapEnabled?: boolean; resizeEnabled?: boolean } = {},
) {
  return renderCanvas(replaceMiddleObjects(makeTownDocument(), [object]), {
    selectedObjectId: object.id,
    resizeEnabled: options.resizeEnabled ?? true,
    snapEnabled: options.snapEnabled ?? false,
  });
}

afterEach(cleanup);

describe('TownCanvas', () => {
  it('selects the top visible object in its own layer and drags it in the same gesture', () => {
    const onSelectObject = vi.fn();
    const onSelectObjectInLayer = vi.fn();
    const onUpdateObject = vi.fn();
    const { container, stage } = renderCanvas(makeTownDocument(), {
      onSelectObject,
      onSelectObjectInLayer,
      onUpdateObject,
    });
    const road = container.querySelector('[data-town-object-id="middle-road"]');
    const lowerHouse = container.querySelector('[data-town-object-id="lower-house"]');

    if (!(road instanceof SVGElement) || !(lowerHouse instanceof SVGElement)) {
      throw new Error('Town active and inactive layer objects are missing from the rendered scene.');
    }

    fireEvent.pointerDown(road, {
      button: 0,
      clientX: 40,
      clientY: 80,
      pointerId: 1,
      pointerType: 'mouse',
    });
    expect(document.activeElement).toBe(stage);
    fireEvent.pointerMove(stage, {
      clientX: 53,
      clientY: 92,
      pointerId: 1,
      pointerType: 'mouse',
    });
    fireEvent.pointerUp(stage, { pointerId: 1, pointerType: 'mouse' });

    expect(onSelectObjectInLayer).toHaveBeenCalledWith('middle-road', 'middle');
    expect(onSelectObject).not.toHaveBeenCalled();
    expect(onUpdateObject).toHaveBeenCalledWith('middle-road', { x: 55, y: 90 });
    const middleLayer = container.querySelector('[data-town-layer-id="middle"]');
    expect(middleLayer?.lastElementChild?.getAttribute('data-town-object-id')).toBe('middle-road');
    expect(Array.from(container.querySelectorAll('[data-town-layer-visible="true"]')).map((layer) => layer.getAttribute('data-town-layer-id')))
      .toEqual(['lower', 'middle']);

    fireEvent.pointerDown(lowerHouse, {
      button: 0,
      clientX: 16,
      clientY: 24,
      pointerId: 2,
      pointerType: 'mouse',
    });
    fireEvent.pointerMove(stage, {
      clientX: 29,
      clientY: 36,
      pointerId: 2,
      pointerType: 'mouse',
    });

    expect(onSelectObjectInLayer).toHaveBeenNthCalledWith(2, 'lower-house', 'lower');
    expect(onSelectObject).not.toHaveBeenCalled();
    expect(onUpdateObject).toHaveBeenCalledWith('lower-house', { x: 20, y: 30 });
    expect(document.activeElement).toBe(stage);
    expect(container.querySelector('[data-town-object-id="hidden-house"]')).toBeNull();
  });

  it('keeps a drag that started on another visible layer after the active layer changes', () => {
    const onUpdateObject = vi.fn();
    const townDocument = makeTownDocument();
    const rendered = renderCanvas(townDocument, { onUpdateObject });
    const lowerHouse = rendered.container.querySelector('[data-town-object-id="lower-house"]');
    if (!(lowerHouse instanceof SVGElement)) {
      throw new Error('Town lower house is missing from the rendered scene.');
    }

    fireEvent.pointerDown(lowerHouse, {
      button: 0,
      clientX: 20,
      clientY: 30,
      pointerId: 8,
      pointerType: 'mouse',
    });
    fireEvent.pointerMove(rendered.stage, {
      clientX: 33,
      clientY: 42,
      pointerId: 8,
      pointerType: 'mouse',
    });
    expect(rendered.onSelectObjectInLayer).toHaveBeenCalledWith('lower-house', 'lower');
    expect(onUpdateObject).toHaveBeenCalledWith('lower-house', { x: 20, y: 30 });

    const stageBeforeActiveLayer = rendered.rerenderCanvas(townDocument, 'lower-house');
    fireEvent.pointerMove(stageBeforeActiveLayer, {
      clientX: 46,
      clientY: 54,
      pointerId: 8,
      pointerType: 'mouse',
    });
    expect(onUpdateObject).toHaveBeenCalledWith('lower-house', { x: 35, y: 40 });

    const stageAfterActiveLayer = rendered.rerenderCanvas(
      { ...townDocument, activeLayer: 'lower' },
      'lower-house',
    );
    fireEvent.pointerMove(stageAfterActiveLayer, {
      clientX: 58,
      clientY: 67,
      pointerId: 8,
      pointerType: 'mouse',
    });
    expect(onUpdateObject).toHaveBeenCalledWith('lower-house', { x: 45, y: 55 });
    expect(onUpdateObject).toHaveBeenCalledTimes(3);
  });

  it('clears selection from the background and focuses the canvas stage', () => {
    const { container, onSelectObject, onSelectObjectInLayer, onUpdateObject, stage } = renderCanvas(makeTownDocument());
    const background = container.querySelector('[data-town-background="true"]');
    if (!(background instanceof SVGElement)) {
      throw new Error('Town background is missing from the rendered scene.');
    }

    fireEvent.pointerDown(background, {
      button: 0,
      clientX: 1,
      clientY: 1,
      pointerId: 7,
      pointerType: 'mouse',
    });
    fireEvent.pointerMove(stage, {
      clientX: 20,
      clientY: 20,
      pointerId: 7,
      pointerType: 'mouse',
    });

    expect(onSelectObject).toHaveBeenCalledTimes(1);
    expect(onSelectObject).toHaveBeenCalledWith(null);
    expect(onSelectObjectInLayer).not.toHaveBeenCalled();
    expect(onUpdateObject).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(stage);
  });

  it('ignores hits on a hidden layer and rejects unknown layers or object ids', () => {
    const { container, onSelectObject, onSelectObjectInLayer, onUpdateObject } = renderCanvas(makeTownDocument());
    expect(container.querySelector('[data-town-object-id="hidden-house"]')).toBeNull();

    const hiddenHit = appendTownObjectHit(container, 'not-a-real-object', 'upper');
    expect(readPointerDownError(hiddenHit, 11)).toBeNull();
    expect(onSelectObjectInLayer).not.toHaveBeenCalled();
    expect(onSelectObject).not.toHaveBeenCalled();
    expect(onUpdateObject).not.toHaveBeenCalled();

    const unknownLayerHit = appendTownObjectHit(container, 'ghost-house', 'roof');
    expect(readPointerDownError(unknownLayerHit, 12)?.message)
      .toBe('Town object "ghost-house" has unknown layer "roof".');

    const missingLayerHit = appendTownObjectHit(container, 'bare-house', null);
    expect(readPointerDownError(missingLayerHit, 13)?.message)
      .toBe('Town object "bare-house" has unknown layer null.');

    const missingObjectHit = appendTownObjectHit(container, 'ghost-road', 'middle');
    expect(readPointerDownError(missingObjectHit, 14)?.message)
      .toBe('Town object "ghost-road" was rendered but is missing from visible layer "middle".');
    expect(onSelectObjectInLayer).not.toHaveBeenCalled();
    expect(onSelectObject).not.toHaveBeenCalled();
  });

  it('maps pointer coordinates through a scaled viewport without changing document coordinates', () => {
    const onUpdateObject = vi.fn();
    const { container, stage } = renderCanvas(makeTownDocument(), {
      onUpdateObject,
    });
    setStageBounds(stage, 160, 120);
    const road = container.querySelector('[data-town-object-id="middle-road"]');

    if (!(road instanceof SVGElement)) {
      throw new Error('Town road object is missing from the rendered scene.');
    }

    fireEvent.pointerDown(road, {
      button: 0,
      clientX: 20,
      clientY: 40,
      pointerId: 3,
      pointerType: 'mouse',
    });
    fireEvent.pointerMove(stage, {
      clientX: 26.5,
      clientY: 46,
      pointerId: 3,
      pointerType: 'mouse',
    });

    expect(onUpdateObject).toHaveBeenCalledWith('middle-road', { x: 55, y: 90 });
  });

  it('shows localized selection controls and resizes a rotated regular object with a fixed aspect ratio', () => {
    const onUpdateObject = vi.fn();
    const onSelectObject = vi.fn();
    const onSelectObjectInLayer = vi.fn();
    const { container, stage } = renderCanvas(makeTownDocument(), {
      locale: 'zh',
      selectedObjectId: 'middle-house',
      resizeEnabled: true,
      onSelectObject,
      onSelectObjectInLayer,
      onUpdateObject,
    });
    const selection = screen.getByLabelText('已选择城镇对象');
    const handle = selection.querySelector('[data-town-handle="se"]');

    if (!(handle instanceof HTMLButtonElement)) {
      throw new Error('Town southeast resize handle is missing from the selection overlay.');
    }

    expect(handle.disabled).toBe(false);
    expect(screen.getByLabelText('调整尺寸控制点；可使用方向键: se')).toBe(handle);
    expect(Array.from(selection.querySelectorAll('[data-town-handle]')).map((item) => item.getAttribute('data-town-handle')))
      .toEqual(['nw', 'ne', 'se', 'sw']);
    const rotatedHouse = {
      x: 120,
      y: 20,
      width: 64,
      height: 64,
      rotationDegrees: 45,
    };
    const rotatedAnchor = {
      x: rotatedHouse.x + readCssPx(handle.style.left, 'southeast left'),
      y: rotatedHouse.y + readCssPx(handle.style.top, 'southeast top'),
    };
    const rotatedStart = rotateTestPoint(rotatedAnchor, { x: 152, y: 52 }, rotatedHouse.rotationDegrees);
    const rotatedDelta = { x: 17.7, y: 17.7 };
    fireEvent.pointerDown(handle, {
      button: 0,
      clientX: rotatedStart.x,
      clientY: rotatedStart.y,
      pointerId: 4,
      pointerType: 'mouse',
    });
    fireEvent.pointerMove(stage, {
      clientX: rotatedStart.x + rotatedDelta.x,
      clientY: rotatedStart.y + rotatedDelta.y,
      pointerId: 4,
      pointerType: 'mouse',
    });

    const resizeCall = onUpdateObject.mock.lastCall;
    if (resizeCall === undefined) {
      throw new Error('Rotated regular resize did not call the update callback.');
    }
    expect(resizeCall[0]).toBe('middle-house');
    expect(resizeCall[1]).toMatchObject({ width: 90, height: 90 });
    expect(resizeCall[1].x).toBeCloseTo(107, 3);
    expect(resizeCall[1].y).toBeCloseTo(25.3848, 3);
    expect(container.querySelector('[data-town-selection="true"]')).toBe(selection);
    expect(onSelectObject).not.toHaveBeenCalled();
    expect(onSelectObjectInLayer).not.toHaveBeenCalled();
  });

  it('keeps dragging available when resize controls are disabled', () => {
    const onUpdateObject = vi.fn();
    const { container, stage } = renderCanvas(makeTownDocument(), {
      selectedObjectId: 'middle-house',
      resizeEnabled: false,
      onUpdateObject,
    });
    const house = container.querySelector('[data-town-object-id="middle-house"]');
    const selection = screen.getByLabelText('Selected town object');

    if (!(house instanceof SVGElement)) {
      throw new Error('Town selected house is missing from the rendered scene.');
    }

    expect(selection.querySelector('[data-town-handle="se"]')).toBeNull();
    fireEvent.pointerDown(house, {
      button: 0,
      clientX: 152,
      clientY: 52,
      pointerId: 5,
      pointerType: 'mouse',
    });
    fireEvent.pointerMove(stage, {
      clientX: 164,
      clientY: 60,
      pointerId: 5,
      pointerType: 'mouse',
    });

    expect(onUpdateObject).toHaveBeenCalledWith('middle-house', { x: 130, y: 30 });
  });

  it('shows only the two end handles for a line and publishes inverse scale metadata', () => {
    const { container, stage } = renderCanvas(makeTownDocument(), {
      selectedObjectId: 'middle-road',
      resizeEnabled: true,
    });
    const selection = screen.getByLabelText('Selected town object');

    expect(Array.from(selection.querySelectorAll('[data-town-handle]')).map((item) => item.getAttribute('data-town-handle')))
      .toEqual(['e', 'w']);
    expect(container.querySelectorAll('[data-town-handle]')).toHaveLength(2);
    expect(stage.style.getPropertyValue('--town-display-scale')).toBe('1');
    expect(stage.style.getPropertyValue('--town-display-inverse-scale')).toBe('1');
  });

  it('keeps the opposite world anchor fixed for rotated non-square corner and line resizes', () => {
    const angles = [45, 90, 135] as const;
    const cases: readonly { assetId: string; handle: 'nw' | 'se' | 'w' | 'e'; delta: { x: number; y: number } }[] = [
      { assetId: 'buildings-house-01-cottage', handle: 'nw', delta: { x: -13, y: -7 } },
      { assetId: 'buildings-house-01-cottage', handle: 'se', delta: { x: 13, y: 7 } },
      { assetId: 'roads-road1', handle: 'w', delta: { x: -13, y: 0 } },
      { assetId: 'roads-road1', handle: 'e', delta: { x: 13, y: 0 } },
    ];

    for (const angle of angles) {
      for (const resizeCase of cases) {
        const originalObject: TownObject = resizeCase.assetId.startsWith('buildings-')
          ? {
            id: 'rotated-object',
            assetId: resizeCase.assetId,
            material: 'stone',
            x: 100,
            y: 100,
            width: 100,
            height: 50,
            rotationDegrees: angle,
          }
          : {
            id: 'rotated-object',
            assetId: resizeCase.assetId,
            material: 'neutral',
            x: 100,
            y: 100,
            width: 100,
            height: 64,
            rotationDegrees: angle,
          };
        const document = replaceMiddleObjects(makeTownDocument(), [originalObject]);
        const onUpdateObject = vi.fn();
        const rendered = renderCanvas(document, {
          selectedObjectId: originalObject.id,
          resizeEnabled: true,
          onUpdateObject,
        });
        const handle = rendered.container.querySelector(`[data-town-handle="${resizeCase.handle}"]`);
        if (!(handle instanceof HTMLButtonElement)) {
          throw new Error(`Missing ${resizeCase.handle} handle for ${resizeCase.assetId} at ${angle} degrees.`);
        }
        const localHandlePoint = getTestHandleLocalPoint(originalObject, resizeCase.handle);
        const center = getTestObjectCenter(originalObject);
        const worldHandlePoint = rotateTestPoint(localHandlePoint, center, angle);
        const worldDraggedPoint = rotateTestPoint(
          { x: localHandlePoint.x + resizeCase.delta.x, y: localHandlePoint.y + resizeCase.delta.y },
          center,
          angle,
        );

        fireEvent.pointerDown(handle, {
          button: 0,
          clientX: worldHandlePoint.x,
          clientY: worldHandlePoint.y,
          pointerId: 20 + angle,
          pointerType: 'mouse',
        });
        fireEvent.pointerMove(rendered.stage, {
          clientX: worldDraggedPoint.x,
          clientY: worldDraggedPoint.y,
          pointerId: 20 + angle,
          pointerType: 'mouse',
        });

        const call = onUpdateObject.mock.lastCall;
        if (call === undefined) {
          throw new Error(`Resize callback did not run for ${resizeCase.handle} at ${angle} degrees.`);
        }
        const patch = call[1];
        const resizedObject = { ...originalObject, ...patch };
        const before = getTestOppositeWorldPoint(originalObject, resizeCase.handle);
        const after = getTestOppositeWorldPoint(resizedObject, resizeCase.handle);
        expect(after.x).toBeCloseTo(before.x, 4);
        expect(after.y).toBeCloseTo(before.y, 4);
        rendered.unmount();
        cleanup();
      }
    }
  });

  it('snaps only the dragged west edge while keeping an unrounded right edge fixed', () => {
    const originalObject: TownObject = {
      id: 'snap-line',
      assetId: 'roads-road1',
      material: 'neutral',
      x: 103,
      y: 100,
      width: 100,
      height: 64,
      rotationDegrees: 0,
    };
    const onUpdateObject = vi.fn();
    const rendered = renderCanvas(replaceMiddleObjects(makeTownDocument(), [originalObject]), {
      selectedObjectId: originalObject.id,
      resizeEnabled: true,
      onUpdateObject,
    });
    const handle = rendered.container.querySelector('[data-town-handle="w"]');
    if (!(handle instanceof HTMLButtonElement)) {
      throw new Error('Missing west line resize handle for snap test.');
    }

    fireEvent.pointerDown(handle, {
      button: 0,
      clientX: 103,
      clientY: 132,
      pointerId: 99,
      pointerType: 'mouse',
    });
    fireEvent.pointerMove(rendered.stage, {
      clientX: 107,
      clientY: 132,
      pointerId: 99,
      pointerType: 'mouse',
    });

    expect(onUpdateObject).toHaveBeenCalledWith('snap-line', {
      x: 108,
      y: 100,
      width: 95,
      height: 64,
    });
  });

  it('adjusts focused handles with one-pixel or five-pixel arrow-key steps', () => {
    const onUpdateObject = vi.fn();
    const rendered = renderCanvas(makeTownDocument(), {
      selectedObjectId: 'middle-road',
      resizeEnabled: true,
      onUpdateObject,
    });
    const handle = rendered.container.querySelector('[data-town-handle="e"]');
    if (!(handle instanceof HTMLButtonElement)) {
      throw new Error('Missing east line resize handle for keyboard test.');
    }

    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(onUpdateObject).toHaveBeenCalledWith('middle-road', {
      x: 40,
      y: 80,
      width: 135,
      height: 64,
    });

    rendered.unmount();
    cleanup();
    const onePixelUpdate = vi.fn();
    const onePixelRendered = renderCanvas(makeTownDocument(), {
      selectedObjectId: 'middle-road',
      snapEnabled: false,
      resizeEnabled: true,
      onUpdateObject: onePixelUpdate,
    });
    const onePixelHandle = onePixelRendered.container.querySelector('[data-town-handle="e"]');
    if (!(onePixelHandle instanceof HTMLButtonElement)) {
      throw new Error('Missing east line resize handle for one-pixel keyboard test.');
    }

    fireEvent.keyDown(onePixelHandle, { key: 'ArrowRight' });
    expect(onePixelUpdate).toHaveBeenCalledWith('middle-road', {
      x: 40,
      y: 80,
      width: 129,
      height: 64,
    });
  });

  it('keeps large handles on the object edges and only spreads handles that would collide', () => {
    const farmland: TownObject = {
      id: 'farmland',
      assetId: 'terrain-farmland',
      material: 'neutral',
      x: 20,
      y: 30,
      width: 64,
      height: 64,
      rotationDegrees: 0,
    };
    const cottage: TownObject = {
      id: 'cottage',
      assetId: 'buildings-house-01-cottage',
      material: 'stone',
      x: 20,
      y: 20,
      width: 128,
      height: 128,
      rotationDegrees: 0,
    };
    const wall: TownObject = {
      id: 'wall',
      assetId: 'defenses-wall1',
      material: 'stone',
      x: 16,
      y: 40,
      width: 128,
      height: 64,
      rotationDegrees: 0,
    };
    const shortWall: TownObject = {
      id: 'short-wall',
      assetId: 'defenses-wall1',
      material: 'stone',
      x: 40,
      y: 80,
      width: 24,
      height: 64,
      rotationDegrees: 0,
    };
    const rendered = renderSelectedObject(farmland);
    const selection = screen.getByLabelText('Selected town object');
    const displayScale = readDisplayScale(rendered.stage);
    expect(displayScale).toBe(1);

    const tileBoxes = readPublishedHandleBoxes(selection, farmland, displayScale);
    expect(tileBoxes.map((box) => box.handle)).toEqual(['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']);
    expect(requirePublishedHandle(tileBoxes, 'e')).toMatchObject({ centerX: 32, centerY: 0 });
    expect(requirePublishedHandle(tileBoxes, 's')).toMatchObject({ centerX: 0, centerY: 32 });
    expect(requirePublishedHandle(tileBoxes, 'se')).toMatchObject({ centerX: 32, centerY: 32 });
    expect(nearestPublishedHandleDistance(tileBoxes, { x: 0, y: 0 })).toBeCloseTo(32, 4);

    rendered.rerenderCanvas(replaceMiddleObjects(makeTownDocument(), [cottage]), cottage.id);
    const cottageBoxes = readPublishedHandleBoxes(screen.getByLabelText('Selected town object'), cottage, readDisplayScale(rendered.stage));
    expect(cottageBoxes.map((box) => box.handle)).toEqual(['nw', 'ne', 'se', 'sw']);
    expect(requirePublishedHandle(cottageBoxes, 'se')).toMatchObject({ centerX: 64, centerY: 64 });
    expect(requirePublishedHandle(cottageBoxes, 'nw')).toMatchObject({ centerX: -64, centerY: -64 });
    expect(nearestPublishedHandleDistance(cottageBoxes, { x: 0, y: 0 })).toBeCloseTo(64 * Math.SQRT2, 4);

    rendered.rerenderCanvas(replaceMiddleObjects(makeTownDocument(), [wall]), wall.id);
    const wallBoxes = readPublishedHandleBoxes(screen.getByLabelText('Selected town object'), wall, readDisplayScale(rendered.stage));
    expect(wallBoxes.map((box) => box.handle)).toEqual(['e', 'w']);
    expect(requirePublishedHandle(wallBoxes, 'e')).toMatchObject({ centerX: 64, centerY: 0 });
    expect(requirePublishedHandle(wallBoxes, 'w')).toMatchObject({ centerX: -64, centerY: 0 });
    expect(nearestPublishedHandleDistance(wallBoxes, { x: 0, y: 0 })).toBeCloseTo(64, 4);

    rendered.rerenderCanvas(replaceMiddleObjects(makeTownDocument(), [shortWall]), shortWall.id);
    const shortWallBoxes = readPublishedHandleBoxes(
      screen.getByLabelText('Selected town object'),
      shortWall,
      readDisplayScale(rendered.stage),
    );
    expect(shortWallBoxes.map((box) => box.handle)).toEqual(['e', 'w']);
    expect(requirePublishedHandle(shortWallBoxes, 'e').centerX).toBeCloseTo(12, 5);
    expect(requirePublishedHandle(shortWallBoxes, 'w').centerX).toBeCloseTo(-12, 5);
    expect(nearestPublishedHandleDistance(shortWallBoxes, { x: 0, y: 0 })).toBeCloseTo(12, 4);
    rendered.unmount();
  });

  it('keeps a 42px tile body clear and medium handles on their geometric anchors', () => {
    const farmland: TownObject = {
      id: 'farmland',
      assetId: 'terrain-farmland',
      material: 'neutral',
      x: 400,
      y: 180,
      width: 64,
      height: 64,
      rotationDegrees: 0,
    };
    const cottage: TownObject = {
      id: 'cottage',
      assetId: 'buildings-house-01-cottage',
      material: 'stone',
      x: 560,
      y: 180,
      width: 128,
      height: 128,
      rotationDegrees: 0,
    };
    const wall: TownObject = {
      id: 'wall',
      assetId: 'defenses-wall1',
      material: 'stone',
      x: 180,
      y: 360,
      width: 128,
      height: 64,
      rotationDegrees: 0,
    };
    const largeField: TownObject = {
      id: 'large-field',
      assetId: 'terrain-farmland',
      material: 'neutral',
      x: 80,
      y: 40,
      width: 200,
      height: 160,
      rotationDegrees: 0,
    };
    const gate: TownObject = {
      id: 'gate',
      assetId: 'defenses-gate-small',
      material: 'wood',
      x: 760,
      y: 240,
      width: 128,
      height: 96,
      rotationDegrees: 0,
    };
    const clientWidth = 32 + 1200 * SMALL_TILE_VIEW_SCALE;
    const clientHeight = 700;

    withElementClientSize(clientWidth, clientHeight, () => {
      const rendered = renderCanvas(makeViewportDocument([farmland]), {
        selectedObjectId: farmland.id,
        resizeEnabled: true,
        snapEnabled: false,
      });
      try {
        const displayScale = readDisplayScale(rendered.stage);
        const inverseScale = Number(rendered.stage.style.getPropertyValue('--town-display-inverse-scale'));
        expect(displayScale).toBeCloseTo(SMALL_TILE_VIEW_SCALE, 6);
        expect(farmland.width * displayScale).toBeCloseTo(42, 4);
        expect(HANDLE_HIT_SCREEN_PX * displayScale * inverseScale).toBeCloseTo(HANDLE_HIT_SCREEN_PX, 4);

        const tileBoxes = readPublishedHandleBoxes(screen.getByLabelText('Selected town object'), farmland, displayScale);
        expect(tileBoxes).toHaveLength(8);
        expect(requirePublishedHandle(tileBoxes, 'e').centerX).toBeCloseTo(21, 4);
        expect(requirePublishedHandle(tileBoxes, 'e').centerY).toBeCloseTo(0, 4);
        expect(requirePublishedHandle(tileBoxes, 's').centerX).toBeCloseTo(0, 4);
        expect(requirePublishedHandle(tileBoxes, 's').centerY).toBeCloseTo(21, 4);
        expect(requirePublishedHandle(tileBoxes, 'se').centerX).toBeCloseTo(21, 4);
        expect(requirePublishedHandle(tileBoxes, 'se').centerY).toBeCloseTo(21, 4);
        expect(requirePublishedHandle(tileBoxes, 'n').centerY).toBeCloseTo(-21, 4);
        expect(requirePublishedHandle(tileBoxes, 'w').centerX).toBeCloseTo(-21, 4);
        expect(nearestPublishedHandleDistance(tileBoxes, { x: 0, y: 0 })).toBeCloseTo(21, 4);

        rendered.rerenderCanvas(makeViewportDocument([cottage]), cottage.id);
        const cottageScale = readDisplayScale(screen.getByRole('application'));
        const cottageBoxes = readPublishedHandleBoxes(screen.getByLabelText('Selected town object'), cottage, cottageScale);
        expect(cottageBoxes.map((box) => box.handle)).toEqual(['nw', 'ne', 'se', 'sw']);
        expect(requirePublishedHandle(cottageBoxes, 'se').centerX).toBeCloseTo(42, 4);
        expect(requirePublishedHandle(cottageBoxes, 'se').centerY).toBeCloseTo(42, 4);
        expect(requirePublishedHandle(cottageBoxes, 'nw').centerX).toBeCloseTo(-42, 4);
        expect(requirePublishedHandle(cottageBoxes, 'nw').centerY).toBeCloseTo(-42, 4);
        expect(nearestPublishedHandleDistance(cottageBoxes, { x: 0, y: 0 })).toBeGreaterThan(21);

        rendered.rerenderCanvas(makeViewportDocument([wall]), wall.id);
        const wallScale = readDisplayScale(screen.getByRole('application'));
        const wallBoxes = readPublishedHandleBoxes(screen.getByLabelText('Selected town object'), wall, wallScale);
        expect(wallBoxes.map((box) => box.handle)).toEqual(['e', 'w']);
        expect(requirePublishedHandle(wallBoxes, 'e').centerX).toBeCloseTo(42, 4);
        expect(requirePublishedHandle(wallBoxes, 'e').centerY).toBeCloseTo(0, 4);
        expect(requirePublishedHandle(wallBoxes, 'w').centerX).toBeCloseTo(-42, 4);
        expect(nearestPublishedHandleDistance(wallBoxes, { x: 0, y: 0 })).toBeCloseTo(42, 4);

        rendered.rerenderCanvas(makeViewportDocument([largeField]), largeField.id);
        const largeScale = readDisplayScale(screen.getByRole('application'));
        const largeBoxes = readPublishedHandleBoxes(screen.getByLabelText('Selected town object'), largeField, largeScale);
        expect(largeBoxes).toHaveLength(8);
        expect(requirePublishedHandle(largeBoxes, 'e').centerX).toBeCloseTo(65.625, 4);
        expect(requirePublishedHandle(largeBoxes, 'e').centerY).toBeCloseTo(0, 4);
        expect(requirePublishedHandle(largeBoxes, 's').centerY).toBeCloseTo(52.5, 4);
        expect(requirePublishedHandle(largeBoxes, 'se').centerX).toBeCloseTo(65.625, 4);
        expect(requirePublishedHandle(largeBoxes, 'se').centerY).toBeCloseTo(52.5, 4);
        expect(nearestPublishedHandleDistance(largeBoxes, { x: 0, y: 0 })).toBeGreaterThan(52);

        rendered.rerenderCanvas(makeViewportDocument([gate]), gate.id);
        const gateScale = readDisplayScale(screen.getByRole('application'));
        const gateBoxes = readPublishedHandleBoxes(screen.getByLabelText('Selected town object'), gate, gateScale);
        expect(gateBoxes.map((box) => box.handle)).toEqual(['nw', 'ne', 'se', 'sw']);
        expect(requirePublishedHandle(gateBoxes, 'se').centerX).toBeCloseTo(42, 4);
        expect(requirePublishedHandle(gateBoxes, 'se').centerY).toBeCloseTo(31.5, 4);
        expect(requirePublishedHandle(gateBoxes, 'nw').centerX).toBeCloseTo(-42, 4);
        expect(requirePublishedHandle(gateBoxes, 'nw').centerY).toBeCloseTo(-31.5, 4);
        expect(nearestPublishedHandleDistance(gateBoxes, { x: 0, y: 0 })).toBeGreaterThan(31);
      } finally {
        rendered.unmount();
        cleanup();
      }
    });
  });

  it('keeps an origin tile handle center inside the measured phone viewport', () => {
    const phoneWidth = 344;
    const phoneHeight = 594;
    const farmland: TownObject = {
      id: 'farmland',
      assetId: 'terrain-farmland',
      material: 'neutral',
      x: 0,
      y: 0,
      width: 64,
      height: 64,
      rotationDegrees: 0,
    };
    const rotatedFarmland: TownObject = { ...farmland, rotationDegrees: 45 };

    withElementClientSize(phoneWidth, phoneHeight, () => {
      const rendered = renderCanvas(makeViewportDocument([farmland]), {
        selectedObjectId: farmland.id,
        resizeEnabled: true,
      });
      try {
        const displayScale = readDisplayScale(rendered.stage);
        expect(displayScale).toBeCloseTo((phoneWidth - 32) / 1200, 6);
        const frameInset = (phoneWidth - 1200 * displayScale) / 2;
        const tileBoxes = readPublishedHandleBoxes(screen.getByLabelText('Selected town object'), farmland, displayScale);
        expect(tileBoxes).toHaveLength(8);
        const northwest = readHandleViewportPoint(farmland, requirePublishedHandle(tileBoxes, 'nw'), displayScale, frameInset);
        expect(northwest.x).toBeCloseTo(14.32, 1);
        expect(northwest.y).toBeCloseTo(14.32, 1);
        for (const box of tileBoxes) {
          const screenPoint = readHandleViewportPoint(farmland, box, displayScale, frameInset);
          expect(screenPoint.x).toBeGreaterThanOrEqual(0);
          expect(screenPoint.y).toBeGreaterThanOrEqual(0);
          expect(screenPoint.x).toBeLessThanOrEqual(phoneWidth);
          expect(screenPoint.y).toBeLessThanOrEqual(phoneHeight);
        }

        rendered.rerenderCanvas(makeViewportDocument([rotatedFarmland]), rotatedFarmland.id);
        const rotatedScale = readDisplayScale(screen.getByRole('application'));
        const rotatedBoxes = readPublishedHandleBoxes(
          screen.getByLabelText('Selected town object'),
          rotatedFarmland,
          rotatedScale,
        );
        const rotatedNorthwest = readHandleViewportPoint(
          rotatedFarmland,
          requirePublishedHandle(rotatedBoxes, 'nw'),
          rotatedScale,
          frameInset,
        );
        expect(rotatedNorthwest.x).toBeCloseTo(24.32, 1);
        expect(rotatedNorthwest.y).toBeCloseTo(10.18, 1);
        for (const box of rotatedBoxes) {
          const screenPoint = readHandleViewportPoint(rotatedFarmland, box, rotatedScale, frameInset);
          expect(screenPoint.x).toBeGreaterThanOrEqual(0);
          expect(screenPoint.y).toBeGreaterThanOrEqual(0);
          expect(screenPoint.x).toBeLessThanOrEqual(phoneWidth);
          expect(screenPoint.y).toBeLessThanOrEqual(phoneHeight);
        }
      } finally {
        rendered.unmount();
        cleanup();
      }
    });
  });

  it('drags a small tile body and resizes only the handle that was grabbed', () => {
    const farmland: TownObject = {
      id: 'farmland',
      assetId: 'terrain-farmland',
      material: 'neutral',
      x: 30,
      y: 40,
      width: 64,
      height: 64,
      rotationDegrees: 0,
    };
    const onUpdateObject = vi.fn();
    const rendered = renderCanvas(replaceMiddleObjects(makeTownDocument(), [farmland]), {
      selectedObjectId: farmland.id,
      resizeEnabled: true,
      snapEnabled: false,
      onUpdateObject,
    });
    const tile = rendered.container.querySelector('[data-town-object-id="farmland"]');
    const selection = screen.getByLabelText('Selected town object');
    if (!(tile instanceof SVGElement)) {
      throw new Error('Terrain farmland is missing from the rendered scene.');
    }

    const center = getTestObjectCenter(farmland);
    fireEvent.pointerDown(tile, {
      button: 0,
      clientX: center.x,
      clientY: center.y,
      pointerId: 31,
      pointerType: 'mouse',
    });
    fireEvent.pointerMove(rendered.stage, {
      clientX: center.x + 12,
      clientY: center.y + 14,
      pointerId: 31,
      pointerType: 'mouse',
    });
    expect(onUpdateObject).toHaveBeenCalledWith('farmland', { x: 42, y: 54 });
    expect(onUpdateObject).toHaveBeenCalledTimes(1);

    function resizeFromHandle(handleName: 'e' | 's' | 'se', deltaX: number, deltaY: number, pointerId: number): void {
      const handle = selection.querySelector(`[data-town-handle="${handleName}"]`);
      if (!(handle instanceof HTMLButtonElement)) {
        throw new Error(`Town ${handleName} handle is missing from the small tile.`);
      }
      const anchorX = farmland.x + readCssPx(handle.style.left, `${handleName} left`);
      const anchorY = farmland.y + readCssPx(handle.style.top, `${handleName} top`);
      fireEvent.pointerDown(handle, {
        button: 0,
        clientX: anchorX,
        clientY: anchorY,
        pointerId,
        pointerType: 'mouse',
      });
      fireEvent.pointerMove(rendered.stage, {
        clientX: anchorX + deltaX,
        clientY: anchorY + deltaY,
        pointerId,
        pointerType: 'mouse',
      });
      fireEvent.pointerUp(rendered.stage, { pointerId, pointerType: 'mouse' });
    }

    resizeFromHandle('e', 8, 6, 32);
    expect(onUpdateObject).toHaveBeenLastCalledWith('farmland', {
      x: 30,
      y: 40,
      width: 72,
      height: 64,
    });
    resizeFromHandle('s', 6, 8, 33);
    expect(onUpdateObject).toHaveBeenLastCalledWith('farmland', {
      x: 30,
      y: 40,
      width: 64,
      height: 72,
    });
    resizeFromHandle('se', 8, 5, 34);
    expect(onUpdateObject).toHaveBeenLastCalledWith('farmland', {
      x: 30,
      y: 40,
      width: 72,
      height: 69,
    });

    const eastHandle = selection.querySelector('[data-town-handle="e"]');
    if (!(eastHandle instanceof HTMLButtonElement)) {
      throw new Error('Town east handle is missing before the keyboard check.');
    }
    fireEvent.keyDown(eastHandle, { key: 'ArrowUp' });
    expect(onUpdateObject).toHaveBeenCalledTimes(4);
    fireEvent.keyDown(eastHandle, { key: 'ArrowRight' });
    expect(onUpdateObject).toHaveBeenLastCalledWith('farmland', {
      x: 30,
      y: 40,
      width: 65,
      height: 64,
    });
  });

  it('keeps the opposite anchor fixed when resizing a rotated tile from the spread handle', () => {
    const farmland: TownObject = {
      id: 'rotated-farmland',
      assetId: 'terrain-farmland',
      material: 'neutral',
      x: 80,
      y: 60,
      width: 64,
      height: 64,
      rotationDegrees: 25,
    };
    const onUpdateObject = vi.fn();
    const rendered = renderCanvas(replaceMiddleObjects(makeTownDocument(), [farmland]), {
      selectedObjectId: farmland.id,
      resizeEnabled: true,
      snapEnabled: false,
      onUpdateObject,
    });
    const selection = screen.getByLabelText('Selected town object');
    const handle = selection.querySelector('[data-town-handle="se"]');
    if (!(handle instanceof HTMLButtonElement)) {
      throw new Error('Rotated farmland is missing its southeast handle.');
    }

    expect(selection.style.transform).toBe('rotate(25deg)');
    const localStart = {
      x: farmland.x + readCssPx(handle.style.left, 'southeast left'),
      y: farmland.y + readCssPx(handle.style.top, 'southeast top'),
    };
    expect(localStart.x).toBeCloseTo(farmland.x + farmland.width, 4);
    expect(localStart.y).toBeCloseTo(farmland.y + farmland.height, 4);
    const center = getTestObjectCenter(farmland);
    const localDelta = { x: 11, y: 5 };
    const worldStart = rotateTestPoint(localStart, center, farmland.rotationDegrees);
    const worldEnd = rotateTestPoint(
      { x: localStart.x + localDelta.x, y: localStart.y + localDelta.y },
      center,
      farmland.rotationDegrees,
    );

    fireEvent.pointerDown(handle, {
      button: 0,
      clientX: worldStart.x,
      clientY: worldStart.y,
      pointerId: 41,
      pointerType: 'mouse',
    });
    fireEvent.pointerMove(rendered.stage, {
      clientX: worldEnd.x,
      clientY: worldEnd.y,
      pointerId: 41,
      pointerType: 'mouse',
    });

    const call = onUpdateObject.mock.lastCall;
    if (call === undefined) {
      throw new Error('Rotated farmland resize did not call the update callback.');
    }
    const patch = call[1];
    expect(patch.width).toBeCloseTo(farmland.width + localDelta.x, 4);
    expect(patch.height).toBeCloseTo(farmland.height + localDelta.y, 4);
    const resizedObject = { ...farmland, ...patch };
    const before = getTestOppositeWorldPoint(farmland, 'se');
    const after = getTestOppositeWorldPoint(resizedObject, 'se');
    expect(after.x).toBeCloseTo(before.x, 4);
    expect(after.y).toBeCloseTo(before.y, 4);
  });

  it('routes overlapping handles by the pointer and drags the topmost visible object', () => {
    const tinyTile: TownObject = {
      id: 'tiny-tile',
      assetId: 'terrain-farmland',
      material: 'neutral',
      x: 40,
      y: 50,
      width: 8,
      height: 8,
      rotationDegrees: 0,
    };
    const onUpdateObject = vi.fn();
    const onSelectObjectInLayer = vi.fn();
    const rendered = renderCanvas(replaceMiddleObjects(makeTownDocument(), [tinyTile]), {
      selectedObjectId: tinyTile.id,
      resizeEnabled: true,
      snapEnabled: false,
      onUpdateObject,
      onSelectObjectInLayer,
    });
    const selection = screen.getByLabelText('Selected town object');
    const center = getTestObjectCenter(tinyTile);

    function handleButton(handleName: string): HTMLButtonElement {
      const handle = selection.querySelector(`[data-town-handle="${handleName}"]`);
      if (!(handle instanceof HTMLButtonElement)) {
        throw new Error(`Town ${handleName} handle is missing from the tiny tile.`);
      }
      return handle;
    }

    function publishedPoint(handleName: string): { x: number; y: number } {
      const handle = handleButton(handleName);
      return {
        x: tinyTile.x + readCssPx(handle.style.left, `${handleName} left`),
        y: tinyTile.y + readCssPx(handle.style.top, `${handleName} top`),
      };
    }

    fireEvent.pointerDown(handleButton('w'), {
      button: 0,
      clientX: center.x,
      clientY: center.y,
      pointerId: 51,
      pointerType: 'mouse',
    });
    fireEvent.pointerMove(rendered.stage, {
      clientX: center.x + 5,
      clientY: center.y + 6,
      pointerId: 51,
      pointerType: 'mouse',
    });
    fireEvent.pointerUp(rendered.stage, { pointerId: 51, pointerType: 'mouse' });
    expect(onUpdateObject).toHaveBeenLastCalledWith('tiny-tile', { x: 45, y: 56 });
    expect(onSelectObjectInLayer).toHaveBeenCalledWith('tiny-tile', 'middle');

    const directions: readonly {
      handle: 'n' | 'e' | 's' | 'w' | 'ne' | 'se' | 'sw' | 'nw';
      delta: { x: number; y: number };
      patch: { x: number; y: number; width: number; height: number };
    }[] = [
      { handle: 'e', delta: { x: 7, y: 0 }, patch: { x: 40, y: 50, width: 15, height: 8 } },
      { handle: 's', delta: { x: 0, y: 7 }, patch: { x: 40, y: 50, width: 8, height: 15 } },
      { handle: 'w', delta: { x: -7, y: 0 }, patch: { x: 33, y: 50, width: 15, height: 8 } },
      { handle: 'n', delta: { x: 0, y: -7 }, patch: { x: 40, y: 43, width: 8, height: 15 } },
      { handle: 'se', delta: { x: 7, y: 7 }, patch: { x: 40, y: 50, width: 15, height: 15 } },
      { handle: 'nw', delta: { x: -7, y: -7 }, patch: { x: 33, y: 43, width: 15, height: 15 } },
      { handle: 'ne', delta: { x: 7, y: -7 }, patch: { x: 40, y: 43, width: 15, height: 15 } },
      { handle: 'sw', delta: { x: -7, y: 7 }, patch: { x: 33, y: 50, width: 15, height: 15 } },
    ];
    for (const [index, direction] of directions.entries()) {
      const point = publishedPoint(direction.handle);
      const wrongHandle = handleButton(direction.handle === 'w' ? 'e' : 'w');
      const pointerId = 60 + index;
      fireEvent.pointerDown(wrongHandle, {
        button: 0,
        clientX: point.x,
        clientY: point.y,
        pointerId,
        pointerType: 'mouse',
      });
      fireEvent.pointerMove(rendered.stage, {
        clientX: point.x + direction.delta.x,
        clientY: point.y + direction.delta.y,
        pointerId,
        pointerType: 'mouse',
      });
      fireEvent.pointerUp(rendered.stage, { pointerId, pointerType: 'mouse' });
      expect(onUpdateObject).toHaveBeenLastCalledWith('tiny-tile', direction.patch);
    }

    const cottage: TownObject = {
      id: 'wide-cottage',
      assetId: 'buildings-house-01-cottage',
      material: 'stone',
      x: 100,
      y: 100,
      width: 128,
      height: 128,
      rotationDegrees: 0,
    };
    rendered.rerenderCanvas(replaceMiddleObjects(makeTownDocument(), [cottage]), cottage.id);
    const cottageSelection = screen.getByLabelText('Selected town object');
    const southeast = cottageSelection.querySelector('[data-town-handle="se"]');
    const northwest = cottageSelection.querySelector('[data-town-handle="nw"]');
    if (!(southeast instanceof HTMLButtonElement) || !(northwest instanceof HTMLButtonElement)) {
      throw new Error('Wide cottage is missing a corner handle.');
    }
    const southeastPoint = {
      x: cottage.x + readCssPx(southeast.style.left, 'wide southeast left'),
      y: cottage.y + readCssPx(southeast.style.top, 'wide southeast top'),
    };
    const insideCircle = {
      x: southeastPoint.x - 16 / Math.SQRT2,
      y: southeastPoint.y - 16 / Math.SQRT2,
    };
    fireEvent.pointerDown(northwest, {
      button: 0,
      clientX: insideCircle.x,
      clientY: insideCircle.y,
      pointerId: 71,
      pointerType: 'mouse',
    });
    fireEvent.pointerMove(rendered.stage, {
      clientX: insideCircle.x + 9,
      clientY: insideCircle.y + 9,
      pointerId: 71,
      pointerType: 'mouse',
    });
    fireEvent.pointerUp(rendered.stage, { pointerId: 71, pointerType: 'mouse' });
    expect(onUpdateObject).toHaveBeenLastCalledWith('wide-cottage', {
      x: 100,
      y: 100,
      width: 137,
      height: 137,
    });

    const lowerTile: TownObject = { ...tinyTile, id: 'lower-tile' };
    const middleTile: TownObject = { ...tinyTile, id: 'middle-tile' };
    const hiddenTile: TownObject = { ...tinyTile, id: 'hidden-tile' };
    const layered = makeTownDocument();
    const layeredDocument: TownDocument = {
      ...layered,
      activeLayer: 'lower',
      layers: [
        { id: 'lower', visible: true, objects: [lowerTile] },
        { id: 'middle', visible: true, objects: [middleTile] },
        { id: 'upper', visible: false, objects: [hiddenTile] },
      ],
    };
    const layeredStage = rendered.rerenderCanvas(layeredDocument, lowerTile.id);
    const layeredSelection = screen.getByLabelText('Selected town object');
    const layeredHandle = layeredSelection.querySelector('[data-town-handle="se"]');
    if (!(layeredHandle instanceof HTMLButtonElement)) {
      throw new Error('Layered tile is missing its southeast handle.');
    }
    expect(rendered.container.querySelector('[data-town-object-id="hidden-tile"]')).toBeNull();
    const hiddenHit = appendTownObjectHit(rendered.container, hiddenTile.id, 'upper');
    const layeredCenter = getTestObjectCenter(lowerTile);
    fireEvent.pointerDown(layeredHandle, {
      button: 0,
      clientX: layeredCenter.x,
      clientY: layeredCenter.y,
      pointerId: 81,
      pointerType: 'mouse',
    });
    fireEvent.pointerMove(layeredStage, {
      clientX: layeredCenter.x + 4,
      clientY: layeredCenter.y + 3,
      pointerId: 81,
      pointerType: 'mouse',
    });
    expect(onSelectObjectInLayer).toHaveBeenCalledWith('middle-tile', 'middle');
    expect(onUpdateObject).toHaveBeenLastCalledWith('middle-tile', { x: 44, y: 53 });
    expect(onUpdateObject).not.toHaveBeenCalledWith('hidden-tile', expect.anything());
    expect(onSelectObjectInLayer).not.toHaveBeenCalledWith('hidden-tile', 'upper');
    hiddenHit.remove();
    rendered.unmount();
  });

  it('fits the frame to old, tall, and custom map ratios without editing objects', () => {
    const maps = [
      { width: 1200, height: 635, slotWidth: 900, slotHeight: 900 },
      { width: 1200, height: 800, slotWidth: 1600, slotHeight: 500 },
      { width: 900, height: 400, slotWidth: 2000, slotHeight: 2000 },
    ] as const;

    for (const map of maps) {
      withElementClientSize(map.slotWidth, map.slotHeight, () => {
        const townDocument: TownDocument = {
          ...makeTownDocument(),
          width: map.width,
          height: map.height,
        };
        const road = townDocument.layers[1]?.objects[0];
        if (road === undefined) {
          throw new Error(`Town map ${map.width}×${map.height} is missing its middle road.`);
        }
        const onUpdateObject = vi.fn();
        const rendered = renderCanvas(townDocument, { onUpdateObject });
        try {
          const scale = readDisplayScale(rendered.stage);
          const contentWidth = map.slotWidth - 32;
          const contentHeight = map.slotHeight - 32;
          const expectedScale = Math.min(1, contentWidth / map.width, contentHeight / map.height);
          expect(scale).toBeCloseTo(expectedScale, 6);
          expect(readCssPx(rendered.stage.style.width, `${map.width} stage width`)).toBe(map.width);
          expect(readCssPx(rendered.stage.style.height, `${map.height} stage height`)).toBe(map.height);
          const transformMatch = /^scale\(([^,)]+)\)$/.exec(rendered.stage.style.transform);
          if (transformMatch?.[1] === undefined) {
            throw new Error(
              `Town map ${map.width}×${map.height} transform must be one uniform scale, received ${JSON.stringify(rendered.stage.style.transform)}.`,
            );
          }
          expect(Number(transformMatch[1])).toBeCloseTo(scale, 6);

          const frame = rendered.container.querySelector('section');
          if (!(frame instanceof HTMLElement)) {
            throw new Error(`Town map ${map.width}×${map.height} frame is missing.`);
          }
          const frameWidth = readCssPx(frame.style.width, `${map.width} frame width`);
          const frameHeight = readCssPx(frame.style.height, `${map.height} frame height`);
          expect(frameWidth - 32).toBeCloseTo(map.width * scale, 4);
          expect(frameHeight - 32).toBeCloseTo(map.height * scale, 4);
          expect((frameWidth - 32) / map.width).toBeCloseTo((frameHeight - 32) / map.height, 6);
          if (contentWidth / map.width <= contentHeight / map.height && expectedScale < 1) {
            expect(frameHeight).toBeLessThan(map.slotHeight);
          }
          if (contentHeight / map.height < contentWidth / map.width && expectedScale < 1) {
            expect(frameWidth).toBeLessThan(map.slotWidth);
          }
          if (expectedScale === 1) {
            expect(frameWidth).toBeLessThan(map.slotWidth);
            expect(frameHeight).toBeLessThan(map.slotHeight);
          }
          expect(rendered.container.querySelector('[data-town-object-id="middle-road"]')).toBeTruthy();
          expect(onUpdateObject).not.toHaveBeenCalled();
          expect(road).toMatchObject({ x: 40, y: 80, width: 128, height: 64 });
        } finally {
          rendered.unmount();
          cleanup();
        }
      });
    }
  });

  it('updates only the display frame when the layout slot size changes', () => {
    let slotWidth = 900;
    let slotHeight = 900;
    const prototype = HTMLElement.prototype;
    const previousWidth = Object.getOwnPropertyDescriptor(prototype, 'clientWidth');
    const previousHeight = Object.getOwnPropertyDescriptor(prototype, 'clientHeight');
    Object.defineProperty(prototype, 'clientWidth', {
      configurable: true,
      get() {
        return slotWidth;
      },
    });
    Object.defineProperty(prototype, 'clientHeight', {
      configurable: true,
      get() {
        return slotHeight;
      },
    });

    const slotObservers: Array<{ emit: () => void }> = [];
    class TownCanvasSlotResizeObserver {
      constructor(private readonly callback: ResizeObserverCallback) {
        slotObservers.push(this);
      }

      observe(): void {}

      unobserve(): void {}

      disconnect(): void {}

      emit(): void {
        this.callback([], this as unknown as ResizeObserver);
      }
    }
    vi.stubGlobal('ResizeObserver', TownCanvasSlotResizeObserver);

    const townDocument: TownDocument = {
      ...makeTownDocument(),
      width: 1200,
      height: 635,
    };
    const onUpdateObject = vi.fn();
    try {
      const rendered = renderCanvas(townDocument, { onUpdateObject });
      const sceneMarkup = rendered.stage.innerHTML;
      const firstScale = readDisplayScale(rendered.stage);
      expect(firstScale).toBeCloseTo(Math.min(1, (900 - 32) / 1200, (900 - 32) / 635), 6);

      slotWidth = 1600;
      slotHeight = 500;
      const observer = slotObservers.at(-1);
      if (observer === undefined) {
        throw new Error('Town map canvas did not observe its layout slot.');
      }
      act(() => {
        observer.emit();
      });

      const nextScale = readDisplayScale(rendered.stage);
      expect(nextScale).toBeCloseTo((500 - 32) / 635, 6);
      expect(nextScale).not.toBeCloseTo(firstScale, 6);
      expect(readCssPx(rendered.stage.style.width, 'resized stage width')).toBe(1200);
      expect(readCssPx(rendered.stage.style.height, 'resized stage height')).toBe(635);
      expect(rendered.stage.style.transform).toBe(`scale(${nextScale})`);
      expect(rendered.stage.innerHTML).toBe(sceneMarkup);
      expect(onUpdateObject).not.toHaveBeenCalled();

      const frame = rendered.container.querySelector('section');
      if (!(frame instanceof HTMLElement)) {
        throw new Error('Town map canvas frame is missing after the slot resize.');
      }
      const frameWidth = readCssPx(frame.style.width, 'resized frame width');
      const frameHeight = readCssPx(frame.style.height, 'resized frame height');
      expect(frameHeight).toBeCloseTo(500, 4);
      expect(frameWidth).toBeLessThan(1600);
      expect((frameWidth - 32) / 1200).toBeCloseTo((frameHeight - 32) / 635, 6);
      rendered.unmount();
    } finally {
      cleanup();
      vi.unstubAllGlobals();
      restoreElementProperty(prototype, 'clientWidth', previousWidth);
      restoreElementProperty(prototype, 'clientHeight', previousHeight);
    }
  });
});
