// ============================================================
// 图像缓存工具库
// 用于全局缓存用户上传的自定义边框和 Mask Base64 图像
// 确保 Canvas 同步绘制时能够立即拿到解析好的 HTMLImageElement
// ============================================================

import { getLruCacheEntry, setLruCacheEntry } from './lruCache';

const MAX_CACHED_IMAGES = 32;
const IMAGES_CACHE = new Map<string, HTMLImageElement>();
const PENDING_IMAGE_LOADS = new Map<string, Set<() => void>>();

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

  const pendingCallbacks = PENDING_IMAGE_LOADS.get(url);
  if (pendingCallbacks) {
    if (onChange) {
      pendingCallbacks.add(onChange);
    }
    return null;
  }

  const callbacks = new Set<() => void>();
  if (onChange) {
    callbacks.add(onChange);
  }
  PENDING_IMAGE_LOADS.set(url, callbacks);

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    setLruCacheEntry(IMAGES_CACHE, url, img, MAX_CACHED_IMAGES);
    const resolvedCallbacks = PENDING_IMAGE_LOADS.get(url);
    PENDING_IMAGE_LOADS.delete(url);
    if (resolvedCallbacks) {
      resolvedCallbacks.forEach((callback) => callback());
    }
  };
  img.onerror = () => {
    PENDING_IMAGE_LOADS.delete(url);
    console.warn(`Failed to cache image: ${url}`);
  };
  img.src = url;

  return null;
}

/**
 * 将 File (PNG/WEBP/SVG) 转换为 Base64
 * 用于持久化保存到自定义模板中
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 直接将 base64 预热并放入缓存中
 */
export async function preloadImageToCache(url: string): Promise<HTMLImageElement> {
  const cachedImage = getLruCacheEntry(IMAGES_CACHE, url);
  if (cachedImage) {
    return cachedImage;
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setLruCacheEntry(IMAGES_CACHE, url, img, MAX_CACHED_IMAGES);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}
