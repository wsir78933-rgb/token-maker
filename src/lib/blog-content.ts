import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import { absoluteUrl } from '@/lib/site-content';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const BLOG_CONTENT_ROOT = path.join(process.cwd(), 'content', 'blog');
export const BLOG_PAGE_SIZE = 3;

export interface BlogHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface BlogPost {
  locale: SiteLocale;
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  featured: boolean;
  draft: boolean;
  canonical?: string;
  seoTitle?: string;
  seoDescription?: string;
  relatedPostSlugs: string[];
  relatedTemplateSlugs: string[];
  ctaQuery: string;
  cover: string;
  coverAlt: string;
  ogImage: string;
  readingTime: string;
  content: string;
  html: string;
  headings: BlogHeading[];
  path: string;
  url: string;
}

interface ParsedFrontmatter {
  [key: string]: unknown;
}

interface ParsedMarkdown {
  html: string;
  headings: BlogHeading[];
}

export interface PaginatedBlogPosts {
  items: BlogPost[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

function stripQuotes(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function parseArrayValue(value: string) {
  const inner = value.slice(1, -1).trim();

  if (!inner) {
    return [];
  }

  return inner
    .split(',')
    .map((item) => stripQuotes(item.trim()))
    .filter(Boolean);
}

function parseScalarValue(value: string): unknown {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  if (trimmed === 'true') {
    return true;
  }

  if (trimmed === 'false') {
    return false;
  }

  if (trimmed === 'null') {
    return null;
  }

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return parseArrayValue(trimmed);
  }

  return stripQuotes(trimmed);
}

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    throw new Error('Blog post is missing frontmatter.');
  }

  const [, frontmatterBlock, content] = match;
  const data: ParsedFrontmatter = {};

  for (const line of frontmatterBlock.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf(':');

    if (separatorIndex === -1) {
      throw new Error(`Invalid frontmatter line: ${trimmed}`);
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    data[key] = parseScalarValue(value);
  }

  return {
    data,
    content: content.trim(),
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute(value: string) {
  return escapeHtml(value);
}

function isEditorLaunchHref(value: string) {
  return /^\/(?:zh)?\?[^#]+#editor-workspace$/.test(value);
}

function slugify(value: string) {
  const normalized = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();

  return normalized || 'section';
}

function renderInline(markdown: string) {
  const linkReplacements: string[] = [];
  const withLinkPlaceholders = markdown.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_match, label: string, href: string) => {
      const placeholder = `@@BLOG_LINK_${linkReplacements.length}@@`;
      const normalizedHref = href.trim();

      if (isEditorLaunchHref(normalizedHref)) {
        linkReplacements.push(
          `<button type="button" class="blog-link blog-link--button" data-editor-launch="${escapeAttribute(normalizedHref)}">${escapeHtml(label)}</button>`,
        );
      } else {
        linkReplacements.push(
          `<a href="${escapeAttribute(normalizedHref)}" class="blog-link"${normalizedHref.startsWith('http') ? ' target="_blank" rel="noreferrer"' : ''}>${escapeHtml(label)}</a>`,
        );
      }

      return placeholder;
    },
  );

  let html = escapeHtml(withLinkPlaceholders);

  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = linkReplacements.reduce(
    (currentHtml, replacement, index) => currentHtml.replace(`@@BLOG_LINK_${index}@@`, replacement),
    html,
  );

  return html;
}

function markdownToHtml(markdown: string): ParsedMarkdown {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: string[] = [];
  const headings: BlogHeading[] = [];
  const headingIds = new Map<string, number>();
  let index = 0;

  const createHeadingId = (text: string) => {
    const base = slugify(text);
    const usedCount = headingIds.get(base) ?? 0;
    headingIds.set(base, usedCount + 1);

    return usedCount ? `${base}-${usedCount + 1}` : base;
  };

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (trimmed.startsWith('```')) {
      const language = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        codeLines.push(lines[index]);
        index += 1;
      }

      if (index < lines.length) {
        index += 1;
      }

      blocks.push(
        `<pre><code${language ? ` data-language="${escapeAttribute(language)}"` : ''}>${escapeHtml(codeLines.join('\n'))}</code></pre>`,
      );
      continue;
    }

    if (/^#{1,6}\s+/.test(trimmed)) {
      const [, hashes, headingText] = trimmed.match(/^(#{1,6})\s+(.*)$/) ?? [];
      const level = hashes.length;
      const id = createHeadingId(headingText);

      if (level === 2 || level === 3) {
        headings.push({
          id,
          text: headingText,
          level,
        });
      }

      blocks.push(`<h${level} id="${id}">${renderInline(headingText)}</h${level}>`);
      index += 1;
      continue;
    }

    if (trimmed === '---') {
      blocks.push('<hr />');
      index += 1;
      continue;
    }

    if (/^!\[[^\]]*]\([^)]+\)$/.test(trimmed)) {
      const [, alt, src] = trimmed.match(/^!\[([^\]]*)]\(([^)]+)\)$/) ?? [];
      blocks.push(
        `<figure><img src="${escapeAttribute(src)}" alt="${escapeAttribute(alt)}" loading="lazy" /><figcaption>${escapeHtml(alt)}</figcaption></figure>`,
      );
      index += 1;
      continue;
    }

    if (trimmed.startsWith('<iframe') || trimmed.startsWith('<video') || trimmed.startsWith('<a')) {
      const rawBlock: string[] = [line];
      index += 1;

      while (
        index < lines.length &&
        !lines[index].includes('</iframe>') &&
        !lines[index].includes('</video>') &&
        !lines[index].includes('</a>')
      ) {
        rawBlock.push(lines[index]);
        index += 1;
      }

      if (index < lines.length) {
        rawBlock.push(lines[index]);
        index += 1;
      }

      blocks.push(rawBlock.join('\n'));
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines: string[] = [];

      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ''));
        index += 1;
      }

      blocks.push(`<blockquote><p>${renderInline(quoteLines.join(' '))}</p></blockquote>`);
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];

      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ''));
        index += 1;
      }

      blocks.push(`<ul>${items.map((item) => `<li>${renderInline(item)}</li>`).join('')}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];

      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ''));
        index += 1;
      }

      blocks.push(`<ol>${items.map((item) => `<li>${renderInline(item)}</li>`).join('')}</ol>`);
      continue;
    }

    const paragraphLines: string[] = [];

    while (index < lines.length) {
      const current = lines[index].trim();

      if (
        !current ||
        current.startsWith('```') ||
        /^#{1,6}\s+/.test(current) ||
        current === '---' ||
        /^!\[[^\]]*]\([^)]+\)$/.test(current) ||
        current.startsWith('<iframe') ||
        current.startsWith('<video') ||
        current.startsWith('<a') ||
        /^>\s?/.test(current) ||
        /^[-*]\s+/.test(current) ||
        /^\d+\.\s+/.test(current)
      ) {
        break;
      }

      paragraphLines.push(current);
      index += 1;
    }

    blocks.push(`<p>${renderInline(paragraphLines.join(' '))}</p>`);
  }

  return {
    html: blocks.join('\n'),
    headings,
  };
}

function estimateReadingTime(locale: SiteLocale, content: string) {
  const latinWords = content.match(/[A-Za-z0-9]+/g)?.length ?? 0;
  const cjkCharacters = content.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const effectiveWords = latinWords + cjkCharacters;
  const wordsPerMinute = locale === 'zh' ? 320 : 220;
  const minutes = Math.max(1, Math.ceil(effectiveWords / wordsPerMinute));

  return locale === 'zh' ? `${minutes} 分钟阅读` : `${minutes} min read`;
}

function parseString(data: ParsedFrontmatter, key: string, fallback?: string) {
  const value = data[key];

  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  if (fallback !== undefined) {
    return fallback;
  }

  throw new Error(`Missing required frontmatter field "${key}".`);
}

function parseStringArray(data: ParsedFrontmatter, key: string) {
  const value = data[key];

  if (!value) {
    return [];
  }

  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
    return value;
  }

  throw new Error(`Frontmatter field "${key}" must be a string array.`);
}

function parseBoolean(data: ParsedFrontmatter, key: string, fallback = false) {
  const value = data[key];

  if (typeof value === 'boolean') {
    return value;
  }

  return fallback;
}

function readPostFile(locale: SiteLocale, fileName: string): BlogPost {
  const fullPath = path.join(BLOG_CONTENT_ROOT, locale, fileName);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = parseFrontmatter(raw);
  const slug = parseString(data, 'slug', fileName.replace(/\.md$/, ''));
  const { html, headings } = markdownToHtml(content);
  const pathName = getLocalizedPath(locale, `/blog/${slug}`);
  const fallbackOgImage = getLocalizedPath(locale, `/blog/${slug}/opengraph-image`);
  const cover = parseString(data, 'cover', fallbackOgImage);
  const title = parseString(data, 'title');

  return {
    locale,
    slug,
    title,
    description: parseString(data, 'description'),
    excerpt: parseString(data, 'excerpt'),
    author: parseString(
      data,
      'author',
      locale === 'zh' ? 'Token Maker 编辑组' : 'Token Maker Editorial Team',
    ),
    publishedAt: parseString(data, 'publishedAt'),
    updatedAt: parseString(data, 'updatedAt', parseString(data, 'publishedAt')),
    category: parseString(data, 'category'),
    tags: parseStringArray(data, 'tags'),
    featured: parseBoolean(data, 'featured'),
    draft: parseBoolean(data, 'draft'),
    canonical: typeof data.canonical === 'string' ? data.canonical : undefined,
    seoTitle: typeof data.seoTitle === 'string' ? data.seoTitle : undefined,
    seoDescription: typeof data.seoDescription === 'string' ? data.seoDescription : undefined,
    relatedPostSlugs: parseStringArray(data, 'relatedPostSlugs'),
    relatedTemplateSlugs: parseStringArray(data, 'relatedTemplateSlugs'),
    ctaQuery: parseString(data, 'ctaQuery', getLocalizedPath(locale, '/')),
    cover,
    coverAlt: parseString(data, 'coverAlt', title),
    ogImage: parseString(data, 'ogImage', fallbackOgImage),
    readingTime: estimateReadingTime(locale, content),
    content,
    html,
    headings,
    path: pathName,
    url: absoluteUrl(pathName),
  };
}

const loadBlogPosts = cache((locale: SiteLocale) => {
  const localeDir = path.join(BLOG_CONTENT_ROOT, locale);

  if (!fs.existsSync(localeDir)) {
    return [] as BlogPost[];
  }

  return fs
    .readdirSync(localeDir)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => readPostFile(locale, fileName))
    .sort((left, right) => {
      const dateDifference =
        new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();

      if (dateDifference !== 0) {
        return dateDifference;
      }

      return left.slug.localeCompare(right.slug);
    });
});

export function getAllBlogPosts(locale: SiteLocale) {
  return loadBlogPosts(locale);
}

export function getPublishedBlogPosts(locale: SiteLocale) {
  return getAllBlogPosts(locale).filter((post) => !post.draft);
}

export function getFeaturedBlogPost(locale: SiteLocale) {
  return getPublishedBlogPosts(locale).find((post) => post.featured) ?? getPublishedBlogPosts(locale)[0];
}

export function getBlogPost(locale: SiteLocale, slug: string) {
  return getPublishedBlogPosts(locale).find((post) => post.slug === slug);
}

export function getPaginatedBlogPosts(
  locale: SiteLocale,
  currentPage = 1,
  pageSize = BLOG_PAGE_SIZE,
): PaginatedBlogPosts {
  const posts = getPublishedBlogPosts(locale);
  const totalItems = posts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const items = posts.slice(startIndex, startIndex + pageSize);

  return {
    items,
    totalItems,
    currentPage: safeCurrentPage,
    totalPages,
    hasPreviousPage: safeCurrentPage > 1,
    hasNextPage: safeCurrentPage < totalPages,
  };
}

export function getAdjacentBlogPosts(locale: SiteLocale, slug: string) {
  const posts = getPublishedBlogPosts(locale);
  const currentIndex = posts.findIndex((post) => post.slug === slug);

  if (currentIndex === -1) {
    return {
      previousPost: undefined,
      nextPost: undefined,
    };
  }

  return {
    previousPost: posts[currentIndex - 1],
    nextPost: posts[currentIndex + 1],
  };
}

export function getRelatedBlogPosts(locale: SiteLocale, slug: string, limit = 3) {
  const currentPost = getBlogPost(locale, slug);

  if (!currentPost) {
    return [];
  }

  const allPosts = getPublishedBlogPosts(locale).filter((post) => post.slug !== slug);
  const explicitMatches = currentPost.relatedPostSlugs
    .map((targetSlug) => allPosts.find((post) => post.slug === targetSlug))
    .filter((post): post is BlogPost => Boolean(post));

  const fallbackMatches = allPosts
    .filter((post) => {
      if (explicitMatches.some((matchedPost) => matchedPost.slug === post.slug)) {
        return false;
      }

      const sharedTags = post.tags.filter((tag) => currentPost.tags.includes(tag)).length;

      return post.category === currentPost.category || sharedTags > 0;
    })
    .sort((left, right) => {
      const rightSharedTags = right.tags.filter((tag) => currentPost.tags.includes(tag)).length;
      const leftSharedTags = left.tags.filter((tag) => currentPost.tags.includes(tag)).length;

      return rightSharedTags - leftSharedTags;
    });

  return [...explicitMatches, ...fallbackMatches].slice(0, limit);
}

export function getBlogCategories(locale: SiteLocale) {
  return Array.from(new Set(getPublishedBlogPosts(locale).map((post) => post.category)));
}

export function getLatestBlogUpdate(locale: SiteLocale) {
  const posts = getPublishedBlogPosts(locale);

  return posts.reduce<string | undefined>((latest, post) => {
    if (!latest) {
      return post.updatedAt;
    }

    return new Date(post.updatedAt).getTime() > new Date(latest).getTime()
      ? post.updatedAt
      : latest;
  }, undefined);
}
