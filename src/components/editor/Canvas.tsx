'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { renderToken, drawCheckerboard } from '@/lib/renderer/pipeline';
import { useI18n } from '@/lib/i18n';
import { ImageUploader } from './ImageUploader';
import { TextCanvasOverlay } from './TextCanvasOverlay';
import type { EditorState } from '@/types/editor';
import { getCurrentImageScaleControls, useCanvasEditorState } from './editor-store-hooks';

function getNextImageScale(currentScale: number, deltaY: number) {
  const scaleFactor = 0.05;
  const direction = deltaY < 0 ? 1 : -1;

  return Math.max(0.1, Math.min(currentScale + direction * scaleFactor, 5));
}

const EDITOR_REFERENCE_SIZE = 512;

interface CanvasProps {
  previewMode?: 'default' | 'batch';
}

export function Canvas({ previewMode = 'default' }: CanvasProps) {
  const { t } = useI18n();
  const isBatchPreview = previewMode === 'batch';
  const {
    imageUrl,
    imageElement,
    imageOffsetX,
    imageOffsetY,
    imageScale,
    selectedBorderId,
    selectedMaskId,
    customBorders,
    borderTint,
    imageBorderTintEnabled,
    overlayTint,
    borderOpacity,
    overlayOpacity,
    textBoxes,
    isImageSelected,
    renderRevision,
    setImageOffset,
    setSelectedText,
  } = useCanvasEditorState();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);

  const [canvasSize, setCanvasSize] = useState(512);
  const [previewCssSize, setPreviewCssSize] = useState(512);
  const [assetRevision, setAssetRevision] = useState(0);
  const handleRenderAssetChange = useCallback(() => {
    if (!isMountedRef.current) return;
    setAssetRevision((revision) => revision + 1);
  }, []);

  // 用于拖拽交互的状态
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPointer = useRef({ x: 0, y: 0 });
  const dragStartOffset = useRef({ x: 0, y: 0 });
  const pendingOffset = useRef<{ x: number; y: number } | null>(null);
  const offsetFrame = useRef<number | null>(null);

  // ResizeObserver: 让 canvas 渲染分辨率跟随容器实际像素尺寸
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setPreviewCssSize(width > 0 ? width : EDITOR_REFERENCE_SIZE);
      const px = Math.round(width * window.devicePixelRatio);
      setCanvasSize(px > 0 ? px : EDITOR_REFERENCE_SIZE);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 1. 初始化背景棋盘格 (canvasSize 变化时重绘)
  useEffect(() => {
    const bgCanvas = bgCanvasRef.current;
    if (!bgCanvas) return;
    const ctx = bgCanvas.getContext('2d');
    if (!ctx) return;
    bgCanvas.width = canvasSize;
    bgCanvas.height = canvasSize;
    drawCheckerboard(ctx, canvasSize, canvasSize, 16, '#09090b', '#121217');
  }, [canvasSize, imageElement]);

  // 2. 渲染主画布内容
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageElement) return;

    const renderState: EditorState = {
      imageUrl,
      imageElement,
      imageLoadRevision: 0,
      imageOffsetX,
      imageOffsetY,
      imageScale,
      selectedBorderId,
      selectedMaskId,
      customBorders,
      borderLibraryMode: 'default',
      borderTint,
      imageBorderTintEnabled,
      textColor: '#ffffff',
      overlayTint,
      borderOpacity,
      overlayOpacity,
      textBoxes,
      selectedTextId: null,
      isImageSelected: false,
      exportSize: 512,
      activePresetId: null,
      renderRevision: renderRevision + assetRevision,
    };
    
    // 重新渲染 Canvas
    renderToken(canvas, renderState, canvasSize, {
      clipFinalOutputToMask: true,
      onAssetChange: handleRenderAssetChange,
    });
  }, [
    imageUrl,
    imageElement,
    imageOffsetX,
    imageOffsetY,
    imageScale,
    selectedBorderId,
    selectedMaskId,
    customBorders,
    borderTint,
    imageBorderTintEnabled,
    overlayTint,
    borderOpacity,
    overlayOpacity,
    textBoxes,
    renderRevision,
    assetRevision,
    canvasSize,
    handleRenderAssetChange,
  ]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (offsetFrame.current !== null) {
        cancelAnimationFrame(offsetFrame.current);
      }
    };
  }, []);

  const scheduleImageOffset = (x: number, y: number) => {
    pendingOffset.current = { x, y };
    if (offsetFrame.current !== null) return;

    offsetFrame.current = requestAnimationFrame(() => {
      offsetFrame.current = null;
      const nextOffset = pendingOffset.current;
      pendingOffset.current = null;
      if (nextOffset) {
        setImageOffset(nextOffset.x, nextOffset.y);
      }
    });
  };

  const flushPendingImageOffset = () => {
    if (offsetFrame.current !== null) {
      cancelAnimationFrame(offsetFrame.current);
      offsetFrame.current = null;
    }

    const nextOffset = pendingOffset.current;
    pendingOffset.current = null;
    if (nextOffset) {
      setImageOffset(nextOffset.x, nextOffset.y);
    }
  };

  useEffect(() => {
    const workspaceElement = workspaceRef.current;
    if (!workspaceElement) return;

    // 使用原生非被动 wheel 监听，避免缩放时触发外层滚动容器滚动。
    const handleWheel = (event: WheelEvent) => {
      const { imageElement, imageScale, setImageScale } = getCurrentImageScaleControls();
      if (!imageElement) return;

      event.preventDefault();
      event.stopPropagation();

      const nextScale = getNextImageScale(imageScale, event.deltaY);
      if (nextScale !== imageScale) {
        setImageScale(nextScale);
      }
    };

    workspaceElement.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      workspaceElement.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // ======== 交互事件 ========
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!imageElement) return;
    setSelectedText(null);
    setIsDragging(true);
    dragStartPointer.current = { x: e.clientX, y: e.clientY };
    dragStartOffset.current = { x: imageOffsetX, y: imageOffsetY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !imageElement) return;
    const previewScale = previewCssSize / EDITOR_REFERENCE_SIZE || 1;
    const dx = (e.clientX - dragStartPointer.current.x) / previewScale;
    const dy = (e.clientY - dragStartPointer.current.y) / previewScale;
    
    scheduleImageOffset(dragStartOffset.current.x + dx, dragStartOffset.current.y + dy);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    flushPendingImageOffset();
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const rootClassName = isBatchPreview
    ? 'relative flex h-full min-h-0 w-full items-center justify-center bg-background/10 p-2 sm:p-3'
    : 'relative flex min-h-[24rem] w-full items-center justify-center bg-background/10 p-3 sm:min-h-[32rem] sm:p-4 xl:h-full xl:min-h-0 xl:p-6';
  const previewFrameSizeClassName = isBatchPreview
    ? 'h-full max-h-[16rem] w-auto max-w-full sm:max-h-[20rem] xl:max-h-[22rem]'
    : 'w-full max-w-[512px]';

  return (
    <div ref={workspaceRef} data-testid="canvas-workspace" className={rootClassName}>
      <div
        ref={previewRef}
        className={`relative aspect-square ${previewFrameSizeClassName} shrink-0 overflow-hidden rounded-xl bg-background shadow-[0_28px_90px_-48px_var(--workspace-shadow-color)] transition-colors sm:rounded-2xl ${
          isImageSelected ? 'border border-primary ring-2 ring-primary/30' : 'border border-border/50'
        }`}
      >
        {imageElement ? (
          <>
            {/* 背景层：棋盘格 */}
            <canvas 
              ref={bgCanvasRef}
              className="absolute inset-0 pointer-events-none opacity-50 w-full h-full" 
            />
            
            {/* 主渲染层（带交互） */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 cursor-move touch-none w-full h-full"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />
            
            {/* 文字交互层 */}
            <TextCanvasOverlay previewScale={previewCssSize / EDITOR_REFERENCE_SIZE || 1} />
          </>
        ) : (
          <ImageUploader />
        )}
      </div>
      
      {imageElement ? (
        <div className="absolute bottom-3 flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium tabular-nums text-foreground/80 shadow-sm backdrop-blur-md pointer-events-none sm:bottom-6">
          <span className="opacity-50">{t('imageScale')}</span>
          {Math.round(imageScale * 100)}%
        </div>
      ) : null}
    </div>
  );
}
