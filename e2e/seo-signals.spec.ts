import { randomUUID } from 'node:crypto';
import { expect, test, type Page } from '@playwright/test';

import {
  getBlogCategory,
  getBlogPost,
  getBlogPostsForPage,
  type BlogCategoryCopy,
  type BlogPost,
} from '../src/lib/blog-content';
import { getSiteConfig, getSiteUrl } from '../src/lib/site-content';
import type { SiteLocale } from '../src/lib/site-locale';

type SchemaObject = Record<string, unknown>;
type SchemaExpectation = { id: string; types: string[] };
type ArticleFixture = { slug: string; post: BlogPost };
type RouteExpectation = {
  route: string;
  locale: SiteLocale;
  scripts: SchemaExpectation[];
  article?: ArticleFixture;
};
type CategoryPageExpectation = { slug: BlogCategoryCopy['slug']; pageCount: number };
type RuntimeMessageKind = 'pageerror' | 'console.warn' | 'console.error';
type RuntimeMessage = { kind: RuntimeMessageKind; route: string; text: string };
type RuntimeDiagnostics = {
  trackRoute: (route: string) => void;
  assertNoBlockingMessages: (route: string) => void;
};

const templateSlug = 'square-token-maker';
const categoryPageExpectations: Record<SiteLocale, readonly CategoryPageExpectation[]> = {
  en: [
    { slug: 'characters', pageCount: 3 },
    { slug: 'monsters', pageCount: 1 },
    { slug: 'spells', pageCount: 2 },
    { slug: 'rules-and-prep', pageCount: 2 },
  ],
  zh: [
    { slug: 'characters', pageCount: 3 },
    { slug: 'monsters', pageCount: 1 },
    { slug: 'spells', pageCount: 2 },
    { slug: 'rules-and-prep', pageCount: 2 },
  ],
};
const reactHydrationErrorPattern = /(?:hydration (?:failed|mismatch|error)|error while hydrating|server[- ]rendered html|text content (?:does not|did not) match|expected server html to contain|minified react error #\d+)/i;
const runtimeDiagnosticsByPage = new WeakMap<Page, RuntimeDiagnostics>();

// Mobile navigation has a React state transition that proves hydration occurred.
test.use({ viewport: { width: 390, height: 844 } });

function isBlockingRuntimeMessage(message: RuntimeMessage) {
  return message.kind === 'pageerror' || reactHydrationErrorPattern.test(message.text);
}

function formatRuntimeMessage(message: RuntimeMessage) {
  return `${message.kind} route=${message.route}: ${message.text}`;
}

function createRuntimeDiagnostics(page: Page): RuntimeDiagnostics {
  const runtimeMessages: RuntimeMessage[] = [];
  let trackedRoute = page.url();
  const recordRuntimeMessage = (kind: RuntimeMessageKind, text: string) => {
    runtimeMessages.push({ kind, route: trackedRoute, text });
  };
  page.on('pageerror', (error) => {
    recordRuntimeMessage('pageerror', error.stack ?? error.message);
  });
  page.on('console', (message) => {
    // Resource-load warnings remain recorded but do not count as React
    // hydration failures; this does not assert that the console is empty.
    const kind = message.type() === 'warning'
      ? 'console.warn'
      : message.type() === 'error'
        ? 'console.error'
        : undefined;
    if (kind) recordRuntimeMessage(kind, message.text());
  });
  return {
    trackRoute(route) {
      trackedRoute = route;
    },
    assertNoBlockingMessages(route) {
      const blockingMessages = runtimeMessages.filter((message) =>
        message.route === route && isBlockingRuntimeMessage(message));
      expect(blockingMessages, `${route}: React runtime errors captured:\n${blockingMessages.map(formatRuntimeMessage).join('\n')}`)
        .toEqual([]);
    },
  };
}

function getRuntimeDiagnostics(page: Page) {
  const diagnostics = runtimeDiagnosticsByPage.get(page);
  if (!diagnostics) throw new Error(`Runtime diagnostics were not installed before navigating ${page.url()}`);
  return diagnostics;
}

function localizedRoute(locale: SiteLocale, path: string) {
  return locale === 'en' ? path : path === '/' ? '/zh' : `/zh${path}`;
}

function canonicalUrl(route: string) {
  return new URL(route, getSiteUrl()).href;
}

function categoryRoute(locale: SiteLocale, slug: string, pageNumber: number) {
  const path = `/blog/category/${slug}`;
  return localizedRoute(locale, pageNumber === 1 ? path : `${path}/page/${pageNumber}`);
}

// This function is serialized into the browser. DOMParser sees actual HTML script
// elements; JSON-LD-looking strings inside RSC payload scripts are not elements.
function readSeoDocument(html: string | null) {
  const root = html === null ? document : new DOMParser().parseFromString(html, 'text/html');
  return {
    titles: Array.from(root.querySelectorAll('title'), (element) => element.textContent ?? ''),
    metas: Array.from(root.querySelectorAll('meta'), (element) => ({
      name: element.getAttribute('name') ?? element.getAttribute('property'),
      content: element.getAttribute('content'),
    })),
    links: Array.from(root.querySelectorAll('link'), (element) => ({
      rel: element.getAttribute('rel'),
      language: element.getAttribute('hreflang'),
      href: element.getAttribute('href'),
    })),
    scripts: Array.from(root.querySelectorAll('script[type="application/ld+json"]'), (element) => ({
      id: element.id,
      text: element.textContent ?? '',
    })),
  };
}

type SeoSnapshot = ReturnType<typeof readSeoDocument>;

function requireObject(value: unknown, context: string): SchemaObject {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${context}: expected an object, received ${JSON.stringify(value)}`);
  }
  return value as SchemaObject;
}

function requireArray(value: unknown, context: string): unknown[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${context}: expected a nonempty array, received ${JSON.stringify(value)}`);
  }
  return value;
}

function requireText(value: unknown, context: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${context}: expected nonempty text, received ${JSON.stringify(value)}`);
  }
  return value;
}

function parseSchema(text: string, context: string): SchemaObject {
  try {
    return requireObject(JSON.parse(text), context);
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    throw new Error(`${context}: invalid JSON object ${text}`, { cause: error });
  }
}

function readMeta(snapshot: SeoSnapshot, name: string, context: string) {
  const matches = snapshot.metas.filter((entry) => entry.name === name);
  expect(matches, `${context}: meta ${name}`).toHaveLength(1);
  return requireText(matches[0].content, `${context}: meta ${name}`);
}

function readOptionalMeta(snapshot: SeoSnapshot, name: string, context: string) {
  const matches = snapshot.metas.filter((entry) => entry.name === name);
  expect(matches.length, `${context}: meta ${name} must appear at most once`).toBeLessThanOrEqual(1);
  return matches.length === 0 ? undefined : requireText(matches[0].content, `${context}: meta ${name}`);
}

function readTitle(snapshot: SeoSnapshot, context: string) {
  expect(snapshot.titles, `${context}: title`).toHaveLength(1);
  return requireText(snapshot.titles[0], `${context}: title`);
}

function assertQuestions(value: unknown, context: string) {
  for (const [index, entry] of requireArray(value, context).entries()) {
    const question = requireObject(entry, `${context}[${index}]`);
    expect(question['@type'], context).toBe('Question');
    requireText(question.name, `${context}[${index}].name`);
    const answer = requireObject(question.acceptedAnswer, `${context}[${index}].acceptedAnswer`);
    expect(answer['@type'], context).toBe('Answer');
    requireText(answer.text, `${context}[${index}].acceptedAnswer.text`);
  }
}

function requireArticleFixture(fixture: RouteExpectation, context: string) {
  const article = fixture.article;
  if (!article) throw new Error(`${context}: missing article fixture for route=${fixture.route}`);
  if (article.post.slug !== article.slug) {
    throw new Error(
      `${context}: article fixture slug mismatch: expected=${JSON.stringify(article.slug)}, actual=${JSON.stringify(article.post.slug)}`,
    );
  }
  return article;
}

function assertSchemaSemantics(object: SchemaObject, fixture: RouteExpectation, context: string) {
  const schemaType = object['@type'];
  const homeUrl = canonicalUrl(localizedRoute(fixture.locale, '/'));
  if (schemaType === 'BreadcrumbList') {
    const items = requireArray(object.itemListElement, `${context}.itemListElement`);
    for (const [index, entry] of items.entries()) {
      const item = requireObject(entry, `${context}.itemListElement[${index}]`);
      expect(item, context).toMatchObject({ '@type': 'ListItem', position: index + 1 });
      requireText(item.name, `${context}.itemListElement[${index}].name`);
      const url = requireText(item.item, `${context}.itemListElement[${index}].item`);
      expect(new URL(url).origin, context).toBe(new URL(getSiteUrl()).origin);
    }
    expect(requireObject(items[0], context).item, context).toBe(homeUrl);
    expect(requireObject(items.at(-1), context).item, context).toBe(canonicalUrl(fixture.route));
    return;
  }
  if (schemaType === 'FAQPage') {
    assertQuestions(object.mainEntity, `${context}.mainEntity`);
    return;
  }
  requireText(schemaType === 'Article' ? object.headline : object.name, `${context}.name/headline`);
  requireText(object.description, `${context}.description`);
  if (schemaType === 'HowTo') {
    for (const [index, entry] of requireArray(object.step, `${context}.step`).entries()) {
      const step = requireObject(entry, `${context}.step[${index}]`);
      expect(step, context).toMatchObject({ '@type': 'HowToStep', position: index + 1 });
      requireText(step.name, `${context}.step[${index}].name`);
      requireText(step.text, `${context}.step[${index}].text`);
    }
    return;
  }
  if (schemaType === 'VideoObject') {
    expect(requireText(object.embedUrl, context), context).toMatch(/^https:\/\/www\.youtube-nocookie\.com\/embed\/.+/);
    expect(requireText(object.thumbnailUrl, context), context).toMatch(/^https:\/\/i\.ytimg\.com\//);
    return;
  }
  expect(object.url, context).toBe(canonicalUrl(fixture.route));
  if (schemaType === 'CollectionPage' || schemaType === 'Article') {
    expect(object.inLanguage, context).toBe(fixture.locale === 'en' ? 'en-US' : 'zh-CN');
  }
  if (schemaType === 'CollectionPage') {
    expect(object.isPartOf, context).toMatchObject({ '@type': 'WebSite', url: homeUrl });
  }
  if (schemaType === 'Article') {
    const { post } = requireArticleFixture(fixture, context);
    if (post.publishedAt !== undefined) {
      expect(requireText(object.datePublished, `${context}.datePublished`), context).toBe(post.publishedAt);
    } else {
      expect(object, context).not.toHaveProperty('datePublished');
    }
    expect(requireText(object.dateModified, `${context}.dateModified`), context).toBe(post.updatedAt);
    expect(object.publisher, context).toEqual({
      '@type': 'Organization',
      name: 'Token Maker',
      url: canonicalUrl(localizedRoute(fixture.locale, '/about')),
    });
    expect(object, context).not.toHaveProperty('author');
  }
  if (schemaType === 'SoftwareApplication' || schemaType === 'WebApplication') {
    expect(object.offers, context).toEqual({ '@type': 'Offer', price: '0', priceCurrency: 'USD' });
    requireText(object.applicationCategory, `${context}.applicationCategory`);
    requireArray(object.featureList, `${context}.featureList`).forEach((feature, index) => {
      requireText(feature, `${context}.featureList[${index}]`);
    });
  }
}

function assertStructuredData(snapshot: SeoSnapshot, fixture: RouteExpectation, phase: string) {
  const context = `${fixture.route} ${phase}`;
  const actualIds = snapshot.scripts.map((script) => script.id);
  expect(actualIds.sort(), `${context}: exact script IDs, including duplicates`).toEqual(
    fixture.scripts.map((script) => script.id).sort(),
  );
  for (const expected of fixture.scripts) {
    const script = snapshot.scripts.find((entry) => entry.id === expected.id)!;
    const scriptContext = `${context} id=${script.id} object=${script.text}`;
    const root = parseSchema(script.text, scriptContext);
    expect(root['@context'], scriptContext).toBe('https://schema.org');
    const objects = root['@graph'] === undefined
      ? [root]
      : requireArray(root['@graph'], scriptContext).map((entry) => requireObject(entry, scriptContext));
    expect(objects.map((object) => object['@type']).sort(), scriptContext).toEqual([...expected.types].sort());
    for (const object of objects) assertSchemaSemantics(object, fixture, scriptContext);
  }
}

async function confirmHydration(page: Page, locale: SiteLocale) {
  await page.evaluate(() => window.scrollTo(0, 0));
  const openLabel = locale === 'en' ? 'Open navigation' : '打开导航';
  const closeLabel = locale === 'en' ? 'Close navigation' : '关闭导航';
  await page.getByRole('button', { name: openLabel, exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog, `${page.url()}: hydrated navigation opens`).toBeVisible();
  await dialog.getByRole('button', { name: closeLabel, exact: true }).click();
  await expect(dialog, `${page.url()}: hydrated navigation closes`).toHaveCount(0);
  await expect(page.getByRole('button', { name: openLabel, exact: true })).toHaveAttribute('aria-expanded', 'false');
}

async function readRawHtml(page: Page, route: string) {
  const response = await page.request.get(route);
  expect(response.status(), `${route}: raw HTML status`).toBe(200);
  expect(response.headers()['content-type'], `${route}: raw HTML content type`).toContain('text/html');
  return page.evaluate(readSeoDocument, await response.text());
}

async function assertLoadedRoute(page: Page, fixture: RouteExpectation) {
  const raw = await readRawHtml(page, fixture.route);
  assertStructuredData(raw, fixture, 'raw HTML');
  await confirmHydration(page, fixture.locale);
  getRuntimeDiagnostics(page).assertNoBlockingMessages(fixture.route);
  const hydrated = await page.evaluate(readSeoDocument, null);
  assertStructuredData(hydrated, fixture, 'hydrated DOM');
  for (const script of raw.scripts) {
    const current = hydrated.scripts.find((entry) => entry.id === script.id)!;
    expect(parseSchema(current.text, `${fixture.route} hydrated id=${script.id}`),
      `${fixture.route}: raw/hydrated object equality id=${script.id}`).toEqual(
      parseSchema(script.text, `${fixture.route} raw id=${script.id}`),
    );
  }
  return { raw, hydrated };
}

async function visitRoute(page: Page, fixture: RouteExpectation) {
  const diagnostics = getRuntimeDiagnostics(page);
  diagnostics.trackRoute(fixture.route);
  const response = await page.goto(fixture.route, { waitUntil: 'load' });
  diagnostics.assertNoBlockingMessages(fixture.route);
  expect(response?.status(), `${fixture.route}: document status`).toBe(200);
  await expect(page, `${fixture.route}: navigation URL`).toHaveURL(fixture.route);
  return assertLoadedRoute(page, fixture);
}

function assertArticleMetadata(snapshot: SeoSnapshot, fixture: RouteExpectation, phase: string) {
  const context = `${fixture.route} ${phase}`;
  const { post } = requireArticleFixture(fixture, context);
  const publishedTime = readOptionalMeta(snapshot, 'article:published_time', context);
  if (post.publishedAt !== undefined) {
    expect(publishedTime, context).toBe(post.publishedAt);
  } else {
    expect(publishedTime, context).toBeUndefined();
  }
  expect(readMeta(snapshot, 'article:modified_time', context), context).toBe(post.updatedAt);
}

function getArticleFixture(locale: SiteLocale, path: string, route: string): ArticleFixture {
  const slug = path.slice('/blog/'.length);
  const post = getBlogPost(locale, slug);
  if (!post) {
    throw new Error(`Missing article fixture: locale=${locale}, route=${route}, slug=${JSON.stringify(slug)}`);
  }
  return { slug, post };
}

function contentFixture(locale: SiteLocale, path: string): RouteExpectation {
  const route = localizedRoute(locale, path);
  if (path === '/') return { route, locale, scripts: [
    { id: locale === 'en' ? 'homepage-jsonld' : 'homepage-zh-jsonld', types: ['SoftwareApplication'] },
  ] };
  if (path === '/blog') return { route, locale, scripts: [
    { id: `blog-hub-${locale}-1`, types: ['CollectionPage'] },
    { id: `blog-hub-breadcrumb-${locale}-1`, types: ['BreadcrumbList'] },
  ] };
  if (path === '/faq') return { route, locale, scripts: [
    { id: `faq-doc-${locale}-collection-jsonld`, types: ['CollectionPage'] },
    { id: `faq-doc-${locale}-faq-jsonld`, types: ['FAQPage'] },
    { id: `faq-doc-${locale}-breadcrumb-jsonld`, types: ['BreadcrumbList'] },
  ] };
  if (path === `/templates/${templateSlug}`) return { route, locale, scripts: [
    { id: `template-${locale}-${templateSlug}-jsonld`, types: ['WebApplication', 'HowTo', 'FAQPage', 'VideoObject'] },
    { id: `template-${locale}-${templateSlug}-breadcrumb-jsonld`, types: ['BreadcrumbList'] },
  ] };
  const article = path.startsWith('/blog/') ? getArticleFixture(locale, path, route) : undefined;
  if (!article) throw new Error(`No published SEO article fixture: locale=${locale}, route=${route}, path=${JSON.stringify(path)}`);
  const { post } = article;
  return { route, locale, scripts: [
    { id: `blog-post-${locale}-${article.slug}`, types: ['Article'] },
    ...(post.faqItems?.length ? [{ id: `blog-post-faq-${locale}-${article.slug}`, types: ['FAQPage'] }] : []),
    { id: `blog-post-breadcrumb-${locale}-${article.slug}`, types: ['BreadcrumbList'] },
  ], article };
}

function categoryFixture(locale: SiteLocale, slug: string, pageNumber: number): RouteExpectation {
  return { locale, route: categoryRoute(locale, slug, pageNumber), scripts: [
    { id: `blog-category-${locale}-${slug}`, types: ['CollectionPage'] },
    { id: `blog-category-breadcrumb-${locale}-${slug}`, types: ['BreadcrumbList'] },
  ] };
}

function assertCategorySignals(
  snapshot: SeoSnapshot, fixture: RouteExpectation, category: BlogCategoryCopy, pageNumber: number, phase: string,
) {
  const context = `${fixture.route} ${phase}`;
  const currentUrl = canonicalUrl(fixture.route);
  expect(snapshot.links.filter((link) => link.rel === 'canonical'), `${context}: canonical`).toEqual([
    { rel: 'canonical', language: null, href: currentUrl },
  ]);
  expect(snapshot.links.filter((link) => link.rel === 'alternate' && link.language)
    .sort((left, right) => left.language!.localeCompare(right.language!)), `${context}: hreflang`).toEqual([
    { rel: 'alternate', language: 'en-US', href: canonicalUrl(categoryRoute('en', category.slug, pageNumber)) },
    { rel: 'alternate', language: 'x-default', href: canonicalUrl(categoryRoute('en', category.slug, pageNumber)) },
    { rel: 'alternate', language: 'zh-CN', href: canonicalUrl(categoryRoute('zh', category.slug, pageNumber)) },
  ]);
  expect(readMeta(snapshot, 'og:url', context), context).toBe(currentUrl);
  const title = readTitle(snapshot, context);
  const description = readMeta(snapshot, 'description', context);
  expect(title, context).toContain(category.label);
  expect(readMeta(snapshot, 'og:title', context), context).toBe(title);
  expect(readMeta(snapshot, 'twitter:title', context), context).toBe(title);
  expect(readMeta(snapshot, 'og:description', context), context).toBe(description);
  expect(readMeta(snapshot, 'twitter:description', context), context).toBe(description);
  const firstTitle = `${category.label} | ${getSiteConfig(fixture.locale).name}`;
  const pageLabel = fixture.locale === 'en' ? `Page ${pageNumber}` : `第 ${pageNumber} 页`;
  if (pageNumber === 1) {
    expect(title, context).toBe(firstTitle);
    expect(description, context).toBe(category.description);
  } else {
    expect(title, context).not.toBe(firstTitle);
    expect(description, context).not.toBe(category.description);
    expect(title, context).toContain(pageLabel);
    expect(description, context).toContain(pageLabel);
  }
  const collectionScript = snapshot.scripts.find((script) => script.id === `blog-category-${fixture.locale}-${category.slug}`)!;
  const collection = parseSchema(collectionScript.text, `${context} id=${collectionScript.id}`);
  expect(collection.description, context).toBe(description);
  expect(title, context).toBe(`${requireText(collection.name, context)} | ${getSiteConfig(fixture.locale).name}`);
  const breadcrumbScript = snapshot.scripts.find((script) => script.id === `blog-category-breadcrumb-${fixture.locale}-${category.slug}`)!;
  const breadcrumb = parseSchema(breadcrumbScript.text, `${context} id=${breadcrumbScript.id}`);
  const items = requireArray(breadcrumb.itemListElement, context).map((entry) => requireObject(entry, context));
  expect(items.map((item) => item.item), `${context}: breadcrumb URL sequence`).toEqual([
    canonicalUrl(localizedRoute(fixture.locale, '/')),
    canonicalUrl(localizedRoute(fixture.locale, '/blog')),
    canonicalUrl(categoryRoute(fixture.locale, category.slug, 1)),
    ...(pageNumber > 1 ? [currentUrl] : []),
  ]);
  expect(items.at(-1)?.name, context).toBe(pageNumber === 1 ? category.label : pageLabel);
}

async function navigateClient(page: Page, fixture: RouteExpectation) {
  const diagnostics = getRuntimeDiagnostics(page);
  diagnostics.trackRoute(fixture.route);
  const marker = randomUUID();
  // A DOM attribute would also survive some full-document cache restorations;
  // this in-memory property must survive the actual link click in this document.
  await page.evaluate((value) => { Object.assign(window, { __seoNavigationMarker: value }); }, marker);
  await page.locator(`a[href="${fixture.route}"]:visible`).first().click();
  await expect(page, `${fixture.route}: client URL`).toHaveURL(fixture.route);
  await expect(page.locator(`script[id="${fixture.scripts[0].id}"][type="application/ld+json"]`)).toHaveCount(1);
  const snapshots = await assertLoadedRoute(page, fixture);
  const retainedMarker = await page.evaluate(() => Reflect.get(window, '__seoNavigationMarker'));
  expect(retainedMarker, `${fixture.route}: link must retain the document during client navigation`).toBe(marker);
  return snapshots;
}

for (const locale of ['en', 'zh'] as const) {
  test.describe(`${locale} SEO signals`, () => {
    test.beforeEach(({ page }) => {
      runtimeDiagnosticsByPage.set(page, createRuntimeDiagnostics(page));
    });

    for (const path of [
      '/',
      '/blog',
      '/blog/dnd-campaigns',
      '/blog/dnd-meaning',
      '/blog/dnd-bard-spells',
      '/faq',
      `/templates/${templateSlug}`,
    ]) {
      const fixture = contentFixture(locale, path);
      test(`${fixture.route}: unique semantic JSON-LD in raw HTML and hydrated DOM`, async ({ page }) => {
        const snapshots = await visitRoute(page, fixture);
        if (fixture.article) {
          for (const [phase, snapshot] of Object.entries(snapshots)) {
            assertArticleMetadata(snapshot, fixture, phase);
          }
        }
      });
    }

    for (const categoryExpectation of categoryPageExpectations[locale]) {
      // Page routes and boundaries are an independent contract. Category copy is
      // read only for localized title and description assertions.
      const category = getBlogCategory(locale, categoryExpectation.slug);
      const lastPage = categoryExpectation.pageCount;
      const pageNumbers = Array.from({ length: lastPage }, (_, index) => index + 1);
      for (const pageNumber of pageNumbers) {
        const fixture = categoryFixture(locale, category.slug, pageNumber);
        test(`${fixture.route}: current-page metadata and schemas`, async ({ page }) => {
          const snapshots = await visitRoute(page, fixture);
          for (const [phase, snapshot] of Object.entries(snapshots)) {
            assertCategorySignals(snapshot, fixture, category, pageNumber, phase);
          }
        });
      }

      test(`${locale}/${category.slug}: page 1 alias and real upper boundary return 404`, async ({ page }) => {
        const diagnostics = getRuntimeDiagnostics(page);
        for (const invalidPage of [0, 1, lastPage + 1]) {
          const route = `${categoryRoute(locale, category.slug, 1)}/page/${invalidPage}`;
          diagnostics.trackRoute(route);
          const response = await page.goto(route);
          diagnostics.assertNoBlockingMessages(route);
          expect(response?.status(), `${route}: invalid category page`).toBe(404);
          const raw = await page.evaluate(readSeoDocument, await response!.text());
          const hydrated = await page.evaluate(readSeoDocument, null);
          for (const [phase, snapshot] of Object.entries({ raw, hydrated })) {
            expect(snapshot.metas.some((entry) => entry.name === 'robots'
              && entry.content?.split(',').map((directive) => directive.trim()).includes('noindex')),
            `${route} ${phase}: robots must include noindex`).toBe(true);
            expect(snapshot.scripts.filter((script) => script.id.startsWith('blog-category-')),
              `${route} ${phase}: no category schema for a nonexistent page`).toEqual([]);
          }
        }
      });
    }

    test('category first/second/last/first client navigation updates every SEO signal', async ({ page }) => {
      test.setTimeout(90_000);
      const categoryExpectation = categoryPageExpectations[locale].find((entry) => entry.slug === 'characters');
      if (!categoryExpectation) throw new Error(`Missing characters category fixture for locale=${locale}`);
      const category = getBlogCategory(locale, categoryExpectation.slug);
      const lastPage = categoryExpectation.pageCount;
      expect(lastPage, `${locale}: characters fixture must exercise pagination`).toBeGreaterThan(1);
      await visitRoute(page, categoryFixture(locale, category.slug, 1));
      for (const pageNumber of [...new Set([2, lastPage]), 1]) {
        const fixture = categoryFixture(locale, category.slug, pageNumber);
        const snapshots = await navigateClient(page, fixture);
        for (const [phase, snapshot] of Object.entries(snapshots)) {
          assertCategorySignals(snapshot, fixture, category, pageNumber, phase);
        }
      }
    });

    test('template/blog/article/FAQ/home client navigation removes stale schemas', async ({ page }) => {
      test.setTimeout(120_000);
      const firstPost = getBlogPostsForPage(locale, 1)[0];
      if (!firstPost) throw new Error(`No first-page article for locale=${locale}`);
      await visitRoute(page, contentFixture(locale, `/templates/${templateSlug}`));
      for (const path of ['/blog', `/blog/${firstPost.slug}`, '/faq', '/', '/blog', `/templates/${templateSlug}`]) {
        await navigateClient(page, contentFixture(locale, path));
      }
    });
  });
}
