// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { listCastleAssets } from '@/lib/castle-creator/catalog';
import { getCastleCreatorCopy } from '@/lib/castle-creator/copy';
import type { CastleLayerId, CastlePiece } from '@/lib/castle-creator/types';
import { CastleSelectedPieceLayers } from './CastleSelectedPieceLayers';

const firstWallAsset = listCastleAssets('walls')[0];
if (!firstWallAsset) throw new Error('Castle layer test requires the first wall asset.');

function createPiece(overrides: Partial<CastlePiece> = {}): CastlePiece {
  return {
    id: 'piece-1',
    assetId: firstWallAsset.id,
    layerId: 'lower',
    buildingColor: 1,
    roofColor: 1,
    x: 24,
    y: 36,
    width: firstWallAsset.width,
    height: firstWallAsset.height,
    ...overrides,
  };
}

function createPointerEvent(
  eventType: string,
  pointerId: number,
  clientX: number,
  clientY: number,
  options: { pointerType?: string; isPrimary?: boolean } = {},
): Event {
  const event = new Event(eventType, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    button: { value: 0 },
    clientX: { value: clientX },
    clientY: { value: clientY },
    isPrimary: { value: options.isPrimary ?? true },
    pointerId: { value: pointerId },
    pointerType: { value: options.pointerType ?? 'mouse' },
  });
  return event;
}

function renderPieceLayerControl(overrides: {
  selectedPiece?: CastlePiece;
  visibleLayers?: Partial<Record<CastleLayerId, boolean>>;
  disabled?: boolean;
  onMovePieceToLayer?: (pieceId: string, layerId: CastleLayerId) => void;
  onDragTargetLayerChange?: (layerId: CastleLayerId | null) => void;
  onParentKeyDown?: () => void;
} = {}) {
  const selectedPiece = overrides.selectedPiece ?? createPiece();
  const visibleLayers = {
    lower: true,
    middle: true,
    upper: true,
    ...overrides.visibleLayers,
  };
  const onMovePieceToLayer = overrides.onMovePieceToLayer ?? vi.fn();
  const onDragTargetLayerChange = overrides.onDragTargetLayerChange ?? vi.fn();
  const rows = new Map<CastleLayerId, HTMLDivElement>();
  const copy = getCastleCreatorCopy('en');
  const pieceLabel = copy.library.assetImageAlt(firstWallAsset.category, firstWallAsset.number);

  const rendered = render(
    <div onKeyDown={overrides.onParentKeyDown}>
      <div data-castle-settings-scroll="true">
        {(['lower', 'middle', 'upper'] as const).map((layerId, index) => (
          <div
            data-castle-layer-target={layerId}
            key={layerId}
            ref={(element) => {
              if (element) rows.set(layerId, element);
            }}
            style={{ height: 48, top: index * 60 }}
          >
            {selectedPiece.layerId === layerId ? (
              <CastleSelectedPieceLayers
                key={`${selectedPiece.id}:${selectedPiece.layerId}:${overrides.disabled ? 'disabled' : 'enabled'}`}
                disabled={overrides.disabled}
                locale="en"
                onDragTargetLayerChange={onDragTargetLayerChange}
                onMovePieceToLayer={onMovePieceToLayer}
                selectedPiece={selectedPiece}
                visibleLayers={visibleLayers}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>,
  );

  const rowsByPosition = new Map<number, HTMLDivElement>([
    [0, rows.get('lower') as HTMLDivElement],
    [1, rows.get('middle') as HTMLDivElement],
    [2, rows.get('upper') as HTMLDivElement],
  ]);
  Object.defineProperty(document, 'elementFromPoint', {
    configurable: true,
    value: (_clientX: number, clientY: number) => rowsByPosition.get(Math.min(2, Math.floor(clientY / 100))) ?? null,
  });

  return {
    ...rendered,
    card: screen.getByRole('button', { name: copy.settings.pieceLayerDragLabel(pieceLabel) }),
    onDragTargetLayerChange,
    onMovePieceToLayer,
    pieceLabel,
    rows,
  };
}

describe('CastleSelectedPieceLayers', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
    Reflect.deleteProperty(document, 'elementFromPoint');
  });

  it('renders the selected thumbnail inside its layer row with its localized alt and actual asset dimensions', () => {
    const selectedPiece = createPiece({ layerId: 'middle', buildingColor: 3, roofColor: 4 });
    renderPieceLayerControl({
      selectedPiece,
      visibleLayers: { middle: false },
    });

    const copy = getCastleCreatorCopy('en');
    const image = screen.getByRole('img', { name: copy.library.assetImageAlt(firstWallAsset.category, firstWallAsset.number) });
    const card = screen.getByRole('button', { name: copy.settings.pieceLayerDragLabel(
      copy.library.assetImageAlt(firstWallAsset.category, firstWallAsset.number),
    ) });
    expect(image.getAttribute('width')).toBe(String(firstWallAsset.width));
    expect(image.getAttribute('height')).toBe(String(firstWallAsset.height));
    expect(card.className).toContain('size-11');
    expect(card.className).toContain('touch-none');
    expect(card.closest('[data-castle-layer-target="middle"]')).not.toBeNull();
    expect(screen.getByRole('status').textContent).toContain(copy.editor.layerLabels.middle);
    expect(screen.getByText(copy.settings.hiddenLayerHint, { selector: '.sr-only' })).toBeDefined();
  });

  it('keeps a quick click inert, then shows a floating preview that follows a long-press drag', () => {
    vi.useFakeTimers();
    const onMovePieceToLayer = vi.fn();
    const onDragTargetLayerChange = vi.fn();
    const copy = getCastleCreatorCopy('en');
    const { card } = renderPieceLayerControl({
      onMovePieceToLayer,
      onDragTargetLayerChange,
      visibleLayers: { upper: false },
    });

    act(() => {
      card.dispatchEvent(createPointerEvent('pointerdown', 7, 12, 20));
      vi.advanceTimersByTime(220);
      window.dispatchEvent(createPointerEvent('pointerup', 7, 12, 20));
    });
    expect(onMovePieceToLayer).not.toHaveBeenCalled();

    act(() => {
      card.dispatchEvent(createPointerEvent('pointerdown', 8, 12, 20));
      window.dispatchEvent(createPointerEvent('pointermove', 8, 22, 30));
      vi.advanceTimersByTime(300);
    });

    const initialPreview = document.querySelector<HTMLElement>('[data-castle-piece-drag-preview="true"]');
    expect(initialPreview).not.toBeNull();
    expect(initialPreview?.style.left).toBe('22px');
    expect(initialPreview?.style.top).toBe('30px');
    expect(initialPreview?.className).toContain('pointer-events-none');
    expect(card.className).toContain('border-amber-200');

    act(() => {
      window.dispatchEvent(createPointerEvent('pointermove', 8, 12, 220));
    });

    const movedPreview = document.querySelector<HTMLElement>('[data-castle-piece-drag-preview="true"]');
    expect(movedPreview?.style.left).toBe('12px');
    expect(movedPreview?.style.top).toBe('220px');
    expect(screen.getByRole('status').textContent).toContain(copy.editor.layerLabels.lower);
    expect(screen.getByText(copy.settings.hiddenLayerHint, { selector: '.sr-only' })).toBeDefined();

    act(() => {
      window.dispatchEvent(createPointerEvent('pointerup', 8, 12, 220));
    });

    expect(onDragTargetLayerChange).toHaveBeenCalledWith('upper');
    expect(onMovePieceToLayer).toHaveBeenCalledExactlyOnceWith('piece-1', 'upper');
    expect(document.querySelector('[data-castle-piece-drag-preview="true"]')).toBeNull();
  });

  it('allows slight drift before the hold but cancels a quick slide and ignores a same-layer drop', () => {
    vi.useFakeTimers();
    const onMovePieceToLayer = vi.fn();
    const { card } = renderPieceLayerControl({ onMovePieceToLayer });

    act(() => {
      card.dispatchEvent(createPointerEvent('pointerdown', 9, 12, 20));
      window.dispatchEvent(createPointerEvent('pointermove', 9, 28, 36));
      vi.advanceTimersByTime(300);
      window.dispatchEvent(createPointerEvent('pointerup', 9, 28, 36));
    });
    expect(onMovePieceToLayer).not.toHaveBeenCalled();

    act(() => {
      card.dispatchEvent(createPointerEvent('pointerdown', 10, 12, 20));
      window.dispatchEvent(createPointerEvent('pointermove', 10, 40, 20));
      vi.advanceTimersByTime(400);
      window.dispatchEvent(createPointerEvent('pointerup', 10, 12, 120));
    });
    expect(onMovePieceToLayer).not.toHaveBeenCalled();

    act(() => {
      card.dispatchEvent(createPointerEvent('pointerdown', 11, 12, 20));
      vi.advanceTimersByTime(300);
      window.dispatchEvent(createPointerEvent('pointerup', 11, 12, 20));
    });
    expect(onMovePieceToLayer).not.toHaveBeenCalled();
  });

  it('uses pointer events for touch and cancels a second touch pointer', () => {
    vi.useFakeTimers();
    const onMovePieceToLayer = vi.fn();
    const { card } = renderPieceLayerControl({ onMovePieceToLayer });

    act(() => {
      card.dispatchEvent(createPointerEvent('pointerdown', 21, 12, 20, { pointerType: 'touch' }));
      window.dispatchEvent(createPointerEvent('pointermove', 21, 18, 25, { pointerType: 'touch' }));
      vi.advanceTimersByTime(300);
    });
    expect(card.className).toContain('touch-none');
    expect(document.querySelector('[data-castle-piece-drag-preview="true"]')).not.toBeNull();

    act(() => {
      card.dispatchEvent(createPointerEvent('pointerdown', 22, 18, 25, {
        pointerType: 'touch',
        isPrimary: false,
      }));
      window.dispatchEvent(createPointerEvent('pointermove', 21, 12, 120, { pointerType: 'touch' }));
      window.dispatchEvent(createPointerEvent('pointerup', 21, 12, 120, { pointerType: 'touch' }));
    });
    expect(onMovePieceToLayer).not.toHaveBeenCalled();
    expect(document.querySelector('[data-castle-piece-drag-preview="true"]')).toBeNull();
  });

  it('cancels a touch drag when a second touch starts on another layer row', () => {
    vi.useFakeTimers();
    const onMovePieceToLayer = vi.fn();
    const { card, rows } = renderPieceLayerControl({ onMovePieceToLayer });
    const middleLayerRow = rows.get('middle');
    if (!middleLayerRow) throw new Error('Castle layer test requires the middle layer row.');

    const setPointerCapture = vi.fn();
    const hasPointerCapture = vi.fn(() => true);
    const releasePointerCapture = vi.fn();
    Object.defineProperties(card, {
      setPointerCapture: { configurable: true, value: setPointerCapture },
      hasPointerCapture: { configurable: true, value: hasPointerCapture },
      releasePointerCapture: { configurable: true, value: releasePointerCapture },
    });

    act(() => {
      card.dispatchEvent(createPointerEvent('pointerdown', 51, 12, 20, { pointerType: 'touch' }));
      vi.advanceTimersByTime(300);
    });
    expect(document.querySelector('[data-castle-piece-drag-preview="true"]')).not.toBeNull();
    expect(setPointerCapture).toHaveBeenCalledWith(51);

    const secondTouchPointerDown = createPointerEvent('pointerdown', 52, 20, 100, {
      pointerType: 'touch',
      isPrimary: false,
    });
    act(() => {
      middleLayerRow.dispatchEvent(secondTouchPointerDown);
      window.dispatchEvent(createPointerEvent('pointermove', 51, 12, 200, { pointerType: 'touch' }));
      window.dispatchEvent(createPointerEvent('pointerup', 51, 12, 200, { pointerType: 'touch' }));
    });

    expect(secondTouchPointerDown.target).toBe(middleLayerRow);
    expect(releasePointerCapture).toHaveBeenCalledWith(51);
    expect(document.querySelector('[data-castle-piece-drag-preview="true"]')).toBeNull();
    expect(onMovePieceToLayer).not.toHaveBeenCalled();
  });

  it('cancels on pointer cancellation, lost capture, selection changes, and disabled state', () => {
    vi.useFakeTimers();
    const onMovePieceToLayer = vi.fn();
    const { card, rerender } = renderPieceLayerControl({ onMovePieceToLayer });

    act(() => {
      card.dispatchEvent(createPointerEvent('pointerdown', 32, 12, 20));
      vi.advanceTimersByTime(300);
      window.dispatchEvent(createPointerEvent('pointercancel', 32, 12, 120));
      window.dispatchEvent(createPointerEvent('pointerup', 32, 12, 120));
    });
    expect(onMovePieceToLayer).not.toHaveBeenCalled();

    act(() => {
      card.dispatchEvent(createPointerEvent('pointerdown', 33, 12, 20));
      vi.advanceTimersByTime(300);
      window.dispatchEvent(createPointerEvent('lostpointercapture', 33, 12, 20));
      window.dispatchEvent(createPointerEvent('pointerup', 33, 12, 120));
    });
    expect(onMovePieceToLayer).not.toHaveBeenCalled();

    const replacementPiece = createPiece({ id: 'piece-2' });
    act(() => {
      card.dispatchEvent(createPointerEvent('pointerdown', 34, 12, 20));
      vi.advanceTimersByTime(300);
    });
    rerender(
      <div data-castle-settings-scroll="true">
        {(['lower', 'middle', 'upper'] as const).map((layerId) => (
          <div data-castle-layer-target={layerId} key={layerId}>
            {replacementPiece.layerId === layerId ? (
              <CastleSelectedPieceLayers
                key={`${replacementPiece.id}:${replacementPiece.layerId}:enabled`}
                locale="en"
                onDragTargetLayerChange={vi.fn()}
                onMovePieceToLayer={onMovePieceToLayer}
                selectedPiece={replacementPiece}
                visibleLayers={{ lower: true, middle: true, upper: true }}
              />
            ) : null}
          </div>
        ))}
      </div>,
    );
    act(() => {
      window.dispatchEvent(createPointerEvent('pointerup', 34, 12, 120));
    });
    expect(onMovePieceToLayer).not.toHaveBeenCalled();

    cleanup();
    const enabledControl = renderPieceLayerControl({ onMovePieceToLayer });
    act(() => {
      enabledControl.card.dispatchEvent(createPointerEvent('pointerdown', 35, 12, 20));
      vi.advanceTimersByTime(300);
    });
    enabledControl.rerender(
      <div data-castle-settings-scroll="true">
        {(['lower', 'middle', 'upper'] as const).map((layerId) => (
          <div data-castle-layer-target={layerId} key={layerId}>
            {layerId === 'lower' ? (
              <CastleSelectedPieceLayers
                key="piece-1:lower:disabled"
                disabled
                locale="en"
                onDragTargetLayerChange={vi.fn()}
                onMovePieceToLayer={onMovePieceToLayer}
                selectedPiece={createPiece()}
                visibleLayers={{ lower: true, middle: true, upper: true }}
              />
            ) : null}
          </div>
        ))}
      </div>,
    );
    act(() => {
      window.dispatchEvent(createPointerEvent('pointerup', 35, 12, 120));
      fireEvent.keyDown(screen.getByRole('button', {
        name: getCastleCreatorCopy('en').settings.pieceLayerDragLabel(enabledControl.pieceLabel),
      }), { key: 'ArrowDown' });
    });
    expect(onMovePieceToLayer).not.toHaveBeenCalled();
  });

  it('cancels its animation frame and releases pointer capture when unmounted mid-drag', () => {
    vi.useFakeTimers();
    const onMovePieceToLayer = vi.fn();
    const onDragTargetLayerChange = vi.fn();
    const { card, unmount } = renderPieceLayerControl({ onMovePieceToLayer, onDragTargetLayerChange });
    const settingsPanel = document.querySelector('[data-castle-settings-scroll="true"]');
    if (!(settingsPanel instanceof HTMLElement)) {
      throw new Error('Castle layer test requires its settings scroll panel.');
    }

    vi.spyOn(settingsPanel, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 244,
      height: 244,
    } as DOMRect);
    const requestAnimationFrame = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(91);
    const cancelAnimationFrame = vi.spyOn(window, 'cancelAnimationFrame');
    const setPointerCapture = vi.fn();
    const hasPointerCapture = vi.fn(() => true);
    const releasePointerCapture = vi.fn();
    Object.defineProperties(card, {
      setPointerCapture: { configurable: true, value: setPointerCapture },
      hasPointerCapture: { configurable: true, value: hasPointerCapture },
      releasePointerCapture: { configurable: true, value: releasePointerCapture },
    });

    act(() => {
      card.dispatchEvent(createPointerEvent('pointerdown', 41, 12, 20));
      vi.advanceTimersByTime(300);
      window.dispatchEvent(createPointerEvent('pointermove', 41, 12, 230));
    });
    expect(requestAnimationFrame).toHaveBeenCalled();

    act(() => unmount());

    expect(cancelAnimationFrame).toHaveBeenCalledWith(91);
    expect(releasePointerCapture).toHaveBeenCalledWith(41);
    expect(onMovePieceToLayer).not.toHaveBeenCalled();
    expect(onDragTargetLayerChange).toHaveBeenLastCalledWith(null);
  });

  it('does not change layers when ArrowUp or ArrowDown is pressed', () => {
    const onMovePieceToLayer = vi.fn();
    const onParentKeyDown = vi.fn();
    const { card } = renderPieceLayerControl({
      selectedPiece: createPiece({ layerId: 'middle' }),
      onMovePieceToLayer,
      onParentKeyDown,
    });

    fireEvent.keyDown(card, { key: 'ArrowUp' });
    fireEvent.keyDown(card, { key: 'ArrowDown' });

    expect(onMovePieceToLayer).not.toHaveBeenCalled();
    expect(onParentKeyDown).toHaveBeenCalledTimes(2);
  });
});
