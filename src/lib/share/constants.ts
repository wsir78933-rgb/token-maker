import type { SiteLocale } from '@/lib/site-locale';

export const SHARE_DIALOG_SUPPRESS_MS = 24 * 60 * 60 * 1000;
export const SHARE_DIALOG_SUPPRESSED_UNTIL_KEY = 'token-maker:share-dialog:suppressed-until';

export const SHARE_ID_LENGTH = 10;
export const SHARE_ID_PATTERN = /^[A-Za-z0-9_-]{10}$/;
export const SHARE_OBJECT_PREFIX = 'shares';
export const SHARE_MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const SHARE_MAX_REQUEST_BODY_BYTES = 8 * 1024 * 1024;
export const SHARE_RATE_LIMIT_WINDOW_MS = 60 * 1000;
export const SHARE_RATE_LIMIT_MAX_REQUESTS = 20;
export const SHARE_RATE_LIMIT_MAX_BUCKETS = 1000;
export const SHARE_RATE_LIMIT_CLEANUP_INTERVAL_MS = 60 * 1000;
export const SHARE_IMAGE_CACHE_CONTROL = 'public, max-age=2592000, immutable';
export const SHARE_R2_PUBLIC_BASE_URL_FALLBACK = 'https://r2.tokenmaker.one';
export const SHARE_SITE_URL_FALLBACK = 'https://www.tokenmaker.one';
export const SHARE_SOCIAL_IMAGE_WIDTH = 1200;
export const SHARE_SOCIAL_IMAGE_HEIGHT = 630;
export const SHARE_SOCIAL_TOKEN_RENDER_SIZE = 1024;

export const SHARE_EXPORT_WIDTHS = [256, 512, 1024, 2048] as const;
export type ShareExportWidth = (typeof SHARE_EXPORT_WIDTHS)[number];
export const SHARE_UPLOAD_WIDTHS = [
  ...SHARE_EXPORT_WIDTHS,
  SHARE_SOCIAL_IMAGE_WIDTH,
] as const;
export type ShareUploadWidth = (typeof SHARE_UPLOAD_WIDTHS)[number];

export type SharePlatform = 'x' | 'pinterest' | 'reddit';

export function isShareExportWidth(value: unknown): value is ShareExportWidth {
  return typeof value === 'number' && SHARE_EXPORT_WIDTHS.includes(value as ShareExportWidth);
}

export function isShareUploadWidth(value: unknown): value is ShareUploadWidth {
  return typeof value === 'number' && SHARE_UPLOAD_WIDTHS.includes(value as ShareUploadWidth);
}

export function isShareId(value: string): boolean {
  return SHARE_ID_PATTERN.test(value);
}

export function normalizeShareBaseUrl(value: string | undefined, fallback: string) {
  const baseUrl = value?.trim() || fallback;
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

export function getShareObjectKey(id: string) {
  return `${SHARE_OBJECT_PREFIX}/${id}.png`;
}

export function getShareImageUrl(
  id: string,
  publicBaseUrl = SHARE_R2_PUBLIC_BASE_URL_FALLBACK
) {
  return `${normalizeShareBaseUrl(publicBaseUrl, SHARE_R2_PUBLIC_BASE_URL_FALLBACK)}/${getShareObjectKey(id)}`;
}

export function getSharePagePath(id: string, locale: SiteLocale) {
  return locale === 'zh' ? `/zh/share/${id}` : `/share/${id}`;
}

export function getSharePageUrl(id: string, locale: SiteLocale, siteUrl = SHARE_SITE_URL_FALLBACK) {
  return `${normalizeShareBaseUrl(siteUrl, SHARE_SITE_URL_FALLBACK)}${getSharePagePath(id, locale)}`;
}
