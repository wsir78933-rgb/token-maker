// ============================================================
// 渲染引擎 — 遮罩路径生成
// 根据 MaskTemplate 生成 Canvas 裁切路径
// ============================================================
import type { MaskTemplate } from '@/types/editor';

/**
 * 生成多边形顶点坐标
 * @param cx 中心 x
 * @param cy 中心 y
 * @param radius 半径
 * @param sides 边数
 * @param rotation 起始旋转角度（弧度）
 */
export function generatePolygonPoints(
  cx: number,
  cy: number,
  radius: number,
  sides: number,
  rotation: number = -Math.PI / 2
): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i < sides; i++) {
    const angle = rotation + (2 * Math.PI * i) / sides;
    points.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
  }
  return points;
}

/**
 * 根据 MaskTemplate 创建裁切路径
 * @param mask 遮罩模板
 * @param size 画布尺寸（正方形边长）
 */
export function createMaskPath(mask: MaskTemplate, size: number): Path2D {
  const path = new Path2D();
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 1; // 留 1px 避免边缘锯齿

  if (mask.sides === 0) {
    // 圆形
    path.arc(cx, cy, radius, 0, Math.PI * 2);
  } else {
    // 多边形
    // 方形需要旋转 45° 让边水平/垂直
    const rotation = mask.sides === 4 ? -Math.PI / 4 : -Math.PI / 2;
    const points = generatePolygonPoints(cx, cy, radius, mask.sides, rotation);
    path.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      path.lineTo(points[i][0], points[i][1]);
    }
    path.closePath();
  }

  return path;
}

/**
 * 在 Canvas Context 上绘制遮罩缩略图（用于模板选择器的预览）
 */
export function drawMaskThumbnail(
  ctx: CanvasRenderingContext2D,
  mask: MaskTemplate,
  size: number,
  color: string = '#a855f7'
): void {
  ctx.clearRect(0, 0, size, size);
  const path = createMaskPath(mask, size * 0.8);

  // 偏移到中心
  ctx.save();
  ctx.translate(size * 0.1, size * 0.1);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke(path);
  ctx.restore();
}
