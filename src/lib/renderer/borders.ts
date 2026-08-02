// ============================================================
// 渲染引擎 — 高级 2.5D 边框绘制
// 具有光影、金属材质渐变和立体投影倒角
// ============================================================
import type { BorderTemplate } from '@/types/editor';
import { generatePolygonPoints } from './masks';
import { getCachedImage } from '@/lib/utils/imageCache';
import { getLruCacheEntry, setLruCacheEntry } from '@/lib/utils/lruCache';

const IMAGE_BORDER_TINT_CACHE = new Map<string, HTMLCanvasElement>();
const BORDER_DEPTH_CACHE = new Map<string, HTMLCanvasElement>();
const BORDER_EDGE_MASK_CACHE = new Map<string, HTMLCanvasElement>();
const MAX_IMAGE_BORDER_TINT_CACHE_ENTRIES = 12;
const MAX_BORDER_DEPTH_CACHE_ENTRIES = 24;
const MAX_BORDER_EDGE_MASK_CACHE_ENTRIES = 48;
const BORDER_INSET_RATIO = 0.032;

function clampDepthStrength(depthStrength: number = 1): number {
  return Math.max(0, Math.min(1, depthStrength));
}

function scaledRgba(red: number, green: number, blue: number, alpha: number, strength: number): string {
  return `rgba(${red}, ${green}, ${blue}, ${(alpha * strength).toFixed(3)})`;
}

function getBorderRenderInset(
  size: number,
  borderType: BorderTemplate['type'],
  borderInsetRatio: number = BORDER_INSET_RATIO
): number {
  if (borderType === 'none') return 1;
  return Math.max(1, size * borderInsetRatio);
}

function createSquareCanvas(size: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }
  return canvas;
}

function buildDirectionalEdgeMask(
  source: CanvasImageSource,
  size: number,
  cacheKey: string,
  offsetX: number,
  offsetY: number
): HTMLCanvasElement {
  const cached = getLruCacheEntry(BORDER_EDGE_MASK_CACHE, cacheKey);
  if (cached) return cached;

  const canvas = createSquareCanvas(size);
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(source, 0, 0, size, size);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.drawImage(source, offsetX, offsetY, size, size);

  setLruCacheEntry(
    BORDER_EDGE_MASK_CACHE,
    cacheKey,
    canvas,
    MAX_BORDER_EDGE_MASK_CACHE_ENTRIES
  );
  return canvas;
}

function tintMaskCanvas(
  maskCanvas: HTMLCanvasElement,
  size: number,
  painter: (ctx: CanvasRenderingContext2D) => void
): HTMLCanvasElement {
  const canvas = createSquareCanvas(size);
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.drawImage(maskCanvas, 0, 0);
  ctx.globalCompositeOperation = 'source-in';
  painter(ctx);
  return canvas;
}

function buildDepthComposedBorder(
  size: number,
  cacheKey: string,
  renderBase: (ctx: CanvasRenderingContext2D) => void,
  depthStrength: number = 1
): HTMLCanvasElement {
  const strength = clampDepthStrength(depthStrength);
  const depthCacheKey = `${cacheKey}::depth-${strength.toFixed(2)}`;
  const cached = getLruCacheEntry(BORDER_DEPTH_CACHE, depthCacheKey);
  if (cached) return cached;

  const baseCanvas = createSquareCanvas(size);
  const baseCtx = baseCanvas.getContext('2d');
  if (!baseCtx) return baseCanvas;
  renderBase(baseCtx);

  const composedCanvas = createSquareCanvas(size);
  const composedCtx = composedCanvas.getContext('2d');
  if (!composedCtx) return baseCanvas;

  composedCtx.drawImage(baseCanvas, 0, 0);

  if (strength > 0) {
    composedCtx.save();
    composedCtx.globalCompositeOperation = 'source-atop';

    const directionalLight = composedCtx.createLinearGradient(
      size * 0.1,
      size * 0.08,
      size * 0.9,
      size * 0.92
    );
    directionalLight.addColorStop(0, scaledRgba(255, 255, 255, 0.2, strength));
    directionalLight.addColorStop(0.18, scaledRgba(255, 255, 255, 0.24, strength));
    directionalLight.addColorStop(0.44, scaledRgba(255, 255, 255, 0.04, strength));
    directionalLight.addColorStop(0.68, scaledRgba(0, 0, 0, 0.14, strength));
    directionalLight.addColorStop(1, scaledRgba(0, 0, 0, 0.34, strength));
    composedCtx.fillStyle = directionalLight;
    composedCtx.fillRect(0, 0, size, size);

    const volumeGradient = composedCtx.createRadialGradient(
      size * 0.34,
      size * 0.28,
      size * 0.08,
      size * 0.64,
      size * 0.7,
      size * 0.82
    );
    volumeGradient.addColorStop(0, scaledRgba(255, 255, 255, 0.22, strength));
    volumeGradient.addColorStop(0.18, scaledRgba(255, 255, 255, 0.12, strength));
    volumeGradient.addColorStop(0.58, scaledRgba(0, 0, 0, 0.08, strength));
    volumeGradient.addColorStop(1, scaledRgba(0, 0, 0, 0.26, strength));
    composedCtx.fillStyle = volumeGradient;
    composedCtx.fillRect(0, 0, size, size);
    composedCtx.restore();

    const edgeShift = Math.max(1, Math.round(size * 0.016 * strength));
    const highlightMask = buildDirectionalEdgeMask(
      baseCanvas,
      size,
      `${depthCacheKey}::highlight::${edgeShift}`,
      edgeShift,
      edgeShift
    );
    const shadowMask = buildDirectionalEdgeMask(
      baseCanvas,
      size,
      `${depthCacheKey}::shadow::${edgeShift}`,
      -edgeShift,
      -edgeShift
    );

    const highlightCanvas = tintMaskCanvas(highlightMask, size, (ctx) => {
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, scaledRgba(255, 255, 255, 0.82, strength));
      gradient.addColorStop(0.28, scaledRgba(255, 255, 255, 0.34, strength));
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    });

    const shadowCanvas = tintMaskCanvas(shadowMask, size, (ctx) => {
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(0.42, scaledRgba(0, 0, 0, 0.28, strength));
      gradient.addColorStop(1, scaledRgba(0, 0, 0, 0.56, strength));
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    });

    composedCtx.drawImage(shadowCanvas, 0, 0);
    composedCtx.drawImage(highlightCanvas, 0, 0);
  }

  setLruCacheEntry(BORDER_DEPTH_CACHE, depthCacheKey, composedCanvas, MAX_BORDER_DEPTH_CACHE_ENTRIES);
  return composedCanvas;
}

function drawDepthComposedBorder(
  ctx: CanvasRenderingContext2D,
  size: number,
  cacheKey: string,
  renderBase: (ctx: CanvasRenderingContext2D) => void,
  depthStrength: number = 1
) {
  const strength = clampDepthStrength(depthStrength);
  const depthCanvas = buildDepthComposedBorder(size, cacheKey, renderBase, strength);

  if (strength > 0) {
    ctx.save();
    ctx.globalAlpha *= strength;
    ctx.shadowColor = scaledRgba(0, 0, 0, 0.34, strength);
    ctx.shadowBlur = Math.max(4, size * 0.03 * strength);
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = Math.max(1, size * 0.016 * strength);
    ctx.drawImage(depthCanvas, 0, 0, size, size);
    ctx.restore();
  }

  ctx.drawImage(depthCanvas, 0, 0, size, size);
}

function drawImageBorderWithDepth(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  size: number,
  cacheKey: string,
  depthStrength: number = 1,
  borderInsetRatio: number = BORDER_INSET_RATIO
) {
  drawDepthComposedBorder(ctx, size, cacheKey, (baseCtx) => {
    const inset = getBorderRenderInset(size, 'image', borderInsetRatio);
    const drawSize = size - inset * 2;
    baseCtx.drawImage(image, inset, inset, drawSize, drawSize);
  }, depthStrength);
}

/**
 * 颜色变暗或变亮辅助函数
 */
function shadeColor(color: string, percent: number): string {
  // 处理六位 HEX，不处理其他奇怪格式
  if (color.startsWith('#') && color.length === 7) {
    let R = parseInt(color.substring(1,3), 16);
    let G = parseInt(color.substring(3,5), 16);
    let B = parseInt(color.substring(5,7), 16);

    R = parseInt(((R * (100 + percent)) / 100).toString());
    G = parseInt(((G * (100 + percent)) / 100).toString());
    B = parseInt(((B * (100 + percent)) / 100).toString());

    R = R < 255 ? R : 255;  
    G = G < 255 ? G : 255;  
    B = B < 255 ? B : 255;  
    R = R > 0 ? R : 0;
    G = G > 0 ? G : 0;
    B = B > 0 ? B : 0;

    const RR = (R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16));
    const GG = (G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16));
    const BB = (B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
  }
  return color;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function parseHexColor(color: string): { r: number; g: number; b: number } | null {
  const normalized = color.trim().replace('#', '');
  if (/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return {
      r: parseInt(normalized.slice(0, 2), 16),
      g: parseInt(normalized.slice(2, 4), 16),
      b: parseInt(normalized.slice(4, 6), 16),
    };
  }

  if (/^[0-9a-fA-F]{3}$/.test(normalized)) {
    return {
      r: parseInt(normalized[0] + normalized[0], 16),
      g: parseInt(normalized[1] + normalized[1], 16),
      b: parseInt(normalized[2] + normalized[2], 16),
    };
  }

  return null;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const nr = r / 255;
  const ng = g / 255;
  const nb = b / 255;
  const max = Math.max(nr, ng, nb);
  const min = Math.min(nr, ng, nb);
  const lightness = (max + min) / 2;

  if (max === min) {
    return [0, 0, lightness];
  }

  const delta = max - min;
  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

  let hue = 0;
  switch (max) {
    case nr:
      hue = (ng - nb) / delta + (ng < nb ? 6 : 0);
      break;
    case ng:
      hue = (nb - nr) / delta + 2;
      break;
    default:
      hue = (nr - ng) / delta + 4;
      break;
  }

  return [hue / 6, saturation, lightness];
}

function hueToRgb(p: number, q: number, t: number): number {
  let nextT = t;
  if (nextT < 0) nextT += 1;
  if (nextT > 1) nextT -= 1;
  if (nextT < 1 / 6) return p + (q - p) * 6 * nextT;
  if (nextT < 1 / 2) return q;
  if (nextT < 2 / 3) return p + (q - p) * (2 / 3 - nextT) * 6;
  return p;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const value = Math.round(l * 255);
    return [value, value, value];
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return [
    Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
    Math.round(hueToRgb(p, q, h) * 255),
    Math.round(hueToRgb(p, q, h - 1 / 3) * 255),
  ];
}

function getTintedImageBorder(
  borderImage: HTMLImageElement,
  cacheKey: string,
  size: number,
  tint: string,
  tintMode: 'solid' | 'metallic' | 'screen' = 'metallic'
): HTMLCanvasElement | null {
  const cached = getLruCacheEntry(IMAGE_BORDER_TINT_CACHE, cacheKey);
  if (cached) return cached;

  const tintRgb = parseHexColor(tint);
  if (!tintRgb) return null;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  try {
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(borderImage, 0, 0, size, size);

    const imageData = ctx.getImageData(0, 0, size, size);
    const { data } = imageData;
    const [tintHue, tintSaturation, tintLightness] = rgbToHsl(
      tintRgb.r,
      tintRgb.g,
      tintRgb.b
    );
    const metallicColorCache = new Map<number, [number, number, number]>();

    for (let index = 0; index < data.length; index += 4) {
      const alpha = data[index + 3];
      if (alpha === 0) continue;

      if (tintMode === 'screen') {
        const originalL = (0.2126 * data[index] + 0.7152 * data[index + 1] + 0.0722 * data[index + 2]) / 255;
        
        // 核心底色：将 TFF 材质常见的 0.9 亮度直接映射为 1.0 (纯用户自选色)
        // 保证哪怕选择了极高纯度/低亮度的颜色，在主体像素上也能100%还原饱和度
        const baseMultiplier = Math.min(1.0, originalL / 0.9);
        const baseR = tintRgb.r * baseMultiplier;
        const baseG = tintRgb.g * baseMultiplier;
        const baseB = tintRgb.b * baseMultiplier;
        
        // 剔除泛白污染：仅当亮度极高(>0.8)时，才增加高光。
        // 用立方曲线使其过渡极度圆滑，保证它只在叶尖/鳞片反光点上闪烁，不冲淡主体颜色。
        let H = 0;
        if (originalL > 0.8) {
          const normalized = (originalL - 0.8) / 0.2;
          H = Math.pow(normalized, 3) * 0.45; // 最亮处保留 45% 的白光
        }
        
        data[index] = Math.min(255, Math.round(baseR + H * (255 - baseR)));
        data[index + 1] = Math.min(255, Math.round(baseG + H * (255 - baseG)));
        data[index + 2] = Math.min(255, Math.round(baseB + H * (255 - baseB)));
        continue;
      }

      if (tintMode === 'solid') {
        const luminance = (0.2126 * data[index] + 0.7152 * data[index + 1] + 0.0722 * data[index + 2]) / 255;
        data[index] = Math.round(luminance * tintRgb.r);
        data[index + 1] = Math.round(luminance * tintRgb.g);
        data[index + 2] = Math.round(luminance * tintRgb.b);
        continue;
      }

      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const colorKey = (red << 16) | (green << 8) | blue;
      const cachedColor = metallicColorCache.get(colorKey);
      if (cachedColor) {
        data[index] = cachedColor[0];
        data[index + 1] = cachedColor[1];
        data[index + 2] = cachedColor[2];
        continue;
      }

      const [, , sourceLightness] = rgbToHsl(red, green, blue);
      const sourceLuminance =
        (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

      const detailLightness = clamp01(
        sourceLightness * 0.72 + sourceLuminance * 0.28
      );
      const recoloredSaturation = clamp01(
        tintSaturation * 0.9 + (1 - detailLightness) * 0.06
      );
      const recoloredLightness = clamp01(
        detailLightness * 0.88 + tintLightness * 0.12
      );

      const [nextRed, nextGreen, nextBlue] = hslToRgb(
        tintHue,
        recoloredSaturation,
        recoloredLightness
      );

      const highlightStrength = Math.max(0, sourceLuminance - 0.74) / 0.26;

      const finalRed = Math.round(nextRed + (255 - nextRed) * highlightStrength * 0.3);
      const finalGreen = Math.round(
        nextGreen + (255 - nextGreen) * highlightStrength * 0.3
      );
      const finalBlue = Math.round(nextBlue + (255 - nextBlue) * highlightStrength * 0.3);
      metallicColorCache.set(colorKey, [finalRed, finalGreen, finalBlue]);
      data[index] = finalRed;
      data[index + 1] = finalGreen;
      data[index + 2] = finalBlue;
    }

    ctx.putImageData(imageData, 0, 0);
    setLruCacheEntry(
      IMAGE_BORDER_TINT_CACHE,
      cacheKey,
      canvas,
      MAX_IMAGE_BORDER_TINT_CACHE_ENTRIES
    );
    return canvas;
  } catch (error) {
    console.warn('Failed to tint border image, using original image instead.', error);
    return null;
  }
}

/**
 * 创建高亮材质渐变 (Conic) 模拟金属质感
 */
function createMetallicGradient(ctx: CanvasRenderingContext2D, cx: number, cy: number, tint: string): CanvasGradient {
  const light = shadeColor(tint, 70); // 高光
  const mid = tint;
  const dark = shadeColor(tint, -50); // 阴影

  if (typeof ctx.createConicGradient === 'function') {
    const gradient = ctx.createConicGradient(Math.PI / 4, cx, cy);
    gradient.addColorStop(0, light);
    gradient.addColorStop(0.15, mid);
    gradient.addColorStop(0.25, dark);
    gradient.addColorStop(0.35, mid);
    gradient.addColorStop(0.5, light);
    gradient.addColorStop(0.65, mid);
    gradient.addColorStop(0.75, dark);
    gradient.addColorStop(0.85, mid);
    gradient.addColorStop(1.0, light);
    return gradient;
  }
  
  // 降级线性
  const gradient = ctx.createLinearGradient(0, 0, cx * 2, cy * 2);
  gradient.addColorStop(0, light);
  gradient.addColorStop(0.5, dark);
  gradient.addColorStop(1, light);
  return gradient;
}

/**
 * 2.5D 一体化 fill 方法 
 * 应用外阴影底色、金属材质和高亮边缘
 */
function fillWithBevel(
  ctx: CanvasRenderingContext2D, 
  cx: number, cy: number, size: number, 
  tint: string, 
  createPath: () => void
) {
  // 1. 底层：深色并带有超强外发光/投影
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = Math.max(10, size * 0.04);
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = size * 0.02;
  ctx.fillStyle = shadeColor(tint, -80); // 极黑色打底
  createPath();
  ctx.fill();
  ctx.restore();

  // 2. 主层：金属质感渐变
  ctx.save();
  ctx.fillStyle = createMetallicGradient(ctx, cx, cy, tint);
  createPath();
  ctx.fill();
  ctx.restore();

  // 3. 顶层：内发光倒角边缘（Stroke 模拟）
  ctx.save();
  ctx.lineWidth = Math.max(1, size * 0.005);
  
  // 从左上角到右下角的线型高光，产生立体凹凸感
  const highlightGrad = ctx.createLinearGradient(0, 0, cx * 2, cy * 2);
  highlightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)'); // 左上高光
  highlightGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0)');
  highlightGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0)'); 
  highlightGrad.addColorStop(1, 'rgba(0, 0, 0, 0.7)'); // 右下阴影
  
  ctx.strokeStyle = highlightGrad;
  createPath(); 
  ctx.stroke();
  ctx.restore();
}

/**
 * 在 Canvas 上绘制边框
 */
export function drawBorder(
  ctx: CanvasRenderingContext2D,
  border: BorderTemplate,
  size: number,
  tint: string,
  opacity: number,
  tintImageBorder: boolean = true,
  onAssetChange?: () => void,
  borderInsetRatio: number = BORDER_INSET_RATIO
): void {
  if (border.type === 'none') return;

  ctx.save();
  ctx.globalAlpha = opacity;

  // 自定义图片或系统内置图片边框处理
  if ((border.isCustom && border.customImageUrl) || border.type === 'image') {
    const url = border.customImageUrl || border.imageUrl;
    if (!url) {
      ctx.restore();
      return;
    }
    const img = getCachedImage(url, onAssetChange);
    if (img) {
      const borderImage = tintImageBorder
        ? getTintedImageBorder(
            img,
            `${url}::${size}::${tint.toLowerCase()}::${border.tintMode || 'metallic'}`,
            size,
            tint,
            border.tintMode
          ) ?? img
        : img;

      drawImageBorderWithDepth(
        ctx,
        borderImage,
        size,
        `${url}::${size}::${tint.toLowerCase()}::${tintImageBorder ? border.tintMode || 'original' : 'untinted'}::${borderInsetRatio}`,
        border.depthStrength,
        borderInsetRatio
      );
    }
    ctx.restore();
    return;
  }

  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size / 2 - getBorderRenderInset(size, border.type, borderInsetRatio);

  switch (border.type) {
    case 'ring':
      drawRing(ctx, cx, cy, maxRadius, border, tint, size);
      break;
    case 'flat-ring':
      drawFlatRing(ctx, cx, cy, maxRadius, border, tint, borderInsetRatio);
      break;
    case 'flat-double-ring':
      drawFlatDoubleRing(ctx, cx, cy, maxRadius, border, tint, borderInsetRatio);
      break;
    case 'flat-polygon':
      drawFlatPolygonBorder(ctx, cx, cy, maxRadius, border, tint, borderInsetRatio);
      break;
    case 'double-ring':
      drawDoubleRing(ctx, cx, cy, maxRadius, border, tint, size);
      break;
    case 'polygon':
      drawPolygonBorder(ctx, cx, cy, maxRadius, border, tint, size);
      break;
    case 'spike':
      drawSpikeRing(ctx, cx, cy, maxRadius, border, tint, size);
      break;
    case 'abstract':
      drawAbstractRing(ctx, cx, cy, maxRadius, border, tint, size);
      break;
  }

  ctx.restore();
}

/** 绘制单环 */
function drawRing(
  ctx: CanvasRenderingContext2D, cx: number, cy: number, maxRadius: number,
  border: BorderTemplate, tint: string, size: number
): void {
  const outer = maxRadius * (border.outerRadius ?? 1);
  const inner = maxRadius * (border.innerRadius ?? 0.9);

  const createPath = () => {
    ctx.beginPath();
    ctx.arc(cx, cy, outer, 0, Math.PI * 2);
    ctx.arc(cx, cy, inner, 0, Math.PI * 2, true);
    ctx.closePath();
  };

  fillWithBevel(ctx, cx, cy, size, tint, createPath);
}

/** 绘制更接近 RollAdvantage 默认 plain_ring_1 的平面细环 */
function drawFlatRing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  maxRadius: number,
  border: BorderTemplate,
  tint: string,
  borderInsetRatio: number
): void {
  const outer = maxRadius * (border.outerRadius ?? 1);
  const inner = maxRadius * (border.innerRadius ?? 0.946);
  drawDepthComposedBorder(
    ctx,
    Math.round(cx * 2),
    `${border.id}::flat-ring::${Math.round(cx * 2)}::${tint.toLowerCase()}::${inner.toFixed(3)}::${outer.toFixed(3)}::${borderInsetRatio}`,
    (baseCtx) => {
      baseCtx.beginPath();
      baseCtx.arc(cx, cy, outer, 0, Math.PI * 2);
      baseCtx.arc(cx, cy, inner, 0, Math.PI * 2, true);
      baseCtx.closePath();
      baseCtx.fillStyle = tint;
      baseCtx.fill();
    }
  );
}

/** 绘制平面双环 */
function drawFlatDoubleRing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  maxRadius: number,
  border: BorderTemplate,
  tint: string,
  borderInsetRatio: number
): void {
  const sw = maxRadius * (border.strokeWidth ?? 0.03);
  const innerOuter = maxRadius * (border.innerRadius ?? 0.89);
  const innerInner = Math.max(0, innerOuter - sw);
  drawDepthComposedBorder(
    ctx,
    Math.round(cx * 2),
    `${border.id}::flat-double-ring::${Math.round(cx * 2)}::${tint.toLowerCase()}::${sw.toFixed(3)}::${innerOuter.toFixed(3)}::${borderInsetRatio}`,
    (baseCtx) => {
      baseCtx.beginPath();
      baseCtx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
      baseCtx.arc(cx, cy, maxRadius - sw, 0, Math.PI * 2, true);
      baseCtx.closePath();
      baseCtx.fillStyle = tint;
      baseCtx.fill();

      baseCtx.beginPath();
      baseCtx.arc(cx, cy, innerOuter, 0, Math.PI * 2);
      baseCtx.arc(cx, cy, innerInner, 0, Math.PI * 2, true);
      baseCtx.closePath();
      baseCtx.fillStyle = tint;
      baseCtx.fill();
    }
  );
}

/** 绘制平面多边形边框 */
function drawFlatPolygonBorder(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  maxRadius: number,
  border: BorderTemplate,
  tint: string,
  borderInsetRatio: number
): void {
  const sides = border.sides ?? 6;
  const sw = (border.strokeWidth ?? 0.05) * maxRadius;
  const rotation = sides === 4 ? -Math.PI / 4 : -Math.PI / 2;
  const outerPoints = generatePolygonPoints(cx, cy, maxRadius, sides, rotation);
  const innerPoints = generatePolygonPoints(cx, cy, Math.max(0, maxRadius - sw), sides, rotation);
  drawDepthComposedBorder(
    ctx,
    Math.round(cx * 2),
    `${border.id}::flat-polygon::${Math.round(cx * 2)}::${tint.toLowerCase()}::${sides}::${sw.toFixed(3)}::${borderInsetRatio}`,
    (baseCtx) => {
      baseCtx.beginPath();
      baseCtx.moveTo(outerPoints[0][0], outerPoints[0][1]);
      for (let i = 1; i < outerPoints.length; i++) {
        baseCtx.lineTo(outerPoints[i][0], outerPoints[i][1]);
      }
      baseCtx.closePath();

      baseCtx.moveTo(innerPoints[0][0], innerPoints[0][1]);
      for (let i = innerPoints.length - 1; i >= 0; i--) {
        baseCtx.lineTo(innerPoints[i][0], innerPoints[i][1]);
      }
      baseCtx.closePath();

      baseCtx.fillStyle = tint;
      baseCtx.fill();
    }
  );
}

/** 绘制双环 */
function drawDoubleRing(
  ctx: CanvasRenderingContext2D, cx: number, cy: number, maxRadius: number,
  border: BorderTemplate, tint: string, size: number
): void {
  const sw = border.strokeWidth ?? 0.03;

  // 外环
  const outerOuter = maxRadius;
  const outerInner = maxRadius * (1 - sw);
  fillWithBevel(ctx, cx, cy, size, tint, () => {
    ctx.beginPath();
    ctx.arc(cx, cy, outerOuter, 0, Math.PI * 2);
    ctx.arc(cx, cy, outerInner, 0, Math.PI * 2, true);
    ctx.closePath();
  });

  // 内环
  const gapWidth = sw * 1.5;
  const innerOuter = maxRadius * (1 - sw - gapWidth);
  const innerInner = maxRadius * (1 - sw * 2 - gapWidth);
  fillWithBevel(ctx, cx, cy, size, tint, () => {
    ctx.beginPath();
    ctx.arc(cx, cy, innerOuter, 0, Math.PI * 2);
    ctx.arc(cx, cy, innerInner, 0, Math.PI * 2, true);
    ctx.closePath();
  });
}

/** 绘制多边形边框 */
function drawPolygonBorder(
  ctx: CanvasRenderingContext2D, cx: number, cy: number, maxRadius: number,
  border: BorderTemplate, tint: string, size: number
): void {
  const sides = border.sides ?? 6;
  const sw = (border.strokeWidth ?? 0.05) * maxRadius;
  const rotation = sides === 4 ? -Math.PI / 4 : -Math.PI / 2;

  const outerPoints = generatePolygonPoints(cx, cy, maxRadius, sides, rotation);
  const innerPoints = generatePolygonPoints(cx, cy, maxRadius - sw, sides, rotation);

  const createPath = () => {
    ctx.beginPath();
    // 外轮廓
    ctx.moveTo(outerPoints[0][0], outerPoints[0][1]);
    for (const p of outerPoints) ctx.lineTo(p[0], p[1]);
    ctx.closePath();

    // 内轮廓（反向，形成环形）
    ctx.moveTo(innerPoints[0][0], innerPoints[0][1]);
    for (let i = innerPoints.length - 1; i >= 0; i--) {
      ctx.lineTo(innerPoints[i][0], innerPoints[i][1]);
    }
    ctx.closePath();
  };

  fillWithBevel(ctx, cx, cy, size, tint, createPath);
}

/** 绘制刺状环 */
function drawSpikeRing(
  ctx: CanvasRenderingContext2D, cx: number, cy: number, maxRadius: number,
  border: BorderTemplate, tint: string, size: number
): void {
  const count = border.spikeCount ?? 24;
  const depth = (border.spikeDepth ?? 0.08) * maxRadius;
  const innerR = maxRadius * (border.innerRadius ?? 0.85);
  const outerR = maxRadius;

  const createPath = () => {
    ctx.beginPath();
    // 绘制带刺突的外轮廓
    for (let i = 0; i < count; i++) {
      const angle1 = (2 * Math.PI * i) / count - Math.PI / 2;
      const angle2 = (2 * Math.PI * (i + 0.5)) / count - Math.PI / 2;

      const tipR = outerR + depth;
      if (i === 0) {
        ctx.moveTo(cx + outerR * Math.cos(angle1), cy + outerR * Math.sin(angle1));
      } else {
        ctx.lineTo(cx + outerR * Math.cos(angle1), cy + outerR * Math.sin(angle1));
      }
      ctx.lineTo(cx + tipR * Math.cos(angle2), cy + tipR * Math.sin(angle2));
    }
    ctx.closePath();

    // 内圆挖空 (反向)
    ctx.moveTo(cx + innerR, cy);
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true);
    ctx.closePath();
  };

  fillWithBevel(ctx, cx, cy, size, tint, createPath);
}

/** 绘制抽象环（带发光装饰线的双层环） */
function drawAbstractRing(
  ctx: CanvasRenderingContext2D, cx: number, cy: number, maxRadius: number,
  border: BorderTemplate, tint: string, size: number
): void {
  const sw = (border.strokeWidth ?? 0.04) * maxRadius;

  // 主环
  fillWithBevel(ctx, cx, cy, size, tint, () => {
    ctx.beginPath();
    ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
    ctx.arc(cx, cy, maxRadius - sw, 0, Math.PI * 2, true);
    ctx.closePath();
  });

  // 内环
  const innerR = maxRadius * (border.innerRadius ?? 0.86);
  fillWithBevel(ctx, cx, cy, size, tint, () => {
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.arc(cx, cy, innerR - sw * 0.6, 0, Math.PI * 2, true);
    ctx.closePath();
  });

  // 装饰性发光短线（12 条）
  ctx.save();
  const decorCount = 12;
  const decorInner = maxRadius - sw * 3.5;
  const decorOuter = maxRadius - sw * 1;
  ctx.lineWidth = Math.max(2, sw * 0.5);
  
  // 发光线条设定
  ctx.shadowColor = tint;
  ctx.shadowBlur = Math.max(5, size * 0.02);
  ctx.strokeStyle = shadeColor(tint, 80); // 极亮线条

  for (let i = 0; i < decorCount; i++) {
    const angle = (2 * Math.PI * i) / decorCount - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx + decorInner * Math.cos(angle), cy + decorInner * Math.sin(angle));
    ctx.lineTo(cx + decorOuter * Math.cos(angle), cy + decorOuter * Math.sin(angle));
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * 绘制边框缩略图（用于模板选择器面板）
 */
export function drawBorderThumbnail(
  ctx: CanvasRenderingContext2D,
  border: BorderTemplate,
  size: number,
  tint: string = '#8b5cf6'
): void {
  ctx.clearRect(0, 0, size, size);
  drawBorder(ctx, border, size, tint, 1);
}
