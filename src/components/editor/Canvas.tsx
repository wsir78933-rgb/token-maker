'use client';

import { useEffect, useRef, useState } from 'react';
import { useEditorStore } from '@/lib/store/editor-store';
import { renderToken, drawCheckerboard } from '@/lib/renderer/pipeline';
import { ImageUploader } from './ImageUploader';
import { TextCanvasOverlay } from './TextCanvasOverlay';

export function Canvas() {
  const store = useEditorStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  
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
    drawCheckerboard(ctx, 512, 512, 16, '#09090b', '#121217'); // 极简暗紫风格棋盘格
  }, []);

  // 2. 渲染主画布内容
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !store.imageElement) return;
    
    // 重新渲染 Canvas
    renderToken(canvas, store, 512);
  }, [store]);

  // ======== 交互事件 ========
  const handleWheel = (e: React.WheelEvent) => {
    if (!store.imageElement) return;
    e.preventDefault();
    const isZoomIn = e.deltaY < 0;
    const scaleFactor = 0.05;
    const currentScale = store.imageScale;
    let newScale = isZoomIn ? currentScale + scaleFactor : currentScale - scaleFactor;
    // 限制缩放范围 0.1 ~ 5
    newScale = Math.max(0.1, Math.min(newScale, 5));
    store.setImageScale(newScale);
  };

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

  if (!store.imageElement) {
    return <ImageUploader />;
  }

  return (
    <div className="flex items-center justify-center p-8 h-full bg-background relative">
      <div 
        className={`relative bg-background overflow-hidden rounded-md shadow-2xl transition-colors ${
          store.isImageSelected ? 'border border-primary ring-2 ring-primary/30' : 'border border-border/50'
        }`}
        style={{ width: 512, height: 512 }}
      >
        {/* 背景层：棋盘格 */}
        <canvas 
          ref={bgCanvasRef}
          className="absolute inset-0 pointer-events-none opacity-50" 
        />
        
        {/* 主渲染层（带交互） */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-move touch-none"
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
        
        {/* 文字交互层 */}
        <TextCanvasOverlay />
      </div>
      
      {/* 缩放指示器悬浮窗 */}
      <div className="absolute bottom-6 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border text-xs font-medium tabular-nums text-foreground/80 flex items-center gap-2 pointer-events-none shadow-sm">
        <span className="opacity-50">Scale</span>
        {Math.round(store.imageScale * 100)}%
      </div>
    </div>
  );
}
