// ============================================================
// 渲染引擎 — 文本绘制
// 负责在最终的 Canvas 上绘制所有文本层
// ============================================================
import type { TextBox } from '@/types/editor';
import {
  getEditorFontCanvasShorthand,
  resolveEditorFontId,
} from '@/lib/editor-fonts/catalog';

/**
 * 在 Canvas 上绘制所有文本框
 * @param ctx 画布上下文
 * @param textBoxes 文本框数组
 * @param size 实际输出的画布边长
 * @param previewSize 原始编辑时的参考坐标系边长 (默认为 512)
 */
export function drawTextBoxes(
  ctx: CanvasRenderingContext2D,
  textBoxes: TextBox[],
  size: number,
  previewSize: number = 512
): void {
  if (!textBoxes || textBoxes.length === 0) return;

  const scaleFactor = size / previewSize;

  ctx.save();
  for (const text of textBoxes) {
    // 换算到实际输出尺寸
    const x = text.x * scaleFactor;
    const y = text.y * scaleFactor;
    const fontSize = text.fontSize * scaleFactor;

    ctx.font = getEditorFontCanvasShorthand(
      resolveEditorFontId(text.fontId),
      text.fontWeight,
      fontSize,
    );
    ctx.fillStyle = text.color;
    ctx.textAlign = text.align;
    ctx.textBaseline = 'middle'; // 方便对齐坐标

    // 绘制描边以提升可读性
    ctx.lineWidth = Math.max(2, size * 0.005);
    ctx.strokeStyle = '#000000';
    ctx.strokeText(text.content, x, y);

    // 绘制填充
    ctx.fillText(text.content, x, y);
  }
  ctx.restore();
}
