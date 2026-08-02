# Coat Maker Shared Site Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Make both Coat Maker routes use the project's shared site navigation without changing any Coat Maker editor behavior.

**Architecture:** CoatOfArmsMaker remains the workbench owner. It builds the localized navigation inputs with the same getSiteConfig, getNavLabels, and getLocalizedPath interfaces already used by InnerPageChrome, then renders ContentSiteTopbar above its existing export action bar. The workbench grid lets the shared navigation determine its own height.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Vitest, Testing Library.

## Global Constraints

- Modify only the Coat Maker shell, its scoped layout styles, and its existing component test; preserve every unrelated dirty worktree change.
- Use the existing ContentSiteTopbar; do not duplicate navigation markup or import the Token editor's stateful Header.
- Preserve the locale-equivalent Coat Maker route, the Export action bar, and all Coat Maker stores, tools, keyboard behavior, and export behavior.
- Do not add dependencies, routes, telemetry, or new localization strings.
- Use RED -> GREEN -> REFACTOR. The new tests must fail before production code is changed.
- Do not stage or commit changes unless the user separately authorizes a Git commit.

---

### Task 1: Render localized shared navigation in the Coat Maker shell

**Files:**

- Modify: src/components/coat-of-arms/CoatOfArmsMaker.tsx (imports and workbench topbar)
- Modify: src/components/coat-of-arms/CoatOfArmsMaker.test.tsx (header assertions)

**Interfaces:**

- Consumes: ContentSiteTopbar, getSiteConfig(locale), getNavLabels(locale), and getLocalizedPath(locale, path).
- Produces: links for Editor, Dice Roller, Coat Maker, and Blog; Coat Maker is active and the locale switch remains on the equivalent route.

- [ ] **Step 1: Write the failing shared-navigation tests.**

Replace the standalone-brand assertion with these behavior tests in CoatOfArmsMaker.test.tsx:

~~~tsx
it('uses the English shared site navigation with Coat Maker active', () => {
  renderWorkbench('en');

  expect(screen.getByRole('link', { name: 'Editor' }).getAttribute('href')).toBe('/');
  expect(screen.getByRole('link', { name: 'Dice Roller' }).getAttribute('href')).toBe('/dice-roller-dnd');
  const coatMakerLink = screen.getByRole('link', { name: 'Coat Maker' });
  expect(coatMakerLink.getAttribute('href')).toBe('/coat-of-arms-maker');
  expect(coatMakerLink.getAttribute('data-active')).toBe('true');
  expect(screen.getByRole('link', { name: 'Blog' }).getAttribute('href')).toBe('/blog');
  expect(screen.getByRole('link', { name: '中文' }).getAttribute('href')).toBe('/zh/coat-of-arms-maker');
  expect(screen.queryByRole('link', { name: 'Help Center' })).toBeNull();
});

it('keeps the Chinese shared navigation and locale switch on Coat Maker', () => {
  renderWorkbench('zh');

  expect(screen.getByRole('link', { name: '编辑器' }).getAttribute('href')).toBe('/zh');
  expect(screen.getByRole('link', { name: '骰子' }).getAttribute('href')).toBe('/zh/dice-roller-dnd');
  const coatMakerLink = screen.getByRole('link', { name: '纹章制作器' });
  expect(coatMakerLink.getAttribute('href')).toBe('/zh/coat-of-arms-maker');
  expect(coatMakerLink.getAttribute('data-active')).toBe('true');
  expect(screen.getByRole('link', { name: '博客' }).getAttribute('href')).toBe('/zh/blog');
  expect(screen.getByRole('link', { name: 'English' }).getAttribute('href')).toBe('/coat-of-arms-maker');
});
~~~

The tests catch a regression where the legacy Help Center / Changelog header reappears, where the active site link is wrong, or where the locale switch leaves the Coat Maker route.

In the existing Export action-bar test, replace the old predecessor assertion with these ordering assertions:

~~~tsx
const topbar = document.querySelector<HTMLElement>('.site-topbar');
expect(topbar).not.toBeNull();
expect(topbar!.nextElementSibling?.tagName).toBe('H1');
expect(topbar!.compareDocumentPosition(actionBar!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
~~~

This assertion fails against the current standalone header. It verifies that the screen-reader project heading follows the shared topbar while the Export bar remains below it in the rendered workbench sequence.

- [ ] **Step 2: Run the focused test and verify RED.**

Run:

~~~bash
pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsMaker.test.tsx --reporter=verbose
~~~

Expected: both new tests fail because the current standalone header has no shared site links.

- [ ] **Step 3: Replace the standalone header with the shared topbar.**

In CoatOfArmsMaker.tsx, import ContentSiteTopbar, getNavLabels, getSiteConfig, and getLocalizedPath. At the beginning of CoatOfArmsMaker, add:

~~~tsx
const siteConfig = getSiteConfig(locale);
const navLabels = getNavLabels(locale);
const nextLocale = locale === 'en' ? 'zh' : 'en';
const siteNavigationLinks = [
  { href: getLocalizedPath(locale, '/'), label: navLabels.editor, isActive: false },
  { href: getLocalizedPath(locale, '/dice-roller-dnd'), label: navLabels.diceRoller, isActive: false },
  { href: getLocalizedPath(locale, '/coat-of-arms-maker'), label: navLabels.coatMaker, isActive: true },
  { href: getLocalizedPath(locale, '/blog'), label: navLabels.blog, isActive: false },
];
~~~

Replace the current header with:

~~~tsx
<ContentSiteTopbar
  brandHref={getLocalizedPath(locale, '/') + '#editor-workspace'}
  brandName={siteConfig.name}
  brandSubtitle={navLabels.coatMakerBackToEditor}
  contentClassName="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8"
  localeSwitchHref={getLocalizedPath(nextLocale, '/coat-of-arms-maker')}
  localeSwitchLabel={navLabels.switchLocale}
  navClassName="mt-3 flex flex-wrap items-center gap-2 sm:mt-4"
  navLinks={siteNavigationLinks}
  siteMarkClassName="h-8 w-8 rounded-lg"
  topbarClassName="relative z-50 shrink-0"
/>
~~~

Keep the screen-reader project heading immediately after the topbar and leave the existing action bar unchanged.

- [ ] **Step 4: Run the focused test and verify GREEN.**

Run:

~~~bash
pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsMaker.test.tsx --reporter=verbose
~~~

Expected: the English and Chinese navigation tests pass alongside the remaining Coat Maker suite.

### Task 2: Preserve the Export bar below a wrapping site topbar

**Files:**

- Modify: src/app/globals.css (scoped Coat Maker workbench styles)
- Modify: src/components/coat-of-arms/CoatOfArmsMaker.test.tsx (action-bar adjacency and obsolete geometry coverage)

**Interfaces:**

- Consumes: Task 1's shared site topbar and the existing coat-target-actionbar contract.
- Produces: a content-sized first workbench grid row and an Export action bar visually directly below the shared navigation, after the screen-reader project heading.

- [ ] **Step 1: Make the top grid row content-sized and remove only stale header CSS.**

In src/app/globals.css, change:

~~~css
grid-template-rows: 4.4375rem auto minmax(0, 1fr);
~~~

to:

~~~css
grid-template-rows: auto auto minmax(0, 1fr);
~~~

Remove only the unused scoped rules for .coat-target-appbar, .coat-target-brand, and .coat-target-info-links, including their small-viewport overrides. Preserve .coat-target-actionbar, canvas, panel, and mobile drawer styles.

Delete the obsolete fixed 71px header-geometry test. Its fixed-height contract is intentionally incompatible with a shared navigation that wraps at narrow widths; the Task 1 adjacency assertion and Task 3 browser check cover the replacement behavior.

- [ ] **Step 2: Run focused checks after the style-only refactor.**

~~~bash
pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsMaker.test.tsx --reporter=verbose
pnpm exec eslint src/components/coat-of-arms/CoatOfArmsMaker.tsx src/components/coat-of-arms/CoatOfArmsMaker.test.tsx
git diff --check
~~~

Expected: all focused tests pass, ESLint exits 0, and git diff --check exits 0.

### Task 3: Verify the scoped change in the full project

**Files:**

- No additional files.

**Interfaces:**

- Verifies that shared navigation integration does not regress the workbench or current site behavior.

- [ ] **Step 1: Run all automated checks.**

~~~bash
pnpm test
pnpm lint
pnpm build
~~~

Expected: each command exits 0.

- [ ] **Step 2: Perform browser acceptance checks.**

At desktop width, open /coat-of-arms-maker and /zh/coat-of-arms-maker; verify the shared site navigation, active Coat Maker pill, locale-equivalent switch, and Export action bar. At 390px width, verify links wrap without overlap and the Export trigger plus mobile tool drawer remain reachable.

- [ ] **Step 3: Review the final diff.**

~~~bash
git diff --check
git diff -- src/components/coat-of-arms/CoatOfArmsMaker.tsx src/components/coat-of-arms/CoatOfArmsMaker.test.tsx src/app/globals.css
~~~

Expected: only the approved topbar integration, stale scoped-style removal, and related tests are present. Do not stage or commit.

### Task 4: Restore route and server-render test contracts affected by the shared topbar

**Files:**

- Modify: src/app/site-routes.test.tsx (Coat Maker header-chrome assertions only)
- Modify: src/components/coat-of-arms/CoatOfArmsMaker.ssr.test.tsx (Node test dependency mock only)

**Interfaces:**

- Consumes: the approved ContentSiteTopbar integration from Task 1 and the existing Node-only Coat Maker SSR guard.
- Produces: route assertions for the shared site navigation and SSR assertions that continue to guard Coat Maker browser API access without depending on Next Image internals.

- [ ] **Step 1: Preserve the current failing evidence.**

Run:

~~~bash
pnpm exec vitest run src/app/site-routes.test.tsx --reporter=verbose
pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsMaker.ssr.test.tsx --reporter=verbose
~~~

Expected before the test-contract update: the two localized route cases fail because they query header.coat-target-appbar; the two Node SSR cases fail because Next Image's environment probe invokes the test's throwing window getter.

- [ ] **Step 2: Update only the stale route test contract.**

In the parameterized Coat Maker header-chrome test in src/app/site-routes.test.tsx, replace the legacy header, Help Center, and Changelog test inputs with localized shared-navigation inputs. Query .site-topbar, retain the Export, footer, removed-artwork, and prohibited-reference-brand checks, and assert the approved links:

~~~tsx
const sharedTopbar = document.querySelector<HTMLElement>('.site-topbar');
if (!sharedTopbar) throw new Error('Coat maker site topbar is unavailable');

for (const link of sharedNavigationLinks) {
  expect(within(sharedTopbar).getByRole('link', { name: link.label }).getAttribute('href')).toBe(link.href);
}
expect(within(sharedTopbar).getByRole('link', { name: localeSwitchLabel }).getAttribute('href')).toBe(localeSwitchHref);
~~~

Use exact route values: English has Editor /, Dice Roller /dice-roller-dnd, Coat Maker /coat-of-arms-maker, Blog /blog, and Chinese /zh/coat-of-arms-maker. Chinese has 编辑器 /zh, 骰子 /zh/dice-roller-dnd, 纹章制作器 /zh/coat-of-arms-maker, 博客 /zh/blog, and English /coat-of-arms-maker. Do not touch the unrelated Fire Bolt static-route assertions in this file.

- [ ] **Step 3: Keep the SSR guard while replacing only the Next Image dependency.**

Before importing CoatOfArmsMaker in src/components/coat-of-arms/CoatOfArmsMaker.ssr.test.tsx, mock next/image as a native image element:

~~~tsx
vi.mock('next/image', async () => {
  const { createElement } = await import('react');
  return {
    default: ({ src, alt, ...imageProps }: { src: string; alt: string }) =>
      createElement('img', { ...imageProps, alt, src }),
  };
});
~~~

Keep renderWithoutBrowserApiAccess unchanged. The mock isolates a Next Image environment check that calls typeof window; it must not weaken the test's guard against CoatOfArmsMaker reads of window, document, or localStorage.

- [ ] **Step 4: Run focused verification.**

~~~bash
pnpm exec vitest run src/app/site-routes.test.tsx src/components/coat-of-arms/CoatOfArmsMaker.ssr.test.tsx src/components/coat-of-arms/CoatOfArmsMaker.test.tsx --reporter=verbose
pnpm exec eslint src/app/site-routes.test.tsx src/components/coat-of-arms/CoatOfArmsMaker.ssr.test.tsx
git diff --check
~~~

Expected: all three focused files pass, ESLint exits 0, and git diff --check exits 0.

### Task 5: Repeat end-to-end verification after test-contract repair

**Files:**

- No additional files.

**Interfaces:**

- Verifies that the approved navigation integration and its test contracts are green as one change set.

- [ ] **Step 1: Run all automated checks.**

~~~bash
pnpm test
pnpm lint
pnpm build
~~~

Expected: each command exits 0.

- [ ] **Step 2: Perform browser acceptance checks.**

At desktop width, open /coat-of-arms-maker and /zh/coat-of-arms-maker; verify the shared navigation, active Coat Maker pill, locale-equivalent switch, and Export action bar. At 390px width, verify links wrap without overlap and the Export trigger plus mobile tool drawer remain reachable.

- [ ] **Step 3: Review the final diff.**

~~~bash
git diff --check
git diff -- src/components/coat-of-arms/CoatOfArmsMaker.tsx src/components/coat-of-arms/CoatOfArmsMaker.test.tsx src/app/globals.css src/app/site-routes.test.tsx src/components/coat-of-arms/CoatOfArmsMaker.ssr.test.tsx
~~~

Expected: only the approved navigation integration, stale scoped-style removal, and directly affected test contracts are present. Do not stage or commit.
