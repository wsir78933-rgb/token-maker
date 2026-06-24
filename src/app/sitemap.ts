import type { MetadataRoute } from 'next';
import {
  BLOG_PLACEHOLDER_MODE,
  getBlogPageCount,
  getBlogPosts,
} from '@/lib/blog-content';
import { getSiteUrl, getTemplatePages } from '@/lib/site-content';
import { getStaticPageLastModified, type StaticSupportPage } from '@/lib/site-page-models';
import { LOCALES, getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const DEFAULT_LAST_MODIFIED = '2026-03-12';
const HOME_LAST_MODIFIED = '2026-05-06';
const DICE_ROLLER_LAST_MODIFIED = '2026-03-30';
const CONTACT_LAST_MODIFIED = '2026-05-02';
const TEMPLATE_LAST_MODIFIED = '2026-05-06';

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
    HOME_LAST_MODIFIED,
    getStaticPageLastModified(locale, 'faq'),
    getStaticPageLastModified(locale, 'privacy'),
    getStaticPageLastModified(locale, 'about'),
    getStaticPageLastModified(locale, 'changelog'),
  ]);
}

function buildAlternates(path: string, siteUrl: string) {
  return {
    languages: {
      'x-default': `${siteUrl}${getLocalizedPath('en', path)}`,
      ...Object.fromEntries(
        LOCALES.map((loc) => [
          loc === 'zh' ? 'zh-CN' : 'en-US',
          `${siteUrl}${getLocalizedPath(loc, path)}`,
        ]),
      ),
    },
  };
}

function getStaticSupportPageFromPath(path: string): StaticSupportPage | null {
  if (path === '/faq') return 'faq';
  if (path === '/privacy') return 'privacy';
  if (path === '/about') return 'about';
  if (path === '/changelog') return 'changelog';
  return null;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const staticPaths = ['/', '/faq', '/privacy', '/about', '/changelog', '/dice-roller-dnd', '/contact'] as const;

  const staticRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    staticPaths.map((path) => {
      const supportPage = getStaticSupportPageFromPath(path);

      return {
        url: `${siteUrl}${getLocalizedPath(locale, path)}`,
        lastModified:
          path === '/dice-roller-dnd'
            ? new Date(DICE_ROLLER_LAST_MODIFIED)
            : path === '/contact'
            ? new Date(CONTACT_LAST_MODIFIED)
            : supportPage
            ? new Date(getStaticPageLastModified(locale, supportPage))
            : new Date(getHomepageLastModified(locale)),
        changeFrequency:
          path === '/'
            ? 'weekly'
            : supportPage === 'privacy' || supportPage === 'about' || supportPage === 'changelog'
            ? 'monthly'
            : 'weekly',
        priority:
          path === '/'
            ? 1
            : supportPage === 'privacy'
            ? 0.4
            : supportPage === 'about'
            ? 0.5
            : supportPage === 'changelog'
            ? 0.48
            : supportPage === 'faq'
            ? 0.6
            : path === '/contact'
            ? 0.55
            : 0.8,
        alternates: buildAlternates(path, siteUrl),
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
              pickLatestIsoDate(getBlogPosts(locale).map((post) => post.updatedAt)),
            ),
            changeFrequency: 'weekly' as const,
            priority: pageNumber === 1 ? 0.75 : 0.55,
            alternates: buildAlternates(path, siteUrl),
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
          alternates: buildAlternates(`/blog/${post.slug}`, siteUrl),
        })),
      );

  const templateRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    getTemplatePages(locale).map((page) => {
      const path = `/templates/${page.slug}`;

      return {
        url: `${siteUrl}${getLocalizedPath(locale, path)}`,
        lastModified: new Date(TEMPLATE_LAST_MODIFIED),
        changeFrequency: 'weekly' as const,
        priority: 0.78,
        alternates: buildAlternates(path, siteUrl),
      };
    }),
  );

  return [...staticRoutes, ...templateRoutes, ...blogHubRoutes, ...blogPostRoutes];
}
