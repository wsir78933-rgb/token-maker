// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { applyProjectCommand } from '@/lib/coat-of-arms/commands';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CoatProject } from '@/lib/coat-of-arms/types';
import { CoatOfArmsCanvas } from './CoatOfArmsCanvas';

let nextId = 0;

function createCanvasProject(): CoatProject {
  const project = createDefaultProject('en');
  const withStableIds: CoatProject = {
    ...project,
    layers: project.layers.map((layer, index) => ({
      ...layer,
      id: index === 0 ? 'background-1' : 'shield-1',
    })),
  };
  const withCharge = applyProjectCommand(withStableIds, {
    type: 'add-layer',
    assetId: 'material-animal-lion-rampant',
  });
  return {
    ...withCharge,
    layers: withCharge.layers.map((layer) => (
      layer.type === 'charge' ? { ...layer, id: 'charge-1' } : layer
    )),
  };
}

function renderCanvas(project: CoatProject = createCanvasProject(), multiSelectEnabled = false) {
  useCoatProjectStore.getState().replaceProject(project);
  const result = render(<CoatOfArmsCanvas locale="en" multiSelectEnabled={multiSelectEnabled} />);
  const canvas = screen.getByRole('application', { name: 'Coat of arms canvas' });
  vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
    x: 0, y: 0, left: 0, top: 0, right: 100, bottom: 110, width: 100, height: 110,
    toJSON: () => ({}),
  });
  return { ...result, canvas };
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

describe('CoatOfArmsCanvas', () => {
  beforeEach(() => {
    nextId = 0;
    vi.stubGlobal('crypto', { randomUUID: () => `generated-${nextId++}` });
    useCoatProjectStore.getState().setDrawingSettings({ isActive: false, color: '#004E89', strokeWidth: 3 });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
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
    useCoatProjectStore.getState().setDrawingSettings({ isActive: true, color: '#004E89', strokeWidth: 3 });
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

  it('commits a bounded crop resize only after its crop handle is released', () => {
    const { canvas } = renderCanvas();
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(charge instanceof SVGElement)) throw new Error('Expected charge scene element');

    fireEvent.pointerDown(charge, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerUp(canvas, { clientX: 50, clientY: 55, pointerId: 1 });

    const cropFrame = screen.getByRole('group', { name: 'Crop selected layer' });
    expect(cropFrame.getAttribute('data-crop-width')).toBe('100');
    expect(cropFrame.getAttribute('data-crop-height')).toBe('110');

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Resize crop left edge' }), {
      clientX: 0, clientY: 55, pointerId: 8,
    });
    fireEvent.pointerMove(canvas, { clientX: 200, clientY: 55, pointerId: 8 });

    expect(getTransformLayer('charge-1').transform.crop).toBeUndefined();
    expect(useCoatProjectStore.getState().history.past).toHaveLength(0);
    expect(cropFrame.getAttribute('data-crop-x')).toBe('99');
    expect(cropFrame.getAttribute('data-crop-width')).toBe('1');

    fireEvent.pointerUp(canvas, { clientX: 200, clientY: 55, pointerId: 8 });

    expect(getLayer('charge-1')).toMatchObject({ transform: { crop: { x: 99, y: 0, width: 1, height: 110 } } });
    expect(useCoatProjectStore.getState().history.past).toHaveLength(1);
  });

  it('moves an existing crop frame within the canvas bounds', () => {
    const cropped = applyProjectCommand(createCanvasProject(), {
      type: 'update-layer',
      layerId: 'charge-1',
      patch: { transform: { x: 0, y: 0, scale: 1, rotation: 0, crop: { x: 10, y: 20, width: 60, height: 70 } } },
    });
    const { canvas } = renderCanvas(cropped);
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(charge instanceof SVGElement)) throw new Error('Expected charge scene element');

    fireEvent.pointerDown(charge, { clientX: 40, clientY: 55, pointerId: 1 });
    fireEvent.pointerUp(canvas, { clientX: 40, clientY: 55, pointerId: 1 });
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Move crop frame' }), {
      clientX: 40, clientY: 55, pointerId: 10,
    });
    fireEvent.pointerMove(canvas, { clientX: -60, clientY: 155, pointerId: 10 });

    expect(screen.getByRole('group', { name: 'Crop selected layer' })).toMatchObject({
      dataset: { cropX: '0', cropY: '40', cropWidth: '60', cropHeight: '70' },
    });
    expect(getLayer('charge-1')).toMatchObject({ transform: { crop: { x: 10, y: 20, width: 60, height: 70 } } });

    fireEvent.pointerUp(canvas, { clientX: -60, clientY: 155, pointerId: 10 });
    expect(getLayer('charge-1')).toMatchObject({ transform: { crop: { x: 0, y: 40, width: 60, height: 70 } } });
  });

  it('keeps the crop frame aligned with a translated non-uniformly scaled layer and converts its resize gesture to local crop units', () => {
    const transformed = applyProjectCommand(createCanvasProject(), {
      type: 'update-layer',
      layerId: 'charge-1',
      patch: {
        transform: {
          x: 10, y: -5, scale: 1, scaleX: 2, scaleY: 0.5, rotation: 0,
          crop: { x: 10, y: 20, width: 60, height: 70 },
        },
      },
    });
    const { canvas } = renderCanvas(transformed);
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(charge instanceof SVGElement)) throw new Error('Expected charge scene element');

    fireEvent.pointerDown(charge, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerUp(canvas, { clientX: 50, clientY: 55, pointerId: 1 });

    const cropFrame = screen.getByRole('group', { name: 'Crop selected layer' });
    expect(cropFrame.parentElement?.getAttribute('style')).toContain('translate(10%, -4.545454545454546%) rotate(0deg) scale(2, 0.5)');

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Resize crop right edge' }), {
      clientX: 100, clientY: 50, pointerId: 11,
    });
    fireEvent.pointerMove(canvas, { clientX: 120, clientY: 50, pointerId: 11 });

    expect(cropFrame).toMatchObject({ dataset: { cropX: '10', cropY: '20', cropWidth: '70', cropHeight: '70' } });
    expect(getLayer('charge-1')).toMatchObject({ transform: { crop: { x: 10, y: 20, width: 60, height: 70 } } });

    fireEvent.pointerUp(canvas, { clientX: 120, clientY: 50, pointerId: 11 });
    expect(getLayer('charge-1')).toMatchObject({ transform: { crop: { x: 10, y: 20, width: 70, height: 70 } } });
  });

  it('maps a rotated crop move through the inverse layer transform before committing it', () => {
    const rotated = applyProjectCommand(createCanvasProject(), {
      type: 'update-layer',
      layerId: 'charge-1',
      patch: {
        transform: {
          x: 8, y: -4, scale: 1.25, rotation: 90,
          crop: { x: 10, y: 20, width: 60, height: 70 },
        },
      },
    });
    const { canvas } = renderCanvas(rotated);
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(charge instanceof SVGElement)) throw new Error('Expected charge scene element');

    fireEvent.pointerDown(charge, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerUp(canvas, { clientX: 50, clientY: 55, pointerId: 1 });
    const cropFrame = screen.getByRole('group', { name: 'Crop selected layer' });
    expect(cropFrame.parentElement?.getAttribute('style')).toContain('translate(8%, -3.6363636363636362%) rotate(90deg) scale(1.25, 1.25)');

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Move crop frame' }), {
      clientX: 58, clientY: 38.5, pointerId: 12,
    });
    fireEvent.pointerMove(canvas, { clientX: 45.5, clientY: 48.5, pointerId: 12 });

    expect(cropFrame).toMatchObject({ dataset: { cropX: '18', cropWidth: '60', cropHeight: '70' } });
    expect(Number(cropFrame.getAttribute('data-crop-y'))).toBeCloseTo(30);
    expect(getLayer('charge-1')).toMatchObject({ transform: { crop: { x: 10, y: 20, width: 60, height: 70 } } });

    fireEvent.pointerUp(canvas, { clientX: 45.5, clientY: 48.5, pointerId: 12 });
    expect(getLayer('charge-1')).toMatchObject({ transform: { crop: { x: 18, width: 60, height: 70 } } });
    expect(getTransformLayer('charge-1').transform.crop?.y).toBeCloseTo(30);
  });

  it('cancels an in-progress crop gesture with Escape without changing the layer', () => {
    const { canvas } = renderCanvas();
    const charge = canvas.querySelector('[data-layer-id="charge-1"]');
    if (!(charge instanceof SVGElement)) throw new Error('Expected charge scene element');

    fireEvent.pointerDown(charge, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerUp(canvas, { clientX: 50, clientY: 55, pointerId: 1 });
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Resize crop left edge' }), {
      clientX: 0, clientY: 55, pointerId: 9,
    });
    fireEvent.pointerMove(canvas, { clientX: 40, clientY: 55, pointerId: 9 });

    expect(screen.getByRole('group', { name: 'Crop selected layer' }).getAttribute('data-crop-x')).toBe('40');
    fireEvent.keyDown(canvas, { key: 'Escape' });

    expect(getTransformLayer('charge-1').transform.crop).toBeUndefined();
    expect(useCoatProjectStore.getState().history.past).toHaveLength(0);
    expect(screen.getByRole('group', { name: 'Crop selected layer' }).getAttribute('data-crop-x')).toBe('0');
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

    fireEvent.keyDown(resizeHandle, { key: 'Enter' });
    fireEvent.keyDown(rotateHandle, { key: ' ' });

    expect(getLayer('charge-1')).toMatchObject({ transform: { scale: 1.1, rotation: 15 } });
    expect(useCoatProjectStore.getState().history.past).toHaveLength(2);
  });

  it('transforms every selected layer from the shared handles and preserves non-uniform proportions', () => {
    let project = applyProjectCommand(createCanvasProject(), { type: 'add-layer', assetId: 'material-symbol-eight-point-star' });
    const secondCharge = project.layers.at(-1);
    if (!secondCharge || secondCharge.type !== 'charge') throw new Error('Expected a second charge');
    project = {
      ...project,
      layers: project.layers.map((layer) => {
        if (layer.id === 'charge-1' && layer.type !== 'background') {
          return { ...layer, transform: { ...layer.transform, scaleX: 2, scaleY: 0.5 } };
        }
        return layer.id === secondCharge.id && layer.type !== 'background'
          ? { ...layer, id: 'charge-2', transform: { ...layer.transform, x: 10 } }
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
    expect(controls.getAttribute('style')).toContain('left: 70%');
    expect(controls.getAttribute('style')).toContain('top: 60%');
  });

  it('renders the shared SVG scene and keeps canvas focusable for keyboard editing', () => {
    renderCanvas();

    expect(screen.getByRole('application', { name: 'Coat of arms canvas' }).getAttribute('tabindex')).toBe('0');
    expect(screen.getByLabelText('My Coat of Arms')).toBeDefined();
    expect(screen.getByText(/Arrow keys move selected layers/)).toBeDefined();
    expect(screen.getByText(/Copy, paste, group, ungroup/)).toBeDefined();
  });
});
