import type { Metadata } from 'next';

import { absoluteUrl, getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { LOCALES, getLanguageAlternates, getLocalizedPath, type SiteLocale } from '@/lib/site-locale';
import type { BlogPost } from './types';

export type { BlogPost, BlogPostFaqItem, BlogPostHeading, PlaceholderCopy } from './types';
export { addHeadingAnchors } from './html-utils';

export const BLOG_POSTS_PER_PAGE = 10;
export const BLOG_PLACEHOLDER_MODE = false;

// Re-export registry — the article data lives in registry.ts
import { postsByLocale, blogHubCopyByLocale, placeholderCopyByLocale } from './registry';

function isPublishedBlogPost(post: BlogPost) {
  return !post.placeholder && Boolean(post.bodyHtml);
}

export function getBlogPosts(locale: SiteLocale) {
  return postsByLocale[locale].filter(isPublishedBlogPost);
}

export function getFeaturedBlogPost(locale: SiteLocale) {
  return getBlogPosts(locale).find((post) => post.featured) ?? getBlogPosts(locale)[0];
}

export function getBlogPost(locale: SiteLocale, slug: string) {
  return getBlogPosts(locale).find((post) => post.slug === slug);
}

function getBlogPostLanguageAlternates(slug: string) {
  const path = `/blog/${slug}`;
  const availableLocales = LOCALES.filter((locale) => Boolean(getBlogPost(locale, slug)));

  if (availableLocales.length === 0) {
    return getLanguageAlternates(path);
  }

  const alternates: Record<string, string> = {
    'x-default': getLocalizedPath(availableLocales.includes('en') ? 'en' : availableLocales[0], path),
  };

  for (const locale of availableLocales) {
    alternates[locale === 'zh' ? 'zh-CN' : 'en-US'] = getLocalizedPath(locale, path);
  }

  return alternates;
}
export function getRelatedBlogPosts(locale: SiteLocale, slug: string, limit = 3) {
  const currentPost = getBlogPost(locale, slug);

  if (!currentPost) {
    return [];
  }

  const candidatePosts = getBlogPosts(locale).filter((post) => post.slug !== slug);

  const explicitMatches = (currentPost.relatedSlugs ?? [])
    .map((relatedSlug) => candidatePosts.find((post) => post.slug === relatedSlug))
    .filter((post): post is BlogPost => Boolean(post));

  const fallbackMatches = candidatePosts
    .filter((post) => !explicitMatches.includes(post))
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

  return [...explicitMatches, ...fallbackMatches].slice(0, limit);
}

export function getBlogPageCount(locale: SiteLocale) {
  const regularPosts = getBlogPosts(locale).filter((post) => !post.featured);
  return Math.max(1, Math.ceil(regularPosts.length / BLOG_POSTS_PER_PAGE));
}

export function getBlogPostsForPage(locale: SiteLocale, page: number) {
  const regularPosts = getBlogPosts(locale).filter((post) => !post.featured);
  const safePage = Math.max(1, page);
  const startIndex = (safePage - 1) * BLOG_POSTS_PER_PAGE;
  return regularPosts.slice(startIndex, startIndex + BLOG_POSTS_PER_PAGE);
}

export function getBlogHubPageContent(locale: SiteLocale, page = 1) {
  const pagePosts = getBlogPostsForPage(locale, page);

  if (page <= 1) {
    return {
      featuredPost: getFeaturedBlogPost(locale),
      gridPosts: pagePosts,
    };
  }

  if (!pagePosts[0]) {
    throw new Error(`Unable to resolve blog page content for locale=${locale}, page=${page}.`);
  }

  const featuredPost = getBlogPostsForPage(locale, page - 1)[0];
  if (!featuredPost) {
    throw new Error(`Unable to resolve blog page content for locale=${locale}, page=${page}.`);
  }

  return {
    featuredPost,
    gridPosts: pagePosts,
  };
}

export function getBlogPagePath(locale: SiteLocale, page: number) {
  const normalizedPage = Math.max(1, page);
  return getLocalizedPath(locale, normalizedPage === 1 ? '/blog' : `/blog/page/${normalizedPage}`);
}

export function getBlogPostPath(locale: SiteLocale, slug: string) {
  return getLocalizedPath(locale, `/blog/${slug}`);
}

export function formatBlogUpdatedAt(locale: SiteLocale, isoDate: string) {
  const formatter =
    locale === 'zh'
      ? new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' })
      : new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return formatter.format(new Date(isoDate));
}

export function getBlogHubTitle(locale: SiteLocale, page = 1) {
  const title = blogHubCopyByLocale[locale].title;
  if (page <= 1) return title;
  return locale === 'zh' ? `${title} - 第 ${page} 页` : `${title} - Page ${page}`;
}

export function getBlogHubDescription(locale: SiteLocale) {
  return blogHubCopyByLocale[locale].description;
}

export function getBlogHubPageDescription(locale: SiteLocale, page = 1) {
  if (page <= 1) {
    return getBlogHubDescription(locale);
  }

  const { featuredPost } = getBlogHubPageContent(locale, page);

  return locale === 'zh'
    ? `Token Maker 博客第 ${page} 页以「${featuredPost.coverLabel}」为起点，汇集 DND 指南、桌面工具与 Token 制作资源。`
    : `Page ${page} of the Token Maker blog features ${featuredPost.coverLabel}, with practical D&D guides, tabletop tools, and token-making resources for game prep.`;
}
export function createBlogHubMetadata(locale: SiteLocale, page = 1): Metadata {
  const siteConfig = getSiteConfig(locale);
  const path = page === 1 ? '/blog' : `/blog/page/${page}`;
  const localizedPath = getLocalizedPath(locale, path);
  const title = getBlogHubTitle(locale, page);
  const description = getBlogHubPageDescription(locale, page);

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical: localizedPath,
      languages: getLanguageAlternates(path),
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: absoluteUrl(localizedPath),
      siteName: siteConfig.name,
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteConfig.name}`,
      description,
    },
    robots: BLOG_PLACEHOLDER_MODE ? { index: false, follow: false } : undefined,
  };
}

export function createBlogPostMetadata(locale: SiteLocale, slug: string): Metadata {
  const siteConfig = getSiteConfig(locale);
  const post = getBlogPost(locale, slug);

  if (!post) {
    return { title: locale === 'zh' ? '文章不存在' : 'Article not found' };
  }

  const path = `/blog/${slug}`;
  const localizedPath = getLocalizedPath(locale, path);
  const metadataTitle = post.seoTitle ?? post.title;
  const description = post.metaDescription ?? post.excerpt;
  const absoluteCoverImage = post.coverImage ? absoluteUrl(post.coverImage) : undefined;
  const publishedTime = post.publishedAt ?? post.updatedAt;

  return {
    metadataBase: new URL(getSiteUrl()),
    title: metadataTitle,
    description,
    alternates: {
      canonical: localizedPath,
      languages: getBlogPostLanguageAlternates(slug),
    },
    openGraph: {
      title: `${metadataTitle} | ${siteConfig.name}`,
      description,
      url: absoluteUrl(localizedPath),
      siteName: siteConfig.name,
      type: 'article',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      publishedTime,
      modifiedTime: post.updatedAt,
      images: absoluteCoverImage
        ? [{ url: absoluteCoverImage, alt: post.coverAlt ?? post.title }]
        : undefined,
    },
    twitter: {
      card: absoluteCoverImage ? 'summary_large_image' : 'summary',
      title: `${metadataTitle} | ${siteConfig.name}`,
      description,
      images: absoluteCoverImage ? [absoluteCoverImage] : undefined,
    },
    robots: BLOG_PLACEHOLDER_MODE ? { index: false, follow: false } : undefined,
  };
}
export function buildBlogHubStructuredData(locale: SiteLocale, page = 1) {
  const siteConfig = getSiteConfig(locale);
  const path = page === 1 ? '/blog' : `/blog/page/${page}`;
  const title = getBlogHubTitle(locale, page);
  const description = getBlogHubPageDescription(locale, page);

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    url: absoluteUrl(getLocalizedPath(locale, path)),
    description,
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: absoluteUrl(getLocalizedPath(locale, '/')),
    },
  };
}

export function buildBlogPostStructuredData(locale: SiteLocale, slug: string) {
  const post = getBlogPost(locale, slug);
  if (!post) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.seoTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    dateModified: post.updatedAt,
    datePublished: post.publishedAt ?? post.updatedAt,
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    url: absoluteUrl(getBlogPostPath(locale, slug)),
    image: post.coverImage ? [absoluteUrl(post.coverImage)] : undefined,
  };
}

export function buildBlogPostFaqStructuredData(locale: SiteLocale, slug: string) {
  const post = getBlogPost(locale, slug);
  if (!post?.faqItems?.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    mainEntity: post.faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function getBlogPlaceholderCopy(locale: SiteLocale) {
  return placeholderCopyByLocale[locale];
}
