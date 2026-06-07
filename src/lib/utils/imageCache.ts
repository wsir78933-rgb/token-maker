// ============================================================
// 图像缓存工具库
// 用于全局缓存边框、Mask 和用户临时上传的图像 URL
// 确保 Canvas 同步绘制时能够立即拿到解析好的 HTMLImageElement
// ============================================================

import { getLruCacheEntry, setLruCacheEntry } from './lruCache';

const MAX_CACHED_IMAGES = 32;
const IMAGES_CACHE = new Map<string, HTMLImageElement>();
const PENDING_IMAGE_LOADS = new Map<
  string,
  {
    callbacks: Set<() => void>;
    promise: Promise<HTMLImageElement>;
  }
>();

function startImageLoad(url: string, onChange?: () => void) {
  const pendingLoad = PENDING_IMAGE_LOADS.get(url);
  if (pendingLoad) {
    if (onChange) pendingLoad.callbacks.add(onChange);
    return pendingLoad.promise;
  }

  const callbacks = new Set<() => void>();
  if (onChange) callbacks.add(onChange);

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setLruCacheEntry(IMAGES_CACHE, url, img, MAX_CACHED_IMAGES);
      PENDING_IMAGE_LOADS.delete(url);
      callbacks.forEach((callback) => callback());
      resolve(img);
    };
    img.onerror = () => {
      PENDING_IMAGE_LOADS.delete(url);
      reject(new Error(`Failed to cache image: ${url}`));
    };
    img.src = url;
  });

  PENDING_IMAGE_LOADS.set(url, { callbacks, promise });
  return promise;
}

/**
 * 获取或加载缓存图像
 * 如果图像已在缓存中，直接返回
 * 如果不在，返回 null，同时发起异步加载。加载完毕将触发 onChange（用于重新触发重渲染）
 */
export function getCachedImage(url: string, onChange?: () => void): HTMLImageElement | null {
  if (!url) return null;
  
  const cachedImage = getLruCacheEntry(IMAGES_CACHE, url);
  if (cachedImage) {
    return cachedImage;
  }

  startImageLoad(url, onChange).catch((error) => {
    console.warn(error);
  });

  return null;
}

/**
 * 直接将图像 URL 预热并放入缓存中
 */
export async function preloadImageToCache(url: string): Promise<HTMLImageElement> {
  const cachedImage = getLruCacheEntry(IMAGES_CACHE, url);
  if (cachedImage) {
    return cachedImage;
  }

  return startImageLoad(url);
}
