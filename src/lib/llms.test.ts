import { readFileSync } from 'node:fs';

import { describe, expect, test } from 'vitest';

import { getBlogPostPath, getBlogPosts } from '@/lib/blog-content';
import { getSiteUrl } from '@/lib/site-content';

const LLMS_PATH = 'public/llms.txt';
const LOCALES = ['en', 'zh'] as const;
const REQUIRED_LINES = [
  '# Token Maker',
  '## Core Pages',
  '## Blog And Guides',
  '## Site Files',
  '## Optional',
  '> Token Maker is a browser-based VTT token maker for DnD, Roll20, Foundry VTT, and similar tabletop workflows. It helps users upload character art, crop portraits, apply token masks and borders, add labels, and export transparent PNG tokens.',
  '- [Armor creator](https://www.tokenmaker.one/armor-creator): Assemble armor in the browser and download an image.',
  '- [Armor creator Chinese](https://www.tokenmaker.one/zh/armor-creator): 在浏览器里搭配护甲并下载图片。',
  '- [Outfit creator](https://www.tokenmaker.one/outfit-creator): Mix clothing layers in the browser, save four looks, and download a PNG.',
  '- [Outfit creator Chinese](https://www.tokenmaker.one/zh/outfit-creator): 在浏览器里组合服装图层、保存四套造型并下载 PNG。',
  '- [Fictional language generator](https://www.tokenmaker.one/language-generator): Create reusable spelling rules and convert vocabulary or custom text for fantasy worldbuilding, D&D, TTRPG campaigns, novels, and games.',
  '- [虚构语言生成器](https://www.tokenmaker.one/zh/language-generator): 为奇幻世界观、D&D、TTRPG 战役、小说和游戏创建可复用的拼写规则并转换词汇或自定义文本。',
  '- [Periodic table creator](https://www.tokenmaker.one/periodic-table-creator): Create editable real or fantasy element tables with custom text, layouts, colors, borders, images, local saves, and offline HTML downloads.',
  '- [元素周期表制作器](https://www.tokenmaker.one/zh/periodic-table-creator): 创建可编辑的真实或幻想元素周期表，自定义文字、布局、颜色、边框和图片，支持本地保存及离线 HTML 下载。',
  '- [Army formation creator](https://www.tokenmaker.one/army-formation-creator): Place battlefield pieces in the browser and download an image.',
  '- [Army formation creator Chinese](https://www.tokenmaker.one/zh/army-formation-creator): 在浏览器里摆放战场棋子并下载图片。',
  '- [Family tree creator](https://www.tokenmaker.one/family-tree-creator): Build editable family trees for novel characters, fantasy worlds, and D&D or TRPG campaigns, then save files or download an image.',
  '- [人物家谱制作器](https://www.tokenmaker.one/zh/family-tree-creator): 为小说人物、奇幻世界观和 D&D / TRPG 战役制作可编辑的家谱，保存文件或下载图片。',
  'Token Maker is designed for tabletop creators, game masters, players, and content publishers who need practical virtual tabletop tokens. The normal editor workflow is local-first: portrait images can stay in the browser during crop, style, and export.',
  'The site has English pages at root-level URLs and Simplified Chinese pages under `/zh`. Use `sitemap.xml` for the full indexable URL set and `robots.txt` for crawler access rules. Do not treat this file as permission to access disallowed paths such as `/api/`.',
];
const RETAINED_NON_ARTICLE_PATHS = [
  '/',
  '/zh',
  '/dice-roller-dnd',
  '/zh/dice-roller-dnd',
  '/language-generator',
  '/zh/language-generator',
  '/periodic-table-creator',
  '/zh/periodic-table-creator',
  '/armor-creator',
  '/zh/armor-creator',
  '/outfit-creator',
  '/zh/outfit-creator',
  '/army-formation-creator',
  '/zh/army-formation-creator',
  '/family-tree-creator',
  '/zh/family-tree-creator',
  '/templates/square-token-maker',
  '/zh/templates/square-token-maker',
  '/faq',
  '/zh/faq',
  '/privacy',
  '/contact',
  '/blog',
  '/zh/blog',
  '/sitemap.xml',
  '/robots.txt',
  '/manifest.webmanifest',
];
const NON_ARTICLE_BLOG_SLUGS = new Set(['category', 'page']);

function requireSiteUrl() {
  const siteUrl = getSiteUrl().trim();
  if (!siteUrl.startsWith('https://') && !siteUrl.startsWith('http://')) {
    throw new Error(`getSiteUrl() returned unsupported site URL ${JSON.stringify(siteUrl)}.`);
  }

  return siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
}

function readLlmsText() {
  const llmsText = readFileSync(LLMS_PATH, 'utf8');
  if (!llmsText.trim()) {
    throw new Error(`${LLMS_PATH} is empty.`);
  }

  return llmsText;
}

function stripTrailingSlash(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function readBlogArticleSlug(pathname: string) {
  const match = /^\/(?:zh\/)?blog\/([^/]+)$/.exec(pathname);
  if (!match) {
    return null;
  }

  const slug = match[1];
  if (NON_ARTICLE_BLOG_SLUGS.has(slug)) {
    return null;
  }

  return slug;
}

function parseMarkdownLinkDestinations(llmsText: string) {
  const destinations: string[] = [];

  for (let index = 0; index < llmsText.length; index += 1) {
    if (llmsText[index] !== '[') {
      continue;
    }

    const labelEnd = llmsText.indexOf(']', index + 1);
    if (labelEnd === -1) {
      throw new Error(`Unclosed markdown link label at index ${index} in ${LLMS_PATH}.`);
    }

    const label = llmsText.slice(index + 1, labelEnd);
    if (label.includes('\n') || llmsText[labelEnd + 1] !== '(') {
      continue;
    }

    const destinationEnd = llmsText.indexOf(')', labelEnd + 2);
    if (destinationEnd === -1) {
      throw new Error(`Unclosed markdown link destination at index ${index} in ${LLMS_PATH}.`);
    }

    const destination = llmsText.slice(labelEnd + 2, destinationEnd).trim().split(/\s+/)[0];
    if (!destination) {
      throw new Error(`Empty markdown link destination at index ${index} in ${LLMS_PATH}.`);
    }

    destinations.push(destination);
    index = destinationEnd;
  }

  return destinations;
}

function normalizeLlmsLinkUrl(destination: string, siteUrl: string) {
  const site = new URL(siteUrl);
  let url: URL;
  try {
    url = new URL(destination, `${site.origin}/`);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Invalid markdown link destination ${JSON.stringify(destination)} in ${LLMS_PATH}: ${reason}`,
    );
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(
      `Markdown link destination ${JSON.stringify(destination)} uses unsupported protocol ${JSON.stringify(url.protocol)}.`,
    );
  }

  if (url.origin !== site.origin) {
    throw new Error(
      `Markdown link destination ${JSON.stringify(destination)} resolved to ${JSON.stringify(url.href)}, outside site origin ${JSON.stringify(site.origin)}.`,
    );
  }

  const comparable = new URL(stripTrailingSlash(url.pathname), `${site.origin}/`);
  comparable.search = url.search;
  comparable.hash = url.hash;
  return comparable.href;
}

function listNormalizedLlmsLinkUrls(llmsText: string, siteUrl: string) {
  return parseMarkdownLinkDestinations(llmsText).map((destination) => normalizeLlmsLinkUrl(destination, siteUrl));
}

function buildAbsoluteUrl(pathname: string, siteUrl: string) {
  return normalizeLlmsLinkUrl(pathname, siteUrl);
}

function listPublishedArticleUrls(siteUrl: string) {
  const urls: string[] = [];

  for (const locale of LOCALES) {
    for (const post of getBlogPosts(locale)) {
      if (!post.slug.trim()) {
        throw new Error(`Published blog post in locale=${locale} has empty slug ${JSON.stringify(post.slug)}.`);
      }

      urls.push(buildAbsoluteUrl(getBlogPostPath(locale, post.slug), siteUrl));
    }
  }

  return urls;
}

function listRepeatedUrls(urls: string[]) {
  const counts = new Map<string, number>();
  for (const url of urls) {
    counts.set(url, (counts.get(url) ?? 0) + 1);
  }

  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([url, count]) => `${url} (count=${count})`);
}

function listUnknownArticleUrls(linkUrls: string[], publishedUrls: Set<string>) {
  const unknown = new Set<string>();

  for (const urlText of linkUrls) {
    const url = new URL(urlText);
    if (readBlogArticleSlug(stripTrailingSlash(url.pathname)) === null) {
      continue;
    }

    if (!publishedUrls.has(urlText)) {
      unknown.add(urlText);
    }
  }

  return [...unknown].sort((left, right) => left.localeCompare(right));
}

function formatUrlList(label: string, urls: string[]) {
  return `${label} (${urls.length}):\n${urls.map((url) => `- ${url}`).join('\n')}`;
}

function assertArticleLinks(linkUrls: string[], publishedUrls: string[]) {
  const publishedRepeats = listRepeatedUrls(publishedUrls);
  if (publishedRepeats.length > 0) {
    throw new Error(`getBlogPosts returned duplicate article URLs:\n${formatUrlList('Duplicate published URLs', publishedRepeats)}`);
  }

  const publishedUrlSet = new Set(publishedUrls);
  const articleLinkUrls = linkUrls.filter((urlText) => {
    const url = new URL(urlText);
    return readBlogArticleSlug(stripTrailingSlash(url.pathname)) !== null;
  });
  const missing = [...publishedUrlSet].filter((url) => !linkUrls.includes(url)).sort((left, right) => left.localeCompare(right));
  const duplicates = listRepeatedUrls(articleLinkUrls);
  const unknown = listUnknownArticleUrls(linkUrls, publishedUrlSet);

  console.info(
    `published=${publishedUrls.length} linkUrls=${linkUrls.length} articleLinks=${articleLinkUrls.length} missing=${missing.length} duplicates=${duplicates.length} unknown=${unknown.length}`,
  );

  const problems = [
    missing.length > 0 ? formatUrlList('Missing published article URLs', missing) : '',
    duplicates.length > 0 ? formatUrlList('Duplicate article URLs', duplicates) : '',
    unknown.length > 0 ? formatUrlList('Unknown or placeholder article URLs', unknown) : '',
  ].filter((problem) => problem.length > 0);

  if (problems.length > 0) {
    throw new Error(problems.join('\n'));
  }
}

function assertRetainedLines(llmsText: string) {
  const lines = new Set(llmsText.split('\n'));
  const missing = REQUIRED_LINES.filter((line) => !lines.has(line));
  if (missing.length > 0) {
    throw new Error(
      `Missing handwritten llms.txt lines: ${missing.map((line) => JSON.stringify(line)).join(', ')}`,
    );
  }
}

function assertRetainedNonArticleUrls(linkUrls: string[], siteUrl: string) {
  const linkUrlSet = new Set(linkUrls);
  const missing = RETAINED_NON_ARTICLE_PATHS.map((pathname) => buildAbsoluteUrl(pathname, siteUrl)).filter(
    (url) => !linkUrlSet.has(url),
  );

  if (missing.length > 0) {
    throw new Error(formatUrlList('Missing core or site-file URLs', missing));
  }
}

describe('public/llms.txt article index', () => {
  test('lists every published localized article once and rejects unknown article links', () => {
    const siteUrl = requireSiteUrl();
    const linkUrls = listNormalizedLlmsLinkUrls(readLlmsText(), siteUrl);
    const publishedUrls = listPublishedArticleUrls(siteUrl);

    assertArticleLinks(linkUrls, publishedUrls);
    expect(new Set(publishedUrls).size).toBe(publishedUrls.length);
  });

  test('keeps the handwritten introduction, core pages, and site files', () => {
    const siteUrl = requireSiteUrl();
    const llmsText = readLlmsText();
    const linkUrls = listNormalizedLlmsLinkUrls(llmsText, siteUrl);

    assertRetainedLines(llmsText);
    assertRetainedNonArticleUrls(linkUrls, siteUrl);
  });

  test('does not classify category, pagination, or blog index URLs as articles', () => {
    const nonArticlePaths = [
      '/blog/category/spells',
      '/zh/blog/category/spells',
      '/blog/category/spells/page/2',
      '/blog/page/2',
      '/zh/blog/page/2',
      '/blog',
      '/zh/blog',
      '/blog/category',
      '/blog/page',
    ];

    for (const pathname of nonArticlePaths) {
      const slug = readBlogArticleSlug(pathname);
      if (slug !== null) {
        throw new Error(`Pathname ${JSON.stringify(pathname)} was classified as article slug ${JSON.stringify(slug)}.`);
      }
    }

    expect(readBlogArticleSlug('/blog/dnd-ranger')).toBe('dnd-ranger');
    expect(readBlogArticleSlug('/blog/dnd-ranger-spells')).toBe('dnd-ranger-spells');
    expect(readBlogArticleSlug('/zh/blog/dnd-ranger')).toBe('dnd-ranger');
    expect(readBlogArticleSlug('/zh/blog/dnd-ranger-spells')).toBe('dnd-ranger-spells');
  });

  test('requires the exact dnd-ranger URL and does not accept dnd-ranger-spells in its place', () => {
    const siteUrl = requireSiteUrl();
    const englishPosts = getBlogPosts('en');
    const chinesePosts = getBlogPosts('zh');
    const ranger = englishPosts.find((post) => post.slug === 'dnd-ranger');
    const rangerSpells = englishPosts.find((post) => post.slug === 'dnd-ranger-spells');
    const chineseRanger = chinesePosts.find((post) => post.slug === 'dnd-ranger');
    const chineseRangerSpells = chinesePosts.find((post) => post.slug === 'dnd-ranger-spells');

    if (!ranger || !rangerSpells || !chineseRanger || !chineseRangerSpells) {
      throw new Error(
        `Expected published dnd-ranger and dnd-ranger-spells in both locales, found enRanger=${Boolean(ranger)} enRangerSpells=${Boolean(rangerSpells)} zhRanger=${Boolean(chineseRanger)} zhRangerSpells=${Boolean(chineseRangerSpells)}.`,
      );
    }

    const linkUrls = new Set(listNormalizedLlmsLinkUrls(readLlmsText(), siteUrl));
    const requiredUrls = [
      buildAbsoluteUrl(getBlogPostPath('en', ranger.slug), siteUrl),
      buildAbsoluteUrl(getBlogPostPath('zh', chineseRanger.slug), siteUrl),
      buildAbsoluteUrl(getBlogPostPath('en', rangerSpells.slug), siteUrl),
      buildAbsoluteUrl(getBlogPostPath('zh', chineseRangerSpells.slug), siteUrl),
    ];

    expect(new Set(requiredUrls).size).toBe(requiredUrls.length);

    const missing = requiredUrls.filter((url) => !linkUrls.has(url));
    if (missing.length > 0) {
      throw new Error(formatUrlList('Missing exact ranger article URLs', missing));
    }
  });
});
