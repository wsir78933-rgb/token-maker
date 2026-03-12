// ============================================================
// 渲染引擎 — 高级 2.5D 边框绘制
// 具有光影、金属材质渐变和立体投影倒角
// ============================================================
import type { BorderTemplate } from '@/types/editor';
import { generatePolygonPoints } from './masks';
import { getCachedImage } from '@/lib/utils/imageCache';
import { useEditorStore } from '@/lib/store/editor-store';

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
  opacity: number
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
    const img = getCachedImage(url, () => {
      // 图像加载完成后强制刷新 Zustand
      useEditorStore.setState({ activePresetId: useEditorStore.getState().activePresetId });
    });
    if (img) {
      // 应用颜色混合（如果设置了非白色的 tint）
      if (tint && tint.toLowerCase() !== '#ffffff' && tint.toLowerCase() !== '#fff') {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = size;
        offCanvas.height = size;
        const oCtx = offCanvas.getContext('2d');
        if (oCtx) {
          // 1. 绘制原图
          oCtx.drawImage(img, 0, 0, size, size);
          // 2. 使用正片叠底加深材质颜色，使高阶材质纹理被保留
          oCtx.globalCompositeOperation = 'multiply';
          oCtx.fillStyle = tint;
          oCtx.fillRect(0, 0, size, size);
          // 3. 去掉透明区域被填充出来的多余色块 (仅保留图片内部不透明的轮廓)
          oCtx.globalCompositeOperation = 'destination-in';
          oCtx.drawImage(img, 0, 0, size, size);
          
          ctx.drawImage(offCanvas, 0, 0);
        } else {
          ctx.drawImage(img, 0, 0, size, size);
        }
      } else {
        ctx.drawImage(img, 0, 0, size, size);
      }
    }
    ctx.restore();
    return;
  }

  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size / 2 - 1;

  switch (border.type) {
    case 'ring':
      drawRing(ctx, cx, cy, maxRadius, border, tint, size);
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
