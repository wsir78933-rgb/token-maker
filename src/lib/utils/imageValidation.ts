export const MAX_UPLOAD_IMAGE_BYTES = 10 * 1024 * 1024;
export const SUPPORTED_IMAGE_NAME = /\.(png|jpe?g|webp)$/i;
export const SUPPORTED_IMAGE_URL = /\.(png|jpe?g|webp)(?=([?#].*)?$)/i;
export const SUPPORTED_IMAGE_ACCEPT = '.png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp';

const SUPPORTED_IMAGE_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);
const SUPPORTED_DATA_IMAGE = /^data:image\/(?:png|jpeg|jpg|webp)[;,]/i;

export function getSupportedImageMimeType(value: string | null | undefined) {
  const mimeType = value?.split(';')[0]?.toLowerCase() ?? '';
  if (mimeType === 'image/jpg') return 'image/jpeg';
  return SUPPORTED_IMAGE_MIME_TYPES.has(mimeType) ? mimeType : null;
}

export function getSupportedImageMimeTypeFromUrl(url: string) {
  const cleanUrl = url.split(/[?#]/)[0]?.toLowerCase() ?? '';
  if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg')) return 'image/jpeg';
  if (cleanUrl.endsWith('.png')) return 'image/png';
  if (cleanUrl.endsWith('.webp')) return 'image/webp';
  return null;
}

export function isSupportedImageSource(value: string | null | undefined) {
  const source = value?.trim();
  if (!source) return false;
  return SUPPORTED_DATA_IMAGE.test(source) || SUPPORTED_IMAGE_URL.test(source);
}

export function isSupportedImageFile(file: File | null | undefined): file is File {
  if (!file || file.size > MAX_UPLOAD_IMAGE_BYTES) return false;

  const mimeType = getSupportedImageMimeType(file.type);
  if (file.type) {
    return Boolean(mimeType);
  }

  return SUPPORTED_IMAGE_NAME.test(file.name);
}

export function getSupportedImageFiles(
  files: ArrayLike<File | null | undefined> | Iterable<File | null | undefined>
) {
  return Array.from(files).filter(isSupportedImageFile);
}
