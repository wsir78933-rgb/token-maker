import type { SharePlatform } from './constants';

interface SharePlatformUrlParams {
  shareUrl: string;
  imageUrl: string;
  text: string;
  title: string;
}

function withEncodedParams(baseUrl: string, params: Record<string, string>) {
  const url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return url.toString();
}

export function buildXShareUrl({ shareUrl, text }: SharePlatformUrlParams) {
  return withEncodedParams('https://x.com/intent/tweet', {
    text,
    url: shareUrl,
  });
}

export function buildPinterestShareUrl({ shareUrl, imageUrl, text }: SharePlatformUrlParams) {
  return withEncodedParams('https://www.pinterest.com/pin/create/button/', {
    url: shareUrl,
    media: imageUrl,
    description: text,
  });
}

export function buildRedditShareUrl({ shareUrl, title }: SharePlatformUrlParams) {
  return withEncodedParams('https://www.reddit.com/submit', {
    url: shareUrl,
    title,
  });
}

export function buildSharePlatformUrl(platform: SharePlatform, params: SharePlatformUrlParams) {
  switch (platform) {
    case 'x':
      return buildXShareUrl(params);
    case 'pinterest':
      return buildPinterestShareUrl(params);
    case 'reddit':
      return buildRedditShareUrl(params);
  }
}
