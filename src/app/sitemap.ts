import type { MetadataRoute } from 'next';
import {
  BLOG_PLACEHOLDER_MODE,
  getBlogPageCount,
  getBlogPosts,
} from '@/lib/blog-content';
import { getSiteUrl } from '@/lib/site-content';
import {
  getAllTemplateDetailModels,
  getStaticPageLastModified,
} from '@/lib/site-page-models';
import { LOCALES, getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const DEFAULT_LAST_MODIFIED = '2026-03-12';

function pickLatestIsoDate(
  values: Array<string | undefined>,
  fallback = DEFAULT_LAST_MODIFIED,
) {
  const normalizedValues = values.filter(
    (value): value is string => typeof value === 'string' && value.length > 0,
  );

  return normalizedValues.reduce((latest, value) => {
    return new Date(value).getTime() > new Date(latest).getTime() ? value : latest;
  }, fallback);
}

function getHomepageLastModified(locale: SiteLocale) {
  return pickLatestIsoDate([
    getStaticPageLastModified(locale, 'templates'),
    getStaticPageLastModified(locale, 'faq'),
    ...getAllTemplateDetailModels(locale).map((page) => page.updatedAt),
  ]);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const staticPaths = ['/', '/templates', '/faq', '/privacy'] as const;

  const staticRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    staticPaths.map((path) => {
      const pageKey =
        path === '/templates'
          ? 'templates'
          : path === '/faq'
            ? 'faq'
            : path === '/privacy'
              ? 'privacy'
              : null;

      return {
        url: `${siteUrl}${getLocalizedPath(locale, path)}`,
        lastModified:
          pageKey
            ? new Date(getStaticPageLastModified(locale, pageKey))
            : new Date(getHomepageLastModified(locale)),
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

  const blogHubRoutes: MetadataRoute.Sitemap = BLOG_PLACEHOLDER_MODE
    ? []
    : LOCALES.flatMap((locale) => {
        const totalPages = getBlogPageCount(locale);

        return Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;
          const path = pageNumber === 1 ? '/blog' : `/blog/page/${pageNumber}`;

          return {
            url: `${siteUrl}${getLocalizedPath(locale, path)}`,
            lastModified: new Date(
              pickLatestIsoDate(getBlogPosts(locale).map((post) => post.updatedAt)),
            ),
            changeFrequency: 'weekly' as const,
            priority: pageNumber === 1 ? 0.75 : 0.55,
          };
        });
      });

  const blogPostRoutes: MetadataRoute.Sitemap = BLOG_PLACEHOLDER_MODE
    ? []
    : LOCALES.flatMap((locale) =>
        getBlogPosts(locale).map((post) => ({
          url: `${siteUrl}${getLocalizedPath(locale, `/blog/${post.slug}`)}`,
          lastModified: new Date(post.updatedAt),
          changeFrequency: 'monthly' as const,
          priority: post.featured ? 0.72 : 0.6,
        })),
      );

  return [...staticRoutes, ...templateRoutes, ...blogHubRoutes, ...blogPostRoutes];
}
