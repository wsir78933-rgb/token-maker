import { describe, expect, it } from 'vitest';

import { getBlogCategories } from '@/lib/blog-content';
import {
  assertContentSiteTopbarModel,
  getContentSiteTopbarModel,
  type ContentSiteTopbarFeature,
  type ContentSiteTopbarModel,
} from '@/lib/content-site-navigation';
import type { SiteLocale } from '@/lib/site-locale';

const BLOG_FEATURE_SLUGS = ['characters', 'monsters', 'spells', 'rules-and-prep'] as const;

function readTopbar(locale: SiteLocale, currentPath: string, localeSwitchHref: string): ContentSiteTopbarModel {
  return getContentSiteTopbarModel({
    locale,
    currentPath,
    localeSwitchHref,
  });
}

function expectedBlogFeatures(locale: SiteLocale): ContentSiteTopbarFeature[] {
  const hrefPrefix = locale === 'zh' ? '/zh' : '';
  return BLOG_FEATURE_SLUGS.map((slug) => {
    const category = getBlogCategories(locale).find((item) => item.slug === slug);
    if (!category) {
      throw new Error(`Missing blog category ${JSON.stringify(slug)} for locale ${locale}.`);
    }

    return {
      href: `${hrefPrefix}/blog/category/${slug}`,
      title: category.label,
      description: category.description,
    };
  });
}

function expectNonEmptyFeatureCopy(features: readonly ContentSiteTopbarFeature[]): void {
  expect(features).toHaveLength(4);
  for (const feature of features) {
    expect(feature.title.trim().length).toBeGreaterThan(0);
    expect(feature.description.trim().length).toBeGreaterThan(0);
  }
}

describe('content site topbar model', () => {
  it('returns the English topbar links, four blog features, and editor action', () => {
    const model = readTopbar('en', '/privacy', '/zh/passed-through');

    expect(model.links).toEqual([
      { href: '/', label: 'Editor', isActive: false },
      { href: '/dice-roller-dnd', label: 'Dice Roller', isActive: false },
      { href: '/coat-of-arms-maker', label: 'Coat Maker', isActive: false },
      { href: '/contact', label: 'Contact', isActive: false },
    ]);
    expect(model.featureMenuLabel).toBe('Blog');
    expect(model.featureMenuHref).toBe('/blog');
    expect(model.featureMenuAccessibleName).toBe('Blog categories');
    expect(model.featureMenuIsActive).toBe(false);
    expect(model.features).toEqual(expectedBlogFeatures('en'));
    expectNonEmptyFeatureCopy(model.features);
    expect(model.primaryAction).toEqual({
      href: '/#editor-workspace',
      label: 'Start making tokens',
    });
    expect(model.localeSwitch).toEqual({
      href: '/zh/passed-through',
      label: '中文',
    });
    expect(model.navigationLabel).toBe('Primary');
    expect(model.openMenuLabel).toBe('Open navigation');
    expect(model.closeMenuLabel).toBe('Close navigation');
    expect(model.menuDescription).toBe('Primary navigation links');
  });

  it('returns Chinese hrefs prefixed with /zh and the blog label', () => {
    const model = readTopbar('zh', '/zh/privacy', '/passed-through');

    expect(model.links).toEqual([
      { href: '/zh', label: '编辑器', isActive: false },
      { href: '/zh/dice-roller-dnd', label: '骰子', isActive: false },
      { href: '/zh/coat-of-arms-maker', label: '纹章制作器', isActive: false },
      { href: '/zh/contact', label: '联系', isActive: false },
    ]);
    expect(model.featureMenuLabel).toBe('博客');
    expect(model.featureMenuHref).toBe('/zh/blog');
    expect(model.featureMenuAccessibleName).toBe('博客分类');
    expect(model.features).toEqual(expectedBlogFeatures('zh'));
    expectNonEmptyFeatureCopy(model.features);
    expect(model.primaryAction).toEqual({
      href: '/zh#editor-workspace',
      label: '开始制作 Token',
    });
    expect(model.localeSwitch).toEqual({
      href: '/passed-through',
      label: 'English',
    });
    expect(model.navigationLabel).toBe('主导航');
    expect(model.openMenuLabel).toBe('打开导航');
    expect(model.closeMenuLabel).toBe('关闭导航');
    expect(model.menuDescription).toBe('主要导航链接');
  });

  it('activates only Coat Maker for /coat-of-arms-maker', () => {
    const model = readTopbar('en', '/coat-of-arms-maker', '/zh/coat-of-arms-maker');

    expect(model.links).toEqual([
      { href: '/', label: 'Editor', isActive: false },
      { href: '/dice-roller-dnd', label: 'Dice Roller', isActive: false },
      { href: '/coat-of-arms-maker', label: 'Coat Maker', isActive: true },
      { href: '/contact', label: 'Contact', isActive: false },
    ]);
    expect(model.featureMenuIsActive).toBe(false);
  });

  it('activates the blog menu, not plain links, for /zh/blog/category/characters', () => {
    const model = readTopbar('zh', '/zh/blog/category/characters', '/blog/category/characters');

    expect(model.featureMenuIsActive).toBe(true);
    expect(model.featureMenuLabel).toBe('博客');
    expect(model.featureMenuHref).toBe('/zh/blog');
    expect(model.links.map((link) => link.isActive)).toEqual([false, false, false, false]);
  });

  it('activates only Editor for /', () => {
    const model = readTopbar('en', '/', '/zh');

    expect(model.links).toEqual([
      { href: '/', label: 'Editor', isActive: true },
      { href: '/dice-roller-dnd', label: 'Dice Roller', isActive: false },
      { href: '/coat-of-arms-maker', label: 'Coat Maker', isActive: false },
      { href: '/contact', label: 'Contact', isActive: false },
    ]);
    expect(model.featureMenuIsActive).toBe(false);
  });

  it('activates only Editor for /zh', () => {
    const englishModel = readTopbar('en', '/zh', '/');
    const chineseModel = readTopbar('zh', '/zh', '/');

    expect(englishModel.links.map((link) => link.isActive)).toEqual([true, false, false, false]);
    expect(englishModel.links[0]?.href).toBe('/');
    expect(chineseModel.links.map((link) => link.isActive)).toEqual([true, false, false, false]);
    expect(chineseModel.links[0]?.href).toBe('/zh');
    expect(englishModel.featureMenuIsActive).toBe(false);
    expect(chineseModel.featureMenuIsActive).toBe(false);
  });

  it('activates the blog menu for /blog', () => {
    const model = readTopbar('en', '/blog', '/zh/blog');

    expect(model.featureMenuIsActive).toBe(true);
    expect(model.featureMenuHref).toBe('/blog');
    expect(model.featureMenuLabel).toBe('Blog');
    expect(model.links.map((link) => link.isActive)).toEqual([false, false, false, false]);
  });

  it('drops the query and hash before choosing the active link', () => {
    const model = readTopbar('zh', '/zh/coat-of-arms-maker?tab=shield#preview', '/coat-of-arms-maker');

    expect(model.links.map((link) => ({ href: link.href, isActive: link.isActive }))).toEqual([
      { href: '/zh', isActive: false },
      { href: '/zh/dice-roller-dnd', isActive: false },
      { href: '/zh/coat-of-arms-maker', isActive: true },
      { href: '/zh/contact', isActive: false },
    ]);
    expect(model.featureMenuIsActive).toBe(false);
  });

  it('activates Coat Maker for a nested path but not a longer sibling slug', () => {
    const nested = readTopbar('en', '/coat-of-arms-maker/gallery', '/zh/coat-of-arms-maker/gallery');
    const sibling = readTopbar('en', '/coat-of-arms-maker-extra', '/zh');
    const contactSibling = readTopbar('en', '/contact-us', '/zh');
    const blogSibling = readTopbar('en', '/blogging', '/zh');

    expect(nested.links.map((link) => link.isActive)).toEqual([false, false, true, false]);
    expect(nested.featureMenuIsActive).toBe(false);
    expect(sibling.links.map((link) => link.isActive)).toEqual([false, false, false, false]);
    expect(contactSibling.links.map((link) => link.isActive)).toEqual([false, false, false, false]);
    expect(blogSibling.featureMenuIsActive).toBe(false);
    expect(blogSibling.links.map((link) => link.isActive)).toEqual([false, false, false, false]);
  });

  it('throws for locale fr', () => {
    expect(() =>
      getContentSiteTopbarModel({
        locale: 'fr' as SiteLocale,
        currentPath: '/',
        localeSwitchHref: '/zh',
      }),
    ).toThrowError(/^Unknown site locale: "fr"\.$/);
  });

  it('throws for an empty currentPath', () => {
    expect(() => readTopbar('en', '', '/zh')).toThrowError(
      /^Content site currentPath must be a non-empty string\. Received ""\.$/,
    );
  });

  it('throws for a whitespace localeSwitchHref', () => {
    expect(() => readTopbar('en', '/', '  ')).toThrowError(
      /^Content site localeSwitchHref must be a non-empty string\. Received "  "\.$/,
    );
  });

  it('rejects a primary action href that does not contain #editor-workspace', () => {
    const model = readTopbar('en', '/', '/zh');

    expect(() =>
      assertContentSiteTopbarModel({
        ...model,
        primaryAction: { href: '/editor', label: 'Start making tokens' },
      }),
    ).toThrowError(
      /^ContentSiteTopbar: primaryAction\.href must contain "#editor-workspace"\. Received "\/editor"\.$/,
    );
  });

  it('rejects an empty features array', () => {
    const model = readTopbar('en', '/', '/zh');

    expect(() =>
      assertContentSiteTopbarModel({
        ...model,
        features: [],
      }),
    ).toThrowError(/^ContentSiteTopbar: features must be a non-empty array\. Received \[\]\.$/);
  });

  it('rejects a feature that is not a plain object', () => {
    const model = readTopbar('en', '/', '/zh');

    expect(() =>
      assertContentSiteTopbarModel({
        ...model,
        features: [null],
      } as unknown as ContentSiteTopbarModel),
    ).toThrowError(/^ContentSiteTopbar: features\[0\] must be a plain object\. Received null\.$/);
  });
});
