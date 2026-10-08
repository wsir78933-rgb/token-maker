// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ComponentProps } from 'react';

import {
  addConstellation,
  addConstellationStar,
  createDefaultConstellationProject,
  transformConstellationObject,
} from '@/lib/constellation-map-creator';
import type { ConstellationObject, ConstellationProject, ConstellationTransform } from '@/lib/constellation-map-creator/types';

import { ConstellationMapCreatorCanvas } from './ConstellationMapCreatorCanvas';

afterEach(cleanup);

function createCanvasProject(): ConstellationProject {
  const blankProject = createDefaultConstellationProject();
  return addConstellationStar(addConstellation(blankProject, 'image-1', 'constellation-1'), 'star-1');
}

function clientRect(width: number, height: number): DOMRect {
  return {
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: width,
    bottom: height,
    width,
    height,
    toJSON: () => ({}),
  };
}

function installCanvasPointerApis(clientWidth = 900, clientHeight = 600): SVGSVGElement {
  const canvas = screen.getByRole('group', { name: 'Constellation canvas' });
  if (!(canvas instanceof SVGSVGElement)) throw new Error('Expected the constellation canvas to be an SVG element.');
  vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue(clientRect(clientWidth, clientHeight));
  Object.defineProperty(canvas, 'setPointerCapture', { value: vi.fn(), configurable: true });
  Object.defineProperty(canvas, 'releasePointerCapture', { value: vi.fn(), configurable: true });
  Object.defineProperty(canvas, 'hasPointerCapture', { value: vi.fn(() => true), configurable: true });
  return canvas;
}

function renderCanvas(
  overrides: Partial<ComponentProps<typeof ConstellationMapCreatorCanvas>> = {},
  clientSize: { width: number; height: number } = { width: 900, height: 600 },
) {
  vi.spyOn(SVGSVGElement.prototype, 'getBoundingClientRect').mockReturnValue(clientRect(clientSize.width, clientSize.height));
  const project = overrides.project ?? createCanvasProject();
  const callbacks = {
    onSelectObject: vi.fn(),
    onObjectTransform: vi.fn(),
    onInteractionError: vi.fn(),
  };
  render(
    <ConstellationMapCreatorCanvas
      project={project}
      selectedObjectId={null}
      draggingEnabled
      resizingEnabled
      label="Constellation canvas"
      objectLabel="Object {number}"
      resizeLabel="Resize object {number}"
      rotateLabel="Rotate object {number}"
      {...callbacks}
      {...overrides}
    />,
  );
  const canvas = installCanvasPointerApis(clientSize.width, clientSize.height);
  return { canvas, callbacks, project };
}

describe('ConstellationMapCreatorCanvas', () => {
  it('uses a mobile-sized transparent hit area for a single star', () => {
    renderCanvas();

    const starHitArea = document.querySelector<SVGElement>('[data-constellation-object-hit="true"]:last-of-type');
    if (starHitArea === null) throw new Error('Expected a star hit area.');
    expect(Number(starHitArea.getAttribute('width'))).toBeGreaterThanOrEqual(44);
    expect(Number(starHitArea.getAttribute('height'))).toBeGreaterThanOrEqual(44);
  });

  it('selects an object once, moves it without deselecting, and supports keyboard movement', () => {
    const { canvas, callbacks } = renderCanvas();
    const object = screen.getByRole('button', { name: 'Object 1' });

    fireEvent.pointerDown(object, { button: 0, isPrimary: true, pointerId: 1, clientX: 12, clientY: 12 });
    fireEvent.pointerMove(canvas, { pointerId: 1, clientX: 32, clientY: 12 });
    fireEvent.pointerUp(canvas, { pointerId: 1, clientX: 32, clientY: 12 });

    expect(callbacks.onSelectObject).toHaveBeenCalledTimes(1);
    expect(callbacks.onSelectObject).toHaveBeenCalledWith('constellation-1');
    expect(callbacks.onObjectTransform).toHaveBeenCalledWith('constellation-1', {
      x: 20,
      y: 0,
      width: 98,
      height: 93,
    });

    fireEvent.keyDown(object, { key: 'ArrowRight' });
    expect(callbacks.onObjectTransform).toHaveBeenCalledTimes(1);
  });

  it('keeps the selected object selected after a drag and cancels selection on a second click', () => {
    const { canvas, callbacks, project } = renderCanvas({ selectedObjectId: 'constellation-1' });
    const object = screen.getByRole('button', { name: 'Object 1' });

    fireEvent.pointerDown(object, { button: 0, isPrimary: true, pointerId: 2, clientX: 12, clientY: 12 });
    fireEvent.pointerMove(canvas, { pointerId: 2, clientX: 32, clientY: 12 });
    fireEvent.pointerUp(canvas, { pointerId: 2, clientX: 32, clientY: 12 });
    expect(callbacks.onSelectObject).not.toHaveBeenCalled();

    fireEvent.pointerDown(object, { button: 0, isPrimary: true, pointerId: 3, clientX: 12, clientY: 12 });
    fireEvent.pointerUp(canvas, { pointerId: 3, clientX: 12, clientY: 12 });
    expect(callbacks.onSelectObject).toHaveBeenCalledWith(null);
    expect(project.objects[0]?.width).toBe(98);
  });

  it('does not drag when dragging is disabled and exposes proportional resize control only when enabled', () => {
    const disabledResize = renderCanvas({ draggingEnabled: false, resizingEnabled: false, selectedObjectId: 'constellation-1' });
    expect(screen.queryByRole('button', { name: 'Resize object 1' })).toBeNull();

    const object = screen.getByRole('button', { name: 'Object 1' });
    fireEvent.pointerDown(object, { button: 0, isPrimary: true, pointerId: 4, clientX: 12, clientY: 12 });
    fireEvent.pointerMove(disabledResize.canvas, { pointerId: 4, clientX: 80, clientY: 80 });
    fireEvent.pointerUp(disabledResize.canvas, { pointerId: 4, clientX: 80, clientY: 80 });
    expect(disabledResize.callbacks.onObjectTransform).not.toHaveBeenCalled();
    expect(disabledResize.callbacks.onSelectObject).toHaveBeenCalledWith(null);

    cleanup();
    const enabledResize = renderCanvas({ selectedObjectId: 'constellation-1' });
    const resizeHandle = screen.getByRole('button', { name: 'Resize object 1' });
    fireEvent.pointerDown(resizeHandle, { button: 0, isPrimary: true, pointerId: 5, clientX: 100, clientY: 100 });
    fireEvent.pointerMove(enabledResize.canvas, { pointerId: 5, clientX: 120, clientY: 120 });
    fireEvent.pointerUp(enabledResize.canvas, { pointerId: 5, clientX: 120, clientY: 120 });

    const resizeCall = enabledResize.callbacks.onObjectTransform.mock.calls[0];
    expect(resizeCall?.[0]).toBe('constellation-1');
    const resizedTransform = resizeCall?.[1] as { width: number; height: number };
    expect(resizedTransform.width).toBeGreaterThan(98);
    expect(resizedTransform.height / resizedTransform.width).toBeCloseTo(93 / 98, 5);
  });
});

function placeCanvasObject(
  box: Pick<ConstellationObject, 'x' | 'y' | 'width' | 'height'>,
  rotation?: number,
): ConstellationProject {
  const project = createCanvasProject();
  const source = project.objects[0];
  if (source === undefined) throw new Error('Expected a constellation object to place.');
  const placed: ConstellationObject = { ...source, ...box, rotation: rotation ?? source.rotation };
  if (rotation === undefined) delete placed.rotation;
  return { ...project, objects: [placed] };
}

function requireSvg(selector: string): SVGElement {
  const element = document.querySelector(selector);
  if (!(element instanceof SVGElement)) {
    throw new Error(`Expected an SVG element for ${selector}.`);
  }
  return element;
}

function readNumber(element: Element, name: string): number {
  const value = Number(element.getAttribute(name));
  if (!Number.isFinite(value)) {
    throw new Error(`Expected ${name} on ${element.tagName} to be finite. Received ${String(element.getAttribute(name))}.`);
  }
  return value;
}

function rectContains(rect: Element, x: number, y: number): boolean {
  const left = readNumber(rect, 'x');
  const top = readNumber(rect, 'y');
  return x >= left
    && y >= top
    && x <= left + readNumber(rect, 'width')
    && y <= top + readNumber(rect, 'height');
}

function localTopLeft(transform: ConstellationTransform, rotationDegrees: number): { x: number; y: number } {
  const centerX = transform.x + transform.width / 2;
  const centerY = transform.y + transform.height / 2;
  const radians = (rotationDegrees * Math.PI) / 180;
  const localX = -transform.width / 2;
  const localY = -transform.height / 2;
  return {
    x: centerX + localX * Math.cos(radians) - localY * Math.sin(radians),
    y: centerY + localX * Math.sin(radians) + localY * Math.cos(radians),
  };
}

function pointerAt(centerX: number, centerY: number, angleDegrees: number, radius: number): { clientX: number; clientY: number } {
  const radians = (angleDegrees * Math.PI) / 180;
  return {
    clientX: centerX + radius * Math.cos(radians),
    clientY: centerY + radius * Math.sin(radians),
  };
}

describe('Constellation map rotation handles', () => {
  it('rotates continuously around a fixed center and does not jump on the first small move', () => {
    const project = placeCanvasObject({ x: 300, y: 200, width: 200, height: 200 }, 0);
    const { canvas, callbacks } = renderCanvas({ project, selectedObjectId: 'constellation-1' });
    const handle = screen.getByRole('button', { name: 'Rotate object 1' });
    const down = pointerAt(400, 300, -90, 80);

    fireEvent.pointerDown(handle, { button: 0, isPrimary: true, pointerId: 7, ...down });
    expect(callbacks.onSelectObject).not.toHaveBeenCalled();
    expect(callbacks.onObjectTransform).not.toHaveBeenCalled();
    expect(canvas.setPointerCapture).toHaveBeenCalledWith(7);

    const nudge = { clientX: down.clientX + 2, clientY: down.clientY };
    fireEvent.pointerMove(canvas, { pointerId: 7, ...nudge });
    const nudged = callbacks.onObjectTransform.mock.calls.at(-1)?.[1] as ConstellationTransform;
    expect(nudged).toMatchObject({ x: 300, y: 200, width: 200, height: 200 });
    expect(nudged.rotation).toBeGreaterThan(0.2);
    expect(nudged.rotation).toBeLessThan(10);

    for (const angle of [0, 90, 180]) {
      fireEvent.pointerMove(canvas, { pointerId: 7, ...pointerAt(400, 300, angle, 80) });
    }
    const turned = callbacks.onObjectTransform.mock.calls.at(-1)?.[1] as ConstellationTransform;
    expect(turned.rotation).toBeCloseTo(270, 5);
    expect(turned).toMatchObject({ x: 300, y: 200, width: 200, height: 200 });

    fireEvent.pointerUp(canvas, { pointerId: 7, clientX: 300, clientY: 300 });
    expect(canvas.releasePointerCapture).toHaveBeenCalledWith(7);
    expect(callbacks.onSelectObject).not.toHaveBeenCalled();
    fireEvent.pointerMove(canvas, { pointerId: 7, clientX: 500, clientY: 300 });
    expect(callbacks.onObjectTransform.mock.calls.at(-1)?.[1]).toBe(turned);
  });

  it('keeps turning clockwise when the pointer crosses the angle branch cut', () => {
    const project = placeCanvasObject({ x: 300, y: 200, width: 200, height: 200 }, 15);
    const { canvas, callbacks } = renderCanvas({ project, selectedObjectId: 'constellation-1' });
    const handle = screen.getByRole('button', { name: 'Rotate object 1' });
    fireEvent.pointerDown(handle, { button: 0, isPrimary: true, pointerId: 8, ...pointerAt(400, 300, 170, 90) });
    fireEvent.pointerMove(canvas, { pointerId: 8, ...pointerAt(400, 300, -170, 90) });
    fireEvent.pointerUp(canvas, { pointerId: 8 });

    const turned = callbacks.onObjectTransform.mock.calls.at(-1)?.[1] as ConstellationTransform;
    expect(turned.rotation).toBeCloseTo(35, 5);
    expect(turned).toMatchObject({ x: 300, y: 200, width: 200, height: 200 });
  });

  it('releases capture on cancel and ignores a secondary pointer', () => {
    const project = placeCanvasObject({ x: 300, y: 200, width: 200, height: 200 }, 0);
    const { canvas, callbacks } = renderCanvas({ project, selectedObjectId: 'constellation-1' });
    const handle = screen.getByRole('button', { name: 'Rotate object 1' });

    fireEvent.pointerDown(handle, { button: 2, isPrimary: true, pointerId: 9, clientX: 400, clientY: 220 });
    expect(canvas.setPointerCapture).not.toHaveBeenCalled();
    expect(callbacks.onObjectTransform).not.toHaveBeenCalled();
    expect(callbacks.onSelectObject).not.toHaveBeenCalled();

    fireEvent.pointerDown(handle, { button: 0, isPrimary: true, pointerId: 10, ...pointerAt(400, 300, -90, 80) });
    fireEvent.pointerMove(canvas, { pointerId: 10, ...pointerAt(400, 300, 0, 80) });
    const movedCalls = callbacks.onObjectTransform.mock.calls.length;
    fireEvent.pointerCancel(canvas, { pointerId: 10 });
    expect(canvas.releasePointerCapture).toHaveBeenCalledWith(10);
    fireEvent.pointerMove(canvas, { pointerId: 10, ...pointerAt(400, 300, 90, 80) });
    expect(callbacks.onObjectTransform).toHaveBeenCalledTimes(movedCalls);
    expect(callbacks.onSelectObject).not.toHaveBeenCalled();

    fireEvent.pointerDown(handle, { button: 0, isPrimary: true, pointerId: 11, ...pointerAt(400, 300, -90, 80) });
    fireEvent.lostPointerCapture(canvas, { pointerId: 11 });
    expect(canvas.releasePointerCapture).toHaveBeenCalledWith(11);
    const afterLost = callbacks.onObjectTransform.mock.calls.length;
    fireEvent.pointerMove(canvas, { pointerId: 11, ...pointerAt(400, 300, 20, 80) });
    expect(callbacks.onObjectTransform).toHaveBeenCalledTimes(afterLost);
  });

  it('nudges the rotation handle with arrow keys and ignores the drag and resize switches', () => {
    const project = placeCanvasObject({ x: 300, y: 200, width: 120, height: 80 }, 90);
    const disabled = renderCanvas({
      project,
      selectedObjectId: 'constellation-1',
      draggingEnabled: false,
      resizingEnabled: false,
    });
    expect(screen.queryByRole('button', { name: 'Resize object 1' })).toBeNull();
    const handle = screen.getByRole('button', { name: 'Rotate object 1' });
    const handleClass = handle.getAttribute('class');
    expect(handleClass).toContain('cursor-pointer');
    expect(handle.getAttribute('tabindex')).toBe('0');
    expect(handleClass).toContain('focus-visible:outline');

    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    fireEvent.keyDown(handle, { key: 'ArrowUp', shiftKey: true });
    fireEvent.keyDown(handle, { key: 'ArrowLeft' });
    const turns = disabled.callbacks.onObjectTransform.mock.calls.map((call) => call[1] as ConstellationTransform);
    expect(turns.map((transform) => transform.rotation)).toEqual([91, 100, 89]);
    for (const transform of turns) {
      expect(transform).toMatchObject({ x: 300, y: 200, width: 120, height: 80 });
    }

    const object = screen.getByRole('button', { name: 'Object 1' });
    fireEvent.pointerDown(object, { button: 0, isPrimary: true, pointerId: 12, clientX: 360, clientY: 240 });
    fireEvent.pointerMove(disabled.canvas, { pointerId: 12, clientX: 420, clientY: 240 });
    expect(disabled.callbacks.onObjectTransform).toHaveBeenCalledTimes(3);
  });

  it('keeps 0, 90, and an arbitrary angle when dragging or scaling', () => {
    const storedAngles = [0, 90, 33.5];
    for (const storedAngle of storedAngles) {
      cleanup();
      const box = { x: 200, y: 150, width: 100, height: 50 };
      const project = placeCanvasObject(box, storedAngle);
      const { canvas, callbacks } = renderCanvas({ project, selectedObjectId: 'constellation-1' });
      const object = screen.getByRole('button', { name: 'Object 1' });
      fireEvent.pointerDown(object, { button: 0, isPrimary: true, pointerId: 13, clientX: 250, clientY: 175 });
      fireEvent.pointerMove(canvas, { pointerId: 13, clientX: 280, clientY: 175 });
      fireEvent.pointerUp(canvas, { pointerId: 13 });
      const dragged = callbacks.onObjectTransform.mock.calls.at(-1)?.[1] as ConstellationTransform;
      expect(dragged).toEqual({ x: 230, y: 150, width: 100, height: 50 });
      expect(transformConstellationObject(project, 'constellation-1', dragged).objects[0]?.rotation).toBe(storedAngle);

      const resizeHandle = screen.getByRole('button', { name: 'Resize object 1' });
      fireEvent.pointerDown(resizeHandle, { button: 0, isPrimary: true, pointerId: 14, clientX: 250, clientY: 175 });
      fireEvent.pointerMove(canvas, { pointerId: 14, clientX: 280, clientY: 175 });
      const resized = callbacks.onObjectTransform.mock.calls.at(-1)?.[1] as ConstellationTransform;
      expect(resized).not.toHaveProperty('rotation');
      expect(resized.height / resized.width).toBeCloseTo(0.5, 5);
      const beforeAnchor = localTopLeft(box, storedAngle);
      const afterAnchor = localTopLeft(resized, storedAngle);
      expect(afterAnchor.x).toBeCloseTo(beforeAnchor.x, 4);
      expect(afterAnchor.y).toBeCloseTo(beforeAnchor.y, 4);
      expect(transformConstellationObject(project, 'constellation-1', resized).objects[0]?.rotation).toBe(storedAngle);
    }
  });

  it('resizes a rotated object along its local axes and keeps an upright resize inside the old canvas bounds', () => {
    const rotated = placeCanvasObject({ x: 100, y: 80, width: 120, height: 60 }, 90);
    const rotatedView = renderCanvas({ project: rotated, selectedObjectId: 'constellation-1' });
    const rotatedHandle = screen.getByRole('button', { name: 'Resize object 1' });
    fireEvent.pointerDown(rotatedHandle, { button: 0, isPrimary: true, pointerId: 15, clientX: 160, clientY: 110 });
    fireEvent.pointerMove(rotatedView.canvas, { pointerId: 15, clientX: 160, clientY: 130 });
    const grown = rotatedView.callbacks.onObjectTransform.mock.calls.at(-1)?.[1] as ConstellationTransform;
    expect(grown.width).toBeCloseTo(140, 5);
    expect(grown.height).toBeCloseTo(70, 5);
    expect(grown).not.toHaveProperty('rotation');
    const rotatedAnchor = localTopLeft({ x: 100, y: 80, width: 120, height: 60 }, 90);
    const grownAnchor = localTopLeft(grown, 90);
    expect(grownAnchor.x).toBeCloseTo(rotatedAnchor.x, 4);
    expect(grownAnchor.y).toBeCloseTo(rotatedAnchor.y, 4);

    cleanup();
    const edged = placeCanvasObject({ x: 860, y: 40, width: 30, height: 20 }, 0);
    const edgedView = renderCanvas({ project: edged, selectedObjectId: 'constellation-1' });
    const edgedHandle = screen.getByRole('button', { name: 'Resize object 1' });
    fireEvent.pointerDown(edgedHandle, { button: 0, isPrimary: true, pointerId: 16, clientX: 880, clientY: 50 });
    fireEvent.pointerMove(edgedView.canvas, { pointerId: 16, clientX: 980, clientY: 50 });
    const bounded = edgedView.callbacks.onObjectTransform.mock.calls.at(-1)?.[1] as ConstellationTransform;
    expect(bounded).toMatchObject({ x: 860, y: 40, width: 40 });
    expect(bounded.height).toBeCloseTo(80 / 3, 5);
    expect(bounded.x + bounded.width).toBeLessThanOrEqual(900);
  });

  it('places the round handle 8 CSS px outside the box, with a 44 CSS px hit that leaves the center free', () => {
    const shortProject = placeCanvasObject({ x: 300, y: 200, width: 120, height: 80 }, 0);
    renderCanvas({ project: shortProject, selectedObjectId: 'constellation-1' });
    const shortGap = readGapCss(1);
    const shortHit = requireSvg('[data-constellation-rotation-hit="true"]');
    expect(readNumber(shortHit, 'width') / 1).toBeCloseTo(44, 4);
    expect(readNumber(shortHit, 'height')).toBeCloseTo(readNumber(shortHit, 'width'), 5);
    const shortCircle = requireSvg('[data-constellation-rotation-marker="true"]');
    expect(rectContains(shortHit, readNumber(shortCircle, 'cx'), readNumber(shortCircle, 'cy'))).toBe(true);
    expect(rectContains(shortHit, 360, 240)).toBe(false);
    expect(requireSvg('[data-constellation-rotation-icon="true"]')).toBeTruthy();
    expect(requireSvg('[data-constellation-rotation-stem="true"]')).toBeTruthy();
    const selection = requireSvg('[data-constellation-selection="true"]');
    expect(selection.parentElement).toBe(requireSvg('[data-constellation-object-frame="constellation-1"]'));

    cleanup();
    const tallProject = placeCanvasObject({ x: 300, y: 140, width: 200, height: 300 }, 0);
    renderCanvas({ project: tallProject, selectedObjectId: 'constellation-1' });
    expect(readGapCss(1)).toBeCloseTo(shortGap, 4);
    expect(readGapCss(1)).toBeCloseTo(8, 4);

    cleanup();
    const scaledProject = placeCanvasObject({ x: 300, y: 200, width: 120, height: 80 }, 0);
    renderCanvas({ project: scaledProject, selectedObjectId: 'constellation-1' }, { width: 450, height: 300 });
    expect(readGapCss(2)).toBeCloseTo(8, 4);
    expect(readNumber(requireSvg('[data-constellation-rotation-hit="true"]'), 'width') / 2).toBeCloseTo(44, 4);
  });

  it('moves an edge handle onto a visible side and keeps rotation and resize hits off the object center', () => {
    const edged = placeCanvasObject({ x: 390, y: 0, width: 120, height: 80 }, 0);
    renderCanvas({ project: edged, selectedObjectId: 'constellation-1' });
    const circle = requireSvg('[data-constellation-rotation-marker="true"]');
    const radius = readNumber(circle, 'r');
    expect(readNumber(circle, 'cy') - radius).toBeGreaterThanOrEqual(0);
    expect(readNumber(circle, 'cx') - radius).toBeGreaterThanOrEqual(0);
    expect((readNumber(circle, 'cy') - radius) - 80).toBeCloseTo(8, 4);
    const rotationHit = requireSvg('[data-constellation-rotation-hit="true"]');
    expect(readNumber(rotationHit, 'y')).toBeGreaterThanOrEqual(0);
    expect(readNumber(rotationHit, 'y') + readNumber(rotationHit, 'height')).toBeLessThanOrEqual(600);
    expect(rectContains(rotationHit, 450, 40)).toBe(false);
    expect(rectContains(requireSvg('[data-constellation-resize-hit="true"]'), 450, 40)).toBe(false);
    const marker = requireSvg('[data-constellation-resize-marker="true"]');
    const markerCenterX = readNumber(marker, 'x') + readNumber(marker, 'width') / 2;
    const markerCenterY = readNumber(marker, 'y') + readNumber(marker, 'height') / 2;
    expect(rectContains(rotationHit, markerCenterX, markerCenterY)).toBe(false);

    cleanup();
    const corner = placeCanvasObject({ x: 0, y: 0, width: 20, height: 20 }, 0);
    renderCanvas({ project: corner, selectedObjectId: 'constellation-1' });
    const cornerCircle = requireSvg('[data-constellation-rotation-marker="true"]');
    const cornerRadius = readNumber(cornerCircle, 'r');
    expect(readNumber(cornerCircle, 'cx') - cornerRadius).toBeGreaterThanOrEqual(0);
    expect(readNumber(cornerCircle, 'cy') - cornerRadius).toBeGreaterThanOrEqual(0);
    const cornerRotationHit = requireSvg('[data-constellation-rotation-hit="true"]');
    const cornerResizeHit = requireSvg('[data-constellation-resize-hit="true"]');
    expect(rectContains(cornerRotationHit, 10, 10)).toBe(false);
    expect(rectContains(cornerResizeHit, 10, 10)).toBe(false);
    const cornerMarker = requireSvg('[data-constellation-resize-marker="true"]');
    expect(rectContains(
      cornerRotationHit,
      readNumber(cornerMarker, 'x') + readNumber(cornerMarker, 'width') / 2,
      readNumber(cornerMarker, 'y') + readNumber(cornerMarker, 'height') / 2,
    )).toBe(false);
    const objectHit = requireSvg('[data-constellation-object-frame="constellation-1"] [data-constellation-object-hit="true"]');
    expect(rectContains(objectHit, 10, 10)).toBe(true);
  });

  it('rotates the selection, focus, hit area, and resize marker with the object', () => {
    const project = placeCanvasObject({ x: 200, y: 180, width: 100, height: 60 }, 90);
    renderCanvas({ project, selectedObjectId: 'constellation-1' });
    const frame = requireSvg('[data-constellation-object-frame="constellation-1"]');
    expect(frame.getAttribute('transform')).toBe('rotate(90 250 210)');
    const selection = requireSvg('[data-constellation-selection="true"]');
    expect(selection.parentElement).toBe(frame);
    expect(readNumber(selection, 'width')).toBe(100);
    expect(readNumber(selection, 'height')).toBe(60);
    fireEvent.focus(screen.getByRole('button', { name: 'Object 1' }));
    expect(requireSvg('[data-constellation-focus-ring="object"]').parentElement).toBe(frame);
    const marker = requireSvg('[data-constellation-resize-marker="true"]');
    expect(readNumber(marker, 'x') + readNumber(marker, 'width') / 2).toBeCloseTo(220, 4);
    expect(readNumber(marker, 'y') + readNumber(marker, 'height') / 2).toBeCloseTo(260, 4);
    expect(rectContains(requireSvg('[data-constellation-resize-hit="true"]'), 250, 210)).toBe(false);
    expect(rectContains(requireSvg('[data-constellation-object-hit="true"]'), 250, 210)).toBe(true);

    cleanup();
    const turnedAround = placeCanvasObject({ x: 200, y: 180, width: 100, height: 60 }, 180);
    renderCanvas({ project: turnedAround, selectedObjectId: 'constellation-1' });
    expect(rectContains(requireSvg('[data-constellation-resize-hit="true"]'), 250, 210)).toBe(false);
    expect(rectContains(requireSvg('[data-constellation-rotation-hit="true"]'), 250, 210)).toBe(false);
  });

  it('hides edit handles in preview and treats a missing angle as 0', () => {
    const project = placeCanvasObject({ x: 300, y: 200, width: 120, height: 80 });
    const { callbacks } = renderCanvas({ project, selectedObjectId: 'constellation-1', interactive: false });
    expect(screen.queryByRole('button', { name: 'Rotate object 1' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Resize object 1' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Object 1' })).toBeNull();
    expect(document.querySelector('[data-constellation-rotation-handle]')).toBeNull();
    expect(document.querySelector('[data-constellation-resize-handle]')).toBeNull();
    expect(requireSvg('[data-constellation-object-frame="constellation-1"]').getAttribute('transform')).toBe('rotate(0 360 240)');

    cleanup();
    const editable = renderCanvas({ project, selectedObjectId: 'constellation-1' });
    fireEvent.keyDown(screen.getByRole('button', { name: 'Rotate object 1' }), { key: 'ArrowUp' });
    expect(editable.callbacks.onObjectTransform).toHaveBeenCalledWith('constellation-1', {
      x: 300,
      y: 200,
      width: 120,
      height: 80,
      rotation: 1,
    });
    expect(callbacks.onObjectTransform).not.toHaveBeenCalled();
  });

  it('keeps rotated edge resizes inside the public non-negative model', () => {
    const originPattern = projectWithPublicObject('constellation', { x: 0, y: 0, width: 98, height: 93 }, 1);
    const originView = renderCanvas({ project: originPattern, selectedObjectId: 'constellation-1' });
    const originHandle = screen.getByRole('button', { name: 'Resize object 1' });
    fireEvent.pointerDown(originHandle, { button: 0, isPrimary: true, pointerId: 41, clientX: 98, clientY: 93 });
    fireEvent.pointerMove(originView.canvas, { pointerId: 41, clientX: 108, clientY: 93 });
    const originResized = acceptPublicResize(originPattern, 'constellation-1', originView.callbacks);
    expect(originResized.width).toBeCloseTo(98, 5);
    expect(originResized.height).toBeCloseTo(93, 5);
    expect(originResized.x).toBeCloseTo(0, 5);
    expect(originResized.y).toBeCloseTo(0, 5);
    expect(localTopLeft(originResized, 1).x).toBeCloseTo(localTopLeft({ x: 0, y: 0, width: 98, height: 93 }, 1).x, 4);
    expect(localTopLeft(originResized, 1).y).toBeCloseTo(localTopLeft({ x: 0, y: 0, width: 98, height: 93 }, 1).y, 4);

    cleanup();
    const originKeys = renderCanvas({ project: originPattern, selectedObjectId: 'constellation-1' });
    fireEvent.keyDown(screen.getByRole('button', { name: 'Resize object 1' }), { key: 'ArrowRight' });
    const originKeyed = acceptPublicResize(originPattern, 'constellation-1', originKeys.callbacks);
    expect(originKeyed).toMatchObject({ x: 0, y: 0, width: 98, height: 93 });

    cleanup();
    const originStar = projectWithPublicObject('star', { x: 0, y: 0, width: 20, height: 20 }, 1);
    const starKeys = renderCanvas({ project: originStar, selectedObjectId: 'star-1' });
    fireEvent.keyDown(screen.getByRole('button', { name: 'Resize object 1' }), { key: 'ArrowRight' });
    const starKeyed = acceptPublicResize(originStar, 'star-1', starKeys.callbacks);
    expect(starKeyed).toMatchObject({ x: 0, y: 0, width: 20, height: 20 });

    cleanup();
    const starPointer = renderCanvas({ project: originStar, selectedObjectId: 'star-1' });
    const starHandle = screen.getByRole('button', { name: 'Resize object 1' });
    fireEvent.pointerDown(starHandle, { button: 0, isPrimary: true, pointerId: 42, clientX: 20, clientY: 20 });
    fireEvent.pointerMove(starPointer.canvas, { pointerId: 42, clientX: 30, clientY: 20 });
    const starResized = acceptPublicResize(originStar, 'star-1', starPointer.callbacks);
    expect(starResized.x).toBeGreaterThanOrEqual(0);
    expect(starResized.y).toBeGreaterThanOrEqual(0);
    expect(starResized.width).toBeCloseTo(20, 5);

    cleanup();
    const leftEdge = projectWithPublicObject('constellation', { x: 0, y: 40, width: 80, height: 40 }, 90);
    const leftView = renderCanvas({ project: leftEdge, selectedObjectId: 'constellation-1' });
    const leftHandle = screen.getByRole('button', { name: 'Resize object 1' });
    fireEvent.pointerDown(leftHandle, { button: 0, isPrimary: true, pointerId: 43, clientX: 40, clientY: 80 });
    fireEvent.pointerMove(leftView.canvas, { pointerId: 43, clientX: 40, clientY: 880 });
    const leftResized = acceptPublicResize(leftEdge, 'constellation-1', leftView.callbacks);
    expect(leftResized.x).toBeGreaterThanOrEqual(0);
    expect(leftResized.y).toBeGreaterThanOrEqual(0);
    expect(leftResized.width).toBeCloseTo(80, 5);
    expect(leftResized.x).toBeCloseTo(0, 5);
    expect(leftResized.y).toBeCloseTo(40, 5);
    expect(localTopLeft(leftResized, 90).x).toBeCloseTo(localTopLeft({ x: 0, y: 40, width: 80, height: 40 }, 90).x, 4);

    cleanup();
    const leftShrink = renderCanvas({ project: leftEdge, selectedObjectId: 'constellation-1' });
    fireEvent.keyDown(screen.getByRole('button', { name: 'Resize object 1' }), { key: 'ArrowLeft' });
    const shrunk = acceptPublicResize(leftEdge, 'constellation-1', leftShrink.callbacks);
    expect(shrunk.width).toBeLessThan(80);
    expect(shrunk.width).toBeGreaterThanOrEqual(8);
    expect(shrunk.x).toBeGreaterThanOrEqual(0);
    expect(shrunk.y).toBeGreaterThanOrEqual(0);
    expect(shrunk.height / shrunk.width).toBeCloseTo(0.5, 5);
    expect(localTopLeft(shrunk, 90).x).toBeCloseTo(localTopLeft({ x: 0, y: 40, width: 80, height: 40 }, 90).x, 4);
    expect(localTopLeft(shrunk, 90).y).toBeCloseTo(localTopLeft({ x: 0, y: 40, width: 80, height: 40 }, 90).y, 4);

    cleanup();
    const flushStar = projectWithPublicObject('star', { x: 880, y: 580, width: 20, height: 20 }, 15);
    const flushView = renderCanvas({ project: flushStar, selectedObjectId: 'star-1' });
    const flushHandle = screen.getByRole('button', { name: 'Resize object 1' });
    fireEvent.pointerDown(flushHandle, { button: 0, isPrimary: true, pointerId: 44, clientX: 893, clientY: 593 });
    fireEvent.pointerMove(flushView.canvas, { pointerId: 44, clientX: 910, clientY: 610 });
    const flushResized = acceptPublicResize(flushStar, 'star-1', flushView.callbacks);
    expect(flushResized.width).toBeCloseTo(20, 4);
    expect(flushResized.x).toBeGreaterThanOrEqual(0);
    expect(flushResized.y).toBeGreaterThanOrEqual(0);
    expect(flushResized.x).toBeCloseTo(880, 3);
    expect(flushResized.y).toBeCloseTo(580, 3);
  });

  it('keeps the rotation circle about 8 CSS px from the finite selection frame', () => {
    const placements = [
      { kind: 'star' as const, box: { x: 0, y: 0, width: 20, height: 20 }, rotation: 15, clientWidth: 900, clientHeight: 600 },
      { kind: 'star' as const, box: { x: 0, y: 0, width: 20, height: 20 }, rotation: 15, clientWidth: 300, clientHeight: 200 },
      { kind: 'star' as const, box: { x: 0, y: 0, width: 20, height: 20 }, rotation: 45, clientWidth: 900, clientHeight: 600 },
      { kind: 'star' as const, box: { x: 0, y: 0, width: 20, height: 20 }, rotation: 45, clientWidth: 300, clientHeight: 200 },
      { kind: 'star' as const, box: { x: 880, y: 580, width: 20, height: 20 }, rotation: 15, clientWidth: 900, clientHeight: 600 },
      { kind: 'star' as const, box: { x: 880, y: 580, width: 20, height: 20 }, rotation: 15, clientWidth: 300, clientHeight: 200 },
      { kind: 'constellation' as const, box: { x: 401, y: 0, width: 98, height: 93 }, rotation: 15, clientWidth: 900, clientHeight: 600 },
      { kind: 'constellation' as const, box: { x: 401, y: 0, width: 98, height: 93 }, rotation: 15, clientWidth: 300, clientHeight: 200 },
    ];
    for (const placement of placements) {
      cleanup();
      const objectId = placement.kind === 'star' ? 'star-1' : 'constellation-1';
      const project = projectWithPublicObject(placement.kind, placement.box, placement.rotation);
      renderCanvas(
        { project, selectedObjectId: objectId },
        { width: placement.clientWidth, height: placement.clientHeight },
      );
      const logicalPixelsPerCssPixel = Math.max(900 / placement.clientWidth, 600 / placement.clientHeight);
      const gapCss = readFiniteFrameGapCss(logicalPixelsPerCssPixel);
      expect(gapCss).toBeCloseTo(8, 1);
      const rotationHit = requireSvg('[data-constellation-rotation-hit="true"]');
      expect(readNumber(rotationHit, 'width') / logicalPixelsPerCssPixel).toBeCloseTo(44, 4);
      expect(readNumber(rotationHit, 'height')).toBeCloseTo(readNumber(rotationHit, 'width'), 5);
      const centerX = placement.box.x + placement.box.width / 2;
      const centerY = placement.box.y + placement.box.height / 2;
      expect(rectContains(rotationHit, centerX, centerY)).toBe(false);
      const marker = requireSvg('[data-constellation-resize-marker="true"]');
      expect(rectContains(
        rotationHit,
        readNumber(marker, 'x') + readNumber(marker, 'width') / 2,
        readNumber(marker, 'y') + readNumber(marker, 'height') / 2,
      )).toBe(false);
      expect(rectContains(requireSvg('[data-constellation-object-hit="true"]'), centerX, centerY)).toBe(true);
    }
  });
});

function projectWithPublicObject(
  kind: 'constellation' | 'star',
  box: Pick<ConstellationObject, 'x' | 'y' | 'width' | 'height'>,
  rotation: number,
): ConstellationProject {
  const blank = createDefaultConstellationProject();
  const project = kind === 'star'
    ? addConstellationStar(blank, 'star-1')
    : addConstellation(blank, 'image-1', 'constellation-1');
  const objectId = kind === 'star' ? 'star-1' : 'constellation-1';
  return transformConstellationObject(project, objectId, { ...box, rotation });
}

function acceptPublicResize(
  project: ConstellationProject,
  objectId: string,
  callbacks: {
    onObjectTransform: ReturnType<typeof vi.fn>;
    onInteractionError: ReturnType<typeof vi.fn>;
  },
): ConstellationTransform {
  expect(callbacks.onInteractionError).not.toHaveBeenCalled();
  const transform = callbacks.onObjectTransform.mock.calls.at(-1)?.[1] as ConstellationTransform | undefined;
  if (transform === undefined) throw new Error(`Expected a resize transform for ${objectId}.`);
  expect(transform).not.toHaveProperty('rotation');
  const stored = transformConstellationObject(project, objectId, transform);
  const storedObject = stored.objects.find((object) => object.id === objectId);
  if (storedObject === undefined) throw new Error(`Expected stored object ${objectId}.`);
  expect(storedObject.x).toBeGreaterThanOrEqual(0);
  expect(storedObject.y).toBeGreaterThanOrEqual(0);
  return transform;
}

function readFiniteFrameGapCss(logicalPixelsPerCssPixel: number): number {
  const selection = requireSvg('[data-constellation-selection="true"]');
  const circle = requireSvg('[data-constellation-rotation-marker="true"]');
  const frame = requireSvg('[data-constellation-object-frame]');
  const transform = frame.getAttribute('transform');
  const matched = transform?.match(/^rotate\(([-0-9.]+) ([-0-9.]+) ([-0-9.]+)\)$/);
  if (matched === undefined || matched === null) {
    throw new Error(`Expected a rotate() transform on the object frame. Received ${String(transform)}.`);
  }
  const angle = Number(matched[1]);
  const centerX = Number(matched[2]);
  const centerY = Number(matched[3]);
  if (![angle, centerX, centerY].every(Number.isFinite)) {
    throw new Error(`Rotation transform is not finite. Received ${String(transform)}.`);
  }
  const boxX = readNumber(selection, 'x');
  const boxY = readNumber(selection, 'y');
  const boxWidth = readNumber(selection, 'width');
  const boxHeight = readNumber(selection, 'height');
  const radians = (angle * Math.PI) / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  const corners = [
    { x: boxX, y: boxY },
    { x: boxX + boxWidth, y: boxY },
    { x: boxX + boxWidth, y: boxY + boxHeight },
    { x: boxX, y: boxY + boxHeight },
  ].map((corner) => {
    const offsetX = corner.x - centerX;
    const offsetY = corner.y - centerY;
    return {
      x: centerX + offsetX * cosine - offsetY * sine,
      y: centerY + offsetX * sine + offsetY * cosine,
    };
  });
  const circleX = readNumber(circle, 'cx');
  const circleY = readNumber(circle, 'cy');
  const radius = readNumber(circle, 'r');
  let nearest = Number.POSITIVE_INFINITY;
  for (let index = 0; index < corners.length; index += 1) {
    const start = corners[index];
    const end = corners[(index + 1) % corners.length];
    if (start === undefined || end === undefined) throw new Error(`Missing selection corner ${String(index)}.`);
    const offsetX = end.x - start.x;
    const offsetY = end.y - start.y;
    const lengthSquared = offsetX * offsetX + offsetY * offsetY;
    if (!(lengthSquared > 0)) throw new Error(`Selection edge ${String(index)} has zero length.`);
    const unclampedT = ((circleX - start.x) * offsetX + (circleY - start.y) * offsetY) / lengthSquared;
    const t = Math.min(1, Math.max(0, unclampedT));
    const distance = Math.hypot(circleX - (start.x + offsetX * t), circleY - (start.y + offsetY * t));
    nearest = Math.min(nearest, distance);
  }
  if (!Number.isFinite(nearest)) {
    throw new Error(`Finite frame distance must be finite. Received ${String(nearest)}.`);
  }
  return (nearest - radius) / logicalPixelsPerCssPixel;
}

function readGapCss(logicalPixelsPerCssPixel: number): number {
  const circle = requireSvg('[data-constellation-rotation-marker="true"]');
  const frame = requireSvg('[data-constellation-object-frame="constellation-1"]');
  const side = frame.parentElement?.querySelector('[data-constellation-rotation-side]')?.getAttribute('data-constellation-rotation-side');
  const image = frame.querySelector('image');
  if (!(image instanceof SVGElement)) throw new Error('Expected the constellation image inside the rotated frame.');
  const objectTop = readNumber(image, 'y');
  const objectBottom = objectTop + readNumber(image, 'height');
  const centerY = readNumber(circle, 'cy');
  const radius = readNumber(circle, 'r');
  const gapUser = side === 'bottom' ? centerY - radius - objectBottom : objectTop - (centerY + radius);
  return gapUser / logicalPixelsPerCssPixel;
}
