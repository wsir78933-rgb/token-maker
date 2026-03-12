// ============================================================
// 图像缓存工具库
// 用于全局缓存用户上传的自定义边框和 Mask Base64 图像
// 确保 Canvas 同步绘制时能够立即拿到解析好的 HTMLImageElement
// ============================================================

const IMAGES_CACHE = new Map<string, HTMLImageElement>();

/**
 * 获取或加载缓存图像
 * 如果图像已在缓存中，直接返回
 * 如果不在，返回 null，同时发起异步加载。加载完毕将触发 onChange（用于重新触发重渲染）
 */
export function getCachedImage(url: string, onChange?: () => void): HTMLImageElement | null {
  if (!url) return null;
  
  if (IMAGES_CACHE.has(url)) {
    return IMAGES_CACHE.get(url) || null;
  }

  // 防止重复发起同一个 url 的加载（可以先塞一个 dummy 对象进去站位，或者用临时状态，这里简化处理）
  const img = new Image();
  // 先设置跨域
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    IMAGES_CACHE.set(url, img);
    if (onChange) {
      onChange();
    }
  };
  img.onerror = () => {
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
  if (IMAGES_CACHE.has(url)) {
    return IMAGES_CACHE.get(url)!;
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      IMAGES_CACHE.set(url, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}
