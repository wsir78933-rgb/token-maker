# Coat Maker Bilingual SEO Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add compact, server-rendered English and Chinese SEO content to the Coat Maker routes while preserving the editor-first experience and keeping each locale's confirmed keyphrase density between 2% and 3%.

**Architecture:** A locale-keyed copy module owns content and verified feature claims. A server component renders the content beneath the client editor. Route modules compose the editor, content, `WebApplication` JSON-LD, and footer without coupling the static content to editor state.

**Tech Stack:** Next.js App Router, React Server Components, TypeScript, Tailwind/CSS, Vitest, Testing Library.

## Global Constraints

- Cover `/coat-of-arms-maker` and `/zh/coat-of-arms-maker` with equivalent localized structure.
- Keep the editor as the first visible product surface; render SEO content after the editor and before the footer.
- English keyphrase: `coat of arms maker`; Chinese keyphrase: `纹章制作器`.
- In each locale, keyphrase density in the SEO content must be at least 2% and at most 3%, measured as keyphrase token contribution divided by all content tokens.
- Render exactly one page-level H1 per route; the dynamic project name must not remain an H1.
- Structured data must use `WebApplication` only. Do not add `HowTo` or `FAQPage` JSON-LD.
- Do not add or modify OG/Twitter images in this task.
- Do not alter editor behavior, storage, export behavior, assets, navigation, sitemap, robots, dependencies, or unrelated routes.
- Do not commit, push, or discard existing user changes.
- Follow high cohesion, low coupling, single responsibility, KISS, Fail Fast, YAGNI, and precise naming.

---

### Task 1: Localized SEO content contract and server component

**Files:**
- Create: `src/components/coat-of-arms/coat-maker-seo-copy.ts`
- Create: `src/components/coat-of-arms/CoatMakerSeoContent.tsx`
- Create: `src/components/coat-of-arms/CoatMakerSeoContent.test.tsx`

**Interfaces:**
- Produces: `getCoatMakerSeoCopy(locale: SiteLocale): CoatMakerSeoCopy`
- Produces: `CoatMakerSeoContent({ locale }: { locale: SiteLocale })`
- Copy includes the localized H1, introduction, three steps, verified features, use cases, local privacy/export explanation, FAQ, contextual internal-link labels, and WebApplication feature names.

- [ ] **Step 1: Write failing component tests**

  Assert that each locale renders one H1, three ordered steps, verified capability text, local-browser privacy text, visible FAQ, localized internal links, and a dedicated content root. Add a deterministic test-only density calculation that fails outside the inclusive 2%–3% range.

- [ ] **Step 2: Run the focused test and verify RED**

  Run: `pnpm exec vitest run src/components/coat-of-arms/CoatMakerSeoContent.test.tsx --reporter=verbose --color=false`

  Expected: FAIL because the content component and copy contract do not exist.

- [ ] **Step 3: Implement the minimal localized copy and server component**

  Keep copy retrieval fail-fast for unsupported locale values. Render semantic sections with one H1, H2 section headings, ordered steps, lists, FAQ question headings, and localized links. Do not put SEO copy in the client workbench module.

- [ ] **Step 4: Run the focused test and verify GREEN**

  Run the same focused Vitest command and require zero failures.

---

### Task 2: Route integration, heading semantics, metadata, and WebApplication schema

**Files:**
- Create: `src/components/coat-of-arms/coat-maker-seo-schema.ts`
- Modify: `src/components/coat-of-arms/coat-maker-seo-copy.ts`
- Modify: `src/app/(maker-en)/coat-of-arms-maker/page.tsx`
- Modify: `src/app/(maker-zh)/zh/coat-of-arms-maker/page.tsx`
- Modify: `src/components/coat-of-arms/CoatOfArmsMaker.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/site-routes.test.tsx`
- Modify: `src/components/coat-of-arms/CoatOfArmsMaker.test.tsx` for existing project-name heading assertions affected by the unique page H1 contract.
- Modify: `src/components/coat-of-arms/CoatOfArmsMaker.ssr.test.tsx` only if the semantic project-name contract needs a focused regression assertion.

**Interfaces:**
- Consumes: `CoatMakerSeoContent` and `getCoatMakerSeoCopy` from Task 1.
- Produces: `buildCoatMakerWebApplicationStructuredData(locale: SiteLocale, localizedPath: string)` as the only schema builder used by both routes.
- Produces: localized route composition and route-local `WebApplication` JSON-LD through `StructuredData`.

- [ ] **Step 1: Extend route tests and verify RED**

  Assert that each full route server render contains exactly one localized H1, the SEO content appears between workbench and footer, project name is not a heading, route-specific Twitter text exists without adding image metadata, and JSON-LD has `@type: WebApplication`, the localized canonical URL, free offer, and verified features. Assert that no `HowTo` or `FAQPage` schema is emitted.

- [ ] **Step 2: Run the focused route and SSR tests and verify RED**

  Run: `pnpm exec vitest run src/app/site-routes.test.tsx src/components/coat-of-arms/CoatOfArmsMaker.ssr.test.tsx --reporter=verbose --color=false`

  Expected: FAIL because route-level content and WebApplication schema are absent and the project name is still an H1.

- [ ] **Step 3: Implement minimal route integration**

  Compose the content between editor and footer, convert the project-name-only H1 to non-heading semantics, add localized Twitter metadata without images, emit one WebApplication JSON-LD object, and allow document scrolling beyond the 100svh editor without changing the editor's own height.

- [ ] **Step 4: Run the focused tests and verify GREEN**

  Run the same focused Vitest command and require zero failures.

---

### Task 3: Regression and browser verification

**Files:**
- No planned production changes; fix only defects demonstrated by verification and cover each fix with a failing test first.

- [ ] **Step 1: Run all Coat Maker and route tests**

  Run: `pnpm exec vitest run src/components/coat-of-arms/CoatMakerSeoContent.test.tsx src/components/coat-of-arms/CoatOfArmsMaker.ssr.test.tsx src/components/coat-of-arms/CoatOfArmsMaker.test.tsx src/app/site-routes.test.tsx --reporter=verbose --color=false`

- [ ] **Step 2: Run static quality checks**

  Run: `pnpm exec eslint src/components/coat-of-arms/coat-maker-seo-copy.ts src/components/coat-of-arms/CoatMakerSeoContent.tsx src/components/coat-of-arms/CoatMakerSeoContent.test.tsx 'src/app/(maker-en)/coat-of-arms-maker/page.tsx' 'src/app/(maker-zh)/zh/coat-of-arms-maker/page.tsx' src/components/coat-of-arms/CoatOfArmsMaker.tsx src/app/site-routes.test.tsx`

  Run: `pnpm exec tsc --noEmit`

  Run: `pnpm build`

- [ ] **Step 3: Browser-check both localized routes**

  Verify that the editor remains first, scrolling reveals the compact content, each route has one visible localized H1, internal links are localized, and the layout remains usable at desktop and mobile widths.

- [ ] **Step 4: Inspect the final scoped diff**

  Confirm no share image, sitemap, robots, dependency, editor behavior, or unrelated-route change entered the task.
