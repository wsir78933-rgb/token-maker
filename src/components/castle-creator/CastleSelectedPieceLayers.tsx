'use client';

/* Castle thumbnails are local catalogue resources and intentionally use img. */
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

import { castleAssetImagePath, getCastleAsset } from '@/lib/castle-creator/catalog';
import { getCastleCreatorCopy } from '@/lib/castle-creator/copy';
import { CASTLE_LAYER_IDS } from '@/lib/castle-creator/types';
import type { CastleLayerId, CastlePiece } from '@/lib/castle-creator/types';
import type { SiteLocale } from '@/lib/site-locale';

const LONG_PRESS_DELAY_MS = 300;
const PRE_DRAG_MOVEMENT_LIMIT_PX = 20;
const PANEL_AUTO_SCROLL_EDGE_PX = 44;
const PANEL_AUTO_SCROLL_FRAME_PX = 10;

type DragPreviewPosition = {
  x: number;
  y: number;
};

type PieceLayerInteraction = {
  pointerId: number;
  pointerType: string;
  pieceId: string;
  sourceLayer: CastleLayerId;
  startX: number;
  startY: number;
  button: HTMLButtonElement;
  holdTimeout: number;
  autoScrollFrameId: number | null;
  isDragging: boolean;
  targetLayer: CastleLayerId | null;
  lastClientX: number;
  lastClientY: number;
};

type CastleSelectedPieceLayersProps = {
  locale: SiteLocale;
  selectedPiece: CastlePiece;
  visibleLayers: Readonly<Record<CastleLayerId, boolean>>;
  disabled?: boolean;
  onMovePieceToLayer: (pieceId: string, layerId: CastleLayerId) => void;
  onDragTargetLayerChange: (layerId: CastleLayerId | null) => void;
};

export function CastleSelectedPieceLayers({
  locale,
  selectedPiece,
  visibleLayers,
  disabled = false,
  onMovePieceToLayer,
  onDragTargetLayerChange,
}: CastleSelectedPieceLayersProps) {
  const copy = getCastleCreatorCopy(locale);
  const asset = getCastleAsset(selectedPiece.assetId);
  const pieceLabel = copy.library.assetImageAlt(asset.category, asset.number);
  const layerStatusId = useId();
  const dragHintId = useId();
  const hiddenLayerHintId = useId();
  const imagePath = castleAssetImagePath(selectedPiece.assetId, {
    building: selectedPiece.buildingColor,
    roof: selectedPiece.roofColor,
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const interactionRef = useRef<PieceLayerInteraction | null>(null);
  const [draggingPieceId, setDraggingPieceId] = useState<string | null>(null);
  const [targetLayer, setTargetLayer] = useState<CastleLayerId | null>(null);
  const [dragPreviewPosition, setDragPreviewPosition] = useState<DragPreviewPosition | null>(null);

  const setPieceLayerDragTarget = useCallback((nextLayerId: CastleLayerId | null) => {
    const interaction = interactionRef.current;
    if (!interaction?.isDragging || interaction.targetLayer === nextLayerId) return;

    interaction.targetLayer = nextLayerId;
    setTargetLayer(nextLayerId);
    onDragTargetLayerChange(nextLayerId);
  }, [onDragTargetLayerChange]);

  const stopPieceLayerInteraction = useCallback((releasePointerCapture: boolean) => {
    const interaction = interactionRef.current;
    if (!interaction) return;

    interactionRef.current = null;
    clearTimeout(interaction.holdTimeout);
    if (interaction.autoScrollFrameId !== null) {
      window.cancelAnimationFrame(interaction.autoScrollFrameId);
    }
    if (releasePointerCapture) releasePieceLayerPointerCapture(interaction);

    setDraggingPieceId(null);
    setTargetLayer(null);
    setDragPreviewPosition(null);
    onDragTargetLayerChange(null);
  }, [onDragTargetLayerChange]);

  const completePieceLayerInteraction = useCallback((nextLayerId: CastleLayerId | null) => {
    const interaction = interactionRef.current;
    if (!interaction) return;

    const shouldMovePiece = interaction.isDragging
      && nextLayerId !== null
      && nextLayerId !== interaction.sourceLayer
      && selectedPiece.id === interaction.pieceId
      && selectedPiece.layerId === interaction.sourceLayer
      && !disabled;
    const pieceId = interaction.pieceId;

    stopPieceLayerInteraction(false);
    if (shouldMovePiece && nextLayerId !== null) {
      onMovePieceToLayer(pieceId, nextLayerId);
    }
  }, [disabled, onMovePieceToLayer, selectedPiece.id, selectedPiece.layerId, stopPieceLayerInteraction]);

  const startPieceLayerInteraction = useCallback(({
    pointerType,
    pointerId,
    startX,
    startY,
    button,
  }: {
    pointerType: string;
    pointerId: number;
    startX: number;
    startY: number;
    button: HTMLButtonElement;
  }) => {
    if (disabled) return;
    stopPieceLayerInteraction(false);

    const interaction: Omit<PieceLayerInteraction, 'holdTimeout'> = {
      pointerType,
      pointerId,
      pieceId: selectedPiece.id,
      sourceLayer: selectedPiece.layerId,
      startX,
      startY,
      button,
      autoScrollFrameId: null,
      isDragging: false,
      targetLayer: null,
      lastClientX: startX,
      lastClientY: startY,
    };

    const holdTimeout = window.setTimeout(() => {
      const currentInteraction = interactionRef.current;
      if (
        !currentInteraction
        || currentInteraction.pieceId !== selectedPiece.id
        || currentInteraction.sourceLayer !== selectedPiece.layerId
        || disabled
        || !currentInteraction.button.isConnected
      ) {
        return;
      }

      currentInteraction.isDragging = true;
      currentInteraction.targetLayer = currentInteraction.sourceLayer;
      setDraggingPieceId(currentInteraction.pieceId);
      setTargetLayer(currentInteraction.sourceLayer);
      setDragPreviewPosition({
        x: currentInteraction.lastClientX,
        y: currentInteraction.lastClientY,
      });
      onDragTargetLayerChange(currentInteraction.sourceLayer);

      if (typeof currentInteraction.button.setPointerCapture === 'function') {
        currentInteraction.button.setPointerCapture(currentInteraction.pointerId);
      }
    }, LONG_PRESS_DELAY_MS);

    interactionRef.current = { ...interaction, holdTimeout };
  }, [disabled, onDragTargetLayerChange, selectedPiece.id, selectedPiece.layerId, stopPieceLayerInteraction]);

  const getLayerAtClientPoint = useCallback((clientX: number, clientY: number): CastleLayerId | null => {
    if (typeof document.elementFromPoint !== 'function') return null;

    const hitElement = document.elementFromPoint(clientX, clientY);
    const layerTarget = hitElement?.closest<HTMLElement>('[data-castle-layer-target]');
    if (!layerTarget) return null;

    const receivedLayerId = layerTarget.dataset.castleLayerTarget;
    if (CASTLE_LAYER_IDS.some((validLayerId) => validLayerId === receivedLayerId)) {
      return receivedLayerId as CastleLayerId;
    }

    throw new Error(`Invalid Castle layer drop target. Received ${JSON.stringify(receivedLayerId)}.`);
  }, []);

  const schedulePanelEdgeAutoScroll = useCallback(() => {
    const interaction = interactionRef.current;
    if (!interaction?.isDragging || typeof window.requestAnimationFrame !== 'function') return;

    const panel = interaction.button.closest<HTMLElement>('[data-castle-settings-scroll]');
    if (!panel) return;

    const panelBounds = panel.getBoundingClientRect();
    if (panelBounds.height <= 0) return;

    const nearTop = interaction.lastClientY >= panelBounds.top
      && interaction.lastClientY <= panelBounds.top + PANEL_AUTO_SCROLL_EDGE_PX;
    const nearBottom = interaction.lastClientY <= panelBounds.bottom
      && interaction.lastClientY >= panelBounds.bottom - PANEL_AUTO_SCROLL_EDGE_PX;
    if (!nearTop && !nearBottom) {
      if (interaction.autoScrollFrameId !== null) {
        window.cancelAnimationFrame(interaction.autoScrollFrameId);
        interaction.autoScrollFrameId = null;
      }
      return;
    }
    if (interaction.autoScrollFrameId !== null) return;

    const scrollPanelAtEdge = () => {
      const currentInteraction = interactionRef.current;
      if (!currentInteraction?.isDragging) return;

      const currentPanel = currentInteraction.button.closest<HTMLElement>('[data-castle-settings-scroll]');
      if (!currentPanel) return;
      const currentBounds = currentPanel.getBoundingClientRect();
      const pointerNearTop = currentInteraction.lastClientY >= currentBounds.top
        && currentInteraction.lastClientY <= currentBounds.top + PANEL_AUTO_SCROLL_EDGE_PX;
      const pointerNearBottom = currentInteraction.lastClientY <= currentBounds.bottom
        && currentInteraction.lastClientY >= currentBounds.bottom - PANEL_AUTO_SCROLL_EDGE_PX;
      const scrollDirection = pointerNearTop ? -1 : pointerNearBottom ? 1 : 0;
      if (scrollDirection === 0) {
        currentInteraction.autoScrollFrameId = null;
        return;
      }

      const previousScrollTop = currentPanel.scrollTop;
      currentPanel.scrollTop += scrollDirection * PANEL_AUTO_SCROLL_FRAME_PX;
      if (currentPanel.scrollTop === previousScrollTop) {
        currentInteraction.autoScrollFrameId = null;
        return;
      }

      setPieceLayerDragTarget(
        getLayerAtClientPoint(currentInteraction.lastClientX, currentInteraction.lastClientY),
      );
      currentInteraction.autoScrollFrameId = window.requestAnimationFrame(scrollPanelAtEdge);
    };

    interaction.autoScrollFrameId = window.requestAnimationFrame(scrollPanelAtEdge);
  }, [getLayerAtClientPoint, setPieceLayerDragTarget]);

  const handleSecondaryTouchPointerDown = useCallback((event: PointerEvent) => {
    if (event.pointerType !== 'touch' || event.isPrimary) return;
    if (interactionRef.current?.pointerType === 'touch') {
      stopPieceLayerInteraction(true);
    }
  }, [stopPieceLayerInteraction]);

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || !event.isPrimary || disabled) return;

    event.stopPropagation();
    startPieceLayerInteraction({
      pointerType: event.pointerType,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      button: event.currentTarget,
    });
  }, [disabled, startPieceLayerInteraction]);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    const interaction = interactionRef.current;
    if (!interaction || interaction.pointerId !== event.pointerId) return;

    if (!interaction.isDragging) {
      const distanceX = Math.abs(event.clientX - interaction.startX);
      const distanceY = Math.abs(event.clientY - interaction.startY);
      if (distanceX > PRE_DRAG_MOVEMENT_LIMIT_PX || distanceY > PRE_DRAG_MOVEMENT_LIMIT_PX) {
        stopPieceLayerInteraction(false);
        return;
      }

      interaction.lastClientX = event.clientX;
      interaction.lastClientY = event.clientY;
      return;
    }

    interaction.lastClientX = event.clientX;
    interaction.lastClientY = event.clientY;
    setDragPreviewPosition({ x: event.clientX, y: event.clientY });
    event.preventDefault();
    setPieceLayerDragTarget(getLayerAtClientPoint(event.clientX, event.clientY));
    schedulePanelEdgeAutoScroll();
  }, [
    getLayerAtClientPoint,
    schedulePanelEdgeAutoScroll,
    setPieceLayerDragTarget,
    stopPieceLayerInteraction,
  ]);

  const handlePointerUp = useCallback((event: PointerEvent) => {
    const interaction = interactionRef.current;
    if (!interaction || interaction.pointerId !== event.pointerId) return;
    if (interaction.isDragging) event.preventDefault();

    completePieceLayerInteraction(
      interaction.isDragging ? getLayerAtClientPoint(event.clientX, event.clientY) : null,
    );
  }, [completePieceLayerInteraction, getLayerAtClientPoint]);

  const handlePointerCancel = useCallback((event: PointerEvent) => {
    if (interactionRef.current?.pointerId === event.pointerId) {
      stopPieceLayerInteraction(false);
    }
  }, [stopPieceLayerInteraction]);

  const handleLostPointerCapture = useCallback((event: PointerEvent) => {
    if (interactionRef.current?.pointerId === event.pointerId) {
      stopPieceLayerInteraction(false);
    }
  }, [stopPieceLayerInteraction]);

  useEffect(() => {
    const selectedPieceButton = buttonRef.current;
    if (!selectedPieceButton) return;

    window.addEventListener('pointerdown', handleSecondaryTouchPointerDown, true);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerCancel);
    window.addEventListener('lostpointercapture', handleLostPointerCapture);

    return () => {
      window.removeEventListener('pointerdown', handleSecondaryTouchPointerDown, true);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
      window.removeEventListener('lostpointercapture', handleLostPointerCapture);
    };
  }, [
    handleSecondaryTouchPointerDown,
    handleLostPointerCapture,
    handlePointerCancel,
    handlePointerMove,
    handlePointerUp,
  ]);

  useLayoutEffect(() => () => {
    const interaction = interactionRef.current;
    if (!interaction) return;

    interactionRef.current = null;
    clearTimeout(interaction.holdTimeout);
    if (interaction.autoScrollFrameId !== null) {
      window.cancelAnimationFrame(interaction.autoScrollFrameId);
    }
    releasePieceLayerPointerCapture(interaction);
    if (interaction.isDragging) onDragTargetLayerChange(null);
  }, [onDragTargetLayerChange]);

  const statusLayerId = selectedPiece.layerId;
  const isTargetLayerHidden = !visibleLayers[targetLayer ?? statusLayerId];
  const isDragging = draggingPieceId === selectedPiece.id;

  return (
    <>
      <button
        aria-disabled={disabled}
        aria-describedby={[
          layerStatusId,
          dragHintId,
          ...(isTargetLayerHidden ? [hiddenLayerHintId] : []),
        ].join(' ')}
        aria-label={copy.settings.pieceLayerDragLabel(pieceLabel)}
        className={[
          'relative inline-flex size-11 shrink-0 touch-none select-none items-center justify-center rounded-md border',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-200',
          disabled ? 'cursor-not-allowed opacity-55' : 'cursor-grab active:cursor-grabbing',
          isDragging ? 'border-amber-200 bg-amber-300/15 ring-2 ring-amber-200/80' : 'border-white/15 bg-black/20 hover:border-white/35',
        ].join(' ')}
        data-castle-selected-piece-card="true"
        draggable={false}
        ref={buttonRef}
        style={{ WebkitTouchCallout: 'none' }}
        type="button"
        onContextMenu={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
        onPointerDown={handlePointerDown}
      >
        <img
          alt={pieceLabel}
          className="size-9 object-contain"
          decoding="async"
          draggable={false}
          height={asset.height}
          src={imagePath}
          width={asset.width}
        />
      </button>
      <span aria-live="polite" className="sr-only" id={layerStatusId} role="status">
        {copy.settings.pieceLayerStatus(pieceLabel, copy.editor.layerLabels[statusLayerId])}
      </span>
      <span className="sr-only" id={dragHintId}>
        {copy.settings.pieceLayerDragHint}
      </span>
      {isTargetLayerHidden ? (
        <span className="sr-only" id={hiddenLayerHintId}>
          {copy.settings.hiddenLayerHint}
        </span>
      ) : null}
      {isDragging && dragPreviewPosition ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-[100] flex size-16 items-center justify-center rounded-lg border-2 border-amber-200 bg-stone-950/90 shadow-xl ring-4 ring-amber-200/30"
          data-castle-piece-drag-preview="true"
          style={{
            left: dragPreviewPosition.x,
            top: dragPreviewPosition.y,
            transform: 'translate(-50%, calc(-50% - 20px))',
          }}
        >
          <img
            alt=""
            className="size-14 object-contain"
            decoding="async"
            draggable={false}
            height={asset.height}
            src={imagePath}
            width={asset.width}
          />
        </div>
      ) : null}
    </>
  );
}

function releasePieceLayerPointerCapture(interaction: PieceLayerInteraction) {
  if (
    typeof interaction.button.hasPointerCapture === 'function'
    && typeof interaction.button.releasePointerCapture === 'function'
    && interaction.button.hasPointerCapture(interaction.pointerId)
  ) {
    interaction.button.releasePointerCapture(interaction.pointerId);
  }
}

