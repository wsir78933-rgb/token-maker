import type { MetadataRoute } from 'next';
import { getGuidePages, getSiteUrl, getTemplatePages } from '@/lib/site-content';
import { LOCALES, getLocalizedPath } from '@/lib/site-locale';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();
  const staticPaths = ['/', '/templates', '/guides', '/faq', '/privacy'] as const;

  const staticRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${siteUrl}${getLocalizedPath(locale, path)}`,
      lastModified: now,
      changeFrequency: path === '/' ? 'weekly' : path === '/privacy' ? 'monthly' : 'weekly',
      priority:
        path === '/' ? 1 : path === '/privacy' ? 0.4 : path === '/faq' ? 0.6 : 0.8,
    })),
  );

  const templateRoutes = LOCALES.flatMap((locale) =>
    getTemplatePages(locale).map((page) => ({
      url: `${siteUrl}${getLocalizedPath(locale, `/templates/${page.slug}`)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  );

  const guideRoutes = LOCALES.flatMap((locale) =>
    getGuidePages(locale).map((page) => ({
      url: `${siteUrl}${getLocalizedPath(locale, `/guides/${page.slug}`)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  );

  return [...staticRoutes, ...templateRoutes, ...guideRoutes];
}
