import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-content';
import {
  getAllGuideDetailModels,
  getAllTemplateDetailModels,
  getStaticPageLastModified,
} from '@/lib/site-page-models';
import { LOCALES, getLocalizedPath } from '@/lib/site-locale';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const homepageUpdatedAt = new Date('2026-03-12');
  const staticPaths = ['/', '/templates', '/blog', '/faq', '/privacy'] as const;

  const staticRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    staticPaths.map((path) => {
      const pageKey =
        path === '/templates'
          ? 'templates'
          : path === '/blog'
            ? 'guides'
            : path === '/faq'
              ? 'faq'
              : path === '/privacy'
                ? 'privacy'
                : null;

      return {
        url: `${siteUrl}${getLocalizedPath(locale, path)}`,
        lastModified: pageKey ? new Date(getStaticPageLastModified(locale, pageKey)) : homepageUpdatedAt,
        changeFrequency: path === '/' ? 'weekly' : path === '/privacy' ? 'monthly' : 'weekly',
        priority: path === '/' ? 1 : path === '/privacy' ? 0.4 : path === '/faq' ? 0.6 : 0.8,
      };
    }),
  );

  const templateRoutes = LOCALES.flatMap((locale) =>
    getAllTemplateDetailModels(locale).map((page) => ({
      url: `${siteUrl}${getLocalizedPath(locale, `/templates/${page.slug}`)}`,
      lastModified: new Date(page.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  );

  const guideRoutes = LOCALES.flatMap((locale) =>
    getAllGuideDetailModels(locale).map((page) => ({
      url: `${siteUrl}${getLocalizedPath(locale, `/blog/${page.slug}`)}`,
      lastModified: new Date(page.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  );

  return [...staticRoutes, ...templateRoutes, ...guideRoutes];
}
