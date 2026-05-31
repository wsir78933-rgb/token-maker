import type { Metadata } from 'next';
import type { SiteLocale } from '@/lib/site-locale';
import { getSiteUrl } from '@/lib/site-content';
import {
  SHARE_SOCIAL_IMAGE_HEIGHT,
  SHARE_SOCIAL_IMAGE_WIDTH,
  getSharePagePath,
  getSharePageUrl,
  isShareId,
} from './constants';
import { getConfiguredShareImageUrl } from './public-url';

const copyByLocale = {
  en: {
    title: 'Check out this VTT token',
    description: 'Made with Token Maker — free VTT token tool',
    madeWith: 'Made with Token Maker',
    body: 'Create VTT tokens for DnD, Roll20, Foundry, and Owlbear.',
    cta: 'Create Your Own Token',
    footer: 'Free browser-based VTT token maker',
    imageAlt: 'Shared VTT token made with Token Maker',
    ctaHref: '/#editor-workspace',
    redirectHref: '/',
    ogLocale: 'en_US',
  },
  zh: {
    title: '看看这个 VTT Token',
    description: '使用 Token Maker 制作 — 免费 VTT Token 工具',
    madeWith: '使用 Token Maker 制作',
    body: '为 DnD、Roll20、Foundry 和 Owlbear 创建 VTT Token。',
    cta: '制作你自己的 Token',
    footer: '免费的浏览器 VTT Token 制作工具',
    imageAlt: '使用 Token Maker 制作的 VTT Token',
    ctaHref: '/zh#editor-workspace',
    redirectHref: '/zh',
    ogLocale: 'zh_CN',
  },
} as const;

export function getSharePageCopy(locale: SiteLocale) {
  return copyByLocale[locale];
}

export function getShareRedirectHref(locale: SiteLocale) {
  return getSharePageCopy(locale).redirectHref;
}

export async function shareImageExists(imageUrl: string) {
  try {
    const response = await fetch(imageUrl, {
      method: 'HEAD',
      cache: 'no-store',
    });

    return response.ok && response.headers.get('content-type')?.includes('image/png');
  } catch {
    return false;
  }
}

export function createSharePageMetadata(locale: SiteLocale, id: string): Metadata {
  const copy = getSharePageCopy(locale);
  const siteUrl = getSiteUrl();
  const imageUrl = getConfiguredShareImageUrl(id);
  const shareUrl = getSharePageUrl(id, locale, siteUrl);
  const path = getSharePagePath(id, locale);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      absolute: copy.title,
    },
    description: copy.description,
    alternates: {
      canonical: path,
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: shareUrl,
      siteName: 'Token Maker',
      type: 'website',
      locale: copy.ogLocale,
      images: [
        {
          url: imageUrl,
          width: SHARE_SOCIAL_IMAGE_WIDTH,
          height: SHARE_SOCIAL_IMAGE_HEIGHT,
          alt: copy.imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
      images: [imageUrl],
    },
  };
}

export function isValidSharePageId(id: string) {
  return isShareId(id);
}
