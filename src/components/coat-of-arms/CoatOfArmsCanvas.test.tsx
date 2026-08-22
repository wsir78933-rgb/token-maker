// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, createEvent, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { applyProjectCommand } from '@/lib/coat-of-arms/commands';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CoatProject } from '@/lib/coat-of-arms/types';
import { CoatOfArmsCanvas } from './CoatOfArmsCanvas';
import { TextMottoPanel } from './TextMottoPanel';
import { TEXT_CREATION_DRAG_MIME } from './text-creation-drag';

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

function getTransformLayer(layerId: string) {
  const layer = getLayer(layerId);
  if (layer.type === 'background') throw new Error(`Expected a transform layer: ${layerId}`);
  return layer;
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
      path: { mode: 'curve', curve: 'upper' },
      transform: { x: -30, scale: 1, rotation: 0 },
    });
    if (!droppedLayer || droppedLayer.type === 'background') throw new Error('Expected dropped text layer');
    expect(droppedLayer.transform.y).toBeCloseTo(-25);
    expect(useCoatProjectStore.getState().selectedLayerIds).toEqual([droppedLayer?.id]);
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
      transform: { scale: 1.25, rotation: 90 },
    });
    expect(useCoatProjectStore.getState().history.past).toHaveLength(2);
  });

  it('shows a bezier control handle and dispatches the reshaped curve through the path command', () => {
    const project = applyProjectCommand(createCanvasProject(), {
      type: 'add-text-layer', text: 'CURVE', color: '#B11F24', fontSize: 40,
      alignment: 'center', path: { mode: 'curve', curve: 'upper' },
    });
    const textLayer = project.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected curved text layer');
    const { canvas } = renderCanvas(project);
    const textElement = canvas.querySelector(`[data-layer-id="${textLayer.id}"]`);
    if (!(textElement instanceof SVGElement)) throw new Error('Expected curved text scene element');

    fireEvent.pointerDown(textElement, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 1 });
    const handle = screen.getByRole('button', { name: 'Adjust curved text control point' });
    fireEvent.pointerDown(handle, { clientX: 50, clientY: 30, pointerId: 2 });
    fireEvent.pointerMove(canvas, { clientX: 50, clientY: 45, pointerId: 2 });
    expect((useCoatProjectStore.getState().project.layers.at(-1) as Extract<CoatProject['layers'][number], { type: 'text' }>).path).toEqual({ mode: 'curve', curve: 'upper' });
    fireEvent.pointerUp(canvas, { clientX: 50, clientY: 45, pointerId: 2 });

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      path: { mode: 'curve', curve: 'upper', controlX: 50, controlY: 45 },
    });
    expect(useCoatProjectStore.getState().history.past).toHaveLength(1);
  });

  it('shows a ring radius handle and dispatches the adjusted radius through the path command', () => {
    const project = applyProjectCommand(createCanvasProject(), {
      type: 'add-text-layer', text: 'RING', color: '#B11F24', fontSize: 40,
      alignment: 'center', path: { mode: 'ring', curve: 'clockwise' },
    });
    const textLayer = project.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected ring text layer');
    const { canvas } = renderCanvas(project);
    const textElement = canvas.querySelector(`[data-layer-id="${textLayer.id}"]`);
    if (!(textElement instanceof SVGElement)) throw new Error('Expected ring text scene element');

    fireEvent.pointerDown(textElement, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerCancel(canvas, { clientX: 50, clientY: 55, pointerId: 1 });
    const handle = screen.getByRole('button', { name: 'Adjust ring text radius' });
    fireEvent.pointerDown(handle, { clientX: 50, clientY: 10, pointerId: 2 });
    fireEvent.pointerMove(canvas, { clientX: 50, clientY: 20, pointerId: 2 });
    fireEvent.pointerUp(canvas, { clientX: 50, clientY: 20, pointerId: 2 });

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      path: { mode: 'ring', curve: 'clockwise', radius: 30 },
    });
    expect(useCoatProjectStore.getState().history.past).toHaveLength(1);
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
