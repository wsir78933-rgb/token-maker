'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';

import { castleAssetImagePath, getCastleAsset } from '@/lib/castle-creator/catalog';
import { getCastleCreatorCopy, type CastleCreatorCopy } from '@/lib/castle-creator/copy';
import type { SiteLocale } from '@/lib/site-locale';
import type {
  CastlePiece,
  CastlePoint,
  CastleProject,
  CastleSize,
} from '@/lib/castle-creator/types';

const CASTLE_LAYER_ORDER = ['lower', 'middle', 'upper'] as const;
const MIN_PIECE_SIZE = 1;
const KEYBOARD_MOVE_STEP = 5;
const KEYBOARD_RESIZE_STEP = 5;
const HANDLE_HIT_SIZE = 44;
const RESIZE_HANDLE_GAP = 8;
const RESIZE_HANDLE_BOTTOM_SPACER = RESIZE_HANDLE_GAP + HANDLE_HIT_SIZE;
const DESKTOP_HANDLE_VISUAL_SIZE = 16;
const MOBILE_HANDLE_VISUAL_SIZE = 16;

type ResizeHandle = 'end';
type ResizeDirection = -1 | 1;
type ResizeCursor = 'nwse-resize' | 'nesw-resize';
type InteractionMode = 'move' | 'resize';

interface CanvasInteraction {
  mode: InteractionMode;
  pointerId: number;
  pieceId: string;
  startPoint: CastlePoint;
  startPiece: CastlePiece;
  resizeHandle?: ResizeHandle;
  resizeHorizontalDirection?: ResizeDirection;
  resizeVerticalDirection?: ResizeDirection;
}

interface ViewportTransform {
  scale: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

interface ResizeHandlePosition {
  left: number;
  top: number;
}

interface ResizeHandleLayout {
  position: ResizeHandlePosition;
  requiresBottomSpacer: boolean;
  horizontalDirection: ResizeDirection;
  verticalDirection: ResizeDirection;
  cursor: ResizeCursor;
}

interface CanvasRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface CastleCanvasProps {
  project: CastleProject;
  selectedPieceId: string | null;
  size: CastleSize;
  locale: SiteLocale;
  onSelectPiece: (pieceId: string | null) => void;
  onMovePiece: (pieceId: string, position: CastlePoint) => void;
  onResizePiece: (pieceId: string, width: number) => void;
}

export function CastleCanvas({
  project,
  selectedPieceId,
  size,
  locale,
  onSelectPiece,
  onMovePiece,
  onResizePiece,
}: CastleCanvasProps) {
  const copy = getCastleCreatorCopy(locale);
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef<CanvasInteraction | null>(null);
  const [viewportTransform, setViewportTransform] = useState<ViewportTransform | null>(null);
  const [failedImagePaths, setFailedImagePaths] = useState<ReadonlySet<string>>(new Set());
  const [interactionError, setInteractionError] = useState<string | null>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  const canvasSize = useMemo(() => validateCanvasSize(size), [size]);
  const visiblePieces = useMemo(
    () => getVisiblePieces(project),
    [project],
  );
  const selectedPiece = selectedPieceId
    ? visiblePieces.find((piece) => piece.id === selectedPieceId) ?? null
    : null;
  const resizeHandleLayout = useMemo(() => (
    selectedPiece && project.resizeEnabled && viewportTransform
      ? getResizeHandlePosition(selectedPiece, viewportTransform, visiblePieces)
      : null
  ), [project.resizeEnabled, selectedPiece, viewportTransform, visiblePieces]);

  const measureViewport = useCallback(() => {
    const svg = svgRef.current;
    const canvas = canvasRef.current;
    if (!svg || !canvas) return;
    const svgRect = svg.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const measured = getViewportTransform(svgRect, canvasRect, canvasSize);
    setViewportTransform((current) => (
      current && isSameViewportTransform(current, measured) ? current : measured
    ));
  }, [canvasSize]);

  useLayoutEffect(() => {
    measureViewport();
  }, [measureViewport]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    measureViewport();
    const handleWindowResize = () => measureViewport();
    window.addEventListener('resize', handleWindowResize);

    const mediaQuery = typeof window.matchMedia === 'function'
      ? window.matchMedia('(max-width: 767px)')
      : null;
    const updateMobileViewport = () => setIsMobileViewport(mediaQuery?.matches ?? false);
    updateMobileViewport();
    mediaQuery?.addEventListener?.('change', updateMobileViewport);

    const observer = typeof ResizeObserver === 'function'
      ? new ResizeObserver(() => measureViewport())
      : null;
    observer?.observe(canvas);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      mediaQuery?.removeEventListener?.('change', updateMobileViewport);
      observer?.disconnect();
    };
  }, [measureViewport]);

  const toCanvasPoint = useCallback((clientX: number, clientY: number): CastlePoint => {
    const svg = svgRef.current;
    if (!svg) {
      throw new Error('Cannot convert pointer coordinates because the castle canvas SVG is unavailable.');
    }
    return clientPointToCanvasPoint(clientX, clientY, svg.getBoundingClientRect(), canvasSize);
  }, [canvasSize]);

  const capturePointer = useCallback((pointerId: number) => {
    const svg = svgRef.current;
    if (!svg) {
      throw new Error(`Cannot capture pointer ${pointerId}: the castle canvas SVG is unavailable.`);
    }
    if (typeof svg.setPointerCapture === 'function') {
      svg.setPointerCapture(pointerId);
    }
    svg.focus();
  }, []);

  const beginMove = useCallback((event: PointerEvent<SVGGElement>, piece: CastlePiece) => {
    event.preventDefault();
    event.stopPropagation();
    setInteractionError(null);
    onSelectPiece(piece.id);
    interactionRef.current = {
      mode: 'move',
      pointerId: event.pointerId,
      pieceId: piece.id,
      startPoint: toCanvasPoint(event.clientX, event.clientY),
      startPiece: piece,
    };
    capturePointer(event.pointerId);
  }, [capturePointer, onSelectPiece, toCanvasPoint]);

  const beginResize = useCallback((
    event: PointerEvent<HTMLButtonElement>,
    piece: CastlePiece,
    handle: ResizeHandle,
    layout: ResizeHandleLayout,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!project.resizeEnabled) return;
    setInteractionError(null);
    interactionRef.current = {
      mode: 'resize',
      pointerId: event.pointerId,
      pieceId: piece.id,
      resizeHandle: handle,
      resizeHorizontalDirection: layout.horizontalDirection,
      resizeVerticalDirection: layout.verticalDirection,
      startPoint: toCanvasPoint(event.clientX, event.clientY),
      startPiece: piece,
    };
    capturePointer(event.pointerId);
    event.currentTarget.focus();
  }, [capturePointer, project.resizeEnabled, toCanvasPoint]);

  const finishInteraction = useCallback((pointerId: number) => {
    const svg = svgRef.current;
    if (svg && typeof svg.hasPointerCapture === 'function' && svg.hasPointerCapture(pointerId)) {
      svg.releasePointerCapture(pointerId);
    }
    interactionRef.current = null;
  }, []);

  const handlePointerMove = useCallback((event: PointerEvent<SVGSVGElement>) => {
    const interaction = interactionRef.current;
    if (!interaction || interaction.pointerId !== event.pointerId) return;

    try {
      const currentPoint = toCanvasPoint(event.clientX, event.clientY);
      if (interaction.mode === 'move') {
        const nextPosition = requireFinitePiecePosition({
          x: interaction.startPiece.x + currentPoint.x - interaction.startPoint.x,
          y: interaction.startPiece.y + currentPoint.y - interaction.startPoint.y,
        });
        onMovePiece(interaction.pieceId, nextPosition);
      } else if (interaction.resizeHandle) {
        const width = getResizedWidth(interaction, currentPoint);
        onResizePiece(interaction.pieceId, width);
      }
    } catch (error) {
      setInteractionError(getErrorMessage(error));
      finishInteraction(event.pointerId);
    }
  }, [finishInteraction, onMovePiece, onResizePiece, toCanvasPoint]);

  const handlePointerEnd = useCallback((event: PointerEvent<SVGSVGElement>) => {
    if (interactionRef.current?.pointerId === event.pointerId) {
      finishInteraction(event.pointerId);
    }
  }, [finishInteraction]);

  const handleCanvasPointerDown = useCallback(() => {
    if (interactionRef.current) return;
    onSelectPiece(null);
  }, [onSelectPiece]);

  const handleCanvasKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    const piece = selectedPiece;
    if (!piece) return;
    if (event.key === 'Escape') {
      onSelectPiece(null);
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const direction = event.key === 'ArrowLeft'
        ? { x: -KEYBOARD_MOVE_STEP, y: 0 }
        : event.key === 'ArrowRight'
          ? { x: KEYBOARD_MOVE_STEP, y: 0 }
          : event.key === 'ArrowUp'
            ? { x: 0, y: -KEYBOARD_MOVE_STEP }
            : { x: 0, y: KEYBOARD_MOVE_STEP };
      onMovePiece(piece.id, requireFinitePiecePosition({ x: piece.x + direction.x, y: piece.y + direction.y }));
    }
  }, [onMovePiece, onSelectPiece, selectedPiece]);

  const handleResizeKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement>, piece: CastlePiece) => {
    if (!project.resizeEnabled) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    event.stopPropagation();
    const widthDelta = event.key === 'ArrowLeft' ? -KEYBOARD_RESIZE_STEP : KEYBOARD_RESIZE_STEP;
    onResizePiece(piece.id, Math.max(MIN_PIECE_SIZE, piece.width + widthDelta));
  }, [onResizePiece, project.resizeEnabled]);

  const handleImageError = useCallback((imagePath: string) => {
    setFailedImagePaths((current) => current.has(imagePath) ? current : new Set([...current, imagePath]));
  }, []);

  return (
    <div
      ref={canvasRef}
      aria-label={copy.editor.canvasLabel}
      className="relative isolate h-[228px] w-full overflow-visible rounded-lg border border-border bg-card md:h-auto"
      role="application"
      style={{
        aspectRatio: `${canvasSize.width} / ${canvasSize.height}`,
        marginBottom: resizeHandleLayout?.requiresBottomSpacer ? `${RESIZE_HANDLE_BOTTOM_SPACER}px` : undefined,
        touchAction: 'none',
      }}
      tabIndex={0}
      onKeyDown={handleCanvasKeyDown}
      onPointerDown={handleCanvasPointerDown}
    >
      <svg
        ref={svgRef}
        aria-label={copy.editor.canvasLabel}
        className="absolute inset-0 h-full w-full overflow-hidden rounded-[inherit]"
        focusable="true"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        tabIndex={-1}
        viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
        onPointerCancel={handlePointerEnd}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
      >
        <rect fill={project.canvas.backgroundColor} height={canvasSize.height} width={canvasSize.width} x="0" y="0" />
        {project.canvas.backgroundImageUrl && !failedImagePaths.has(project.canvas.backgroundImageUrl) ? (
          <image
            aria-label={copy.editor.canvasLabel}
            height={canvasSize.height}
            preserveAspectRatio="xMidYMid slice"
            href={project.canvas.backgroundImageUrl}
            width={canvasSize.width}
            x="0"
            y="0"
            onError={() => handleImageError(project.canvas.backgroundImageUrl as string)}
          />
        ) : null}
        {project.canvas.backgroundImageUrl && failedImagePaths.has(project.canvas.backgroundImageUrl) ? (
          <text fill="#991b1b" fontSize={Math.max(12, canvasSize.height / 60)} x="16" y="28">
            {copy.library.imageLoadError(project.canvas.backgroundImageUrl)}
          </text>
        ) : null}

        {visiblePieces.map((piece) => (
          <CastlePieceImage
            key={piece.id}
            copy={copy}
            failedImagePaths={failedImagePaths}
            moveHitSize={getMoveHitSizeInScene(viewportTransform)}
            piece={piece}
            selected={piece.id === selectedPieceId}
            onImageError={handleImageError}
            onPointerDown={beginMove}
          />
        ))}

        {selectedPiece ? (
          <rect
            aria-label={copy.editor.selectedPieceLabel}
            data-castle-selection={selectedPiece.id}
            fill="none"
            height={selectedPiece.height}
            pointerEvents="none"
            stroke="#2563eb"
            strokeWidth={2}
            width={selectedPiece.width}
            x={selectedPiece.x}
            y={selectedPiece.y}
          />
        ) : null}
      </svg>

      {selectedPiece && resizeHandleLayout ? (
        <ResizeHandleOverlay
          isMobileViewport={isMobileViewport}
          copy={copy}
          layout={resizeHandleLayout}
          piece={selectedPiece}
          onKeyDown={handleResizeKeyDown}
          onPointerDown={beginResize}
        />
      ) : null}

      {selectedPiece && project.resizeEnabled ? (
        <span className="sr-only" data-resize-key-help>{copy.editor.resizeKeyboardHint}</span>
      ) : null}

      {interactionError ? (
        <p aria-live="assertive" className="absolute bottom-2 left-2 right-2 rounded bg-red-50 px-2 py-1 text-xs text-red-900" role="alert">
          {copy.editor.interactionError}: {interactionError}
        </p>
      ) : null}

      {visiblePieces.length === 0 ? (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          data-castle-empty-hint
        >
          <p className="rounded-md bg-background/80 px-3 py-2 text-xs text-muted-foreground shadow-sm ring-1 ring-border/50">
            {copy.editor.emptyCanvasHint}
          </p>
        </div>
      ) : null}
    </div>
  );
}

interface CastlePieceImageProps {
  copy: CastleCreatorCopy;
  failedImagePaths: ReadonlySet<string>;
  moveHitSize: number;
  piece: CastlePiece;
  selected: boolean;
  onImageError: (imagePath: string) => void;
  onPointerDown: (event: PointerEvent<SVGGElement>, piece: CastlePiece) => void;
}

function CastlePieceImage({
  copy,
  failedImagePaths,
  moveHitSize,
  piece,
  selected,
  onImageError,
  onPointerDown,
}: CastlePieceImageProps) {
  const asset = getCastleAsset(piece.assetId);
  const imagePath = castleAssetImagePath(piece.assetId, {
    building: piece.buildingColor,
    roof: piece.roofColor,
  });
  const label = copy.library.assetImageAlt(asset.category, asset.number);
  const hasImageError = failedImagePaths.has(imagePath);

  return (
    <g
      aria-label={label}
      aria-pressed={selected}
      className="touch-none cursor-grab select-none active:cursor-grabbing"
      data-castle-piece-id={piece.id}
      data-castle-layer-id={piece.layerId}
      role="button"
      tabIndex={-1}
      onPointerDown={(event) => onPointerDown(event, piece)}
    >
      <rect
        data-castle-move-hit-target={piece.id}
        fill="transparent"
        height={Math.max(piece.height, moveHitSize)}
        pointerEvents="all"
        width={Math.max(piece.width, moveHitSize)}
        x={piece.x - Math.max(0, moveHitSize - piece.width) / 2}
        y={piece.y - Math.max(0, moveHitSize - piece.height) / 2}
      />
      {!hasImageError ? (
        <image
          aria-label={label}
          height={piece.height}
          href={imagePath}
          preserveAspectRatio="none"
          width={piece.width}
          x={piece.x}
          y={piece.y}
          onError={() => onImageError(imagePath)}
        />
      ) : (
        <>
          <rect fill="#fee2e2" height={piece.height} width={piece.width} x={piece.x} y={piece.y} />
          <text fill="#991b1b" fontSize={Math.max(10, piece.height / 8)} x={piece.x + 4} y={piece.y + Math.min(piece.height - 4, 18)}>
            {copy.library.imageLoadError(imagePath)}
          </text>
        </>
      )}
    </g>
  );
}

interface ResizeHandleOverlayProps {
  copy: CastleCreatorCopy;
  isMobileViewport: boolean;
  layout: ResizeHandleLayout;
  piece: CastlePiece;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, piece: CastlePiece) => void;
  onPointerDown: (
    event: PointerEvent<HTMLButtonElement>,
    piece: CastlePiece,
    handle: ResizeHandle,
    layout: ResizeHandleLayout,
  ) => void;
}

function ResizeHandleOverlay({
  copy,
  isMobileViewport,
  layout,
  piece,
  onKeyDown,
  onPointerDown,
}: ResizeHandleOverlayProps) {
  const visualSize = isMobileViewport ? MOBILE_HANDLE_VISUAL_SIZE : DESKTOP_HANDLE_VISUAL_SIZE;
  const handle: ResizeHandle = 'end';
  return (
    <div aria-label={copy.editor.selectedPieceLabel} className="pointer-events-none absolute inset-0" data-castle-resize-controls>
      <button
        aria-label={copy.editor.resizeHandleLabels[handle]}
        className={`pointer-events-auto absolute flex items-center justify-center rounded-sm border-0 bg-transparent p-0 ${
          layout.cursor === 'nwse-resize' ? 'cursor-nwse-resize' : 'cursor-nesw-resize'
        }`}
        data-castle-resize-handle={handle}
        style={{
          left: `${layout.position.left}px`,
          top: `${layout.position.top}px`,
          width: `${HANDLE_HIT_SIZE}px`,
          height: `${HANDLE_HIT_SIZE}px`,
          cursor: layout.cursor,
          touchAction: 'none',
        }}
        type="button"
        onKeyDown={(event) => onKeyDown(event, piece)}
        onPointerDown={(event) => onPointerDown(event, piece, handle, layout)}
      >
        <span
          aria-hidden="true"
          className="rounded-[1px] border-2 border-blue-600 bg-white"
          style={{ width: `${visualSize}px`, height: `${visualSize}px` }}
        />
      </button>
    </div>
  );
}

function validateCanvasSize(size: CastleSize): CastleSize {
  if (!Number.isFinite(size.width) || size.width <= 0) {
    throw new Error(`Invalid castle canvas width: ${size.width}. Expected a positive number.`);
  }
  if (!Number.isFinite(size.height) || size.height <= 0) {
    throw new Error(`Invalid castle canvas height: ${size.height}. Expected a positive number.`);
  }
  return { width: size.width, height: size.height };
}

function getVisiblePieces(project: CastleProject): CastlePiece[] {
  return CASTLE_LAYER_ORDER.flatMap((layerId) => (
    project.visibleLayers[layerId] ? project.pieces.filter((piece) => piece.layerId === layerId) : []
  ));
}

function getResizeHandlePosition(
  piece: CastlePiece,
  transform: ViewportTransform,
  visiblePieces: CastlePiece[],
): ResizeHandleLayout {
  const canvasRect: CanvasRect = {
    left: transform.left,
    top: transform.top,
    width: transform.width,
    height: transform.height,
  };
  const visiblePieceRects = visiblePieces.flatMap((visiblePiece) => {
    validateResizeGeometry(visiblePiece, transform, canvasRect);
    const visibleRect = getVisiblePieceRect(visiblePiece, transform, canvasRect);
    return visibleRect ? [visibleRect] : [];
  });

  const pieceRect: CanvasRect = {
    left: transform.left + piece.x * transform.scale,
    top: transform.top + piece.y * transform.scale,
    width: piece.width * transform.scale,
    height: piece.height * transform.scale,
  };
  const visiblePieceRect = intersectRectangles(pieceRect, canvasRect);
  if (!visiblePieceRect) {
    return {
      ...createResizeHandleLayout(
        getBottomFallbackPosition(canvasRect, canvasRect),
        canvasRect,
        true,
      ),
    };
  }
  const candidates: ResizeHandlePosition[] = [
    { left: visiblePieceRect.left + visiblePieceRect.width, top: visiblePieceRect.top + visiblePieceRect.height },
    { left: visiblePieceRect.left + visiblePieceRect.width, top: visiblePieceRect.top - HANDLE_HIT_SIZE },
    { left: visiblePieceRect.left - HANDLE_HIT_SIZE, top: visiblePieceRect.top + visiblePieceRect.height },
    { left: visiblePieceRect.left - HANDLE_HIT_SIZE, top: visiblePieceRect.top - HANDLE_HIT_SIZE },
    { left: visiblePieceRect.left + visiblePieceRect.width, top: visiblePieceRect.top + (visiblePieceRect.height - HANDLE_HIT_SIZE) / 2 },
    { left: visiblePieceRect.left - HANDLE_HIT_SIZE, top: visiblePieceRect.top + (visiblePieceRect.height - HANDLE_HIT_SIZE) / 2 },
    { left: visiblePieceRect.left + (visiblePieceRect.width - HANDLE_HIT_SIZE) / 2, top: visiblePieceRect.top + visiblePieceRect.height },
    { left: visiblePieceRect.left + (visiblePieceRect.width - HANDLE_HIT_SIZE) / 2, top: visiblePieceRect.top - HANDLE_HIT_SIZE },
  ];
  const position = candidates.find((candidate) => (
    isRectInside(candidate, canvasRect)
    && !visiblePieceRects.some((visibleRect) => (
      rectanglesOverlap({ ...candidate, width: HANDLE_HIT_SIZE, height: HANDLE_HIT_SIZE }, visibleRect)
    ))
  ));
  if (position) {
    return createResizeHandleLayout(position, visiblePieceRect, false);
  }
  return {
    ...createResizeHandleLayout(
      getBottomFallbackPosition(canvasRect, visiblePieceRect),
      visiblePieceRect,
      true,
    ),
  };
}

function validateResizeGeometry(piece: CastlePiece, transform: ViewportTransform, canvasRect: CanvasRect): void {
  const finiteFields: ReadonlyArray<readonly [string, number]> = [
    ['transform.scale', transform.scale],
    ['canvas.left', canvasRect.left],
    ['canvas.top', canvasRect.top],
    ['canvas.width', canvasRect.width],
    ['canvas.height', canvasRect.height],
    ['piece.x', piece.x],
    ['piece.y', piece.y],
    ['piece.width', piece.width],
    ['piece.height', piece.height],
  ];
  const invalidFiniteField = finiteFields.find(([, value]) => !Number.isFinite(value));
  if (invalidFiniteField) {
    throw new Error(
      `Invalid castle resize geometry for piece ${JSON.stringify(piece.id)}: `
      + `${invalidFiniteField[0]}=${String(invalidFiniteField[1])} must be finite.`,
    );
  }
  const positiveFields: ReadonlyArray<readonly [string, number]> = [
    ['transform.scale', transform.scale],
    ['canvas.width', canvasRect.width],
    ['canvas.height', canvasRect.height],
    ['piece.width', piece.width],
    ['piece.height', piece.height],
  ];
  const invalidPositiveField = positiveFields.find(([, value]) => value <= 0);
  if (invalidPositiveField) {
    throw new Error(
      `Invalid castle resize geometry for piece ${JSON.stringify(piece.id)}: `
      + `${invalidPositiveField[0]}=${String(invalidPositiveField[1])} must be greater than zero.`,
    );
  }
}

function getVisiblePieceRect(
  piece: CastlePiece,
  transform: ViewportTransform,
  canvasRect: CanvasRect,
): CanvasRect | null {
  const pieceRect: CanvasRect = {
    left: transform.left + piece.x * transform.scale,
    top: transform.top + piece.y * transform.scale,
    width: piece.width * transform.scale,
    height: piece.height * transform.scale,
  };
  return intersectRectangles(pieceRect, canvasRect);
}

function createResizeHandleLayout(
  position: ResizeHandlePosition,
  referenceRect: CanvasRect,
  requiresBottomSpacer: boolean,
): ResizeHandleLayout {
  const handleCenterX = position.left + HANDLE_HIT_SIZE / 2;
  const handleCenterY = position.top + HANDLE_HIT_SIZE / 2;
  const referenceCenterX = referenceRect.left + referenceRect.width / 2;
  const referenceCenterY = referenceRect.top + referenceRect.height / 2;
  const horizontalDirection: ResizeDirection = handleCenterX >= referenceCenterX ? 1 : -1;
  const verticalDirection: ResizeDirection = handleCenterY >= referenceCenterY ? 1 : -1;
  return {
    position,
    requiresBottomSpacer,
    horizontalDirection,
    verticalDirection,
    cursor: horizontalDirection === verticalDirection ? 'nwse-resize' : 'nesw-resize',
  }
}

function intersectRectangles(first: CanvasRect, second: CanvasRect): CanvasRect | null {
  const left = Math.max(first.left, second.left);
  const top = Math.max(first.top, second.top);
  const right = Math.min(first.left + first.width, second.left + second.width);
  const bottom = Math.min(first.top + first.height, second.top + second.height);
  if (right <= left || bottom <= top) return null;
  return { left, top, width: right - left, height: bottom - top };
}

function getBottomFallbackPosition(canvasRect: CanvasRect, visiblePieceRect: CanvasRect): ResizeHandlePosition {
  return {
    left: clampHandleLeft(
      visiblePieceRect.left + visiblePieceRect.width - HANDLE_HIT_SIZE,
      canvasRect.left,
      canvasRect.left + canvasRect.width - HANDLE_HIT_SIZE,
    ),
    top: canvasRect.top + canvasRect.height + RESIZE_HANDLE_GAP,
  };
}

function clampHandleLeft(value: number, minimum: number, maximum: number): number {
  if (maximum < minimum) return minimum;
  return Math.min(maximum, Math.max(minimum, value));
}

function isRectInside(position: ResizeHandlePosition, canvasRect: CanvasRect): boolean {
  return position.left >= canvasRect.left
    && position.top >= canvasRect.top
    && position.left + HANDLE_HIT_SIZE <= canvasRect.left + canvasRect.width
    && position.top + HANDLE_HIT_SIZE <= canvasRect.top + canvasRect.height;
}

function rectanglesOverlap(first: CanvasRect, second: CanvasRect): boolean {
  return first.left < second.left + second.width
    && second.left < first.left + first.width
    && first.top < second.top + second.height
    && second.top < first.top + first.height;
}

function getViewportTransform(
  svgRect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>,
  canvasRect: Pick<DOMRect, 'left' | 'top'>,
  sceneSize: CastleSize,
): ViewportTransform {
  if (!Number.isFinite(svgRect.width) || !Number.isFinite(svgRect.height) || svgRect.width <= 0 || svgRect.height <= 0) {
    return { scale: 1, left: 0, top: 0, width: sceneSize.width, height: sceneSize.height };
  }
  const scale = Math.min(svgRect.width / sceneSize.width, svgRect.height / sceneSize.height);
  const renderedWidth = sceneSize.width * scale;
  const renderedHeight = sceneSize.height * scale;
  return {
    scale,
    left: svgRect.left - canvasRect.left + (svgRect.width - renderedWidth) / 2,
    top: svgRect.top - canvasRect.top + (svgRect.height - renderedHeight) / 2,
    width: renderedWidth,
    height: renderedHeight,
  };
}

function clientPointToCanvasPoint(
  clientX: number,
  clientY: number,
  svgRect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>,
  sceneSize: CastleSize,
): CastlePoint {
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) {
    throw new Error(`Invalid pointer coordinates: x=${clientX}, y=${clientY}.`);
  }
  const transform = getViewportTransform(svgRect, svgRect, sceneSize);
  if (transform.scale <= 0 || !Number.isFinite(transform.scale)) {
    throw new Error(`Invalid canvas display scale: ${transform.scale}.`);
  }
  return {
    x: (clientX - svgRect.left - (svgRect.width - transform.width) / 2) / transform.scale,
    y: (clientY - svgRect.top - (svgRect.height - transform.height) / 2) / transform.scale,
  };
}

function requireFinitePiecePosition(position: CastlePoint): CastlePoint {
  if (!Number.isFinite(position.x) || !Number.isFinite(position.y)) {
    throw new Error(`Invalid castle piece position: x=${position.x}, y=${position.y}.`);
  }
  return position;
}

function getMoveHitSizeInScene(transform: ViewportTransform | null): number {
  const displayScale = transform?.scale ?? 1;
  if (!Number.isFinite(displayScale) || displayScale <= 0) {
    throw new Error(`Invalid canvas display scale for move hit target: ${displayScale}.`);
  }
  return HANDLE_HIT_SIZE / displayScale;
}

function getResizedWidth(interaction: CanvasInteraction, currentPoint: CastlePoint): number {
  if (!interaction.resizeHandle) {
    throw new Error(`Resize interaction for piece ${interaction.pieceId} has no resize handle.`);
  }
  if (!interaction.resizeHorizontalDirection || !interaction.resizeVerticalDirection) {
    throw new Error(
      `Resize interaction for piece ${JSON.stringify(interaction.pieceId)} is missing its handle directions.`,
    );
  }
  const deltaX = currentPoint.x - interaction.startPoint.x;
  const deltaY = currentPoint.y - interaction.startPoint.y;
  const directedDeltaX = deltaX * interaction.resizeHorizontalDirection;
  const directedDeltaY = deltaY * interaction.resizeVerticalDirection;
  const widthFromHeightDelta = directedDeltaY * interaction.startPiece.width / interaction.startPiece.height;
  const widthDelta = Math.abs(directedDeltaX) >= Math.abs(widthFromHeightDelta)
    ? directedDeltaX
    : widthFromHeightDelta;
  const width = interaction.startPiece.width + widthDelta;
  if (!Number.isFinite(width)) {
    throw new Error(`Invalid resized width for piece ${interaction.pieceId}: ${width}.`);
  }
  return Math.max(MIN_PIECE_SIZE, width);
}

function isSameViewportTransform(first: ViewportTransform, second: ViewportTransform): boolean {
  return first.scale === second.scale
    && first.left === second.left
    && first.top === second.top
    && first.width === second.width
    && first.height === second.height;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
