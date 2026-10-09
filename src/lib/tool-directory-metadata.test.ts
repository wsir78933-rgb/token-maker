import { describe, expect, it } from 'vitest';

import { getSiteUrl } from '@/lib/site-content';
import type { SiteLocale } from '@/lib/site-locale';

import { getToolDirectoryMetadata } from './tool-directory-metadata';

describe('tool directory metadata', () => {
  it.each([
    { locale: 'en' as const, canonical: '/tools', ogLocale: 'en_US' },
    { locale: 'zh' as const, canonical: '/zh/tools', ogLocale: 'zh_CN' },
  ])('returns complete localized metadata for $locale', ({ locale, canonical, ogLocale }) => {
    const metadata = getToolDirectoryMetadata(locale);

    expect(metadata.title).toBe(locale === 'en' ? 'Free Tabletop and Fantasy Tools' : '免费桌游与奇幻创作工具');
    expect(metadata.description).toBeTruthy();
    expect(metadata.metadataBase).toEqual(new URL(getSiteUrl()));
    expect(metadata.alternates).toEqual({
      canonical,
      languages: {
        'x-default': '/tools',
        'en-US': '/tools',
        'zh-CN': '/zh/tools',
      },
    });
    expect(metadata.openGraph).toMatchObject({
      url: new URL(canonical, `${getSiteUrl()}/`).toString(),
      locale: ogLocale,
      type: 'website',
    });
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      images: expect.any(Array),
    });
  });

  it('fails with the received value for an unsupported locale', () => {
    expect(() => getToolDirectoryMetadata('fr' as unknown as SiteLocale)).toThrow(
      'Tool directory metadata locale is invalid. Received "fr".',
    );
  });
});
