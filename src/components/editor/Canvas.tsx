'use client';

import { useEffect, useRef, useState } from 'react';
import { useEditorStore } from '@/lib/store/editor-store';
import { renderToken, drawCheckerboard } from '@/lib/renderer/pipeline';
import { ImageUploader } from './ImageUploader';
import { TextCanvasOverlay } from './TextCanvasOverlay';

function getNextImageScale(currentScale: number, deltaY: number) {
  const scaleFactor = 0.05;
  const direction = deltaY < 0 ? 1 : -1;

  return Math.max(0.1, Math.min(currentScale + direction * scaleFactor, 5));
}

export function Canvas() {
  const store = useEditorStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // 用于拖拽交互的状态
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // 1. 初始化背景棋盘格 (只画一次)
  useEffect(() => {
    const bgCanvas = bgCanvasRef.current;
    if (!bgCanvas) return;
    const ctx = bgCanvas.getContext('2d');
    if (!ctx) return;
    
    // 假设固定 512x512 预览
    bgCanvas.width = 512;
    bgCanvas.height = 512;
    drawCheckerboard(
      ctx,
      512,
      512,
      16,
      '#09090b',
      '#121217',
    );
  }, []);

  // 2. 渲染主画布内容
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !store.imageElement) return;
    
    // 重新渲染 Canvas
    renderToken(canvas, store, 512, { clipFinalOutputToMask: true });
  }, [store]);

  useEffect(() => {
    const previewElement = previewRef.current;
    if (!previewElement) return;

    // 使用原生非被动 wheel 监听，避免缩放时触发外层滚动容器滚动。
    const handleWheel = (event: WheelEvent) => {
      const { imageElement, imageScale, setImageScale } = useEditorStore.getState();
      if (!imageElement) return;

      event.preventDefault();
      event.stopPropagation();

      const nextScale = getNextImageScale(imageScale, event.deltaY);
      if (nextScale !== imageScale) {
        setImageScale(nextScale);
      }
    };

    previewElement.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      previewElement.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // ======== 交互事件 ========
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!store.imageElement) return;
    store.setSelectedText(null);
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !store.imageElement) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    
    store.setImageOffset(store.imageOffsetX + dx, store.imageOffsetY + dy);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div className="relative flex h-full items-center justify-center bg-background/10 p-4 sm:p-8">
      <div 
        ref={previewRef}
        className={`relative overflow-hidden rounded-2xl bg-background shadow-[0_28px_90px_-48px_var(--workspace-shadow-color)] transition-colors aspect-square ${
          store.isImageSelected ? 'border border-primary ring-2 ring-primary/30' : 'border border-border/50'
        }`}
        style={{ width: 512, height: 512, maxWidth: '100%', maxHeight: '100%' }}
      >
        {store.imageElement ? (
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
            <TextCanvasOverlay />
          </>
        ) : (
          <ImageUploader />
        )}
      </div>
      
      {store.imageElement ? (
        <div className="absolute bottom-4 sm:bottom-6 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border text-xs font-medium tabular-nums text-foreground/80 flex items-center gap-2 pointer-events-none shadow-sm">
          <span className="opacity-50">Scale</span>
          {Math.round(store.imageScale * 100)}%
        </div>
      ) : null}
    </div>
  );
}
