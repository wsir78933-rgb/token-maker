import { getArmyFormationCreatorCopy } from '@/lib/army-formation/copy';
import { getBlogCategories, getBlogCategoryPath, type BlogCategoryCopy } from '@/lib/blog-content';
import { getHomeCopy, getNavLabels, type NavLabels } from '@/lib/site-content';
import { getLocalizedPath, isSiteLocale, stripLocalePrefix, type SiteLocale } from '@/lib/site-locale';

const EDITOR_WORKSPACE_HASH = '#editor-workspace';
const ARMY_FORMATION_CREATOR_PATH = '/army-formation-creator';

export type ContentSiteTopbarFeature = {
  href: string;
  title: string;
  description: string;
};

export type ContentSiteTopbarPlainLink = {
  href: string;
  label: string;
  isActive: boolean;
};

export type ContentSiteTopbarAction = {
  href: string;
  label: string;
};

export type ContentSiteTopbarModel = {
  navigationLabel: string;
  featureMenuLabel: string;
  featureMenuHref: string;
  featureMenuIsActive: boolean;
  featureMenuAccessibleName: string;
  features: readonly ContentSiteTopbarFeature[];
  links: readonly ContentSiteTopbarPlainLink[];
  localeSwitch: ContentSiteTopbarAction;
  primaryAction: ContentSiteTopbarAction;
  openMenuLabel: string;
  closeMenuLabel: string;
  menuDescription: string;
};

export function getContentSiteTopbarModel(input: {
  locale: SiteLocale;
  currentPath: string;
  localeSwitchHref: string;
}): ContentSiteTopbarModel {
  const locale = requireContentSiteLocale(input.locale);
  const currentPath = requireContentSiteText(input.currentPath, 'currentPath');
  const localeSwitchHref = requireContentSiteText(input.localeSwitchHref, 'localeSwitchHref');
  const normalizedCurrentPath = normalizeContentSitePath(currentPath);
  const model = buildContentSiteTopbarModel({
    locale,
    normalizedCurrentPath,
    localeSwitchHref,
  });
  assertContentSiteTopbarModel(model);
  return model;
}

function requireContentSiteLocale(locale: string): SiteLocale {
  if (!isSiteLocale(locale)) {
    throw new Error(`Unknown site locale: ${JSON.stringify(locale)}.`);
  }

  return locale;
}

function requireContentSiteText(value: string, fieldName: 'currentPath' | 'localeSwitchHref'): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      `Content site ${fieldName} must be a non-empty string. Received ${JSON.stringify(value)}.`,
    );
  }

  return value;
}

function normalizeContentSitePath(currentPath: string): string {
  const withoutLocale = stripLocalePrefix(dropUrlQuery(dropUrlHash(currentPath)));
  if (withoutLocale === '') {
    return '/';
  }

  return withoutLocale;
}

function dropUrlHash(currentPath: string): string {
  const hashStart = currentPath.indexOf('#');
  if (hashStart === -1) {
    return currentPath;
  }

  return currentPath.slice(0, hashStart);
}

function dropUrlQuery(currentPath: string): string {
  const queryStart = currentPath.indexOf('?');
  if (queryStart === -1) {
    return currentPath;
  }

  return currentPath.slice(0, queryStart);
}

function buildContentSiteTopbarModel(input: {
  locale: SiteLocale;
  normalizedCurrentPath: string;
  localeSwitchHref: string;
}): ContentSiteTopbarModel {
  const navLabels = getNavLabels(input.locale);

  return {
    navigationLabel: navLabels.navigation,
    ...buildContentSiteFeatureMenu(input.locale, input.normalizedCurrentPath, navLabels),
    features: buildContentSiteBlogFeatures(input.locale),
    links: buildContentSitePlainLinks(input.locale, input.normalizedCurrentPath, navLabels),
    localeSwitch: buildContentSiteLocaleSwitch(input.localeSwitchHref, navLabels.switchLocale),
    primaryAction: buildContentSitePrimaryAction(input.locale),
    openMenuLabel: navLabels.openNavigation,
    closeMenuLabel: navLabels.closeNavigation,
    menuDescription: navLabels.navigationMenuDescription,
  };
}

function buildContentSiteFeatureMenu(
  locale: SiteLocale,
  normalizedCurrentPath: string,
  navLabels: NavLabels,
): Pick<
  ContentSiteTopbarModel,
  'featureMenuLabel' | 'featureMenuHref' | 'featureMenuIsActive' | 'featureMenuAccessibleName'
> {
  return {
    featureMenuLabel: navLabels.blog,
    featureMenuHref: getLocalizedPath(locale, '/blog'),
    featureMenuIsActive: isBlogSectionPath(normalizedCurrentPath),
    featureMenuAccessibleName: navLabels.blogCategoryMenu,
  };
}

function buildContentSiteBlogFeatures(locale: SiteLocale): ContentSiteTopbarFeature[] {
  return getBlogCategories(locale).map((category) => buildContentSiteBlogFeature(locale, category));
}

function buildContentSiteBlogFeature(locale: SiteLocale, category: BlogCategoryCopy): ContentSiteTopbarFeature {
  return {
    href: requireBlogFeatureField(category.slug, 'href', getBlogCategoryPath(locale, category.slug)),
    title: requireBlogFeatureField(category.slug, 'title', category.label),
    description: requireBlogFeatureField(category.slug, 'description', category.description),
  };
}

function requireBlogFeatureField(
  slug: string,
  fieldName: 'href' | 'title' | 'description',
  value: unknown,
): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      `Blog category slug ${JSON.stringify(slug)} field ${fieldName} must be a non-empty string. Received ${JSON.stringify(value)}.`,
    );
  }

  return value;
}

function readArmyFormationNavigationName(locale: SiteLocale): string {
  const navigationName = getArmyFormationCreatorCopy(locale).navigationName;
  if (navigationName.trim() === '') {
    throw new Error(
      `Army formation creator navigation name must be a non-empty string. Received ${JSON.stringify(navigationName)}.`,
    );
  }

  return navigationName;
}

function buildContentSitePlainLinks(
  locale: SiteLocale,
  normalizedCurrentPath: string,
  navLabels: NavLabels,
): ContentSiteTopbarPlainLink[] {
  return [
    buildEditorLink(locale, normalizedCurrentPath, navLabels.editor),
    buildSectionLink(locale, normalizedCurrentPath, '/dice-roller-dnd', navLabels.diceRoller),
    buildSectionLink(locale, normalizedCurrentPath, '/coat-of-arms-maker', navLabels.coatMaker),
    buildSectionLink(locale, normalizedCurrentPath, '/armor-creator', navLabels.armor),
    buildSectionLink(
      locale,
      normalizedCurrentPath,
      ARMY_FORMATION_CREATOR_PATH,
      readArmyFormationNavigationName(locale),
    ),
    buildSectionLink(locale, normalizedCurrentPath, '/contact', navLabels.contact),
  ];
}

function buildEditorLink(
  locale: SiteLocale,
  normalizedCurrentPath: string,
  label: string,
): ContentSiteTopbarPlainLink {
  return {
    href: getLocalizedPath(locale, '/'),
    label,
    isActive: isEditorPath(normalizedCurrentPath),
  };
}

function buildSectionLink(
  locale: SiteLocale,
  normalizedCurrentPath: string,
  path: string,
  label: string,
): ContentSiteTopbarPlainLink {
  const href = getLocalizedPath(locale, path);
  return {
    href,
    label,
    isActive: isContentSiteSectionPath(normalizedCurrentPath, normalizeContentSitePath(href)),
  };
}

function isEditorPath(normalizedCurrentPath: string): boolean {
  return normalizedCurrentPath === '/';
}

// A section matches its own path or a child path. `/` is not a section prefix.
function isContentSiteSectionPath(normalizedCurrentPath: string, normalizedHref: string): boolean {
  if (normalizedHref === '/') {
    return normalizedCurrentPath === '/';
  }

  return (
    normalizedCurrentPath === normalizedHref || normalizedCurrentPath.startsWith(`${normalizedHref}/`)
  );
}

function isBlogSectionPath(normalizedCurrentPath: string): boolean {
  return isContentSiteSectionPath(normalizedCurrentPath, '/blog');
}

function buildContentSiteLocaleSwitch(localeSwitchHref: string, label: string): ContentSiteTopbarAction {
  return {
    href: localeSwitchHref,
    label,
  };
}

function buildContentSitePrimaryAction(locale: SiteLocale): ContentSiteTopbarAction {
  return {
    href: buildEditorWorkspaceHref(locale),
    label: getHomeCopy(locale).heroPrimaryCta,
  };
}

function buildEditorWorkspaceHref(locale: SiteLocale): string {
  return `${getLocalizedPath(locale, '/')}${EDITOR_WORKSPACE_HASH}`;
}

export function assertContentSiteTopbarModel(model: ContentSiteTopbarModel): void {
  assertContentSiteTopbarPlainObject(model, 'model');
  assertContentSiteTopbarText(model.navigationLabel, 'navigationLabel');
  assertContentSiteTopbarText(model.featureMenuLabel, 'featureMenuLabel');
  assertContentSiteTopbarText(model.featureMenuHref, 'featureMenuHref');
  assertContentSiteTopbarBoolean(model.featureMenuIsActive, 'featureMenuIsActive');
  assertContentSiteTopbarText(model.featureMenuAccessibleName, 'featureMenuAccessibleName');
  assertContentSiteTopbarFeatures(model.features);
  assertContentSiteTopbarLinks(model.links);
  assertContentSiteTopbarAction(model.localeSwitch, 'localeSwitch');
  assertPrimaryAction(model.primaryAction);
  assertContentSiteTopbarText(model.openMenuLabel, 'openMenuLabel');
  assertContentSiteTopbarText(model.closeMenuLabel, 'closeMenuLabel');
  assertContentSiteTopbarText(model.menuDescription, 'menuDescription');
}

function assertContentSiteTopbarFeatures(features: unknown): void {
  assertContentSiteTopbarNonEmptyArray(features, 'features');
  for (let index = 0; index < features.length; index += 1) {
    assertContentSiteTopbarFeature(features[index], `features[${index}]`);
  }
}

function assertContentSiteTopbarFeature(feature: unknown, fieldPath: string): void {
  assertContentSiteTopbarPlainObject(feature, fieldPath);
  assertContentSiteTopbarText(feature.title, `${fieldPath}.title`);
  assertContentSiteTopbarText(feature.description, `${fieldPath}.description`);
  assertContentSiteTopbarText(feature.href, `${fieldPath}.href`);
}

function assertContentSiteTopbarLinks(links: unknown): void {
  assertContentSiteTopbarNonEmptyArray(links, 'links');
  for (let index = 0; index < links.length; index += 1) {
    assertContentSiteTopbarLink(links[index], `links[${index}]`);
  }
}

function assertContentSiteTopbarLink(link: unknown, fieldPath: string): void {
  assertContentSiteTopbarPlainObject(link, fieldPath);
  assertContentSiteTopbarText(link.label, `${fieldPath}.label`);
  assertContentSiteTopbarText(link.href, `${fieldPath}.href`);
  assertContentSiteTopbarBoolean(link.isActive, `${fieldPath}.isActive`);
}

function assertContentSiteTopbarAction(action: unknown, fieldPath: string): void {
  assertContentSiteTopbarPlainObject(action, fieldPath);
  assertContentSiteTopbarText(action.label, `${fieldPath}.label`);
  assertContentSiteTopbarText(action.href, `${fieldPath}.href`);
}

function assertPrimaryAction(action: unknown): void {
  assertContentSiteTopbarPlainObject(action, 'primaryAction');
  assertContentSiteTopbarText(action.label, 'primaryAction.label');
  const href = action.href;
  assertContentSiteTopbarText(href, 'primaryAction.href');
  assertPrimaryActionOpensEditor(href);
}

function assertPrimaryActionOpensEditor(href: string): void {
  if (href.includes(EDITOR_WORKSPACE_HASH)) {
    return;
  }

  throw new Error(
    `ContentSiteTopbar: primaryAction.href must contain ${JSON.stringify(EDITOR_WORKSPACE_HASH)}. Received ${JSON.stringify(href)}.`,
  );
}

function assertContentSiteTopbarNonEmptyArray(value: unknown, fieldPath: string): asserts value is unknown[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(
      `ContentSiteTopbar: ${fieldPath} must be a non-empty array. Received ${JSON.stringify(value)}.`,
    );
  }
}

function assertContentSiteTopbarPlainObject(
  value: unknown,
  fieldPath: string,
): asserts value is Record<string, unknown> {
  if (!isPlainObject(value)) {
    throw new Error(
      `ContentSiteTopbar: ${fieldPath} must be a plain object. Received ${JSON.stringify(value)}.`,
    );
  }
}

function assertContentSiteTopbarText(value: unknown, fieldPath: string): asserts value is string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      `ContentSiteTopbar: ${fieldPath} must be a non-empty string. Received ${JSON.stringify(value)}.`,
    );
  }
}

function assertContentSiteTopbarBoolean(value: unknown, fieldPath: string): void {
  if (typeof value !== 'boolean') {
    throw new Error(`ContentSiteTopbar: ${fieldPath} must be a boolean. Received ${JSON.stringify(value)}.`);
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
