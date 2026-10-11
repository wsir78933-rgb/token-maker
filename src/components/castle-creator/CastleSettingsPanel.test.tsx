// @vitest-environment jsdom

import { useState } from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { listCastleAssets } from '@/lib/castle-creator/catalog';
import { getCastleCreatorCopy } from '@/lib/castle-creator/copy';
import type { CastlePiece, CastleProject } from '@/lib/castle-creator/types';
import { CastleSettingsPanel } from './CastleSettingsPanel';

const firstWallAsset = listCastleAssets('walls')[0];
if (!firstWallAsset) throw new Error('Castle settings test requires the first wall asset.');

function createProject(overrides: Partial<CastleProject> = {}): CastleProject {
  return {
    version: 1,
    pieces: [],
    activeLayer: 'lower',
    visibleLayers: { lower: true, middle: true, upper: true },
    canvas: {
      width: 0,
      height: 0,
      backgroundColor: '#ffffff',
      backgroundImageUrl: null,
    },
    palette: { building: 1, roof: 1 },
    snapEnabled: false,
    resizeEnabled: true,
    ...overrides,
  };
}

function createSelectedPiece(): CastlePiece {
  return {
    id: 'selected-piece-1',
    assetId: firstWallAsset.id,
    layerId: 'lower',
    buildingColor: 2,
    roofColor: 3,
    x: 18,
    y: 29,
    width: firstWallAsset.width,
    height: firstWallAsset.height,
  };
}

function createPointerEvent(eventType: string, pointerId: number, clientX: number, clientY: number): Event {
  const event = new Event(eventType, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    button: { value: 0 },
    clientX: { value: clientX },
    clientY: { value: clientY },
    isPrimary: { value: true },
    pointerId: { value: pointerId },
    pointerType: { value: 'mouse' },
  });
  return event;
}

function CastleSettingsPanelMoveHarness({
  initialPiece,
  onMovePieceToLayer,
}: {
  initialPiece: CastlePiece;
  onMovePieceToLayer: (pieceId: string, layerId: CastlePiece['layerId']) => void;
}) {
  const [selectedPiece, setSelectedPiece] = useState(initialPiece);
  const [project, setProject] = useState(() => createProject({ pieces: [initialPiece] }));

  const movePieceToLayer = (pieceId: string, layerId: CastlePiece['layerId']) => {
    if (selectedPiece.id !== pieceId) {
      throw new Error(`Unexpected selected Castle piece id. Received ${JSON.stringify(pieceId)}.`);
    }

    const movedPiece = { ...selectedPiece, layerId };
    onMovePieceToLayer(pieceId, layerId);
    setSelectedPiece(movedPiece);
    setProject((currentProject) => ({
      ...currentProject,
      pieces: currentProject.pieces.map((piece) => (piece.id === pieceId ? movedPiece : piece)),
    }));
  };

  return (
    <CastleSettingsPanel
      locale="en"
      selectedPiece={selectedPiece}
      onMovePieceToLayer={movePieceToLayer}
      onActiveLayerChange={vi.fn()}
      onCanvasSettingsChange={vi.fn()}
      onClearAll={vi.fn()}
      onClearLayer={vi.fn()}
      onLayerVisibilityChange={vi.fn()}
      project={project}
    />
  );
}

describe('CastleSettingsPanel', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
    Reflect.deleteProperty(document, 'elementFromPoint');
  });

  it('keeps a long-press drag active across panel rerenders and moves only the selected piece', () => {
    vi.useFakeTimers();
    const copy = getCastleCreatorCopy('en');
    const selectedPiece = createSelectedPiece();
    const onMovePieceToLayer = vi.fn();
    render(
      <CastleSettingsPanelMoveHarness
        initialPiece={selectedPiece}
        onMovePieceToLayer={onMovePieceToLayer}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: copy.settings.layersHeading }));

    const layerList = screen.getByRole('list', { name: copy.settings.layersHeading });
    const sourceLayer = layerList.querySelector('[data-castle-layer-target="lower"]');
    const targetLayer = layerList.querySelector('[data-castle-layer-target="middle"]');
    if (!(sourceLayer instanceof HTMLElement) || !(targetLayer instanceof HTMLElement)) {
      throw new Error('Castle settings test requires lower and middle layer rows.');
    }
    const thumbnail = within(sourceLayer).getByRole('button', {
      name: copy.settings.pieceLayerDragLabel(
        copy.library.assetImageAlt(firstWallAsset.category, firstWallAsset.number),
      ),
    });
    expect(thumbnail.closest('[data-castle-layer-target="lower"]')).toBe(sourceLayer);

    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: () => targetLayer,
    });

    act(() => {
      thumbnail.dispatchEvent(createPointerEvent('pointerdown', 77, 16, 20));
      vi.advanceTimersByTime(300);
    });
    expect(document.querySelector('[data-castle-piece-drag-preview="true"]')).not.toBeNull();

    act(() => {
      window.dispatchEvent(createPointerEvent('pointermove', 77, 60, 120));
    });
    expect(targetLayer.className).toContain('ring-2');

    act(() => {
      window.dispatchEvent(createPointerEvent('pointerup', 77, 60, 120));
    });

    expect(onMovePieceToLayer).toHaveBeenCalledExactlyOnceWith('selected-piece-1', 'middle');
    const movedThumbnail = screen.getByRole('button', { name: copy.settings.pieceLayerDragLabel(
      copy.library.assetImageAlt(firstWallAsset.category, firstWallAsset.number),
    ) });
    expect(movedThumbnail.closest('[data-castle-layer-target="middle"]')).not.toBeNull();
    expect(sourceLayer.querySelector('[data-castle-selected-piece-card="true"]')).toBeNull();
    expect(screen.getByRole('status').textContent).toContain(copy.editor.layerLabels.middle);
  });

  it.each(['en', 'zh'] as const)('shows the selected-piece drag hint in %s and describes the thumbnail', (locale) => {
    const copy = getCastleCreatorCopy(locale);
    const selectedPiece = createSelectedPiece();
    render(
      <CastleSettingsPanel
        locale={locale}
        selectedPiece={selectedPiece}
        onMovePieceToLayer={vi.fn()}
        onActiveLayerChange={vi.fn()}
        onCanvasSettingsChange={vi.fn()}
        onClearAll={vi.fn()}
        onClearLayer={vi.fn()}
        onLayerVisibilityChange={vi.fn()}
        project={createProject({ pieces: [selectedPiece] })}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: copy.settings.layersHeading }));

    const visibleDragHint = screen.getByText(copy.settings.pieceLayerDragHint, { selector: 'p' });
    expect(visibleDragHint.className).toContain('text-xs');
    expect(visibleDragHint.className).toContain('whitespace-nowrap');
    expect(visibleDragHint.textContent).not.toMatch(/keyboard|键盘|↑|↓/i);
    const thumbnail = screen.getByRole('button', {
      name: copy.settings.pieceLayerDragLabel(
        copy.library.assetImageAlt(firstWallAsset.category, firstWallAsset.number),
      ),
    });
    const describedByIds = thumbnail.getAttribute('aria-describedby')?.split(/\s+/) ?? [];
    const describedTexts = describedByIds.map((descriptionId) => (
      document.getElementById(descriptionId)?.textContent ?? ''
    ));
    expect(describedTexts).toContain(copy.settings.pieceLayerDragHint);
  });

  it('keeps layers and canvas settings independently collapsed and expandable', () => {
    const copy = getCastleCreatorCopy('en');
    const onActiveLayerChange = vi.fn();
    const onLayerVisibilityChange = vi.fn();
    const onClearLayer = vi.fn();
    render(
      <CastleSettingsPanel
        locale="en"
        selectedPiece={null}
        onMovePieceToLayer={vi.fn()}
        onActiveLayerChange={onActiveLayerChange}
        onCanvasSettingsChange={vi.fn()}
        onClearAll={vi.fn()}
        onClearLayer={onClearLayer}
        onLayerVisibilityChange={onLayerVisibilityChange}
        project={createProject()}
      />,
    );

    const settingsScrollSurface = screen.getByRole('region', { name: copy.settings.panelHeading });
    expect(settingsScrollSurface.getAttribute('data-castle-settings-scroll')).toBe('true');
    expect(settingsScrollSurface.className).toContain('h-[244px]');
    expect(screen.queryByRole('list')).toBeNull();
    expect(screen.queryByLabelText(copy.settings.canvasWidthLabel)).toBeNull();

    const layersToggle = screen.getByRole('button', { name: copy.settings.layersHeading });
    const canvasToggle = screen.getByRole('button', { name: copy.settings.canvasHeading });
    fireEvent.click(layersToggle);

    const layers = screen.getByRole('list', { name: copy.settings.layersHeading });
    expect(layers.querySelectorAll(':scope > li')).toHaveLength(3);
    expect(screen.getByRole('button', { name: copy.editor.activeLayerLabel('lower') }).getAttribute('aria-pressed'))
      .toBe('true');
    expect(screen.queryByLabelText(copy.settings.canvasWidthLabel)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: copy.editor.activeLayerLabel('middle') }));
    fireEvent.click(screen.getByRole('checkbox', { name: `${copy.settings.layerVisibilityLabel}: ${copy.editor.layerLabels.middle}` }));
    fireEvent.click(screen.getByRole('button', { name: `${copy.settings.clearLayerLabel}: ${copy.editor.layerLabels.upper}` }));

    expect(onActiveLayerChange).toHaveBeenCalledWith('middle');
    expect(onLayerVisibilityChange).toHaveBeenCalledWith('middle', false);
    expect(onClearLayer).toHaveBeenCalledWith('upper');

    fireEvent.click(layersToggle);
    expect(screen.queryByRole('list')).toBeNull();
    fireEvent.click(canvasToggle);
    expect(screen.getByLabelText(copy.settings.canvasWidthLabel)).toBeDefined();
    expect(screen.queryByRole('list')).toBeNull();
    fireEvent.click(canvasToggle);
    expect(screen.queryByLabelText(copy.settings.canvasWidthLabel)).toBeNull();
  });

  it('applies background, URL, and zero-aware canvas settings through one public callback', () => {
    const onCanvasSettingsChange = vi.fn();
    const copy = getCastleCreatorCopy('zh');
    render(
      <CastleSettingsPanel
        locale="zh"
        selectedPiece={null}
        onMovePieceToLayer={vi.fn()}
        onActiveLayerChange={vi.fn()}
        onCanvasSettingsChange={onCanvasSettingsChange}
        onClearAll={vi.fn()}
        onClearLayer={vi.fn()}
        onLayerVisibilityChange={vi.fn()}
        project={createProject()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: copy.settings.canvasHeading }));

    fireEvent.change(screen.getByLabelText(copy.settings.backgroundImageUrlLabel), {
      target: { value: '  https://example.test/castle.webp  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: copy.settings.backgroundImageApplyLabel }));
    fireEvent.change(screen.getByLabelText(copy.settings.backgroundColorLabel), {
      target: { value: '#112233' },
    });
    fireEvent.change(screen.getByLabelText(copy.settings.canvasWidthLabel), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText(copy.settings.canvasHeightLabel), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: copy.settings.applyCanvasSizeLabel }));

    expect(onCanvasSettingsChange).toHaveBeenNthCalledWith(1, expect.objectContaining({
      backgroundImageUrl: 'https://example.test/castle.webp',
    }));
    expect(onCanvasSettingsChange).toHaveBeenNthCalledWith(2, expect.objectContaining({
      backgroundColor: '#112233',
    }));
    expect(onCanvasSettingsChange).toHaveBeenNthCalledWith(3, expect.objectContaining({
      width: 0,
      height: 0,
    }));
  });

  it('shows known callback errors and rejects invalid dimensions with the received value', () => {
    const copy = getCastleCreatorCopy('en');
    const onCanvasSettingsChange = vi.fn(() => {
      throw new Error('canvas callback rejected this settings value');
    });
    render(
      <CastleSettingsPanel
        locale="en"
        selectedPiece={null}
        onMovePieceToLayer={vi.fn()}
        onActiveLayerChange={vi.fn()}
        onCanvasSettingsChange={onCanvasSettingsChange}
        onClearAll={vi.fn()}
        onClearLayer={vi.fn()}
        onLayerVisibilityChange={vi.fn()}
        project={createProject()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: copy.settings.canvasHeading }));
    fireEvent.change(screen.getByLabelText(copy.settings.backgroundColorLabel), {
      target: { value: '#112233' },
    });
    expect(screen.getByRole('alert').textContent).toContain('canvas callback rejected this settings value');

    fireEvent.change(screen.getByLabelText(copy.settings.canvasWidthLabel), { target: { value: '-1' } });
    fireEvent.click(screen.getByRole('button', { name: copy.settings.applyCanvasSizeLabel }));
    expect(screen.getByRole('alert').textContent).toContain('Received "-1"');
  });

  it('synchronizes draft fields when a loaded project changes', async () => {
    const copy = getCastleCreatorCopy('en');
    const firstProject = createProject();
    const { rerender } = render(
      <CastleSettingsPanel
        locale="en"
        selectedPiece={null}
        onMovePieceToLayer={vi.fn()}
        onActiveLayerChange={vi.fn()}
        onCanvasSettingsChange={vi.fn()}
        onClearAll={vi.fn()}
        onClearLayer={vi.fn()}
        onLayerVisibilityChange={vi.fn()}
        project={firstProject}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: copy.settings.canvasHeading }));

    const loadedProject = createProject({
      canvas: {
        width: 720,
        height: 635,
        backgroundColor: '#000000',
        backgroundImageUrl: 'https://example.test/loaded.webp',
      },
    });
    rerender(
      <CastleSettingsPanel
        locale="en"
        selectedPiece={null}
        onMovePieceToLayer={vi.fn()}
        onActiveLayerChange={vi.fn()}
        onCanvasSettingsChange={vi.fn()}
        onClearAll={vi.fn()}
        onClearLayer={vi.fn()}
        onLayerVisibilityChange={vi.fn()}
        project={loadedProject}
      />,
    );

    await waitFor(() => {
      expect((screen.getByLabelText(copy.settings.backgroundImageUrlLabel) as HTMLInputElement).value)
        .toBe('https://example.test/loaded.webp');
      expect((screen.getByLabelText(copy.settings.canvasWidthLabel) as HTMLInputElement).value)
        .toBe('720');
      expect((screen.getByLabelText(copy.settings.canvasHeightLabel) as HTMLInputElement).value)
        .toBe('635');
    });
  });

  it('generates a distinct labelled background URL id for each mounted panel', () => {
    const copy = getCastleCreatorCopy('en');
    const project = createProject();
    render(
      <>
        <CastleSettingsPanel
          locale="en"
          selectedPiece={null}
          onMovePieceToLayer={vi.fn()}
          onActiveLayerChange={vi.fn()}
          onCanvasSettingsChange={vi.fn()}
          onClearAll={vi.fn()}
          onClearLayer={vi.fn()}
          onLayerVisibilityChange={vi.fn()}
          project={project}
        />
        <CastleSettingsPanel
          locale="en"
          selectedPiece={null}
          onMovePieceToLayer={vi.fn()}
          onActiveLayerChange={vi.fn()}
          onCanvasSettingsChange={vi.fn()}
          onClearAll={vi.fn()}
          onClearLayer={vi.fn()}
          onLayerVisibilityChange={vi.fn()}
          project={project}
        />
      </>,
    );

    screen.getAllByRole('button', { name: copy.settings.canvasHeading }).forEach((toggle) => {
      fireEvent.click(toggle);
    });
    const inputs = screen.getAllByLabelText(copy.settings.backgroundImageUrlLabel) as HTMLInputElement[];
    const inputIds = inputs.map((input) => input.id);
    expect(new Set(inputIds).size).toBe(2);
    expect(inputIds.every((inputId) => inputId.length > 0)).toBe(true);
    expect(inputs.every((input) => (
      [...document.querySelectorAll('label')].some((label) => label.htmlFor === input.id)
    ))).toBe(true);
  });
});
