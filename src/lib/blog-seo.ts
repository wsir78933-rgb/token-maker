import type { Metadata } from 'next';
import {
  getBlogPost,
  getPaginatedBlogPosts,
  type BlogPost,
} from '@/lib/blog-content';
import { getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getLanguageAlternates, getLocalizedPath, type SiteLocale } from '@/lib/site-locale';
import { getSeoImageUrl } from '@/lib/site-seo';

const blogCopyByLocale = {
  en: {
    title: 'Token Maker Blog',
    description:
      'Read practical posts about token workflows, platform-specific setup, export sizing, and other decisions around DnD, Roll20, and Foundry VTT token creation.',
    eyebrow: 'Blog',
    pageTitle: (page: number) => `Token Maker Blog - Page ${page}`,
    pageDescription: (page: number, totalPages: number) =>
      `Page ${page} of ${totalPages}. Read practical posts about token workflows, platform-specific setup, export sizing, and other decisions around DnD, Roll20, and Foundry VTT token creation.`,
  },
  zh: {
    title: 'Token Maker 博客',
    description:
      '阅读与 Token 制作有关的实用文章，覆盖 VTT 工作流、平台适配、导出尺寸，以及 DnD、Roll20、Foundry VTT 的常见决策。',
    eyebrow: '博客',
    pageTitle: (page: number) => `Token Maker 博客 第 ${page} 页`,
    pageDescription: (page: number, totalPages: number) =>
      `第 ${page} 页，共 ${totalPages} 页。阅读与 Token 制作有关的实用文章，覆盖 VTT 工作流、平台适配、导出尺寸，以及 DnD、Roll20、Foundry VTT 的常见决策。`,
  },
} as const;

export function getBlogIndexCopy(locale: SiteLocale) {
  return blogCopyByLocale[locale];
}

export function buildBlogIndexPath(locale: SiteLocale, currentPage = 1) {
  const basePath = getLocalizedPath(locale, '/blog');

  if (currentPage <= 1) {
    return basePath;
  }

  return `${basePath}?page=${currentPage}`;
}

export function createBlogIndexMetadata(locale: SiteLocale, currentPage = 1): Metadata {
  const siteConfig = getSiteConfig(locale);
  const copy = getBlogIndexCopy(locale);
  const pagination = getPaginatedBlogPosts(locale, currentPage);
  const page = pagination.currentPage;
  const path = buildBlogIndexPath(locale, page);
  const alternatePath = page === 1 ? '/blog' : `/blog?page=${page}`;
  const title = page === 1 ? copy.title : copy.pageTitle(page);
  const description =
    page === 1 ? copy.description : copy.pageDescription(page, pagination.totalPages);

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical: path,
      languages: getLanguageAlternates(alternatePath),
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: path,
      type: 'website',
      images: [
        {
          url: getSeoImageUrl(locale, 'guides'),
          width: 1200,
          height: 630,
          alt: copy.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [getSeoImageUrl(locale, 'guides')],
    },
  };
}

export function createBlogDetailMetadata(locale: SiteLocale, slug: string): Metadata {
  const post = getBlogPost(locale, slug);
  const siteConfig = getSiteConfig(locale);

  if (!post) {
    return {
      metadataBase: new URL(getSiteUrl()),
      title: locale === 'zh' ? '文章不存在' : 'Post not found',
    };
  }

  const path = getLocalizedPath(locale, `/blog/${post.slug}`);
  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.description;
  const socialImage = post.ogImage.startsWith('http')
    ? post.ogImage
    : `${getSiteUrl()}${post.ogImage}`;

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    authors: [{ name: post.author }],
    alternates: {
      canonical: post.canonical ?? path,
      languages: getLanguageAlternates(`/blog/${post.slug}`),
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: path,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: post.coverAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [socialImage],
    },
  };
}

export function buildBlogCollectionStructuredData(locale: SiteLocale, currentPage = 1) {
  const copy = getBlogIndexCopy(locale);
  const siteConfig = getSiteConfig(locale);
  const pagination = getPaginatedBlogPosts(locale, currentPage);
  const page = pagination.currentPage;
  const name = page === 1 ? copy.title : copy.pageTitle(page);
  const description =
    page === 1 ? copy.description : copy.pageDescription(page, pagination.totalPages);

  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name,
    description,
    url: `${getSiteUrl()}${buildBlogIndexPath(locale, page)}`,
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    blogPost: pagination.items.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: post.url,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      author: {
        '@type': 'Organization',
        name: post.author,
      },
    })),
  };
}

export function buildBlogPostStructuredData(locale: SiteLocale, post: BlogPost) {
  const siteConfig = getSiteConfig(locale);
  const image = post.cover.startsWith('http') ? post.cover : `${getSiteUrl()}${post.cover}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image,
    url: post.url,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    articleSection: post.category,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    mainEntityOfPage: post.url,
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
  };
}
