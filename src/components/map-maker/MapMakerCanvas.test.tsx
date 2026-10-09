// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createDefaultMapMakerProject } from '@/lib/map-maker';
import type { MapMakerElement, MapMakerLabel, MapMakerProject } from '@/lib/map-maker';
import { getMapMakerCopy } from '@/lib/map-maker/copy';

import { MapMakerCanvas } from './MapMakerCanvas';

afterEach(cleanup);

const englishCopy = getMapMakerCopy('en').workspace;

function createCanvasProject(
  elements: readonly MapMakerElement[] = [],
  labels: readonly MapMakerLabel[] = [],
  settings: Partial<MapMakerProject['settings']> = {},
): MapMakerProject {
  const project = createDefaultMapMakerProject();
  return { ...project, elements: [...elements], labels: [...labels], settings: { ...project.settings, ...settings } };
}

function createElement(id: string, x: number, width: number, layer: 1 | 2 = 1): MapMakerElement {
  return {
    id,
    source: { kind: 'asset', assetId: 'am1' },
    layer,
    x,
    y: 40,
    width,
    height: 50,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
  };
}

function createLabel(id: string, x: number, y: number, width: number, height: number, text = 'Place'): MapMakerLabel {
  return { id, text, x, y, width, height, fontSize: 16 };
}

function rectangle(width: number, height: number): DOMRect {
  return { x: 0, y: 0, left: 0, top: 0, right: width, bottom: height, width, height, toJSON: () => ({}) };
}

function installPointerCapture(button: HTMLElement): void {
  Object.defineProperty(button, 'setPointerCapture', { configurable: true, value: vi.fn() });
  Object.defineProperty(button, 'hasPointerCapture', { configurable: true, value: () => false });
}

function renderCanvas(
  overrides: Partial<ComponentProps<typeof MapMakerCanvas>> = {},
) {
  const callbacks = {
    onSelectCells: vi.fn(),
    onSelectElements: vi.fn(),
    onSelectLabels: vi.fn(),
    onMoveElements: vi.fn(),
    onMoveLabels: vi.fn(),
    onResizeElement: vi.fn(),
    onResizeLabel: vi.fn(),
    onEditLabel: vi.fn(),
    onUpdateLabelText: vi.fn(),
    onFinishLabelEdit: vi.fn(),
    onCancelLabelEdit: vi.fn(),
    onImageLoadError: vi.fn(),
  };
  const project = overrides.project ?? createCanvasProject();
  const rendered = render(
    <MapMakerCanvas
      copy={englishCopy}
      project={project}
      editTarget="base"
      selectedCells={[]}
      selectedElementIds={[]}
      selectedLabelIds={[]}
      multiSelectEnabled={false}
      editingLabelId={null}
      {...callbacks}
      {...overrides}
    />,
  );
  const canvas = screen.getByRole('group', { name: englishCopy.canvas.mapPreviewAlt });
  vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue(rectangle(project.columns * 70, project.rows * 70));
  return { ...rendered, callbacks, project, canvas };
}

describe('MapMakerCanvas', () => {
  it('clamps a pointer drag by the whole selected group bounds', () => {
    const elementOne = createElement('west', 100, 100);
    const elementTwo = createElement('east', 700, 100);
    const { callbacks } = renderCanvas({
      project: createCanvasProject([elementOne, elementTwo]),
      editTarget: 'layer-1',
      selectedElementIds: ['west', 'east'],
    });
    const objectButton = screen.getByTestId('map-maker-element-west');
    installPointerCapture(objectButton);

    fireEvent.pointerDown(objectButton, { button: 0, isPrimary: true, pointerId: 3, clientX: 0, clientY: 0 });
    fireEvent.pointerMove(objectButton, { pointerId: 3, clientX: 50, clientY: 0 });

    expect(callbacks.onMoveElements).toHaveBeenCalledWith(['west', 'east'], 40, 0);
  });

  it('does not send an out-of-bounds keyboard move for a selected group at the map edge', () => {
    const edgeElement = createElement('edge', 839, 1);
    const { callbacks } = renderCanvas({
      project: createCanvasProject([edgeElement]),
      editTarget: 'layer-1',
      selectedElementIds: ['edge'],
    });

    fireEvent.keyDown(screen.getByTestId('map-maker-element-edge'), { key: 'ArrowRight' });

    expect(callbacks.onMoveElements).not.toHaveBeenCalled();
  });

  it('keeps inactive objects out of pointer targeting and keyboard actions while labels stay on top', () => {
    const { callbacks } = renderCanvas({
      project: createCanvasProject([createElement('icon', 120, 50)], [createLabel('label', 200, 80, 120, 32)]),
      editTarget: 'labels',
    });
    const inactiveElement = screen.getByTestId('map-maker-element-icon');
    const activeLabel = screen.getByTestId('map-maker-label-label');
    installPointerCapture(activeLabel);

    expect(inactiveElement.getAttribute('tabindex')).toBe('-1');
    expect((inactiveElement as HTMLButtonElement).style.pointerEvents).toBe('none');
    expect(activeLabel.style.pointerEvents).toBe('auto');
    expect(activeLabel.parentElement?.style.zIndex).toBe('3');
    fireEvent.keyDown(inactiveElement, { key: 'ArrowRight' });
    fireEvent.pointerDown(inactiveElement, { button: 0, isPrimary: true, pointerId: 5, clientX: 10, clientY: 10 });

    expect(callbacks.onMoveElements).not.toHaveBeenCalled();
    expect(callbacks.onSelectElements).not.toHaveBeenCalled();

    fireEvent.pointerDown(activeLabel, { button: 0, isPrimary: true, pointerId: 6, clientX: 10, clientY: 10 });
    expect(callbacks.onSelectLabels).toHaveBeenCalledWith(['label'], false);
  });

  it('allows touch multi-select for labels', () => {
    const { callbacks } = renderCanvas({
      project: createCanvasProject([], [
        createLabel('first', 100, 80, 100, 30),
        createLabel('edge', 700, 80, 140, 32),
      ]),
      editTarget: 'labels',
      selectedLabelIds: ['first'],
      multiSelectEnabled: true,
    });
    const targetLabel = screen.getByTestId('map-maker-label-edge');
    installPointerCapture(targetLabel);
    fireEvent.pointerDown(targetLabel, { button: 0, isPrimary: true, pointerId: 4, clientX: 10, clientY: 10 });
    expect(callbacks.onSelectLabels).toHaveBeenCalledWith(['first', 'edge'], false);
  });

  it('clamps label keyboard resize to the map edge', () => {
    const { callbacks } = renderCanvas({
      project: createCanvasProject([], [createLabel('edge', 700, 80, 140, 32)]),
      editTarget: 'labels',
      selectedLabelIds: ['edge'],
    });
    fireEvent.keyDown(screen.getByRole('button', { name: englishCopy.properties.allowResize }), { key: 'ArrowRight' });
    const resizeCall = callbacks.onResizeLabel.mock.calls[0];
    expect(resizeCall?.[0]).toBe('edge');
    expect(resizeCall?.[1]).toBeLessThanOrEqual(140);
  });

  it('draws a true SVG hex grid whose cell width follows the map percentage without a minimum', () => {
    const { container } = renderCanvas({
      project: createCanvasProject([], [], { hexGridVisible: true, hexSizePercent: 1 }),
    });
    const overlay = container.querySelector<HTMLElement>('[data-hex-width-px]');

    if (overlay === null) throw new Error('Expected a hex grid overlay.');
    expect(Number(overlay.dataset.hexWidthPx)).toBeCloseTo(8.4, 5);
    expect(overlay.style.backgroundSize.startsWith('12.6px ')).toBe(true);
    expect(decodeURIComponent(overlay.style.backgroundImage)).toContain('<svg');
    expect(decodeURIComponent(overlay.style.backgroundImage)).toContain('M');
  });

  it('keeps Shift+Enter as a label newline and uses plain Enter to finish editing', () => {
    const { callbacks } = renderCanvas({
      project: createCanvasProject([], [createLabel('editable', 150, 90, 160, 48, 'Mist Sea')]),
      editTarget: 'labels',
      selectedLabelIds: ['editable'],
      editingLabelId: 'editable',
    });
    const editor = screen.getByTestId('map-maker-label-editor-editable');

    fireEvent.keyDown(editor, { key: 'Enter', shiftKey: true });
    expect(callbacks.onFinishLabelEdit).not.toHaveBeenCalled();
    fireEvent.keyDown(editor, { key: 'Enter' });
    expect(callbacks.onFinishLabelEdit).toHaveBeenCalledWith('editable');
  });
});
