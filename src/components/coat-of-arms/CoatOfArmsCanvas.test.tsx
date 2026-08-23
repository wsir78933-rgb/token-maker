// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, createEvent, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { applyProjectCommand } from '@/lib/coat-of-arms/commands';
import { SELECTION_SCENE_HEIGHT, SELECTION_SCENE_WIDTH } from '@/lib/coat-of-arms/selection-bounds';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CoatProject, TextPathPlacement } from '@/lib/coat-of-arms/types';
import {
  CoatOfArmsCanvas,
  getNextTextBoxWidth,
  getNextTextPathInteractionPath,
  toTextPathMeetBoxScenePoint,
} from './CoatOfArmsCanvas';
import { TextMottoPanel } from './TextMottoPanel';
import { createTextCreationCommand, TEXT_CREATION_DRAG_MIME } from './text-creation-drag';

const UPPER_CURVE_TEXT_PATH = {
  mode: 'curve',
  startX: 10,
  startY: 72,
  controlX: 50,
  controlY: 30,
  endX: 90,
  endY: 72,
} as const satisfies TextPathPlacement;

const OUTWARD_RING_TEXT_PATH = {
  mode: 'ring',
  radius: 40,
  facing: 'out',
  layout: 'full',
  spacing: 'natural',
  startAngle: 0,
} as const satisfies TextPathPlacement;

let nextId = 0;

function createCanvasProject(): CoatProject {
  const project = createDefaultProject('en');
  const withStableIds: CoatProject = {
    ...project,
    canvas: { width: 1200, height: 1200 },
    layers: project.layers.map((layer, index) => {
      if (index === 0) return { ...layer, id: 'background-1' };
      if (layer.type !== 'shield') return layer;
      return { ...layer, id: 'shield-1', transform: { ...layer.transform, scale: 1 } };
    }),
  };
  const withCharge = applyProjectCommand(withStableIds, {
    type: 'add-layer',
    assetId: 'material-animal-wolf-rampant',
  });
  return {
    ...withCharge,
    layers: withCharge.layers.map((layer) => (
      layer.type === 'charge'
        ? { ...layer, id: 'charge-1', transform: { ...layer.transform, scale: 1 } }
        : layer
    )),
  };
}

function renderCanvas(
  project: CoatProject = createCanvasProject(),
  multiSelectEnabled = false,
  snappingEnabled?: boolean,
  canvasSize: { width: number; height: number } = { width: 100, height: 110 },
) {
  useCoatProjectStore.getState().replaceProject(project);
  const result = render(
    <CoatOfArmsCanvas
      locale="en"
      multiSelectEnabled={multiSelectEnabled}
      snappingEnabled={snappingEnabled}
    />,
  );
  const canvas = screen.getByRole('application', { name: 'Coat of arms canvas' });
  vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
    x: 0, y: 0, left: 0, top: 0,
    right: canvasSize.width, bottom: canvasSize.height,
    width: canvasSize.width, height: canvasSize.height,
    toJSON: () => ({}),
  });
  return { ...result, canvas };
}

function createSnappingProject(): CoatProject {
  const project = createCanvasProject();
  return {
    ...project,
    layers: project.layers.map((layer) => (
      layer.id === 'charge-1' && layer.type !== 'background'
        ? { ...layer, transform: { ...layer.transform, crop: { x: 40, y: 45, width: 20, height: 20 } } }
        : layer
    )),
  };
}

function getLayer(layerId: string) {
  const layer = useCoatProjectStore.getState().project.layers.find((candidate) => candidate.id === layerId);
  if (!layer) throw new Error(`Expected layer: ${layerId}`);
  return layer;
}

function stubStraightTextGlyphRect(canvas: HTMLElement, layerId: string): void {
  const glyphRect = {
    x: 21.5,
    y: 50,
    left: 21.5,
    top: 50,
    right: 78.5,
    bottom: 60,
    width: 57,
    height: 10,
    toJSON: () => ({}),
  } as DOMRect;
  const paintedLayers = canvas.querySelectorAll(`[data-layer-id="${layerId}"]`);
  if (paintedLayers.length === 0) {
    throw new Error(`Expected painted straight text layer: ${layerId}`);
  }
  paintedLayers.forEach((paintedLayer) => {
    vi.spyOn(paintedLayer, 'getBoundingClientRect').mockReturnValue(glyphRect);
  });
}

function stubTextPathMeetBox(
  canvas: HTMLElement,
  rect: { left: number; top: number; width: number; height: number } = { left: 0, top: 0, width: 100, height: 110 },
): { left: number; top: number; width: number; height: number } {
  const meetBox = canvas.querySelector('[data-text-path-meet-box]');
  if (!(meetBox instanceof HTMLElement)) {
    throw new Error(`Text path meet box is missing: ${String(meetBox)}`);
  }
  const box = {
    x: rect.left,
    y: rect.top,
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    right: rect.left + rect.width,
    bottom: rect.top + rect.height,
    toJSON: () => box,
  };
  vi.spyOn(meetBox, 'getBoundingClientRect').mockReturnValue(box as DOMRect);
  return rect;
}

function letterboxMeetRect(
  artboardWidth: number,
  artboardHeight: number,
): { left: number; top: number; width: number; height: number } {
  const scale = Math.min(artboardWidth / SELECTION_SCENE_WIDTH, artboardHeight / SELECTION_SCENE_HEIGHT);
  const width = SELECTION_SCENE_WIDTH * scale;
  const height = SELECTION_SCENE_HEIGHT * scale;
  return {
    left: (artboardWidth - width) / 2,
    top: (artboardHeight - height) / 2,
    width,
    height,
  };
}

function getTransformLayer(layerId: string) {
  const layer = getLayer(layerId);
  if (layer.type === 'background') throw new Error(`Expected a transform layer: ${layerId}`);
  return layer;
}

function selectedLayerBoundingRect() {
  const selection = screen.getByLabelText('Selected layer controls');
  return [...selection.children].find((node) => (
    node instanceof HTMLElement
    && node.className.includes('inset-0')
    && node.className.includes('border-2')
  ));
}

function createTextDragDataTransfer(kind: string): DataTransfer {
  const values = new Map<string, string>();
  values.set(TEXT_CREATION_DRAG_MIME, kind);
  return {
    dropEffect: 'none',
    effectAllowed: 'all',
    files: [],
    items: [],
    types: [TEXT_CREATION_DRAG_MIME],
    clearData: () => values.clear(),
    getData: (format: string) => values.get(format) ?? '',
    setData: (format: string, value: string) => values.set(format, value),
    setDragImage: () => undefined,
  } as unknown as DataTransfer;
}

function renderTextDragSurface() {
  useCoatProjectStore.getState().replaceProject(createCanvasProject());
  const result = render(
    <>
      <TextMottoPanel locale="en" />
      <CoatOfArmsCanvas locale="en" />
    </>,
  );
  const canvas = screen.getByRole('application', { name: 'Coat of arms canvas' });
  vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
    x: 0, y: 0, left: 0, top: 0,
    right: 100, bottom: 110, width: 100, height: 110,
    toJSON: () => ({}),
  });
  return { ...result, canvas };
}

describe('CoatOfArmsCanvas', () => {
  beforeEach(() => {
    nextId = 0;
    vi.stubGlobal('crypto', { randomUUID: () => `generated-${nextId++}` });
    useCoatProjectStore.getState().setDrawingSettings({ isActive: false, color: '#004E89', strokeWidth: 3, opacity: 1 });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('creates and selects text at the scene position when a text card is dropped on the canvas', () => {
    const { canvas } = renderTextDragSurface();
    const card = screen.getByRole('button', { name: 'Curved Text' });
    const dataTransfer = createTextDragDataTransfer('curved');

    fireEvent.dragStart(card, { dataTransfer });
    fireEvent.dragOver(canvas, { dataTransfer });
    const dropEvent = createEvent.drop(canvas, { dataTransfer });
    Object.defineProperties(dropEvent, {
      clientX: { configurable: true, value: 20 },
      clientY: { configurable: true, value: 30 },
    });
    fireEvent(canvas, dropEvent);

    const droppedLayer = useCoatProjectStore.getState().project.layers.at(-1);
    expect(droppedLayer).toMatchObject({
      type: 'text',
      text: 'Curved Text',
      fontSize: 50,
      path: {
        mode: 'curve',
      },
      transform: { x: -30, scale: 1, rotation: 0 },
    });
    if (!droppedLayer || droppedLayer.type === 'background') throw new Error('Expected dropped text layer');
    expect(droppedLayer.transform.y).toBeCloseTo(-25);
    expect(useCoatProjectStore.getState().selectedLayerIds).toEqual([droppedLayer?.id]);
    expect(useCoatProjectStore.getState().history.past).toHaveLength(1);
  });

  it('places dropped straight text so the SVG baseline lands on the drop point', () => {
    const { canvas } = renderTextDragSurface();
    const card = screen.getByRole('button', { name: /^Text$/ });
    const dataTransfer = createTextDragDataTransfer('text');

    fireEvent.dragStart(card, { dataTransfer });
    fireEvent.dragOver(canvas, { dataTransfer });
    const dropEvent = createEvent.drop(canvas, { dataTransfer });
    Object.defineProperties(dropEvent, {
      clientX: { configurable: true, value: 50 },
      clientY: { configurable: true, value: 55 },
    });
    fireEvent(canvas, dropEvent);

    const droppedLayer = useCoatProjectStore.getState().project.layers.at(-1);
    expect(droppedLayer).toMatchObject({
      type: 'text',
      text: 'Double-click to edit',
      fontSize: 40,
      path: { mode: 'none' },
      boxWidth: 57,
      transform: { x: 0, scale: 1, rotation: 0 },
    });
    if (!droppedLayer || droppedLayer.type !== 'text') throw new Error(`Expected dropped straight text layer, got: ${JSON.stringify(droppedLayer)}`);
    expect(droppedLayer.transform.y).toBe(-47);
    expect(useCoatProjectStore.getState().selectedLayerIds).toEqual([droppedLayer.id]);
    expect(useCoatProjectStore.getState().history.past).toHaveLength(1);
  });

  it('previews a drag locally and records one update command when the pointer is released', () => {
    const { canvas } = renderCanvas();
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(charge instanceof SVGElement)) throw new Error('Expected charge scene element');

    fireEvent.pointerDown(charge, { clientX: 10, clientY: 10, pointerId: 1 });
    fireEvent.pointerMove(canvas, { clientX: 30, clientY: 20, pointerId: 1 });
    fireEvent.pointerMove(canvas, { clientX: 50, clientY: 30, pointerId: 1 });

    expect(getLayer('charge-1')).toMatchObject({ transform: { x: 0, y: 0 } });
    expect(screen.getByLabelText('Selected layer controls').getAttribute('data-selection-x')).toBe('40');
    expect(useCoatProjectStore.getState().history.past).toHaveLength(0);

    fireEvent.pointerUp(canvas, { clientX: 50, clientY: 30, pointerId: 1 });
    expect(getLayer('charge-1')).toMatchObject({ transform: { x: 40 } });
    expect((getLayer('charge-1') as Extract<ReturnType<typeof getLayer>, { transform: { y: number } }>).transform.y).toBeCloseTo(20);
    expect(getLayer('shield-1')).toMatchObject({ transform: { x: 0, y: 0 } });
    expect(useCoatProjectStore.getState().history.past).toHaveLength(1);
    useCoatProjectStore.getState().undo();
    expect(getLayer('charge-1')).toMatchObject({ transform: { x: 0, y: 0 } });
  });

  it('snaps a drag by default, renders the exact alignment guide, and commits one undo entry', () => {
    const { canvas } = renderCanvas(createSnappingProject());
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(charge instanceof SVGElement)) throw new Error('Expected charge scene element');

    fireEvent.pointerDown(charge, { clientX: 10, clientY: 55, pointerId: 1 });
    fireEvent.pointerMove(canvas, { clientX: 49, clientY: 55, pointerId: 1 });

    const xGuide = canvas.querySelector('[data-snap-guide-axis="x"]');
    if (!(xGuide instanceof Element)) throw new Error('Expected vertical snapping guide');
    expect(xGuide.getAttribute('x1')).toBe('100');
    expect(xGuide.getAttribute('stroke')).toBe('#5b9bd5');
    expect(xGuide.getAttribute('stroke-width')).toBe('2');
    expect(xGuide.getAttribute('stroke-dasharray')).toBe('5 4');
    expect(getTransformLayer('charge-1').transform.x).toBe(0);

    fireEvent.pointerUp(canvas, { clientX: 49, clientY: 55, pointerId: 1 });

    expect(getTransformLayer('charge-1').transform.x).toBe(40);
    expect(useCoatProjectStore.getState().history.past).toHaveLength(1);
    expect(canvas.querySelector('[data-snap-guide-axis]')).toBeNull();

    const movedCharge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(movedCharge instanceof SVGElement)) throw new Error('Expected moved charge scene element');
    fireEvent.pointerDown(movedCharge, { clientX: 49, clientY: 55, pointerId: 2 });
    fireEvent.pointerMove(canvas, { clientX: 45, clientY: 55, pointerId: 2 });
    expect(canvas.querySelector('[data-snap-guide-axis="x"]')).not.toBeNull();
    fireEvent.pointerCancel(canvas, { clientX: 45, clientY: 55, pointerId: 2 });
    expect(canvas.querySelector('[data-snap-guide-axis]')).toBeNull();
    expect(useCoatProjectStore.getState().history.past).toHaveLength(1);
  });

  it('keeps a drag unsnapped when the public snapping switch is off', () => {
    const { canvas } = renderCanvas(createSnappingProject(), false, false);
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(charge instanceof SVGElement)) throw new Error('Expected charge scene element');

    fireEvent.pointerDown(charge, { clientX: 10, clientY: 55, pointerId: 1 });
    fireEvent.pointerMove(canvas, { clientX: 49, clientY: 55, pointerId: 1 });
    fireEvent.pointerUp(canvas, { clientX: 49, clientY: 55, pointerId: 1 });

    expect(getTransformLayer('charge-1').transform.x).toBe(39);
    expect(canvas.querySelector('[data-snap-guide-axis]')).toBeNull();
    expect(useCoatProjectStore.getState().history.past).toHaveLength(1);
  });

  it('uses Alt to reverse both states of the public snapping switch during a drag', () => {
    const enabledCanvas = renderCanvas(createSnappingProject());
    const enabledCharge = enabledCanvas.canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(enabledCharge instanceof SVGElement)) throw new Error('Expected charge scene element');

    fireEvent.pointerDown(enabledCharge, { clientX: 10, clientY: 55, pointerId: 1 });
    fireEvent.pointerMove(enabledCanvas.canvas, { clientX: 49, clientY: 55, pointerId: 1, altKey: true });
    fireEvent.pointerUp(enabledCanvas.canvas, { clientX: 49, clientY: 55, pointerId: 1, altKey: true });
    expect(getTransformLayer('charge-1').transform.x).toBe(39);
    enabledCanvas.unmount();

    const disabledCanvas = renderCanvas(createSnappingProject(), false, false);
    const disabledCharge = disabledCanvas.canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(disabledCharge instanceof SVGElement)) throw new Error('Expected charge scene element');
    fireEvent.pointerDown(disabledCharge, { clientX: 10, clientY: 55, pointerId: 2 });
    fireEvent.pointerMove(disabledCanvas.canvas, { clientX: 49, clientY: 55, pointerId: 2, altKey: true });
    fireEvent.pointerUp(disabledCanvas.canvas, { clientX: 49, clientY: 55, pointerId: 2, altKey: true });

    expect(getTransformLayer('charge-1').transform.x).toBe(40);
  });

  it('uses a seven CSS pixel threshold across 400, 440, and 480px canvas rects', () => {
    for (const [index, width] of [400, 440, 480].entries()) {
      const height = width * 1.1;
      const startX = width / 2;
      const insideEndX = startX + width * 0.4 - 7;
      const insideThreshold = renderCanvas(createSnappingProject(), false, true, { width, height });
      const insideCharge = insideThreshold.canvas.querySelector('[data-layer-id="charge-1"]');
      if (!(insideCharge instanceof SVGElement)) throw new Error('Expected charge scene element');

      fireEvent.pointerDown(insideCharge, { clientX: startX, clientY: height / 2, pointerId: index * 2 + 1 });
      fireEvent.pointerMove(insideThreshold.canvas, { clientX: insideEndX, clientY: height / 2, pointerId: index * 2 + 1 });
      fireEvent.pointerUp(insideThreshold.canvas, { clientX: insideEndX, clientY: height / 2, pointerId: index * 2 + 1 });
      expect(getTransformLayer('charge-1').transform.x).toBe(40);
      insideThreshold.unmount();

      const outsideEndX = startX + width * 0.4 - 8;
      const outsideThreshold = renderCanvas(createSnappingProject(), false, true, { width, height });
      const outsideCharge = outsideThreshold.canvas.querySelector('[data-layer-id="charge-1"]');
      if (!(outsideCharge instanceof SVGElement)) throw new Error('Expected charge scene element');

      fireEvent.pointerDown(outsideCharge, { clientX: startX, clientY: height / 2, pointerId: index * 2 + 2 });
      fireEvent.pointerMove(outsideThreshold.canvas, { clientX: outsideEndX, clientY: height / 2, pointerId: index * 2 + 2 });
      fireEvent.pointerUp(outsideThreshold.canvas, { clientX: outsideEndX, clientY: height / 2, pointerId: index * 2 + 2 });
      expect(getTransformLayer('charge-1').transform.x).toBeCloseTo(40 - 800 / width);
      outsideThreshold.unmount();
    }
  });

  it('snaps painted layer bounds instead of their full scene transform boxes', () => {
    const { canvas } = renderCanvas(createCanvasProject(), false, true, { width: 400, height: 440 });
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    const shield = canvas.querySelector('[data-layer-id="shield-1"]');
    if (!(charge instanceof SVGElement) || !(shield instanceof SVGElement)) {
      throw new Error('Expected charge and shield scene elements');
    }
    vi.spyOn(charge, 'getBoundingClientRect').mockReturnValue({
      x: 80, y: 80, left: 80, top: 80, right: 120, bottom: 120, width: 40, height: 40,
      toJSON: () => ({}),
    });
    vi.spyOn(shield, 'getBoundingClientRect').mockReturnValue({
      x: 190, y: 160, left: 190, top: 160, right: 230, bottom: 200, width: 40, height: 40,
      toJSON: () => ({}),
    });

    fireEvent.pointerDown(charge, { clientX: 100, clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(canvas, { clientX: 166, clientY: 100, pointerId: 1 });

    const guide = canvas.querySelector('[data-snap-guide-axis="x"]');
    expect(guide?.getAttribute('x1')).toBe('47.5');
    fireEvent.pointerUp(canvas, { clientX: 166, clientY: 100, pointerId: 1 });
    expect(getTransformLayer('charge-1').transform.x).toBe(17.5);
  });

  it('adds canvas layers to the selection without a keyboard modifier when multi-select is enabled', () => {
    const { canvas } = renderCanvas(createCanvasProject(), true);
    const shield = canvas.querySelector('[data-layer-id="shield-1"]');
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(shield instanceof SVGElement) || !(charge instanceof SVGElement)) {
      throw new Error('Expected selectable shield and charge scene elements');
    }

    fireEvent.pointerDown(shield, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 1 });
    const chargeAfterSelection = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(chargeAfterSelection instanceof SVGElement)) throw new Error('Expected charge scene element after selection');
    fireEvent.pointerDown(chargeAfterSelection, { clientX: 50, clientY: 55, pointerId: 2 });

    expect(useCoatProjectStore.getState().selectedLayerIds).toEqual(['shield-1', 'charge-1']);
  });

  it('clears the selection when empty canvas is clicked', () => {
    const { canvas } = renderCanvas();
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(charge instanceof SVGElement)) {
      throw new Error('Expected charge scene element');
    }

    fireEvent.pointerDown(charge, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerDown(canvas, { clientX: 5, clientY: 5, pointerId: 2 });

    expect(useCoatProjectStore.getState().selectedLayerIds).toEqual([]);
  });

  it('moves every selected unlocked layer in one history entry when multi-select drag is enabled', () => {
    const { canvas } = renderCanvas(createCanvasProject(), true);
    const shield = canvas.querySelector('[data-layer-id="shield-1"]');
    if (!(shield instanceof SVGElement)) throw new Error('Expected shield scene element');

    fireEvent.pointerDown(shield, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 1 });
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(charge instanceof SVGElement)) throw new Error('Expected charge scene element');

    fireEvent.pointerDown(charge, { clientX: 50, clientY: 55, pointerId: 2 });
    fireEvent.pointerMove(canvas, { clientX: 60, clientY: 65, pointerId: 2 });
    fireEvent.pointerUp(canvas, { clientX: 60, clientY: 65, pointerId: 2 });

    expect(getTransformLayer('shield-1').transform).toMatchObject({ x: 10, y: 10 });
    expect(getTransformLayer('charge-1').transform).toMatchObject({ x: 10, y: 10 });
    expect(useCoatProjectStore.getState().history.past).toHaveLength(1);
  });

  it('keeps an existing multi-selection intact when dragging one of its selected layers again', () => {
    const { canvas } = renderCanvas(createCanvasProject(), true);
    const shield = canvas.querySelector('[data-layer-id="shield-1"]');
    if (!(shield instanceof SVGElement)) throw new Error('Expected shield scene element');

    fireEvent.pointerDown(shield, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 1 });
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(charge instanceof SVGElement)) throw new Error('Expected charge scene element');
    fireEvent.pointerDown(charge, { clientX: 50, clientY: 55, pointerId: 2 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 2 });

    const shieldAfterSelection = canvas.querySelector('[data-layer-id="shield-1"]');
    if (!(shieldAfterSelection instanceof SVGElement)) throw new Error('Expected shield scene element after selection');
    fireEvent.pointerDown(shieldAfterSelection, { clientX: 50, clientY: 55, pointerId: 3 });
    fireEvent.pointerMove(canvas, { clientX: 60, clientY: 65, pointerId: 3 });
    fireEvent.pointerUp(canvas, { clientX: 60, clientY: 65, pointerId: 3 });

    expect(useCoatProjectStore.getState().selectedLayerIds).toEqual(['shield-1', 'charge-1']);
    expect(getTransformLayer('shield-1').transform).toMatchObject({ x: 10, y: 10 });
    expect(getTransformLayer('charge-1').transform).toMatchObject({ x: 10, y: 10 });
  });

  it('does not begin a drag when a modifier click removes a layer from a multi-selection', () => {
    const { canvas } = renderCanvas(createCanvasProject(), true);
    const shield = canvas.querySelector('[data-layer-id="shield-1"]');
    if (!(shield instanceof SVGElement)) throw new Error('Expected shield scene element');

    fireEvent.pointerDown(shield, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 1 });
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(charge instanceof SVGElement)) throw new Error('Expected charge scene element');
    fireEvent.pointerDown(charge, { clientX: 50, clientY: 55, pointerId: 2 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 2 });

    const shieldAfterSelection = canvas.querySelector('[data-layer-id="shield-1"]');
    if (!(shieldAfterSelection instanceof SVGElement)) throw new Error('Expected shield scene element after multi-selection');
    fireEvent.pointerDown(shieldAfterSelection, { clientX: 50, clientY: 55, pointerId: 3, ctrlKey: true });
    fireEvent.pointerMove(canvas, { clientX: 60, clientY: 65, pointerId: 3 });
    fireEvent.pointerUp(canvas, { clientX: 60, clientY: 65, pointerId: 3 });

    expect(useCoatProjectStore.getState().selectedLayerIds).toEqual(['charge-1']);
    expect(getTransformLayer('shield-1').transform).toMatchObject({ x: 0, y: 0 });
    expect(getTransformLayer('charge-1').transform).toMatchObject({ x: 0, y: 0 });
    expect(useCoatProjectStore.getState().history.past).toHaveLength(0);
  });

  it('selects and drags all members when a grouped canvas layer is clicked', () => {
    const groupedProject = applyProjectCommand(createCanvasProject(), {
      type: 'group-layers', groupId: 'animal-group', layerIds: ['shield-1', 'charge-1'],
    });
    const { canvas } = renderCanvas(groupedProject);
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(charge instanceof SVGElement)) throw new Error('Expected grouped charge scene element');

    fireEvent.pointerDown(charge, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerMove(canvas, { clientX: 60, clientY: 65, pointerId: 1 });
    fireEvent.pointerUp(canvas, { clientX: 60, clientY: 65, pointerId: 1 });

    expect(useCoatProjectStore.getState().selectedLayerIds).toEqual(['shield-1', 'charge-1']);
    expect(getTransformLayer('shield-1').transform).toMatchObject({ x: 10, y: 10 });
    expect(getTransformLayer('charge-1').transform).toMatchObject({ x: 10, y: 10 });
  });

  it('adds one selected local vector drawing after a freehand canvas stroke', () => {
    useCoatProjectStore.getState().setDrawingSettings({ isActive: true, color: '#004E89', strokeWidth: 3, opacity: 1 });
    const { canvas } = renderCanvas();

    fireEvent.pointerDown(canvas, { clientX: 10, clientY: 20, pointerId: 4 });
    fireEvent.pointerMove(canvas, { clientX: 30, clientY: 40, pointerId: 4 });
    fireEvent.pointerUp(canvas, { clientX: 50, clientY: 60, pointerId: 4 });

    const drawingLayer = useCoatProjectStore.getState().project.layers.at(-1);
    expect(drawingLayer).toMatchObject({ type: 'draw', color: '#004E89', strokeWidth: 3, path: 'M 10 20 L 30 40 L 50 60' });
    expect(useCoatProjectStore.getState().selectedLayerIds).toEqual([drawingLayer?.id]);
    expect(useCoatProjectStore.getState().history.past).toHaveLength(1);
  });

  it('discards a local transform preview when the active pointer is cancelled', () => {
    const { canvas } = renderCanvas();
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(charge instanceof SVGElement)) throw new Error('Expected charge scene element');

    fireEvent.pointerDown(charge, { clientX: 10, clientY: 10, pointerId: 1 });
    fireEvent.pointerMove(canvas, { clientX: 50, clientY: 30, pointerId: 1 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 30, pointerId: 1 });

    expect(getLayer('charge-1')).toMatchObject({ transform: { x: 0, y: 0 } });
    expect(useCoatProjectStore.getState().history.past).toHaveLength(0);
    expect(screen.getByLabelText('Selected layer controls').getAttribute('data-selection-x')).toBe('0');
  });

  it('does not transform a locked layer when the scene element is dragged', () => {
    const locked = applyProjectCommand(createCanvasProject(), {
      type: 'set-layer-lock', layerId: 'charge-1', locked: true,
    });
    const { canvas } = renderCanvas(locked);
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(charge instanceof SVGElement)) throw new Error('Expected charge scene element');

    fireEvent.pointerDown(charge, { clientX: 10, clientY: 10, pointerId: 1 });
    fireEvent.pointerMove(canvas, { clientX: 50, clientY: 30, pointerId: 1 });

    expect(getLayer('charge-1')).toMatchObject({ locked: true, transform: { x: 0, y: 0 } });
    expect(useCoatProjectStore.getState().history.past).toHaveLength(0);
    expect(screen.queryByRole('group', { name: 'Crop selected layer' })).toBeNull();
  });

  it('uses the presentational resize and rotate handles to emit validated transform commands', () => {
    const { canvas } = renderCanvas();
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(charge instanceof SVGElement)) throw new Error('Expected charge scene element');

    fireEvent.pointerDown(charge, { clientX: 50, clientY: 55, pointerId: 1 });
    const resizeHandle = screen.getByRole('button', { name: 'Resize selected layer' });
    fireEvent.pointerDown(resizeHandle, { clientX: 50, clientY: 55, pointerId: 2 });
    fireEvent.pointerMove(canvas, { clientX: 75, clientY: 55, pointerId: 2 });
    fireEvent.pointerUp(canvas, { clientX: 75, clientY: 55, pointerId: 2 });
    const rotateHandle = screen.getByRole('button', { name: 'Rotate selected layer' });
    fireEvent.pointerDown(rotateHandle, { clientX: 100, clientY: 55, pointerId: 3 });
    fireEvent.pointerMove(canvas, { clientX: 50, clientY: 105, pointerId: 3 });
    fireEvent.pointerUp(canvas, { clientX: 50, clientY: 105, pointerId: 3 });

    expect(getLayer('charge-1')).toMatchObject({
      transform: { scale: 1.25, rotation: 45 },
    });
    expect(useCoatProjectStore.getState().history.past).toHaveLength(2);
  });

  it('shows three curve handles on a dashed path and dispatches the dragged control point', () => {
    const project = applyProjectCommand(createCanvasProject(), {
      type: 'add-text-layer', text: 'CURVE', color: '#B11F24', fontSize: 40,
      alignment: 'center', path: UPPER_CURVE_TEXT_PATH,
    });
    const textLayer = project.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected curved text layer');
    const { canvas } = renderCanvas(project);
    const textElement = canvas.querySelector(`[data-layer-id="${textLayer.id}"]`);
    if (!(textElement instanceof SVGElement)) throw new Error('Expected curved text scene element');

    fireEvent.pointerDown(textElement, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 1 });
    stubTextPathMeetBox(canvas);
    expect(canvas.querySelectorAll('[data-resize-handle]')).toHaveLength(0);
    expect(screen.queryByRole('button', { name: 'Rotate selected layer' })).toBeNull();
    expect(selectedLayerBoundingRect()).toBeUndefined();
    expect(canvas.querySelectorAll('[data-text-path-handle]')).toHaveLength(3);
    expect(canvas.querySelector('[data-text-path-handle="curve-start"]')).not.toBeNull();
    expect(canvas.querySelector('[data-text-path-handle="curve-end"]')).not.toBeNull();
    expect(canvas.querySelector('[data-text-path-meet-box]')).not.toBeNull();
    const toolbar = screen.getByRole('toolbar', { name: 'Selected element actions' });
    const controls = screen.getByLabelText('Selected layer controls');
    expect(controls.contains(toolbar)).toBe(false);
    expect(canvas.contains(toolbar)).toBe(true);
    expect(toolbar.className).not.toContain('bottom-full');
    expect(toolbar.className).not.toContain('mb-14');
    expect(toolbar.className).not.toContain('top-2');
    expect(toolbar.className).toContain('top-auto');
    expect(toolbar.className).toContain('bottom-2');
    const guide = canvas.querySelector('[data-text-path-guide="curve"]');
    expect(guide?.getAttribute('d')).toBe('M10 72 Q50 30 90 72');
    expect(guide?.getAttribute('stroke')).toBe('#7eb6ff');
    expect(guide?.getAttribute('stroke-dasharray')).toBe('3 3');
    expect(guide?.closest('svg')?.getAttribute('viewBox')).toBe('0 0 100 110');

    const handle = screen.getByRole('button', { name: 'Adjust curved text control point' });
    expect(toolbar.contains(handle)).toBe(false);
    fireEvent.pointerDown(handle, { clientX: 50, clientY: 30, pointerId: 2 });
    fireEvent.pointerMove(canvas, { clientX: 50, clientY: 45, pointerId: 2 });
    expect((useCoatProjectStore.getState().project.layers.at(-1) as Extract<CoatProject['layers'][number], { type: 'text' }>).path).toEqual(UPPER_CURVE_TEXT_PATH);
    fireEvent.pointerUp(canvas, { clientX: 50, clientY: 45, pointerId: 2 });

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      path: { ...UPPER_CURVE_TEXT_PATH, controlX: 50, controlY: 45 },
    });
    expect(useCoatProjectStore.getState().history.past).toHaveLength(1);
  });

  it('writes start and end coordinates from their own curve handles', () => {
    const project = applyProjectCommand(createCanvasProject(), {
      type: 'add-text-layer', text: 'CURVE', color: '#B11F24', fontSize: 40,
      alignment: 'center', path: UPPER_CURVE_TEXT_PATH,
    });
    const textLayer = project.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected curved text layer');
    const { canvas } = renderCanvas(project);
    const textElement = canvas.querySelector(`[data-layer-id="${textLayer.id}"]`);
    if (!(textElement instanceof SVGElement)) throw new Error('Expected curved text scene element');

    fireEvent.pointerDown(textElement, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 1 });
    stubTextPathMeetBox(canvas);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Adjust curved text start point' }), {
      clientX: 10, clientY: 72, pointerId: 2,
    });
    fireEvent.pointerMove(canvas, { clientX: 18, clientY: 80, pointerId: 2 });
    fireEvent.pointerUp(canvas, { clientX: 18, clientY: 80, pointerId: 2 });
    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      path: { ...UPPER_CURVE_TEXT_PATH, startX: 18, startY: 80 },
    });

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Adjust curved text end point' }), {
      clientX: 90, clientY: 72, pointerId: 3,
    });
    fireEvent.pointerMove(canvas, { clientX: 82, clientY: 64, pointerId: 3 });
    fireEvent.pointerUp(canvas, { clientX: 82, clientY: 64, pointerId: 3 });
    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      path: { ...UPPER_CURVE_TEXT_PATH, startX: 18, startY: 80, endX: 82, endY: 64 },
    });
    expect(useCoatProjectStore.getState().history.past).toHaveLength(2);
  });

  it('shows a dashed ring and dispatches the adjusted radius through the path command', () => {
    const project = applyProjectCommand(createCanvasProject(), {
      type: 'add-text-layer', text: 'RING', color: '#B11F24', fontSize: 40,
      alignment: 'center', path: OUTWARD_RING_TEXT_PATH,
    });
    const textLayer = project.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected ring text layer');
    const { canvas } = renderCanvas(project);
    const textElement = canvas.querySelector(`[data-layer-id="${textLayer.id}"]`);
    if (!(textElement instanceof SVGElement)) throw new Error('Expected ring text scene element');

    fireEvent.pointerDown(textElement, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 1 });
    stubTextPathMeetBox(canvas);
    expect(canvas.querySelectorAll('[data-resize-handle]')).toHaveLength(0);
    expect(screen.queryByRole('button', { name: 'Rotate selected layer' })).toBeNull();
    expect(selectedLayerBoundingRect()).toBeUndefined();
    expect(canvas.querySelectorAll('[data-text-path-handle]')).toHaveLength(1);
    const toolbar = screen.getByRole('toolbar', { name: 'Selected element actions' });
    const controls = screen.getByLabelText('Selected layer controls');
    expect(controls.contains(toolbar)).toBe(false);
    expect(canvas.contains(toolbar)).toBe(true);
    expect(toolbar.className).not.toContain('bottom-full');
    expect(toolbar.className).not.toContain('mb-14');
    expect(toolbar.className).not.toContain('top-2');
    expect(toolbar.className).toContain('top-auto');
    expect(toolbar.className).toContain('bottom-2');
    const guide = canvas.querySelector('[data-text-path-guide="ring"]');
    expect(guide?.getAttribute('r')).toBe('40');
    expect(guide?.getAttribute('stroke')).toBe('#7eb6ff');
    expect(guide?.getAttribute('stroke-dasharray')).toBe('3 3');
    expect(guide?.closest('svg')?.getAttribute('viewBox')).toBe('0 0 100 110');
    const handle = screen.getByRole('button', { name: 'Adjust ring text radius and position' });
    expect(toolbar.contains(handle)).toBe(false);
    fireEvent.pointerDown(handle, { clientX: 50, clientY: 10, pointerId: 2 });
    fireEvent.pointerMove(canvas, { clientX: 50, clientY: 20, pointerId: 2 });
    fireEvent.pointerUp(canvas, { clientX: 50, clientY: 20, pointerId: 2 });

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      path: { ...OUTWARD_RING_TEXT_PATH, radius: 30 },
    });
    expect(useCoatProjectStore.getState().history.past).toHaveLength(1);
  });

  it('rotates ring text around the circle when the handle is dragged sideways', () => {
    const project = applyProjectCommand(createCanvasProject(), {
      type: 'add-text-layer', text: 'RING', color: '#B11F24', fontSize: 40,
      alignment: 'center', path: OUTWARD_RING_TEXT_PATH,
    });
    const textLayer = project.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected ring text layer');
    const { canvas } = renderCanvas(project);
    const textElement = canvas.querySelector(`[data-layer-id="${textLayer.id}"]`);
    if (!(textElement instanceof SVGElement)) throw new Error('Expected ring text scene element');

    fireEvent.pointerDown(textElement, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 1 });
    stubTextPathMeetBox(canvas);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Adjust ring text radius and position' }), {
      clientX: 50, clientY: 10, pointerId: 2,
    });
    fireEvent.pointerMove(canvas, { clientX: 90, clientY: 50, pointerId: 2 });
    fireEvent.pointerUp(canvas, { clientX: 90, clientY: 50, pointerId: 2 });

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      path: { ...OUTWARD_RING_TEXT_PATH, radius: 40, startAngle: 90 },
    });
    expect(useCoatProjectStore.getState().history.past).toHaveLength(1);
  });

  it('saturates an out-of-range ring radius instead of throwing', () => {
    const ringInteraction = {
      pointerId: 1,
      layerId: 'text-ring',
      kind: 'ring-radius' as const,
      startPath: OUTWARD_RING_TEXT_PATH,
      startTransform: { x: 0, y: 0, scale: 1, rotation: 0 },
    };
    expect(getNextTextPathInteractionPath(ringInteraction, { x: 50, y: 50 })).toMatchObject({ radius: 10, startAngle: 0 });
    expect(getNextTextPathInteractionPath(ringInteraction, { x: 50, y: -5 })).toMatchObject({ radius: 50, startAngle: 0 });
    expect(getNextTextPathInteractionPath(ringInteraction, { x: 90, y: 50 })).toMatchObject({ radius: 40, startAngle: 90 });
    expect(getNextTextPathInteractionPath(ringInteraction, { x: 10, y: 50 })).toMatchObject({ radius: 40, startAngle: 270 });
    expect(() => getNextTextPathInteractionPath(ringInteraction, { x: Number.NaN, y: 10 }))
      .toThrow('Invalid text path radius: NaN; expected 10-50');
  });

  it('saturates out-of-range curve handle coordinates instead of throwing', () => {
    const startInteraction = {
      pointerId: 1,
      layerId: 'text-curve',
      kind: 'curve-start' as const,
      startPath: UPPER_CURVE_TEXT_PATH,
      startTransform: { x: 0, y: 0, scale: 1, rotation: 0 },
    };
    expect(getNextTextPathInteractionPath(startInteraction, { x: -1, y: 80 })).toMatchObject({
      startX: 0, startY: 80,
    });
    expect(getNextTextPathInteractionPath(startInteraction, { x: 101, y: 111 })).toMatchObject({
      startX: 100, startY: 110,
    });
    expect(() => getNextTextPathInteractionPath(startInteraction, { x: Number.NaN, y: 72 }))
      .toThrow('Invalid text path start x: NaN; expected 0-100');
  });

  it('saturates an out-of-range text box width instead of throwing', () => {
    const widthInteraction = {
      pointerId: 1,
      layerId: 'text-width',
      side: 'right' as const,
      startBoxWidth: 40,
      startPoint: { x: 70, y: 55 },
    };
    expect(getNextTextBoxWidth(widthInteraction, { x: 200, y: 55 })).toBe(100);
    expect(getNextTextBoxWidth(widthInteraction, { x: 0, y: 55 })).toBe(8);
    expect(() => getNextTextBoxWidth(widthInteraction, { x: Number.NaN, y: 55 }))
      .toThrow('Invalid text box width: NaN; expected 8-100 scene units');
  });

  it('writes boxWidth from the straight-text width handles without scaling the layer', () => {
    const project = applyProjectCommand(createCanvasProject(), {
      type: 'add-text-layer', text: 'WIDTH', color: '#B11F24', fontSize: 40,
      alignment: 'center', path: { mode: 'none' }, boxWidth: 40,
    });
    const textLayer = project.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected straight text layer');
    const { canvas } = renderCanvas({
      ...project,
      layers: project.layers.map((layer) => layer.id === textLayer.id ? { ...layer, id: 'text-width' } : layer),
    });
    const textElement = canvas.querySelector('[data-layer-id="text-width"]');
    if (!(textElement instanceof SVGElement)) throw new Error('Expected straight text scene element');

    fireEvent.pointerDown(textElement, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 1 });
    expect(canvas.querySelectorAll('[data-text-box-width-handle]')).toHaveLength(2);
    expect(canvas.querySelectorAll('[data-resize-handle]')).toHaveLength(0);
    expect(screen.getByRole('button', { name: 'Rotate selected layer' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Adjust straight text width left' })).toBeDefined();
    expect(selectedLayerBoundingRect()).toBeDefined();
    expect(canvas.querySelector('[data-text-path-guide]')).toBeNull();
    const toolbar = screen.getByRole('toolbar', { name: 'Selected element actions' });
    const controls = screen.getByLabelText('Selected layer controls');
    expect(controls.contains(toolbar)).toBe(true);
    expect(toolbar.className).toContain('bottom-full');
    expect(toolbar.className).toContain('mb-14');

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Adjust straight text width right' }), {
      clientX: 70, clientY: 55, pointerId: 2,
    });
    fireEvent.pointerMove(canvas, { clientX: 85, clientY: 55, pointerId: 2 });
    expect(getLayer('text-width')).toMatchObject({ type: 'text', boxWidth: 40, transform: { scale: 1 } });
    fireEvent.pointerUp(canvas, { clientX: 85, clientY: 55, pointerId: 2 });

    expect(getLayer('text-width')).toMatchObject({
      type: 'text',
      boxWidth: 55,
      transform: { scale: 1, x: 0, y: 0 },
    });
    expect(useCoatProjectStore.getState().history.past).toHaveLength(1);
  });

  it('rotates selected straight text around the measured glyph box instead of the transform origin', () => {
    const project = applyProjectCommand(
      createCanvasProject(),
      createTextCreationCommand('text', 'Double-click to edit'),
    );
    const textLayer = project.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected straight text layer');
    expect(textLayer.transform).toMatchObject({ x: 0, y: -47, rotation: 0 });
    const { canvas } = renderCanvas({
      ...project,
      layers: project.layers.map((layer) => (
        layer.id === textLayer.id ? { ...layer, id: 'text-rotate' } : layer
      )),
    });
    const textElement = canvas.querySelector('[data-layer-id="text-rotate"]');
    if (!(textElement instanceof SVGElement)) throw new Error('Expected straight text scene element');

    fireEvent.pointerDown(textElement, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 1 });
    stubStraightTextGlyphRect(canvas, 'text-rotate');

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Rotate selected layer' }), {
      clientX: 50, clientY: 40, pointerId: 2,
    });
    fireEvent.pointerMove(canvas, { clientX: 70, clientY: 55, pointerId: 2 });
    fireEvent.pointerUp(canvas, { clientX: 70, clientY: 55, pointerId: 2 });

    const rotated = getLayer('text-rotate');
    if (rotated.type !== 'text') {
      throw new Error(`Expected rotated straight text layer, got: ${JSON.stringify(rotated)}`);
    }
    expect(rotated.transform.rotation).toBeCloseTo(45);
    expect(rotated.transform.x).toBe(0);
    expect(rotated.transform.y).toBe(-47);
  });

  it('clamps a ring radius dragged past the scene and still releases the pointer', () => {
    const project = applyProjectCommand(createCanvasProject(), {
      type: 'add-text-layer', text: 'RING', color: '#B11F24', fontSize: 40,
      alignment: 'center', path: OUTWARD_RING_TEXT_PATH,
    });
    const textLayer = project.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected ring text layer');
    const { canvas } = renderCanvas({
      ...project,
      layers: project.layers.map((layer) => layer.id === textLayer.id ? { ...layer, id: 'text-ring' } : layer),
    });
    const setPointerCapture = vi.fn();
    const releasePointerCapture = vi.fn();
    Object.defineProperties(canvas, {
      setPointerCapture: { configurable: true, value: setPointerCapture },
      releasePointerCapture: { configurable: true, value: releasePointerCapture },
    });
    const textElement = canvas.querySelector('[data-layer-id="text-ring"]');
    if (!(textElement instanceof SVGElement)) throw new Error('Expected ring text scene element');

    fireEvent.pointerDown(textElement, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 1 });
    stubTextPathMeetBox(canvas);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Adjust ring text radius and position' }), {
      clientX: 50, clientY: 10, pointerId: 2,
    });
    fireEvent.pointerMove(canvas, { clientX: 50, clientY: -5, pointerId: 2 });
    fireEvent.pointerUp(canvas, { clientX: 50, clientY: -5, pointerId: 2 });

    expect(getLayer('text-ring')).toMatchObject({ path: { ...OUTWARD_RING_TEXT_PATH, radius: 50 } });
    expect(releasePointerCapture).toHaveBeenCalledWith(2);
    expect(useCoatProjectStore.getState().history.past).toHaveLength(1);
  });

  it('clamps a curve start dragged 1px off the artboard instead of throwing', () => {
    const project = applyProjectCommand(createCanvasProject(), {
      type: 'add-text-layer', text: 'CURVE', color: '#B11F24', fontSize: 40,
      alignment: 'center', path: UPPER_CURVE_TEXT_PATH,
    });
    const textLayer = project.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected curved text layer');
    const { canvas } = renderCanvas({
      ...project,
      layers: project.layers.map((layer) => layer.id === textLayer.id ? { ...layer, id: 'text-curve' } : layer),
    });
    const textElement = canvas.querySelector('[data-layer-id="text-curve"]');
    if (!(textElement instanceof SVGElement)) throw new Error('Expected curved text scene element');

    fireEvent.pointerDown(textElement, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 1 });
    stubTextPathMeetBox(canvas);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Adjust curved text start point' }), {
      clientX: 10, clientY: 72, pointerId: 2,
    });
    fireEvent.pointerMove(canvas, { clientX: -1, clientY: 72, pointerId: 2 });
    fireEvent.pointerUp(canvas, { clientX: -1, clientY: 72, pointerId: 2 });

    expect(getLayer('text-curve')).toMatchObject({
      path: { ...UPPER_CURVE_TEXT_PATH, startX: 0, startY: 72 },
    });
  });

  it('writes a curve start from the meet box letterbox, not the stretched artboard', () => {
    const artboard = { width: 1800, height: 1080 };
    const project = applyProjectCommand(createCanvasProject(), {
      type: 'add-text-layer', text: 'CURVE', color: '#B11F24', fontSize: 40,
      alignment: 'center', path: UPPER_CURVE_TEXT_PATH,
    });
    const textLayer = project.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected curved text layer');
    const { canvas } = renderCanvas({
      ...project,
      layers: project.layers.map((layer) => layer.id === textLayer.id ? { ...layer, id: 'text-curve' } : layer),
    }, false, undefined, artboard);
    const textElement = canvas.querySelector('[data-layer-id="text-curve"]');
    if (!(textElement instanceof SVGElement)) throw new Error('Expected curved text scene element');

    fireEvent.pointerDown(textElement, { clientX: 900, clientY: 540, pointerId: 1 });
    fireEvent.pointerCancel(canvas, { clientX: 900, clientY: 540, pointerId: 1 });
    const meetRect = stubTextPathMeetBox(canvas, letterboxMeetRect(artboard.width, artboard.height));
    const clientX = meetRect.left + (18 / SELECTION_SCENE_WIDTH) * meetRect.width;
    const clientY = meetRect.top + (80 / SELECTION_SCENE_HEIGHT) * meetRect.height;
    const naiveArtboardX = (clientX / artboard.width) * SELECTION_SCENE_WIDTH;
    expect(Math.abs(naiveArtboardX - 18)).toBeGreaterThan(10);

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Adjust curved text start point' }), {
      clientX, clientY, pointerId: 2,
    });
    fireEvent.pointerMove(canvas, { clientX, clientY, pointerId: 2 });
    fireEvent.pointerUp(canvas, { clientX, clientY, pointerId: 2 });

    const written = getLayer('text-curve');
    if (written.type !== 'text' || written.path.mode !== 'curve' || !('startX' in written.path) || !('startY' in written.path)) {
      throw new Error(`Expected written curve path, got: ${JSON.stringify(written)}`);
    }
    expect(written.path.startX).toBeCloseTo(18, 10);
    expect(written.path.startY).toBeCloseTo(80, 10);
    expect(written.path.startX).not.toBeCloseTo(naiveArtboardX, 0);
  });

  it('throws when the text path meet box is missing or has no size', () => {
    const canvas = document.createElement('div');
    expect(() => toTextPathMeetBoxScenePoint(null, { clientX: 10, clientY: 20 }))
      .toThrow('Canvas element is unavailable for text path pointer conversion');
    expect(() => toTextPathMeetBoxScenePoint(canvas, { clientX: 10, clientY: 20 }))
      .toThrow('Text path meet box is missing: null');

    const meetBox = document.createElement('div');
    meetBox.setAttribute('data-text-path-meet-box', '');
    canvas.appendChild(meetBox);
    vi.spyOn(meetBox, 'getBoundingClientRect').mockReturnValue({
      x: 12,
      y: 8,
      left: 12,
      top: 8,
      width: 0,
      height: -3,
      right: 12,
      bottom: 5,
      toJSON: () => ({}),
    } as DOMRect);
    expect(() => toTextPathMeetBoxScenePoint(canvas, { clientX: 10, clientY: 20 }))
      .toThrow('Invalid text path meet box bounds: 0x-3');
  });

  it('clamps a straight-text width drag past 100 without throwing', () => {
    const project = applyProjectCommand(createCanvasProject(), {
      type: 'add-text-layer', text: 'WIDTH', color: '#B11F24', fontSize: 40,
      alignment: 'center', path: { mode: 'none' }, boxWidth: 40,
    });
    const textLayer = project.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected straight text layer');
    const { canvas } = renderCanvas({
      ...project,
      layers: project.layers.map((layer) => layer.id === textLayer.id ? { ...layer, id: 'text-width' } : layer),
    });
    const textElement = canvas.querySelector('[data-layer-id="text-width"]');
    if (!(textElement instanceof SVGElement)) throw new Error('Expected straight text scene element');

    fireEvent.pointerDown(textElement, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Adjust straight text width right' }), {
      clientX: 70, clientY: 55, pointerId: 2,
    });
    fireEvent.pointerMove(canvas, { clientX: 200, clientY: 55, pointerId: 2 });
    fireEvent.pointerUp(canvas, { clientX: 200, clientY: 55, pointerId: 2 });

    expect(getLayer('text-width')).toMatchObject({ type: 'text', boxWidth: 100, transform: { scale: 1 } });
  });

  it('clamps the missing boxWidth estimate to 100 so old straight text can still drag width', () => {
    const project = applyProjectCommand(createCanvasProject(), {
      type: 'add-text-layer',
      text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      color: '#B11F24',
      fontSize: 40,
      alignment: 'center',
      path: { mode: 'none' },
    });
    const textLayer = project.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected straight text layer');
    expect('boxWidth' in textLayer).toBe(false);
    const { canvas } = renderCanvas({
      ...project,
      layers: project.layers.map((layer) => layer.id === textLayer.id ? { ...layer, id: 'text-legacy-width' } : layer),
    });
    const textElement = canvas.querySelector('[data-layer-id="text-legacy-width"]');
    if (!(textElement instanceof SVGElement)) throw new Error('Expected straight text scene element');

    fireEvent.pointerDown(textElement, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Adjust straight text width right' }), {
      clientX: 70, clientY: 55, pointerId: 2,
    });
    fireEvent.pointerMove(canvas, { clientX: 60, clientY: 55, pointerId: 2 });
    fireEvent.pointerUp(canvas, { clientX: 60, clientY: 55, pointerId: 2 });

    expect(getLayer('text-legacy-width')).toMatchObject({ type: 'text', boxWidth: 90 });
  });

  it('does not expose crop handles on a selected layer', () => {
    const { canvas } = renderCanvas();
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(charge instanceof SVGElement)) throw new Error('Expected charge scene element');

    fireEvent.pointerDown(charge, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerUp(canvas, { clientX: 50, clientY: 55, pointerId: 1 });

    expect(screen.getByRole('button', { name: 'Resize selected layer' })).toBeDefined();
    expect(screen.queryByLabelText('Crop left')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Reset crop' })).toBeNull();
    expect(screen.queryByRole('group', { name: 'Crop selected layer' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Move crop frame' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Resize crop left edge' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Resize crop right edge' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Resize crop top edge' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Resize crop bottom edge' })).toBeNull();
  });

  it('lets keyboard users select a canvas layer and adjust its scale and rotation without persisting selection', () => {
    const { canvas } = renderCanvas();

    fireEvent.keyDown(canvas, { key: 'ArrowDown', altKey: true });
    fireEvent.keyDown(canvas, { key: 'ArrowDown', altKey: true });
    expect(screen.getByLabelText('Selected layer controls').getAttribute('data-selection-x')).toBe('0');

    fireEvent.keyDown(canvas, { key: ']' });
    fireEvent.keyDown(canvas, { key: '.' });

    expect(getLayer('charge-1')).toMatchObject({ transform: { scale: 1.1, rotation: 15 } });
    expect(useCoatProjectStore.getState().history.past).toHaveLength(2);
    expect(useCoatProjectStore.getState().project).not.toHaveProperty('selection');
  });

  it('lets keyboard users activate the 24px resize and rotate handle targets', () => {
    const { canvas } = renderCanvas();
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(charge instanceof SVGElement)) throw new Error('Expected charge scene element');

    fireEvent.pointerDown(charge, { clientX: 50, clientY: 55, pointerId: 1 });
    const resizeHandle = screen.getByRole('button', { name: 'Resize selected layer' });
    const rotateHandle = screen.getByRole('button', { name: 'Rotate selected layer' });

    expect(resizeHandle.className).toContain('h-6');
    expect(resizeHandle.className).toContain('w-6');
    expect(rotateHandle.className).toContain('h-6');
    expect(rotateHandle.className).toContain('w-6');
    expect(resizeHandle.querySelector('span')?.className).toContain('h-[13px]');
    expect(resizeHandle.querySelector('span')?.className).toContain('w-[13px]');
    expect(rotateHandle.querySelector('span')?.className).toContain('h-[13px]');

    fireEvent.keyDown(resizeHandle, { key: 'Enter' });
    fireEvent.keyDown(rotateHandle, { key: ' ' });

    expect(getLayer('charge-1')).toMatchObject({ transform: { scale: 1.1, rotation: 15 } });
    expect(useCoatProjectStore.getState().history.past).toHaveLength(2);
  });

  it('transforms every selected layer from the shared handles and preserves non-uniform proportions', () => {
    let project = applyProjectCommand(createCanvasProject(), { type: 'add-layer', assetId: 'material-symbol-shooting-star' });
    const secondCharge = project.layers.at(-1);
    if (!secondCharge || secondCharge.type !== 'charge') throw new Error('Expected a second charge');
    project = {
      ...project,
      layers: project.layers.map((layer) => {
        if (layer.id === 'charge-1' && layer.type !== 'background') {
          return { ...layer, transform: { ...layer.transform, scaleX: 2, scaleY: 0.5 } };
        }
        return layer.id === secondCharge.id && layer.type !== 'background'
          ? { ...layer, id: 'charge-2', transform: { ...layer.transform, x: 10, scale: 1 } }
          : layer;
      }),
    };
    const { canvas } = renderCanvas(project, true);
    const firstCharge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(firstCharge instanceof SVGElement)) throw new Error('Expected first charge scene element');

    fireEvent.pointerDown(firstCharge, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 1 });
    const secondChargeElement = canvas.querySelector('[data-layer-id="charge-2"]');
    if (!(secondChargeElement instanceof SVGElement)) throw new Error('Expected second charge scene element');
    fireEvent.pointerDown(secondChargeElement, { clientX: 50, clientY: 55, pointerId: 2 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 2 });

    fireEvent.keyDown(screen.getByRole('button', { name: 'Resize selected layer' }), { key: 'Enter' });
    fireEvent.keyDown(screen.getByRole('button', { name: 'Rotate selected layer' }), { key: 'Enter' });

    expect(getTransformLayer('charge-1').transform).toMatchObject({ scale: 1.1, scaleX: 2.2, scaleY: 0.55, rotation: 15 });
    expect(getTransformLayer('charge-2').transform).toMatchObject({ scale: 1.1, rotation: 15 });
    expect(getTransformLayer('charge-1').transform.x).toBeCloseTo(-0.31, 2);
    expect(getTransformLayer('charge-1').transform.y).toBeCloseTo(-1.42, 2);
    expect(getTransformLayer('charge-2').transform.x).toBeCloseTo(10.31, 2);
    expect(getTransformLayer('charge-2').transform.y).toBeCloseTo(1.42, 2);
    expect(useCoatProjectStore.getState().history.past).toHaveLength(2);
  });

  it('captures the active pointer and releases it so later pointer moves cannot change the transform', () => {
    const { canvas } = renderCanvas();
    const setPointerCapture = vi.fn();
    const releasePointerCapture = vi.fn();
    Object.defineProperties(canvas, {
      setPointerCapture: { configurable: true, value: setPointerCapture },
      releasePointerCapture: { configurable: true, value: releasePointerCapture },
    });
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(charge instanceof SVGElement)) throw new Error('Expected charge scene element');

    fireEvent.pointerDown(charge, { clientX: 10, clientY: 10, pointerId: 7 });
    fireEvent.pointerMove(canvas, { clientX: 50, clientY: 30, pointerId: 7 });
    fireEvent.pointerUp(canvas, { clientX: 50, clientY: 30, pointerId: 7 });
    fireEvent.pointerMove(canvas, { clientX: 90, clientY: 90, pointerId: 7 });

    expect(setPointerCapture).toHaveBeenCalledWith(7);
    expect(releasePointerCapture).toHaveBeenCalledWith(7);
    expect(getLayer('charge-1')).toMatchObject({ transform: { x: 40 } });
    expect(useCoatProjectStore.getState().history.past).toHaveLength(1);
  });

  it('positions presentational handles from the selected layer scene transform', () => {
    const moved = applyProjectCommand(createCanvasProject(), {
      type: 'update-layer',
      layerId: 'charge-1',
      patch: { transform: { x: 20, y: 11, scale: 1, rotation: 0 } },
    });
    const { canvas } = renderCanvas(moved);
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(charge instanceof SVGElement)) throw new Error('Expected charge scene element');

    fireEvent.pointerDown(charge, { clientX: 50, clientY: 55, pointerId: 1 });

    const controls = screen.getByLabelText('Selected layer controls');
    expect(controls.getAttribute('data-selection-x')).toBe('20');
    expect(controls.getAttribute('data-selection-y')).toBe('11');
    expect(controls.getAttribute('style')).toContain('left: 20%');
    expect(controls.getAttribute('style')).toContain('top: 10%');
  });

  it('shows eight resize handles, a rotate handle, and the floating action toolbar on the selected layer', () => {
    const { canvas } = renderCanvas();
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(charge instanceof SVGElement)) throw new Error('Expected charge scene element');

    fireEvent.pointerDown(charge, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 1 });

    expect(canvas.querySelectorAll('[data-resize-handle]')).toHaveLength(8);
    expect(screen.getByRole('button', { name: 'Resize selected layer' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Rotate selected layer' })).toBeDefined();
    expect(screen.getByRole('toolbar', { name: 'Selected element actions' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Duplicate selected element' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Flip selected element horizontally' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Selected element layer order' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Delete selected element' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Lock selected element' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Hide selected element' })).toBeDefined();
  });

  it('keeps the selection when the floating toolbar is pressed', () => {
    const { canvas } = renderCanvas();
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(charge instanceof SVGElement)) throw new Error('Expected charge scene element');

    fireEvent.pointerDown(charge, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerDown(screen.getByRole('toolbar', { name: 'Selected element actions' }), {
      clientX: 50, clientY: 8, pointerId: 4,
    });

    expect(useCoatProjectStore.getState().selectedLayerIds).toEqual(['charge-1']);
  });

  it('renders the shared SVG scene and keeps canvas focusable for keyboard editing', () => {
    renderCanvas();

    expect(screen.getByRole('application', { name: 'Coat of arms canvas' }).getAttribute('tabindex')).toBe('0');
    expect(screen.getByLabelText('My Coat of Arms')).toBeDefined();
    expect(screen.getByText(/Arrow keys move selected layers/)).toBeDefined();
    expect(screen.getByText(/Copy, paste, group, ungroup/)).toBeDefined();
  });

  it('opens straight text for inline editing and commits on Enter or blur', () => {
    const project = applyProjectCommand(createCanvasProject(), {
      type: 'add-text-layer', text: 'ORIGINAL', color: '#B11F24', fontSize: 40,
      alignment: 'center', path: { mode: 'none' },
    });
    const textLayer = project.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected text layer');
    const { canvas } = renderCanvas({
      ...project,
      layers: project.layers.map((layer) => layer.id === textLayer.id ? { ...layer, id: 'text-1' } : layer),
    });

    const textElement = canvas.querySelector('[data-layer-id="text-1"]');
    if (!(textElement instanceof SVGElement)) throw new Error('Expected text scene element');
    fireEvent.doubleClick(textElement);
    const editor = screen.getByRole('textbox', { name: 'Edit text' });
    fireEvent.change(editor, { target: { value: 'COMMITTED' } });
    fireEvent.keyDown(editor, { key: 'Enter' });

    expect(getLayer('text-1')).toMatchObject({ type: 'text', text: 'COMMITTED' });
    expect(screen.queryByRole('textbox', { name: 'Edit text' })).toBeNull();

    fireEvent.doubleClick(canvas.querySelector('[data-layer-id="text-1"]') as SVGElement);
    const cancelledEditor = screen.getByRole('textbox', { name: 'Edit text' });
    fireEvent.change(cancelledEditor, { target: { value: 'CANCELLED' } });
    fireEvent.keyDown(cancelledEditor, { key: 'Escape' });
    expect(getLayer('text-1')).toMatchObject({ type: 'text', text: 'COMMITTED' });

    fireEvent.doubleClick(canvas.querySelector('[data-layer-id="text-1"]') as SVGElement);
    const blurredEditor = screen.getByRole('textbox', { name: 'Edit text' });
    fireEvent.change(blurredEditor, { target: { value: 'BLURRED' } });
    fireEvent.blur(blurredEditor);
    expect(getLayer('text-1')).toMatchObject({ type: 'text', text: 'BLURRED' });
  });

  it('keeps inline editing open and reports empty text validation errors', () => {
    const project = applyProjectCommand(createCanvasProject(), {
      type: 'add-text-layer', text: 'ORIGINAL', color: '#B11F24', fontSize: 40,
      alignment: 'center', path: { mode: 'none' },
    });
    const textLayer = project.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected text layer');
    const { canvas } = renderCanvas({ ...project, layers: project.layers.map((layer) => layer.id === textLayer.id ? { ...layer, id: 'text-empty' } : layer) });
    fireEvent.doubleClick(canvas.querySelector('[data-layer-id="text-empty"]') as SVGElement);
    const editor = screen.getByRole('textbox', { name: 'Edit text' });
    fireEvent.change(editor, { target: { value: '' } });
    fireEvent.keyDown(editor, { key: 'Enter' });

    expect(screen.getByRole('alert').textContent).toMatch(/text layer text/i);
    expect(screen.getByRole('textbox', { name: 'Edit text' })).toBeDefined();
    expect(getLayer('text-empty')).toMatchObject({ text: 'ORIGINAL' });
  });

  it('keeps inline editing open and reports text over the 240-character limit', () => {
    const project = applyProjectCommand(createCanvasProject(), {
      type: 'add-text-layer', text: 'ORIGINAL', color: '#B11F24', fontSize: 40,
      alignment: 'center', path: { mode: 'none' },
    });
    const textLayer = project.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected text layer');
    const { canvas } = renderCanvas({ ...project, layers: project.layers.map((layer) => layer.id === textLayer.id ? { ...layer, id: 'text-long' } : layer) });
    fireEvent.doubleClick(canvas.querySelector('[data-layer-id="text-long"]') as SVGElement);
    const editor = screen.getByRole('textbox', { name: 'Edit text' });
    expect(editor.getAttribute('maxlength')).toBe('240');
    fireEvent.change(editor, { target: { value: 'A'.repeat(241) } });
    fireEvent.keyDown(editor, { key: 'Enter' });

    expect(screen.getByRole('alert').textContent).toContain('241');
    expect(screen.getByRole('textbox', { name: 'Edit text' })).toBeDefined();
    expect(getLayer('text-long')).toMatchObject({ text: 'ORIGINAL' });
  });

  it('clears inline editing when its text layer is deleted', () => {
    const project = applyProjectCommand(createCanvasProject(), {
      type: 'add-text-layer', text: 'ORIGINAL', color: '#B11F24', fontSize: 40,
      alignment: 'center', path: { mode: 'none' },
    });
    const textLayer = project.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected text layer');
    const { canvas } = renderCanvas({ ...project, layers: project.layers.map((layer) => layer.id === textLayer.id ? { ...layer, id: 'text-deleted' } : layer) });
    fireEvent.doubleClick(canvas.querySelector('[data-layer-id="text-deleted"]') as SVGElement);
    expect(screen.getByRole('textbox', { name: 'Edit text' })).toBeDefined();
    act(() => useCoatProjectStore.getState().dispatch({ type: 'remove-layer', layerId: 'text-deleted' }));

    expect(screen.queryByRole('textbox', { name: 'Edit text' })).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('fades only off-artboard pixels and keeps in-canvas pixels fully opaque and unclipped', () => {
    const { canvas } = renderCanvas(createCanvasProject(), false, false);
    const overflowPass = canvas.querySelector('[data-coat-scene-pass="overflow"]');
    const artboardPass = canvas.querySelector('[data-coat-scene-pass="artboard"]');
    if (!(overflowPass instanceof HTMLElement) || !(artboardPass instanceof HTMLElement)) {
      throw new Error('Expected overflow and artboard scene passes');
    }

    expect(overflowPass.style.opacity).toBe('0.5');
    expect(overflowPass.className).toContain('overflow-visible');
    expect(overflowPass.className).toContain('pointer-events-none');
    expect(overflowPass.getAttribute('aria-hidden')).toBe('true');
    expect(artboardPass.className).toContain('overflow-hidden');
    expect(artboardPass.style.opacity).toBe('');
    expect(overflowPass.nextElementSibling).toBe(artboardPass);
    expect(
      overflowPass.compareDocumentPosition(artboardPass) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

    const overflowSvg = overflowPass.querySelector('svg');
    const artboardSvg = artboardPass.querySelector('svg');
    if (!(overflowSvg instanceof SVGElement) || !(artboardSvg instanceof SVGElement)) {
      throw new Error('Expected a scene SVG in each pass');
    }
    expect(overflowSvg.getAttribute('overflow')).toBe('visible');
    expect(overflowSvg.getAttribute('aria-hidden')).toBe('true');
    expect(artboardSvg.getAttribute('overflow')).toBeNull();

    const overflowCharge = overflowPass.querySelector('[data-layer-id="charge-1"]');
    const artboardCharge = artboardPass.querySelector('[data-layer-id="charge-1"]');
    if (!(overflowCharge instanceof SVGElement) || !(artboardCharge instanceof SVGElement)) {
      throw new Error('Expected charge in both scene passes');
    }
    expect(overflowCharge.querySelector('g[opacity]')?.getAttribute('opacity')).toBe('1');
    expect(artboardCharge.querySelector('g[opacity]')?.getAttribute('opacity')).toBe('1');
    expect(getTransformLayer('charge-1').transform.opacity ?? 1).toBe(1);

    expect(overflowPass.innerHTML).toContain('id="coat-overflow-');
    expect(artboardPass.innerHTML).toContain('id="coat-shield-clip-1"');
    expect(artboardPass.innerHTML).not.toContain('id="coat-overflow-');
    expect(overflowPass.innerHTML).not.toContain('data-layer-id="coat-overflow-');

    fireEvent.pointerDown(artboardCharge, { clientX: 10, clientY: 55, pointerId: 1 });
    fireEvent.pointerMove(canvas, { clientX: 90, clientY: 55, pointerId: 1 });

    const overflowChargeAfterDrag = overflowPass.querySelector('[data-layer-id="charge-1"] g[transform]');
    const artboardChargeAfterDrag = artboardPass.querySelector('[data-layer-id="charge-1"] g[transform]');
    if (!(overflowChargeAfterDrag instanceof SVGElement) || !(artboardChargeAfterDrag instanceof SVGElement)) {
      throw new Error('Expected preview transforms on both scene passes');
    }
    expect(overflowChargeAfterDrag.getAttribute('transform')).toContain('translate(80');
    expect(artboardChargeAfterDrag.getAttribute('transform')).toContain('translate(80');
    expect(overflowPass.style.opacity).toBe('0.5');
    expect(artboardPass.className).toContain('overflow-hidden');

    const handles = canvas.querySelector('[data-resize-handle]');
    if (!(handles instanceof HTMLElement)) throw new Error('Expected selection handles');
    expect(handles.compareDocumentPosition(overflowPass) & Node.DOCUMENT_POSITION_PRECEDING).toBeGreaterThan(0);
    expect(handles.compareDocumentPosition(artboardPass) & Node.DOCUMENT_POSITION_PRECEDING).toBeGreaterThan(0);
    expect(handles.style.opacity).toBe('');
  });
});
