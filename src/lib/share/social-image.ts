import {
  SHARE_SOCIAL_IMAGE_HEIGHT,
  SHARE_SOCIAL_IMAGE_WIDTH,
  SHARE_SOCIAL_TOKEN_RENDER_SIZE,
} from './constants';
import { exportTokenAsPNG } from '@/lib/renderer/pipeline';
import type { EditorState } from '@/types/editor';

interface ShareSocialImageLayout {
  canvasHeight: number;
  canvasWidth: number;
  drawHeight: number;
  drawWidth: number;
  x: number;
  y: number;
}

const SAFE_X = 80;
const SAFE_Y = 36;
const MAX_TOKEN_SIZE = 560;

export function getShareSocialImageLayout(
  sourceWidth: number,
  sourceHeight: number
): ShareSocialImageLayout {
  const availableWidth = SHARE_SOCIAL_IMAGE_WIDTH - SAFE_X * 2;
  const availableHeight = SHARE_SOCIAL_IMAGE_HEIGHT - SAFE_Y * 2;
  const scale = Math.min(
    MAX_TOKEN_SIZE / sourceWidth,
    MAX_TOKEN_SIZE / sourceHeight,
    availableWidth / sourceWidth,
    availableHeight / sourceHeight
  );
  const drawWidth = Math.round(sourceWidth * scale);
  const drawHeight = Math.round(sourceHeight * scale);

  return {
    canvasHeight: SHARE_SOCIAL_IMAGE_HEIGHT,
    canvasWidth: SHARE_SOCIAL_IMAGE_WIDTH,
    drawHeight,
    drawWidth,
    x: Math.round((SHARE_SOCIAL_IMAGE_WIDTH - drawWidth) / 2),
    y: Math.round((SHARE_SOCIAL_IMAGE_HEIGHT - drawHeight) / 2),
  };
}

function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Unable to load social share token image'));
    };
    image.src = url;
  });
}

function drawShareBackground(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createRadialGradient(600, 300, 80, 600, 300, 720);
  gradient.addColorStop(0, '#1f1d33');
  gradient.addColorStop(0.56, '#080b11');
  gradient.addColorStop(1, '#181713');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SHARE_SOCIAL_IMAGE_WIDTH, SHARE_SOCIAL_IMAGE_HEIGHT);

  const vignette = ctx.createLinearGradient(0, 0, SHARE_SOCIAL_IMAGE_WIDTH, 0);
  vignette.addColorStop(0, 'rgba(0,0,0,0.48)');
  vignette.addColorStop(0.5, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.48)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, SHARE_SOCIAL_IMAGE_WIDTH, SHARE_SOCIAL_IMAGE_HEIGHT);
}

function canvasToPngBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png', 1);
  });
}

export async function createShareSocialImageBlob(state: EditorState) {
  const tokenBlob = await exportTokenAsPNG(state, SHARE_SOCIAL_TOKEN_RENDER_SIZE);
  if (!tokenBlob) return null;

  const image = await loadImageFromBlob(tokenBlob);
  const canvas = document.createElement('canvas');
  canvas.width = SHARE_SOCIAL_IMAGE_WIDTH;
  canvas.height = SHARE_SOCIAL_IMAGE_HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  drawShareBackground(ctx);

  const sourceWidth = image.naturalWidth || image.width || SHARE_SOCIAL_TOKEN_RENDER_SIZE;
  const sourceHeight = image.naturalHeight || image.height || SHARE_SOCIAL_TOKEN_RENDER_SIZE;
  const layout = getShareSocialImageLayout(sourceWidth, sourceHeight);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 36;
  ctx.drawImage(image, layout.x, layout.y, layout.drawWidth, layout.drawHeight);
  ctx.shadowBlur = 0;

  return canvasToPngBlob(canvas);
}
