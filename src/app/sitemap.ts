import type { MetadataRoute } from 'next';
import {
  BLOG_PLACEHOLDER_MODE,
  getBlogPageCount,
  getBlogPosts,
} from '@/lib/blog-content';
import { getSiteUrl } from '@/lib/site-content';
import { getStaticPageLastModified, getToolPageLastModified } from '@/lib/site-page-models';
import { LOCALES, getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

function pickLatestIsoDate(
  values: Array<string | undefined>,
  fallback: string,
) {
  const normalizedValues = values.filter(
    (value): value is string => typeof value === 'string' && value.length > 0,
  );

  return normalizedValues.reduce((latest, value) => {
    const candidateTime = new Date(value).getTime();
    const latestTime = new Date(latest).getTime();

    if (!Number.isFinite(candidateTime)) {
      return latest;
    }

    if (!Number.isFinite(latestTime)) {
      return value;
    }

    return candidateTime > latestTime ? value : latest;
  }, fallback);
}

function getHomepageLastModified(locale: SiteLocale) {
  return pickLatestIsoDate([
    getStaticPageLastModified(locale, 'faq'),
    getStaticPageLastModified(locale, 'privacy'),
  ], '2026-03-17');
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const staticPaths = ['/', '/faq', '/privacy', '/dice-roller-dnd'] as const;

  const staticRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    staticPaths.map((path) => {
      const pageKey =
        path === '/faq'
          ? 'faq'
          : path === '/privacy'
            ? 'privacy'
            : null;

      return {
        url: `${siteUrl}${getLocalizedPath(locale, path)}`,
        lastModified:
          path === '/dice-roller-dnd'
            ? new Date(getToolPageLastModified(locale, 'diceRoller'))
            : pageKey
            ? new Date(getStaticPageLastModified(locale, pageKey))
            : new Date(getHomepageLastModified(locale)),
        changeFrequency: path === '/' ? 'weekly' : path === '/privacy' ? 'monthly' : 'weekly',
        priority: path === '/' ? 1 : path === '/privacy' ? 0.4 : path === '/faq' ? 0.6 : 0.8,
      };
    }),
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
              pickLatestIsoDate(getBlogPosts(locale).map((post) => post.updatedAt), getHomepageLastModified(locale)),
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

  return [...staticRoutes, ...blogHubRoutes, ...blogPostRoutes];
}
