import type { MetadataRoute } from 'next';
import { getPaginatedBlogPosts, getPublishedBlogPosts } from '@/lib/blog-content';
import { buildBlogIndexPath } from '@/lib/blog-seo';
import { getSiteUrl } from '@/lib/site-content';
import {
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
      const latestBlogUpdate = getPublishedBlogPosts(locale)[0]?.updatedAt ?? '2026-03-12';
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
        lastModified:
          path === '/blog'
            ? new Date(latestBlogUpdate)
            : pageKey
              ? new Date(getStaticPageLastModified(locale, pageKey))
              : homepageUpdatedAt,
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

  const blogRoutes = LOCALES.flatMap((locale) =>
    getPublishedBlogPosts(locale).map((post) => ({
      url: `${siteUrl}${getLocalizedPath(locale, `/blog/${post.slug}`)}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  );

  const paginatedBlogRoutes = LOCALES.flatMap((locale) => {
    const { totalPages } = getPaginatedBlogPosts(locale);

    return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => {
      const currentPage = index + 2;
      const pageItems = getPaginatedBlogPosts(locale, currentPage).items;
      const latestPageUpdate =
        pageItems.reduce(
          (latest, post) => (latest > post.updatedAt ? latest : post.updatedAt),
          pageItems[0]?.updatedAt ?? getPublishedBlogPosts(locale)[0]?.updatedAt ?? '2026-03-12',
        );

      return {
        url: `${siteUrl}${buildBlogIndexPath(locale, currentPage)}`,
        lastModified: new Date(latestPageUpdate),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      };
    });
  });

  return [...staticRoutes, ...templateRoutes, ...blogRoutes, ...paginatedBlogRoutes];
}
