// @vitest-environment jsdom

import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import sitemap from '@/app/sitemap';
import {
  DND_WARLOCK_SPELLS_COVER_PATH,
  DND_WARLOCK_SPELLS_ELDRITCH_BLAST_IMAGE_PATH,
  DND_WARLOCK_SPELLS_ARCANE_FLIGHT_IMAGE_PATH,
  DND_WARLOCK_SPELLS_FOCUSED_CONCENTRATION_IMAGE_PATH,
} from '@/lib/blog-posts/shared';
import {
  DND_WARLOCK_SPELLS_CHINESE_SEO_TITLE,
  DND_WARLOCK_SPELLS_ENGLISH_SEO_TITLE,
} from '@/lib/blog-posts/dnd-warlock-spells';
import {
  buildBlogPostStructuredData,
  createBlogPostMetadata,
  getBlogPost,
  getBlogPostPath,
  getBlogPostsByCategory,
} from './index';
import { getBlogCategory } from './categories';

const SLUG = 'dnd-warlock-spells';
const UPDATED_AT = '2026-09-26';
const ENGLISH_TITLE = 'DnD Warlock Spells: Six Choices, Two Slots, One Missing Party Job';
const CHINESE_TITLE = '龙与地下城契术师法术：远程、控场、位移、反应怎么选';
const ENGLISH_IMAGES = [
  DND_WARLOCK_SPELLS_ELDRITCH_BLAST_IMAGE_PATH,
  DND_WARLOCK_SPELLS_ARCANE_FLIGHT_IMAGE_PATH,
  DND_WARLOCK_SPELLS_FOCUSED_CONCENTRATION_IMAGE_PATH,
] as const;
const CHINESE_IMAGES = [DND_WARLOCK_SPELLS_ELDRITCH_BLAST_IMAGE_PATH] as const;

function getBodyRoot(bodyHtml: string) {
  return new DOMParser().parseFromString(bodyHtml, 'text/html').body;
}

function expectWebpAsset(path: string) {
  const bytes = readFileSync(`public${path}`);

  expect(bytes.subarray(0, 4).toString('ascii')).toBe('RIFF');
  expect(bytes.subarray(8, 12).toString('ascii')).toBe('WEBP');
}

function expectReaderBody(bodyHtml: string, imagePaths: readonly string[], sourceHeading: string) {
  const bodyRoot = getBodyRoot(bodyHtml);
  const images = Array.from(bodyRoot.querySelectorAll('figure img'));
  const captions = Array.from(bodyRoot.querySelectorAll('figure figcaption'));

  expect(bodyRoot.querySelector('h1')).toBeNull();
  expect(images.map((image) => image.getAttribute('src'))).toEqual([...imagePaths]);
  expect(images.every((image) => image.getAttribute('alt'))).toBe(true);
  expect(images.every((image) => image.getAttribute('width') === '1536')).toBe(true);
  expect(images.every((image) => image.getAttribute('height') === '1024')).toBe(true);
  expect(images.every((image) => image.getAttribute('loading') === 'lazy')).toBe(true);
  expect(images.every((image) => image.getAttribute('decoding') === 'async')).toBe(true);
  expect(captions).toHaveLength(images.length);
  expect(bodyRoot.querySelector(`h2`)).not.toBeNull();
  expect(Array.from(bodyRoot.querySelectorAll('h2')).some((heading) => heading.textContent === sourceHeading)).toBe(true);
  expect(bodyRoot.querySelectorAll('table').length).toBeGreaterThanOrEqual(1);

  for (const forbiddenText of [
    'author-notes',
    'handoff',
    'dispatch',
    'agent',
    'task-id',
    'editorial/',
    '../../media/',
    'PublicBlogHandoff',
  ]) {
    expect(bodyHtml.toLowerCase()).not.toContain(forbiddenText.toLowerCase());
  }
}

describe('dnd warlock spells blog post', () => {
  test('registers bilingual reader content with public source tables and character WebP assets', () => {
    const englishPost = getBlogPost('en', SLUG);
    const chinesePost = getBlogPost('zh', SLUG);

    expect(englishPost).toMatchObject({
      slug: SLUG,
      title: ENGLISH_TITLE,
      updatedAt: UPDATED_AT,
      publishedAt: UPDATED_AT,
      coverImage: DND_WARLOCK_SPELLS_COVER_PATH,
      category: 'spells',
      faqItems: [],
    });
    expect(chinesePost).toMatchObject({
      slug: SLUG,
      title: CHINESE_TITLE,
      updatedAt: UPDATED_AT,
      publishedAt: UPDATED_AT,
      coverImage: DND_WARLOCK_SPELLS_COVER_PATH,
      category: 'spells',
      faqItems: [],
    });

    expectReaderBody(englishPost?.bodyHtml ?? '', ENGLISH_IMAGES, 'Sources');
    expectReaderBody(chinesePost?.bodyHtml ?? '', CHINESE_IMAGES, '来源表');
    expect(englishPost?.bodyHtml).toContain('https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Warlock');
    expect(chinesePost?.bodyHtml).toContain('https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Warlock');

    for (const imagePath of [...ENGLISH_IMAGES, ...CHINESE_IMAGES]) {
      expect(existsSync(`public${imagePath}`)).toBe(true);
      expectWebpAsset(imagePath);
    }
  });

  test('keeps the English opening paragraph reader-facing and aligned with the final body', () => {
    const finalEnglishBody = readFileSync('editorial/dnd-warlock-spells/final/en/body.md', 'utf8');
    const finalEnglishFirstParagraph = finalEnglishBody.split(/\n\n/, 1)[0]?.trim();
    const finalEnglishFirstParagraphText = finalEnglishFirstParagraph
      ?.replace('**dnd warlock spells**', 'dnd warlock spells')
      .replace('`2024`', '2024');
    const englishBodyRoot = getBodyRoot(getBlogPost('en', SLUG)?.bodyHtml ?? '');

    expect(finalEnglishFirstParagraph).toBe(
      'Start a level-5 Warlock worksheet by writing `2024` at the top, then organize your **dnd warlock spells** around six base prepared-spell entries, two level-3 Pact Magic slots, and the party job that still needs coverage. Any spells made always prepared by a feature are separate from those six entries. The result is a conditional six-name list you can check against your table, not a universal ranking of the “best” spells.',
    );
    expect(englishBodyRoot.querySelector('p')?.textContent?.trim()).toBe(finalEnglishFirstParagraphText);
  });

  test('keeps the Chinese opening paragraph aligned with the final body', () => {
    const finalChineseBody = readFileSync('editorial/dnd-warlock-spells/final/zh-CN/body.md', 'utf8');
    const finalChineseFirstParagraph = finalChineseBody.split(/\n\n/, 1)[0]?.trim();
    if (!finalChineseFirstParagraph) {
      throw new Error('final/zh-CN/body.md is missing its opening paragraph.');
    }

    const chineseBodyRoot = getBodyRoot(getBlogPost('zh', SLUG)?.bodyHtml ?? '');

    expect(chineseBodyRoot.querySelector('p')?.textContent?.trim()).toBe(finalChineseFirstParagraph);
  });

  test('uses Chinese spell names after one English introduction and Chinese source labels', () => {
    const chinesePost = getBlogPost('zh', SLUG);
    const chineseBodyRoot = getBodyRoot(chinesePost?.bodyHtml ?? '');
    const finalChineseBody = readFileSync('editorial/dnd-warlock-spells/final/zh-CN/body.md', 'utf8');
    const finalChineseProse = finalChineseBody.split('## 来源表')[0]
      .replace(/^!\[.*\n/gm, '')
      .replace(/^\*遗迹石厅.*\n/gm, '')
      .replace(/\]\(https?:\/\/[^)]+\)/g, ']');

    // Image captions are intentionally preserved; attribution has separate checks below.
    chineseBodyRoot.querySelectorAll('figure, details').forEach((element) => element.remove());
    const readerText = chineseBodyRoot.textContent ?? '';
    expect(chinesePost?.title).toBe(CHINESE_TITLE);
    expect(chinesePost?.excerpt).not.toMatch(/dnd warlock spells|Pact Magic|Warlock/);
    expect(readerText.match(/dnd warlock spells/g)).toHaveLength(1);
    expect(finalChineseProse.match(/dnd warlock spells/g)).toHaveLength(1);
    for (const [chineseName, englishName] of [
      ['契术魔法', 'Pact Magic'],
      ['魔能爆', 'Eldritch Blast'],
      ['脆弱诅咒', 'Hex'],
      ['炼狱叱喝', 'Hellish Rebuke'],
      ['迷踪步', 'Misty Step'],
      ['催眠图纹', 'Hypnotic Pattern'],
      ['法术反制', 'Counterspell'],
      ['人类定身术', 'Hold Person'],
    ]) {
      expect(readerText).toContain(`${chineseName}（${englishName}）`);
      expect(readerText.split(englishName)).toHaveLength(2);
      expect(finalChineseProse.split(englishName)).toHaveLength(2);
    }
    expect(readerText).not.toMatch(/\b(?:DM|DC|Humanoid|Magical Cunning|Warlock)\b/);
    const sourceTable = Array.from(chineseBodyRoot.querySelectorAll('table')).at(-1);
    expect(sourceTable?.querySelectorAll('tbody tr')).toHaveLength(10);
    expect(sourceTable?.textContent).not.toMatch(/Warlock|Pact Magic|Eldritch Blast|Hex|Hellish Rebuke|Misty Step|Hypnotic Pattern|Counterspell|Hold Person/);
  });

  test('exposes bilingual public attribution after each source table', () => {
    const englishPost = getBlogPost('en', SLUG);
    const chinesePost = getBlogPost('zh', SLUG);
    const englishBodyRoot = getBodyRoot(englishPost?.bodyHtml ?? '');
    const chineseBodyRoot = getBodyRoot(chinesePost?.bodyHtml ?? '');
    const finalEnglishAttributionBody = readFileSync('editorial/dnd-warlock-spells/final/en/attribution.md', 'utf8')
      .trim()
      .split(/\n\n/)
      .at(-1);
    const finalChineseAttributionBody = readFileSync('editorial/dnd-warlock-spells/final/zh-CN/attribution.md', 'utf8')
      .trim()
      .split(/\n\n/)[1]
      ?.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    if (!finalEnglishAttributionBody || !finalChineseAttributionBody) {
      throw new Error('The bilingual attribution files are missing their public attribution text.');
    }

    expect(Array.from(englishBodyRoot.querySelectorAll('h2')).at(-1)?.textContent).toBe('Public attribution');
    expect(Array.from(chineseBodyRoot.querySelectorAll('h2')).at(-1)?.textContent).toBe('公开署名');
    expect(englishBodyRoot.textContent).toContain(finalEnglishAttributionBody);
    expect(chineseBodyRoot.textContent).toContain(finalChineseAttributionBody);
    expect(englishBodyRoot.querySelector('a[href="https://www.dndbeyond.com/srd"]')).not.toBeNull();
    expect(chineseBodyRoot.querySelector('a[href="https://www.dndbeyond.com/srd"]')).not.toBeNull();
    expect(englishBodyRoot.querySelector('a[href="https://creativecommons.org/licenses/by/4.0/legalcode"]')).not.toBeNull();
    expect(chineseBodyRoot.querySelector('a[href="https://creativecommons.org/licenses/by/4.0/legalcode"]')).not.toBeNull();

    const chineseAttributionHeading = Array.from(chineseBodyRoot.querySelectorAll('h2')).at(-1);
    const chineseAttributionParagraph = chineseAttributionHeading?.nextElementSibling;
    const licenseDetails = chineseAttributionParagraph?.nextElementSibling;
    expect(chineseAttributionParagraph?.tagName).toBe('P');
    expect(chineseAttributionParagraph?.textContent).toBe(finalChineseAttributionBody);
    expect(chineseAttributionParagraph?.textContent).toContain('本作品包含来自 Wizards of the Coast LLC 的《系统参考文档 5.2.1》');
    expect(chineseAttributionParagraph?.textContent).toContain('知识共享署名 4.0 国际许可协议');
    expect(chineseAttributionParagraph?.textContent).not.toContain('This work includes material');
    expect(chineseBodyRoot.querySelectorAll('details')).toHaveLength(1);
    expect(licenseDetails?.tagName).toBe('DETAILS');
    expect(licenseDetails?.hasAttribute('open')).toBe(false);
    expect(licenseDetails?.querySelector('summary')?.textContent).toBe('查看许可原文');
    expect(licenseDetails?.querySelector('p')?.textContent).toBe(finalEnglishAttributionBody);
    for (const attributionUrl of [
      'https://www.dndbeyond.com/srd',
      'https://creativecommons.org/licenses/by/4.0/legalcode',
    ]) {
      expect(chineseAttributionParagraph?.querySelector(`a[href="${attributionUrl}"]`)).not.toBeNull();
      expect(licenseDetails?.querySelector(`a[href="${attributionUrl}"]`)).not.toBeNull();
    }
    licenseDetails?.remove();
    expect(chineseBodyRoot.textContent).not.toContain(finalEnglishAttributionBody);

    for (const bodyHtml of [englishPost?.bodyHtml ?? '', chinesePost?.bodyHtml ?? '']) {
      expect(bodyHtml).not.toContain('If you are searching for');
      expect(bodyHtml).not.toContain('如果你正在查');
    }
  });

  test('exposes bilingual routes, spells category order, metadata, and sitemap entries', () => {
    expect(getBlogPostPath('en', SLUG)).toBe('/blog/dnd-warlock-spells');
    expect(getBlogPostPath('zh', SLUG)).toBe('/zh/blog/dnd-warlock-spells');
    expect(getBlogCategory('en', 'spells').label).toBe('Spells');
    expect(getBlogCategory('zh', 'spells').label).toBe('法术');

    const englishSpells = getBlogPostsByCategory('en', 'spells');
    const chineseSpells = getBlogPostsByCategory('zh', 'spells');
    expect(englishSpells.map((post) => post.slug)).toEqual(chineseSpells.map((post) => post.slug));
    expect(englishSpells.at(-1)?.slug).toBe(SLUG);
    expect(englishSpells.at(-1)?.category).toBe('spells');

    expect(createBlogPostMetadata('en', SLUG)).toMatchObject({
      title: DND_WARLOCK_SPELLS_ENGLISH_SEO_TITLE,
      alternates: { canonical: '/blog/dnd-warlock-spells' },
      openGraph: {
        images: [{ url: `https://www.tokenmaker.one${DND_WARLOCK_SPELLS_COVER_PATH}` }],
      },
    });
    expect(createBlogPostMetadata('zh', SLUG)).toMatchObject({
      title: DND_WARLOCK_SPELLS_CHINESE_SEO_TITLE,
      alternates: { canonical: '/zh/blog/dnd-warlock-spells' },
    });

    for (const [locale, url] of [
      ['en', 'https://www.tokenmaker.one/blog/dnd-warlock-spells'],
      ['zh', 'https://www.tokenmaker.one/zh/blog/dnd-warlock-spells'],
    ] as const) {
      const entry = sitemap().find((candidate) => candidate.url === url);
      expect(entry).toMatchObject({ lastModified: new Date(UPDATED_AT), changeFrequency: 'monthly' });
      expect(buildBlogPostStructuredData(locale, SLUG)).toMatchObject({
        '@type': 'Article',
        datePublished: UPDATED_AT,
        dateModified: UPDATED_AT,
        url,
        image: [`https://www.tokenmaker.one${DND_WARLOCK_SPELLS_COVER_PATH}`],
      });
    }
  });
});
