import { describe, expect, it } from 'vitest';
import type { Metadata } from 'next';
import sitemap from '@/app/sitemap';
import { getCollectionPageCopy } from '@/lib/site-content';
import {
  buildCollectionStructuredData,
  createCollectionMetadata,
  getAboutDocModel,
  getChangelogDocModel,
  getPrivacyDocModel,
  getStaticPageLastModified,
} from '@/lib/site-page-models';

type CollectionMetadataOpenGraph = {
  url: string;
  locale: string;
  images: Array<{ url: string }>;
};

function findSitemapEntry(url: string) {
  const sitemapEntry = sitemap().find((entry) => entry.url === url);

  if (!sitemapEntry) {
    throw new Error(`Expected sitemap entry for ${url}.`);
  }

  return sitemapEntry;
}

function getCollectionMetadataOpenGraph(metadata: Metadata) {
  const metadataOpenGraph = metadata.openGraph as CollectionMetadataOpenGraph | undefined;

  if (!metadataOpenGraph) {
    throw new Error(`Expected metadata openGraph for ${String(metadata.title)}.`);
  }

  return metadataOpenGraph;
}

describe('static site support pages', () => {
  it('exposes About and Changelog copy for both locales', () => {
    const englishCopy = getCollectionPageCopy('en');
    const chineseCopy = getCollectionPageCopy('zh');

    expect(englishCopy.about.title).toContain('About');
    expect(englishCopy.changelog.title).toContain('Changelog');
    expect(chineseCopy.about.title).toContain('关于');
    expect(chineseCopy.changelog.title).toContain('更新');
  });

  it('tracks About and Changelog last modified dates', () => {
    expect(getStaticPageLastModified('en', 'about')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(getStaticPageLastModified('zh', 'about')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(getStaticPageLastModified('en', 'changelog')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(getStaticPageLastModified('zh', 'changelog')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it.each([
    {
      url: 'https://www.tokenmaker.one/about',
      priority: 0.5,
      languages: {
        'x-default': 'https://www.tokenmaker.one/about',
        'en-US': 'https://www.tokenmaker.one/about',
        'zh-CN': 'https://www.tokenmaker.one/zh/about',
      },
    },
    {
      url: 'https://www.tokenmaker.one/changelog',
      priority: 0.48,
      languages: {
        'x-default': 'https://www.tokenmaker.one/changelog',
        'en-US': 'https://www.tokenmaker.one/changelog',
        'zh-CN': 'https://www.tokenmaker.one/zh/changelog',
      },
    },
    {
      url: 'https://www.tokenmaker.one/zh/about',
      priority: 0.5,
      languages: {
        'x-default': 'https://www.tokenmaker.one/about',
        'en-US': 'https://www.tokenmaker.one/about',
        'zh-CN': 'https://www.tokenmaker.one/zh/about',
      },
    },
    {
      url: 'https://www.tokenmaker.one/zh/changelog',
      priority: 0.48,
      languages: {
        'x-default': 'https://www.tokenmaker.one/changelog',
        'en-US': 'https://www.tokenmaker.one/changelog',
        'zh-CN': 'https://www.tokenmaker.one/zh/changelog',
      },
    },
  ])('includes complete sitemap metadata for $url', ({ url, priority, languages }) => {
    const sitemapEntry = findSitemapEntry(url);

    expect(sitemapEntry.lastModified).toEqual(new Date('2026-06-24'));
    expect(sitemapEntry.changeFrequency).toBe('monthly');
    expect(sitemapEntry.priority).toBe(priority);
    expect(sitemapEntry.alternates?.languages).toEqual(languages);
  });

  it('updates homepage last modified when visible support links change', () => {
    const englishHomepage = sitemap().find((entry) => entry.url === 'https://www.tokenmaker.one/');
    const chineseHomepage = sitemap().find((entry) => entry.url === 'https://www.tokenmaker.one/zh');

    expect(englishHomepage?.lastModified).toEqual(new Date('2026-06-24'));
    expect(chineseHomepage?.lastModified).toEqual(new Date('2026-06-24'));
  });

  it.each([
    {
      locale: 'en' as const,
      page: 'about' as const,
      title: 'About Token Maker',
      canonical: '/about',
      openGraphUrl: 'https://www.tokenmaker.one/about',
      openGraphLocale: 'en_US',
      imageUrl: 'https://www.tokenmaker.one/opengraph-image',
    },
    {
      locale: 'zh' as const,
      page: 'about' as const,
      title: '关于 Token Maker',
      canonical: '/zh/about',
      openGraphUrl: 'https://www.tokenmaker.one/zh/about',
      openGraphLocale: 'zh_CN',
      imageUrl: 'https://www.tokenmaker.one/zh/opengraph-image',
    },
    {
      locale: 'en' as const,
      page: 'changelog' as const,
      title: 'Token Maker Changelog',
      canonical: '/changelog',
      openGraphUrl: 'https://www.tokenmaker.one/changelog',
      openGraphLocale: 'en_US',
      imageUrl: 'https://www.tokenmaker.one/opengraph-image',
    },
    {
      locale: 'zh' as const,
      page: 'changelog' as const,
      title: 'Token Maker 更新记录',
      canonical: '/zh/changelog',
      openGraphUrl: 'https://www.tokenmaker.one/zh/changelog',
      openGraphLocale: 'zh_CN',
      imageUrl: 'https://www.tokenmaker.one/zh/opengraph-image',
    },
  ])(
    'creates complete localized metadata for $locale/$page',
    ({ locale, page, title, canonical, openGraphUrl, openGraphLocale, imageUrl }) => {
      const metadata = createCollectionMetadata(locale, page);
      const metadataOpenGraph = getCollectionMetadataOpenGraph(metadata);

      expect(metadata.title).toBe(title);
      expect(metadata.alternates?.canonical).toBe(canonical);
      expect(metadata.alternates?.languages).toEqual({
        'x-default': `/${page}`,
        'en-US': `/${page}`,
        'zh-CN': `/zh/${page}`,
      });
      expect(metadataOpenGraph.url).toBe(openGraphUrl);
      expect(metadataOpenGraph.locale).toBe(openGraphLocale);
      expect(metadataOpenGraph.images[0].url).toBe(imageUrl);
    }
  );

  it('uses precise structured data types for support pages', () => {
    expect(buildCollectionStructuredData('en', '/faq', 'FAQ', 'Questions')).toMatchObject({
      '@type': 'CollectionPage',
    });
    expect(buildCollectionStructuredData('en', '/about', 'About Token Maker', 'About')).toMatchObject({
      '@type': 'AboutPage',
    });
    expect(buildCollectionStructuredData('en', '/changelog', 'Token Maker Changelog', 'Updates')).toMatchObject({
      '@type': 'WebPage',
    });
  });

  it('describes the current privacy facts instead of future-only disclosures', () => {
    const englishPrivacy = getPrivacyDocModel('en');
    const englishPrivacyText = [
      englishPrivacy.title,
      englishPrivacy.description,
      englishPrivacy.intro,
      ...englishPrivacy.principles.flatMap((principle) => [principle.title, principle.description]),
      ...englishPrivacy.sections.flatMap((section) => [section.title, section.body]),
      ...englishPrivacy.commitments,
    ].join(' ');
    const chinesePrivacy = getPrivacyDocModel('zh');
    const chinesePrivacyText = [
      chinesePrivacy.title,
      chinesePrivacy.description,
      chinesePrivacy.intro,
      ...chinesePrivacy.principles.flatMap((principle) => [principle.title, principle.description]),
      ...chinesePrivacy.sections.flatMap((section) => [section.title, section.body]),
      ...chinesePrivacy.commitments,
    ].join(' ');

    expect(englishPrivacyText).toContain('Ordinary PNG downloads are generated locally in your browser.');
    expect(englishPrivacyText).toContain('/api/share');
    expect(englishPrivacyText).toContain('R2');
    expect(englishPrivacyText).toContain('public share link');
    expect(englishPrivacyText).toContain('Microsoft Clarity is included on the live site outside development.');
    expect(englishPrivacyText).toContain(
      'Google Analytics runs only in production when NEXT_PUBLIC_GA_MEASUREMENT_ID is configured.'
    );
    expect(englishPrivacyText).toContain(
      'Token Maker does not provide a self-service deletion or retention promise on this page.'
    );
    expect(englishPrivacyText).not.toMatch(/If you add analytics|future remote|added later|retention policy/i);

    expect(chinesePrivacyText).toContain('普通 PNG 下载会在你的浏览器本地生成。');
    expect(chinesePrivacyText).toContain('/api/share');
    expect(chinesePrivacyText).toContain('R2');
    expect(chinesePrivacyText).toContain('公开分享链接');
    expect(chinesePrivacyText).toContain('Microsoft Clarity 会在非开发环境的站点加载。');
    expect(chinesePrivacyText).toContain('只有在生产环境且配置 NEXT_PUBLIC_GA_MEASUREMENT_ID 时，Google Analytics 才会启用。');
    expect(chinesePrivacyText).not.toMatch(/以后|未来|如果后面|保留期限/);
  });

  it('keeps About evidence links and Changelog affected links in the page models', () => {
    const aboutModel = getAboutDocModel('en');
    const changelogModel = getChangelogDocModel('en');

    expect(aboutModel.principles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Clear image handling',
          evidenceLink: { label: 'Privacy', path: '/privacy' },
        }),
        expect.objectContaining({
          title: 'Visible maintenance',
          evidenceLink: { label: 'Changelog', path: '/changelog' },
        }),
      ])
    );
    expect(changelogModel.entries[0]).toMatchObject({
      title: 'Added trust pages',
      affectedLinks: [
        { label: 'About', path: '/about' },
        { label: 'Changelog', path: '/changelog' },
      ],
    });
    expect(changelogModel.entries.at(-1)).toMatchObject({
      title: 'Published FAQ and privacy notes',
      affectedLinks: [
        { label: 'FAQ', path: '/faq' },
        { label: 'Privacy', path: '/privacy' },
      ],
    });
  });

  it('uses the existing updatedAt value as structured data dateModified when provided', () => {
    expect(
      buildCollectionStructuredData(
        'en',
        '/privacy',
        'How Token Maker handles images by default',
        'Privacy facts',
        getStaticPageLastModified('en', 'privacy')
      )
    ).toMatchObject({
      dateModified: getStaticPageLastModified('en', 'privacy'),
    });
  });
});
