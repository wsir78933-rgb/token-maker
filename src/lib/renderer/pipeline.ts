// ============================================================
// 渲染引擎 — 统一渲染管线
// 预览和导出共用同一函数，仅输出尺寸不同
// ============================================================
import type { BorderTemplate, EditorState } from '@/types/editor';
import { getMaskById } from '@/lib/templates/masks';
import { getBorderById } from '@/lib/templates/borders';
import { createMaskPathWithInset } from './masks';
import { drawBorder } from './borders';
import { drawTextBoxes } from './text';
import { getCachedImage, preloadImageToCache } from '@/lib/utils/imageCache';
import { getLruCacheEntry, setLruCacheEntry } from '@/lib/utils/lruCache';
import { useEditorStore } from '@/lib/store/editor-store';

interface RenderTokenOptions {
  clipFinalOutputToMask?: boolean;
}

const IMAGE_BORDER_MASK_CACHE = new Map<string, HTMLCanvasElement>();
const MAX_IMAGE_BORDER_MASK_CACHE_ENTRIES = 16;
const BORDER_ALPHA_THRESHOLD = 8;
const BORDER_INSET_RATIO = 0.032;

function getBorderRenderInset(outputSize: number, border?: BorderTemplate): number {
  if (!border || border.type === 'none') return 1;
  return Math.max(1, outputSize * BORDER_INSET_RATIO);
}

function drawImageAssetWithInset(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  outputSize: number,
  inset: number
) {
  const drawSize = outputSize - inset * 2;
  ctx.drawImage(image, inset, inset, drawSize, drawSize);
}

function hasImageBasedBorder(border?: BorderTemplate): boolean {
  if (!border) return false;

  return Boolean(
    border.customImageUrl ||
    (border.type === 'image' && border.imageUrl)
  );
}

function forceRenderRefresh() {
  useEditorStore.setState((state) => ({ renderRevision: state.renderRevision + 1 }));
}

function getExplicitMaskImageUrl(border?: BorderTemplate): string | null {
  return border?.maskUrl || null;
}

function getDerivedBorderMaskImageUrl(border?: BorderTemplate): string | null {
  return border?.customImageUrl || border?.imageUrl || null;
}

function getSelectedBorder(state: EditorState) {
  return (
    getBorderById(state.selectedBorderId) ??
    state.customBorders.find((border) => border.id === state.selectedBorderId)
  );
}

export function getTokenRenderAssetUrls(state: EditorState): string[] {
  const border = getSelectedBorder(state);
  if (!border || border.type === 'none') return [];

  const urls = new Set<string>();
  const borderImageUrl = getDerivedBorderMaskImageUrl(border);
  if (hasImageBasedBorder(border) && borderImageUrl) {
    urls.add(borderImageUrl);
  }

  const explicitMaskUrl = getExplicitMaskImageUrl(border);
  if (explicitMaskUrl) {
    urls.add(explicitMaskUrl);
  }

  return Array.from(urls);
}

export async function preloadTokenRenderAssets(state: EditorState) {
  const urls = getTokenRenderAssetUrls(state);
  await Promise.all(urls.map((url) => preloadImageToCache(url)));
}

function applyMaskToCanvas(
  ctx: CanvasRenderingContext2D,
  state: EditorState,
  outputSize: number,
  border?: BorderTemplate
) {
  const inset = getBorderRenderInset(outputSize, border);
  const explicitMaskUrl = getExplicitMaskImageUrl(border);
  if (explicitMaskUrl) {
    const maskImage = getCachedImage(explicitMaskUrl, forceRenderRefresh);
    if (maskImage) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-in';
      drawImageAssetWithInset(ctx, maskImage, outputSize, inset);
      ctx.restore();
      return;
    }
  }

  const mask = getMaskById(state.selectedMaskId);
  if (!mask) return;

  ctx.save();
  ctx.globalCompositeOperation = 'destination-in';
  const path = createMaskPathWithInset(mask, outputSize, inset);
  ctx.fillStyle = '#ffffff';
  ctx.fill(path);
  ctx.restore();
}

function buildImageBorderMask(
  borderImage: HTMLImageElement,
  cacheKey: string,
  outputSize: number
): HTMLCanvasElement | null {
  const cachedMask = getLruCacheEntry(IMAGE_BORDER_MASK_CACHE, cacheKey);
  if (cachedMask) return cachedMask;

  const sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = outputSize;
  sourceCanvas.height = outputSize;
  const sourceCtx = sourceCanvas.getContext('2d', { willReadFrequently: true });
  if (!sourceCtx) return null;

  sourceCtx.clearRect(0, 0, outputSize, outputSize);
  const inset = getBorderRenderInset(outputSize, { id: 'image-border', name: '', type: 'image' });
  drawImageAssetWithInset(sourceCtx, borderImage, outputSize, inset);

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
  setLruCacheEntry(
    IMAGE_BORDER_MASK_CACHE,
    cacheKey,
    maskCanvas,
    MAX_IMAGE_BORDER_MASK_CACHE_ENTRIES
  );

  return maskCanvas;
}

function applyFinalMask(
  ctx: CanvasRenderingContext2D,
  state: EditorState,
  outputSize: number,
  border?: BorderTemplate
) {
  const inset = getBorderRenderInset(outputSize, border);
  const explicitMaskUrl = getExplicitMaskImageUrl(border);
  if (explicitMaskUrl) {
    const explicitMaskImage = getCachedImage(explicitMaskUrl, forceRenderRefresh);
    if (explicitMaskImage) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-in';
      drawImageAssetWithInset(ctx, explicitMaskImage, outputSize, inset);
      ctx.restore();
      return;
    }
  }

  if (!explicitMaskUrl) {
    const borderMaskImageUrl = getDerivedBorderMaskImageUrl(border);
    if (hasImageBasedBorder(border) && borderMaskImageUrl) {
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
  }

  const mask = getMaskById(state.selectedMaskId);
  if (!mask) return;

  ctx.save();
  ctx.globalCompositeOperation = 'destination-in';

  const path = createMaskPathWithInset(mask, outputSize, inset);
  ctx.fillStyle = '#ffffff';
  ctx.fill(path);
  ctx.restore();
}

function drawBorderContactShadow(
  ctx: CanvasRenderingContext2D,
  state: EditorState,
  outputSize: number,
  border?: BorderTemplate
) {
  if (!border || border.type === 'none') return;

  const maskId = border?.linkedMaskId ?? state.selectedMaskId;
  const mask = getMaskById(maskId);
  if (!mask) return;

  const inset = getBorderRenderInset(outputSize, border);
  const path = createMaskPathWithInset(mask, outputSize, inset);
  const shadowLineWidth = Math.max(12, outputSize * 0.05);
  const highlightLineWidth = Math.max(2, outputSize * 0.008);

  ctx.save();
  ctx.clip(path);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.lineWidth = shadowLineWidth;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.28)';
  ctx.shadowBlur = Math.max(6, outputSize * 0.02);
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = Math.max(2, outputSize * 0.01);
  ctx.stroke(path);

  const highlightGradient = ctx.createLinearGradient(0, 0, outputSize, outputSize);
  highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
  highlightGradient.addColorStop(0.28, 'rgba(255, 255, 255, 0.04)');
  highlightGradient.addColorStop(0.58, 'rgba(255, 255, 255, 0)');
  highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = highlightGradient;
  ctx.lineWidth = highlightLineWidth;
  ctx.stroke(path);
  ctx.restore();
}

/**
 * 统一渲染函数 —— 整个项目的核心
 *
 * 渲染步骤：
 * 1. 根据 Mask 创建裁切路径
 * 2. 绘制主图（应用位移和缩放）
 * 3. 应用 Overlay（带 tint 和 opacity）
 * 4. 绘制边框（带 tint 和 opacity）
 * 5. （阶段二）绘制文字
 * 6. 输出最终 Canvas
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
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.clearRect(0, 0, outputSize, outputSize);

  const border = getSelectedBorder(state);

  const baseLayer = document.createElement('canvas');
  baseLayer.width = outputSize;
  baseLayer.height = outputSize;
  const baseCtx = baseLayer.getContext('2d');
  if (!baseCtx) return;
  baseCtx.imageSmoothingEnabled = true;
  baseCtx.imageSmoothingQuality = 'high';

  // ------- Step 1 & 2: 裁切 + 主图 -------
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

    baseCtx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }

  // ------- Step 3: Overlay -------
  if (state.overlayOpacity > 0) {
    baseCtx.globalAlpha = state.overlayOpacity;
    baseCtx.fillStyle = state.overlayTint;
    baseCtx.fillRect(0, 0, outputSize, outputSize);
    baseCtx.globalAlpha = 1.0;
  }

  applyMaskToCanvas(baseCtx, state, outputSize, border);
  ctx.drawImage(baseLayer, 0, 0);

  drawBorderContactShadow(ctx, state, outputSize, border);

  // ------- Step 4: 边框 -------
  if (border && border.type !== 'none') {
    drawBorder(
      ctx,
      border,
      outputSize,
      state.borderTint,
      state.borderOpacity,
      state.imageBorderTintEnabled
    );
  }

  if (options.clipFinalOutputToMask) {
    applyFinalMask(ctx, state, outputSize, border);
  }

  // ------- Step 5: 文字 -------
  drawTextBoxes(ctx, state.textBoxes, outputSize);
}

/**
 * 导出 Token 为 PNG Blob
 */
export async function exportTokenAsPNG(
  state: EditorState,
  exportSize: number
): Promise<Blob | null> {
  try {
    await preloadTokenRenderAssets(state);
  } catch (error) {
    console.warn('Failed to preload token render assets.', error);
    return null;
  }

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
