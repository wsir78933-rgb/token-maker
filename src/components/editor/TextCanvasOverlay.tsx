'use client';

import { useRef, useEffect, useState } from 'react';
import type { TextBox } from '@/types/editor';
import { useDraggableTextState, useTextCanvasOverlayState } from './editor-store-hooks';

/**
 * 文本图层交互覆盖组件
 * 在主画布上方绝对定位，提供文本的拖动和双击编辑能力。
 */
export function TextCanvasOverlay({ previewScale = 1 }: { previewScale?: number }) {
  const { textBoxes, setSelectedText } = useTextCanvasOverlayState();
  
  // 点击空白处取消选中
  const handleWrapperClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedText(null);
    }
  };

  if (textBoxes.length === 0) return null;

  return (
    <div 
      className="absolute inset-0 pointer-events-auto overflow-hidden" 
      onClick={handleWrapperClick}
    >
      {textBoxes.map((text) => (
        <DraggableText key={text.id} text={text} previewScale={previewScale} />
      ))}
    </div>
  );
}

function DraggableText({ text, previewScale }: { text: TextBox; previewScale: number }) {
  const { isSelected, setSelectedText, updateTextBox } = useDraggableTextState(text);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartOffset = useRef({ x: 0, y: 0 });

  const scale = Math.max(0.001, previewScale);

  // ==== 拖拽逻辑 ====
  const onPointerDown = (e: React.PointerEvent) => {
    if (isEditing) return;
    
    e.stopPropagation(); // 阻止冒泡到外层取消选中
    setSelectedText(text.id);
    
    // 捕获指针准备拖动
    if (boxRef.current) {
      boxRef.current.setPointerCapture(e.pointerId);
      setIsDragging(true);
      
      // 记录鼠标相对文本框初始点击的偏移
      // x, y 在 state 里约定为居中或左侧坐标，按目前渲染逻辑 textBaseline = 'middle'
      // 我们可以简单计算 dx, dy 控制坐标
      dragStartOffset.current = {
        x: e.clientX,
        y: e.clientY,
      };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const dx = (e.clientX - dragStartOffset.current.x) / scale;
    const dy = (e.clientY - dragStartOffset.current.y) / scale;
    
    updateTextBox(text.id, {
      x: text.x + dx,
      y: text.y + dy,
    });

    dragStartOffset.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    if (boxRef.current) {
      boxRef.current.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
  };

  // ==== 编辑逻辑 ====
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setSelectedText(text.id);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // 全选文本方便覆盖
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  // 计算对应的 CSS 样式，要和 Canvas 渲染对齐
  // Canvas: x, y, align, textBaseline=middle
  const transform = `translate(${text.x * scale}px, ${text.y * scale}px)`;
  const translateFix = text.align === 'center' ? '-50%' : text.align === 'right' ? '-100%' : '0%';
  const strokeWidth = Math.max(1, 2 * scale);

  return (
    <div
      ref={boxRef}
      className={`absolute select-none origin-center ${
        isSelected && !isEditing ? 'ring-2 ring-primary bg-primary/10 rounded cursor-move' : 'cursor-pointer'
      } ${isEditing ? 'z-50' : 'z-10'}`}
      style={{
        left: 0,
        top: 0,
        transform: `${transform} translate(${translateFix}, -50%)`, // 居中修正
        fontSize: text.fontSize * scale,
        fontWeight: text.fontWeight,
        color: text.color,
        textAlign: text.align,
        // 添加一点文字阴影模拟描边
        textShadow: `${-strokeWidth}px ${-strokeWidth}px 0 #000, ${strokeWidth}px ${-strokeWidth}px 0 #000, ${-strokeWidth}px ${strokeWidth}px 0 #000, ${strokeWidth}px ${strokeWidth}px 0 #000`,
        padding: `0 ${4 * scale}px`,
        whiteSpace: 'nowrap'
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={text.content}
          onChange={(e) => updateTextBox(text.id, { content: e.target.value })}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none w-auto min-w-[20px]"
          style={{
            color: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'inherit',
            textAlign: 'inherit',
            textShadow: 'inherit',
          }}
          // 给一个合理的宽度以输入
          size={Math.max(text.content.length, 1)}
        />
      ) : (
        text.content
      )}
    </div>
  );
}
