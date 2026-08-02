# Coat Maker Bilingual SEO Landing Design

## Goal

Turn the English and Chinese Coat Maker routes from editor-only pages into compact, server-rendered tool landing pages that can explain the product to search engines and first-time visitors without delaying access to the editor.

## Approved Product Decisions

- Cover both `/coat-of-arms-maker` and `/zh/coat-of-arms-maker` with equivalent i18n structure.
- Keep the editor as the first visible product surface; the editorial content follows the workbench.
- Use the compact landing-page scope: feature explanation, three-step use guidance, use cases, and FAQ rather than a long-form heraldry guide.
- Do not alter editor behavior, local storage, export behavior, asset catalogs, navigation, or other routes.

## Options Considered

1. Add the copy to `CoatOfArmsMaker`.
   - Rejected: the workbench is a client component. Static SEO content would be coupled to editor hydration and to its active UI state.
2. Add a server-rendered content component beneath the existing workbench.
   - Selected: preserves the immediate editor experience while giving crawlers deterministic, visible semantic content.
3. Create a separate editorial route and keep this route tool-only.
   - Rejected: splits the core commercial intent across URLs and does not repair the thin-content route.

## Architecture

### Localized content model

Extend `src/lib/site-content.ts` with a `CoatMakerSeoCopy` record and `getCoatMakerSeoCopy(locale)`. It owns English and Chinese equivalents for:

- a visible route-level title and introduction;
- three numbered creation steps;
- verified editor capabilities (shields, charges and ordinaries, colours and fields, text and layers, local projects, and export);
- three use cases (family/personal emblems, fantasy or RPG groups, and printable digital graphics);
- four FAQ items, including an explicit clarification that the tool creates an original design and does not grant or prove official/inherited arms;
- the feature list used by structured data.

The copy must describe only currently implemented capabilities. It must not assert historical authenticity, ownership rights, official registration, accounts, cloud saving, or paid features.

### Static content component

Add `src/components/coat-of-arms/CoatMakerSeoContent.tsx` as a server component with `{ locale: SiteLocale }`. It renders one visible H1 and four compact sections using existing site surface and typography utilities:

1. an introductory heading and paragraph;
2. a three-step ordered guide;
3. editor features and practical use cases;
4. FAQ questions and answers.

The existing client workbench remains unchanged, including its project-name-only screen-reader heading. The new H1 is the route's public subject heading. No new image asset is included in this first content-focused pass; the live editor remains the primary visual demonstration.

### Route integration and metadata

Update both server route files to:

- render `CoatMakerSeoContent` after `CoatOfArmsMaker` and before `SiteFooter`;
- render a single JSON-LD graph through the existing `StructuredData` component;
- use the existing locale-aware canonical and alternate URLs;
- strengthen title and description around the specific tool intent.

The graph contains `WebApplication`, `HowTo`, and `FAQPage` nodes. `WebApplication` will identify a free, browser-based design tool running on any operating system. The HowTo and FAQ nodes mirror the visible content exactly; they are semantic metadata, not a promise of a Google rich-result treatment.

## Test Strategy

Use TDD and add focused tests without modifying the existing dirty workbench test files:

- a component test for both locales that asserts the visible H1, three instructions, feature/use-case content, and FAQ appear in server-rendered markup;
- a route-level test that renders both page exports and asserts each JSON-LD graph contains `WebApplication`, `HowTo`, and `FAQPage` with the matching localized route URL;
- retain the pre-existing workbench SSR suite as a regression guard because the workbench remains untouched.

Then run the focused test files, lint the changed files, `pnpm exec tsc --noEmit`, `pnpm build`, and browser-check both local routes for the visible content and rendered JSON-LD.

## Non-Goals

- No editor UX or functionality change.
- No generated or third-party images.
- No schema claim about an official heraldic authority.
- No sitemap, robots, deployment, commit, or external publication change.

## Review Checklist

- The plan preserves editor-first behavior and i18n parity.
- Every content claim maps to a current editor capability.
- The page-level section is server-rendered and separate from the client workbench.
- Structured data is derived from the same visible copy.
- Scope excludes all existing unrelated uncommitted changes.
