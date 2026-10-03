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
    if (feature.description !== undefined) {
      expect(feature.description.trim().length).toBeGreaterThan(0);
    }
  }
}

describe('content site topbar model', () => {
  it('returns English free tools, plain links, four blog features, and editor action', () => {
    const model = readTopbar('en', '/privacy', '/zh/passed-through');

    expect(model.freeToolsMenuLabel).toBe('Free tools');
    expect(model.freeToolsMenuHref).toBe('/');
    expect(model.freeToolsMenuAccessibleName).toBe('Free tools');
    expect(model.freeToolsMenuIsActive).toBe(false);
    expect(model.freeTools).toEqual([
      { href: '/', title: 'Token Maker' },
      { href: '/coat-of-arms-maker', title: 'Coat of Arms Maker' },
      { href: '/armor-creator', title: 'Armor Creator' },
      { href: '/army-formation-creator', title: 'Army Formation Creator' },
      { href: '/emblem-creator', title: 'Emblem Creator' },
    ]);
    expect(model.links).toEqual([
      { href: '/dice-roller-dnd', label: 'Dice Roller', isActive: false },
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

  it('returns Chinese free tools, localized tool paths, plain links, and blog label', () => {
    const model = readTopbar('zh', '/zh/privacy', '/passed-through');

    expect(model.freeToolsMenuLabel).toBe('免费工具');
    expect(model.freeToolsMenuHref).toBe('/zh');
    expect(model.freeToolsMenuAccessibleName).toBe('免费工具');
    expect(model.freeToolsMenuIsActive).toBe(false);
    expect(model.freeTools).toEqual([
      { href: '/zh', title: '令牌制作器' },
      { href: '/zh/coat-of-arms-maker', title: '纹章制作器' },
      { href: '/zh/armor-creator', title: '护甲制作器' },
      { href: '/zh/army-formation-creator', title: '军队阵型制作器' },
      { href: '/zh/emblem-creator', title: '徽标制作工具' },
    ]);
    expect(model.links).toEqual([
      { href: '/zh/dice-roller-dnd', label: '骰子', isActive: false },
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

  it('activates the free tools menu for each tool path and its nested paths', () => {
    const editor = readTopbar('en', '/', '/zh');
    const chineseEditor = readTopbar('zh', '/zh', '/');
    const coat = readTopbar('en', '/coat-of-arms-maker', '/zh/coat-of-arms-maker');
    const coatNested = readTopbar('en', '/coat-of-arms-maker/gallery', '/zh/coat-of-arms-maker/gallery');
    const armor = readTopbar('en', '/armor-creator', '/zh/armor-creator');
    const armorNested = readTopbar('en', '/armor-creator/saved', '/zh/armor-creator/saved');
    const army = readTopbar('en', '/army-formation-creator', '/zh/army-formation-creator');
    const nested = readTopbar('en', '/army-formation-creator/saved', '/zh/army-formation-creator/saved');
    const sibling = readTopbar('en', '/army-formation-creator-extra', '/zh');

    expect(editor.freeToolsMenuIsActive).toBe(true);
    expect(chineseEditor.freeToolsMenuIsActive).toBe(true);
    expect(coat.freeToolsMenuIsActive).toBe(true);
    expect(coatNested.freeToolsMenuIsActive).toBe(true);
    expect(armor.freeToolsMenuIsActive).toBe(true);
    expect(armorNested.freeToolsMenuIsActive).toBe(true);
    expect(army.freeToolsMenuIsActive).toBe(true);
    expect(nested.freeToolsMenuIsActive).toBe(true);
    expect(sibling.freeToolsMenuIsActive).toBe(false);
    expect(editor.links.map((link) => link.isActive)).toEqual([false, false]);
    expect(coat.links.map((link) => link.isActive)).toEqual([false, false]);
  });

  it.each([
    { locale: 'en' as const, prefix: '', otherPrefix: '/zh' },
    { locale: 'zh' as const, prefix: '/zh', otherPrefix: '' },
  ])('activates the emblem tool boundary and preserves the $locale language switch', ({
    locale,
    prefix,
    otherPrefix,
  }) => {
    const switchedPath = `${otherPrefix}/emblem-creator`;
    const current = readTopbar(locale, `${prefix}/emblem-creator?tab=layers#canvas`, switchedPath);
    const nested = readTopbar(locale, `${prefix}/emblem-creator/saved`, switchedPath);
    const sibling = readTopbar(locale, `${prefix}/emblem-creator-extra`, switchedPath);

    expect(current.freeToolsMenuIsActive).toBe(true);
    expect(current.featureMenuIsActive).toBe(false);
    expect(current.links.every((link) => !link.isActive)).toBe(true);
    expect(current.localeSwitch.href).toBe(switchedPath);
    expect(nested.freeToolsMenuIsActive).toBe(true);
    expect(sibling.freeToolsMenuIsActive).toBe(false);
  });

  it('activates only Dice Roller or Contact among the remaining plain links', () => {
    const dice = readTopbar('en', '/dice-roller-dnd', '/zh/dice-roller-dnd');
    const contact = readTopbar('zh', '/zh/contact/forms', '/contact/forms');
    const diceSibling = readTopbar('en', '/dice-roller-dnd-extra', '/zh');
    const contactSibling = readTopbar('en', '/contact-us', '/zh');

    expect(dice.links.map((link) => link.isActive)).toEqual([true, false]);
    expect(contact.links.map((link) => link.isActive)).toEqual([false, true]);
    expect(diceSibling.links.map((link) => link.isActive)).toEqual([false, false]);
    expect(contactSibling.links.map((link) => link.isActive)).toEqual([false, false]);
  });

  it('activates the blog menu, not plain links, for blog paths', () => {
    const category = readTopbar('zh', '/zh/blog/category/characters', '/blog/category/characters');
    const index = readTopbar('en', '/blog', '/zh/blog');
    const sibling = readTopbar('en', '/blogging', '/zh');

    expect(category.featureMenuIsActive).toBe(true);
    expect(category.featureMenuLabel).toBe('博客');
    expect(category.featureMenuHref).toBe('/zh/blog');
    expect(category.freeToolsMenuIsActive).toBe(false);
    expect(category.links.map((link) => link.isActive)).toEqual([false, false]);
    expect(index.featureMenuIsActive).toBe(true);
    expect(sibling.featureMenuIsActive).toBe(false);
  });

  it('drops the query and hash before choosing active sections', () => {
    const model = readTopbar('zh', '/zh/coat-of-arms-maker?tab=shield#preview', '/coat-of-arms-maker');

    expect(model.freeToolsMenuIsActive).toBe(true);
    expect(model.links.map((link) => ({ href: link.href, isActive: link.isActive }))).toEqual([
      { href: '/zh/dice-roller-dnd', isActive: false },
      { href: '/zh/contact', isActive: false },
    ]);
    expect(model.featureMenuIsActive).toBe(false);
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

  it('rejects an empty free tools array', () => {
    const model = readTopbar('en', '/', '/zh');

    expect(() =>
      assertContentSiteTopbarModel({
        ...model,
        freeTools: [],
      }),
    ).toThrowError(/^ContentSiteTopbar: freeTools must be a non-empty array\. Received \[\]\.$/);
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
