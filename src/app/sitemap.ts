import type { MetadataRoute } from 'next';
import {
  BLOG_PLACEHOLDER_MODE,
  getBlogCategories,
  getBlogCategoryPageCount,
  getBlogCategoryPagePath,
  getBlogPageCount,
  getBlogPostsByCategory,
  getBlogPosts,
} from '@/lib/blog-content';
import { getSiteUrl, getTemplatePages } from '@/lib/site-content';
import { getStaticPageLastModified, type StaticSupportPage } from '@/lib/site-page-models';
import { LOCALES, getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const DEFAULT_LAST_MODIFIED = '2026-03-12';
const HOME_LAST_MODIFIED = '2026-05-06';
const DICE_ROLLER_LAST_MODIFIED = '2026-03-30';
const COAT_MAKER_LAST_MODIFIED = '2026-07-28';
const EMBLEM_CREATOR_LAST_MODIFIED = '2026-10-03';
const OUTFIT_CREATOR_LAST_MODIFIED = '2026-10-04';
const WEAPON_CREATOR_LAST_MODIFIED = '2026-10-05';
const LANGUAGE_GENERATOR_LAST_MODIFIED = '2026-10-05';
const SCROLL_CREATOR_LAST_MODIFIED = '2026-10-06';
const FAMILY_TREE_CREATOR_LAST_MODIFIED = '2026-10-06';
const CONSTELLATION_MAP_CREATOR_LAST_MODIFIED = '2026-10-07';
const SOLAR_SYSTEM_CREATOR_LAST_MODIFIED = '2026-10-06';
const PERIODIC_TABLE_CREATOR_LAST_MODIFIED = '2026-10-06';
const TAROT_CARDS_LAST_MODIFIED = '2026-10-06';
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

function getBlogCategorySitemapRoutes(siteUrl: string): MetadataRoute.Sitemap {
  const categorySlugs = getBlogCategories('en').map((category) => category.slug);

  return LOCALES.flatMap((locale) =>
    categorySlugs.flatMap((categorySlug) => {
      const totalPages = getBlogCategoryPageCount(locale, categorySlug);
      const categoryPosts = getBlogPostsByCategory(locale, categorySlug);

      return Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;
        const canonicalPath = getBlogCategoryPagePath('en', categorySlug, pageNumber);
        const localizedPath = getBlogCategoryPagePath(locale, categorySlug, pageNumber);

        return {
          url: `${siteUrl}${localizedPath}`,
          lastModified: new Date(pickLatestIsoDate(categoryPosts.map((post) => post.updatedAt))),
          changeFrequency: 'weekly' as const,
          priority: pageNumber === 1 ? 0.65 : 0.55,
          alternates: buildAlternates(canonicalPath, siteUrl),
        };
      });
    }),
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const staticPaths = [
    '/',
    '/faq',
    '/privacy',
    '/about',
    '/changelog',
    '/dice-roller-dnd',
    '/armor-creator',
    '/outfit-creator',
    '/weapon-creator',
    '/army-formation-creator',
    '/army-formation-creator/backgrounds',
    '/emblem-creator',
    '/language-generator',
    '/scroll-creator',
    '/family-tree-creator',
    '/constellation-map-creator',
    '/solar-system-creator',
    '/periodic-table-creator',
    '/tarot-cards',
    '/coat-of-arms-maker',
    '/contact',
  ] as const;

  const staticRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    staticPaths.map((path) => {
      const supportPage = getStaticSupportPageFromPath(path);

      return {
        url: `${siteUrl}${getLocalizedPath(locale, path)}`,
        lastModified:
          path === '/dice-roller-dnd'
            ? new Date(DICE_ROLLER_LAST_MODIFIED)
            : path === '/coat-of-arms-maker'
            ? new Date(COAT_MAKER_LAST_MODIFIED)
            : path === '/emblem-creator'
            ? new Date(EMBLEM_CREATOR_LAST_MODIFIED)
            : path === '/outfit-creator'
            ? new Date(OUTFIT_CREATOR_LAST_MODIFIED)
            : path === '/weapon-creator'
            ? new Date(WEAPON_CREATOR_LAST_MODIFIED)
            : path === '/language-generator'
            ? new Date(LANGUAGE_GENERATOR_LAST_MODIFIED)
            : path === '/scroll-creator'
            ? new Date(SCROLL_CREATOR_LAST_MODIFIED)
            : path === '/family-tree-creator'
            ? new Date(FAMILY_TREE_CREATOR_LAST_MODIFIED)
            : path === '/constellation-map-creator'
            ? new Date(CONSTELLATION_MAP_CREATOR_LAST_MODIFIED)
            : path === '/solar-system-creator'
            ? new Date(SOLAR_SYSTEM_CREATOR_LAST_MODIFIED)
            : path === '/periodic-table-creator'
            ? new Date(PERIODIC_TABLE_CREATOR_LAST_MODIFIED)
            : path === '/tarot-cards'
            ? new Date(TAROT_CARDS_LAST_MODIFIED)
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

  const blogCategoryRoutes: MetadataRoute.Sitemap = BLOG_PLACEHOLDER_MODE
    ? []
    : getBlogCategorySitemapRoutes(siteUrl);

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

  return [...staticRoutes, ...templateRoutes, ...blogHubRoutes, ...blogCategoryRoutes, ...blogPostRoutes];
}
