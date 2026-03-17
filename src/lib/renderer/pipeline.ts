// ============================================================
// 渲染引擎 — 统一渲染管线
// 预览和导出共用同一函数，仅输出尺寸不同
// ============================================================
import type { BorderTemplate, EditorState } from '@/types/editor';
import { getMaskById } from '@/lib/templates/masks';
import { getBorderById } from '@/lib/templates/borders';
import { createMaskPath } from './masks';
import { drawBorder } from './borders';
import { drawTextBoxes } from './text';
import { getCachedImage } from '@/lib/utils/imageCache';
import { useEditorStore } from '@/lib/store/editor-store';

interface RenderTokenOptions {
  clipFinalOutputToMask?: boolean;
}

const IMAGE_BORDER_MASK_CACHE = new Map<string, HTMLCanvasElement>();
const BORDER_ALPHA_THRESHOLD = 8;

function forceRenderRefresh() {
  useEditorStore.setState({ activePresetId: useEditorStore.getState().activePresetId });
}

function getBorderMaskImageUrl(border?: BorderTemplate): string | null {
  return border?.customImageUrl || border?.imageUrl || null;
}

function buildImageBorderMask(
  borderImage: HTMLImageElement,
  cacheKey: string,
  outputSize: number
): HTMLCanvasElement | null {
  const cachedMask = IMAGE_BORDER_MASK_CACHE.get(cacheKey);
  if (cachedMask) return cachedMask;

  const sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = outputSize;
  sourceCanvas.height = outputSize;
  const sourceCtx = sourceCanvas.getContext('2d', { willReadFrequently: true });
  if (!sourceCtx) return null;

  sourceCtx.clearRect(0, 0, outputSize, outputSize);
  sourceCtx.drawImage(borderImage, 0, 0, outputSize, outputSize);

  const sourceImageData = sourceCtx.getImageData(0, 0, outputSize, outputSize);
  const { data } = sourceImageData;
  const pixelCount = outputSize * outputSize;
  const outsidePixels = new Uint8Array(pixelCount);
  const queue = new Uint32Array(pixelCount);
  let head = 0;
  let tail = 0;

  const isTransparent = (index: number) => data[index * 4 + 3] <= BORDER_ALPHA_THRESHOLD;
  const tryEnqueue = (index: number) => {
    if (outsidePixels[index] || !isTransparent(index)) return;
    outsidePixels[index] = 1;
    queue[tail++] = index;
  };

  for (let x = 0; x < outputSize; x += 1) {
    tryEnqueue(x);
    tryEnqueue((outputSize - 1) * outputSize + x);
  }

  for (let y = 1; y < outputSize - 1; y += 1) {
    tryEnqueue(y * outputSize);
    tryEnqueue(y * outputSize + outputSize - 1);
  }

  while (head < tail) {
    const index = queue[head++];
    const x = index % outputSize;

    if (x > 0) tryEnqueue(index - 1);
    if (x < outputSize - 1) tryEnqueue(index + 1);
    if (index >= outputSize) tryEnqueue(index - outputSize);
    if (index < pixelCount - outputSize) tryEnqueue(index + outputSize);
  }

  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = outputSize;
  maskCanvas.height = outputSize;
  const maskCtx = maskCanvas.getContext('2d');
  if (!maskCtx) return null;

  const maskImageData = maskCtx.createImageData(outputSize, outputSize);
  const maskData = maskImageData.data;

  for (let index = 0; index < pixelCount; index += 1) {
    const offset = index * 4;
    const borderAlpha = data[offset + 3];
    const isEnclosedArea = outsidePixels[index] === 0;

    if (!isEnclosedArea && borderAlpha <= BORDER_ALPHA_THRESHOLD) {
      continue;
    }

    maskData[offset] = 255;
    maskData[offset + 1] = 255;
    maskData[offset + 2] = 255;
    maskData[offset + 3] = 255;
  }

  maskCtx.putImageData(maskImageData, 0, 0);
  IMAGE_BORDER_MASK_CACHE.set(cacheKey, maskCanvas);

  return maskCanvas;
}

function applyFinalMask(
  ctx: CanvasRenderingContext2D,
  state: EditorState,
  outputSize: number,
  border?: BorderTemplate
) {
  const borderMaskImageUrl = getBorderMaskImageUrl(border);
  if (borderMaskImageUrl) {
    const borderImage = getCachedImage(borderMaskImageUrl, forceRenderRefresh);
    if (borderImage) {
      const maskCanvas = buildImageBorderMask(
        borderImage,
        `${borderMaskImageUrl}::${outputSize}`,
        outputSize
      );

      if (maskCanvas) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(maskCanvas, 0, 0);
        ctx.restore();
        return;
      }
    }
  }

  let mask = getMaskById(state.selectedMaskId);
  if (!mask) mask = state.customMasks.find((item) => item.id === state.selectedMaskId);
  if (!mask) return;

  ctx.save();
  ctx.globalCompositeOperation = 'destination-in';

  if (!mask.isCustom) {
    const path = createMaskPath(mask, outputSize);
    ctx.fillStyle = '#ffffff';
    ctx.fill(path);
    ctx.restore();
    return;
  }

  if (!mask.customImageUrl) {
    ctx.restore();
    return;
  }

  const maskImage = getCachedImage(mask.customImageUrl, forceRenderRefresh);
  if (maskImage) {
    ctx.drawImage(maskImage, 0, 0, outputSize, outputSize);
  }

  ctx.restore();
}

/**
 * 统一渲染函数 —— 整个项目的核心
 *
 * 渲染步骤：
 * 1. 填充背景色
 * 2. 根据 Mask 创建裁切路径
 * 3. 绘制主图（应用位移和缩放）
 * 4. 应用 Overlay（带 tint 和 opacity）
 * 5. 绘制边框（带 tint 和 opacity）
 * 6. （阶段二）绘制文字
 * 7. 输出最终 Canvas
 *
 * @param canvas 目标 Canvas 元素
 * @param state 编辑器状态
 * @param outputSize 输出尺寸（预览 512，导出时自定义）
 */
export function renderToken(
  canvas: HTMLCanvasElement,
  state: EditorState,
  outputSize: number,
  options: RenderTokenOptions = {}
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = outputSize;
  canvas.height = outputSize;
  ctx.clearRect(0, 0, outputSize, outputSize);

  let mask = getMaskById(state.selectedMaskId);
  if (!mask) mask = state.customMasks.find((m) => m.id === state.selectedMaskId);

  let border = getBorderById(state.selectedBorderId);
  if (!border) border = state.customBorders.find((b) => b.id === state.selectedBorderId);

  ctx.save();
  
  // 如果是标准路径遮罩，首先设置 clip 以裁剪背景和图片
  if (mask && !mask.isCustom) {
    const bgPath = createMaskPath(mask, outputSize);
    ctx.clip(bgPath);
  }

  // ------- Step 1: 背景 -------
  ctx.fillStyle = state.backgroundColor;
  ctx.fillRect(0, 0, outputSize, outputSize);

  // ------- Step 2 & 3: 裁切 + 主图 -------
  if (state.imageElement) {
    // 计算图片绘制参数
    const scaleFactor = outputSize / 512;
    const img = state.imageElement;

    const imgAspect = img.naturalWidth / img.naturalHeight;
    let drawWidth: number, drawHeight: number;
    if (imgAspect > 1) {
      drawHeight = outputSize * state.imageScale;
      drawWidth = drawHeight * imgAspect;
    } else {
      drawWidth = outputSize * state.imageScale;
      drawHeight = drawWidth / imgAspect;
    }

    const drawX = (outputSize - drawWidth) / 2 + state.imageOffsetX * scaleFactor;
    const drawY = (outputSize - drawHeight) / 2 + state.imageOffsetY * scaleFactor;

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }

  // ------- Step 4: Overlay -------
  if (state.overlayOpacity > 0) {
    ctx.globalAlpha = state.overlayOpacity;
    ctx.fillStyle = state.overlayTint;
    ctx.fillRect(0, 0, outputSize, outputSize);
    ctx.globalAlpha = 1.0;
  }

  ctx.restore(); // 释放标准路径 clip

  // ------- Custom Mask 切除 -------
  // 如果使用图片做 Mask，使用 destination-in (保留重叠的部分，即 Mask 非透明区)
  if (mask && mask.isCustom && mask.customImageUrl) {
    const maskImg = getCachedImage(mask.customImageUrl, forceRenderRefresh);
    if (maskImg) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(maskImg, 0, 0, outputSize, outputSize);
      ctx.restore();
    }
  }

  // ------- Step 5: 边框 -------
  if (border && border.type !== 'none') {
    drawBorder(ctx, border, outputSize, state.borderTint, state.borderOpacity);
  }

  if (options.clipFinalOutputToMask) {
    applyFinalMask(ctx, state, outputSize, border);
  }

  // ------- Step 6: 文字 -------
  drawTextBoxes(ctx, state.textBoxes, outputSize);
}

/**
 * 导出 Token 为 PNG Blob
 */
export async function exportTokenAsPNG(
  state: EditorState,
  exportSize: number
): Promise<Blob | null> {
  const offscreen = document.createElement('canvas');
  renderToken(offscreen, state, exportSize, { clipFinalOutputToMask: true });

  return new Promise((resolve) => {
    offscreen.toBlob(
      (blob) => resolve(blob),
      'image/png',
      1.0
    );
  });
}

/**
 * 绘制棋盘格背景（用于预览区域显示透明）
 */
export function drawCheckerboard(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cellSize: number = 16,
  color1: string = '#1a1a2e',
  color2: string = '#16162a'
): void {
  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      const isEven = ((x / cellSize) + (y / cellSize)) % 2 === 0;
      ctx.fillStyle = isEven ? color1 : color2;
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  }
}
