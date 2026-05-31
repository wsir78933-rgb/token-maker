import {
  SHARE_R2_PUBLIC_BASE_URL_FALLBACK,
  getShareImageUrl,
  normalizeShareBaseUrl,
} from './constants';

export function getSharePublicBaseUrl() {
  return normalizeShareBaseUrl(
    process.env.R2_PUBLIC_BASE_URL,
    SHARE_R2_PUBLIC_BASE_URL_FALLBACK
  );
}

export function getConfiguredShareImageUrl(id: string) {
  return getShareImageUrl(id, getSharePublicBaseUrl());
}
