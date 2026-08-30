# Coat-maker SEO layout polish — worker report

Task: `task_e313fceaa121`  
Dispatch: `ctx_4e41ccd71822`  
Agent: Grok

## Files modified

- `src/components/coat-of-arms/CoatMakerSeoContent.tsx`
- `src/app/globals.css`

Not modified: copy, tests, schema, page.tsx, accordion primitive, other routes.

## Visual changes

- Consistent section rhythm (`mt-16`) and H2 scale (`font-display` + `font-semibold` + `text-balance`); lead paragraphs capped at `max-w-2xl` with `text-pretty`.
- Use-case cards: tighter padding, 16:9 image radius + ring, 200ms hover lift/gold border (disabled under `prefers-reduced-motion`).
- Steps: CSS-counter gold numbered badges (no extra text nodes). Capabilities: gold left-bar chips.
- Comparison table is the hero: column 0 (our maker) gold header/cells + gold left/right border, 32% width, top-aligned cells, larger padding, zebra + hover. Competitor columns muted. Same single `<table>`; mobile `<767px` stacks rows and shows column names via `td::before { content: attr(data-label) }` (attribute only, no duplicated text nodes).
- CTA / FAQ / related: tighter gaps, FAQ trigger hover to gold without underline, related chips slightly denser.

## Constraints kept

- No user-visible copy changes.
- `data-testid="coat-maker-seo-content"` on outer section.
- Exactly one `<h1>`. DOM order: H1+intro → use-cases → steps/tools → comparison table → CTA → FAQ → related.
- One semantic `<table>`, 3 columns / 4 rows, `th[scope=col]`, `th[scope=row]`, `<td>`.
- FAQ trigger/panel ids, aria-controls/aria-labelledby, CTA `href="#coat-editor-workspace"` unchanged.
- Use-case `<img>` src/alt bindings unchanged. Schema untouched.
- Fail Fast: existing `imageSrc`/`imageAlt` throws kept; missing comparison column at `cellIndex` now throws.

## Coding rules (all 8 followed)

1. High cohesion, low coupling — layout CSS scoped under `.coat-maker-seo-content`.
2. Single responsibility — `renderUseCaseCards` / `renderComparisonTable` remain separate; main component only composes; table markup stays inside `renderComparisonTable`.
3. Public exports only — still only `CoatMakerSeoContent`.
4. KISS — Tailwind utilities + one scoped CSS block; no new component library, no Strategy/classes.
5. Fail Fast — image and comparison-column throws; nothing swallowed.
6. YAGNI — no theming system, no variant props.
7. Precise names — `coat-maker-seo-comparison-*`, `comparisonColumnLabel`; no data/temp/helper/util/manager.
8. Explicitly follow all of the above.

## Verification

### vitest (required)

```
pnpm exec vitest run src/components/coat-of-arms/CoatMakerSeoContent.test.tsx src/app/site-routes.test.tsx --reporter=verbose --color=false
```

Result: **60 passed / 60** (2 files). CoatMakerSeoContent contract, CTA, FAQ accordion, density, and site-routes coat-maker SSR JSON-LD all green.

EN/ZH keyphrase density (same semantic fields the density test counts: headings, paragraphs, list items, links, table cells; CSS `::before` / `data-label` not counted):

- **en** `coat of arms maker`: 3.425% (9 occurrences × 4 tokens / 1051 tokens) — inside 2%–4%
- **zh** `纹章制作器`: 3.279% (8 occurrences × 5 tokens / 1220 tokens) — inside 2%–4%

### tsc (required filter)

```
pnpm exec tsc --noEmit --pretty false 2>&1 | rg "CoatMakerSeo|coat-maker" || echo "no coat typecheck errors"
```

Output: `no coat typecheck errors`

Note: full `tsc --noEmit` still reports pre-existing errors in unrelated test files (`src/app/api/coat-export/route.test.ts`, `src/lib/coat-of-arms/cloud-export/r2-storage.test.ts`). Not introduced by this change.

### eslint (required)

```
pnpm exec eslint src/components/coat-of-arms/CoatMakerSeoContent.tsx
```

- 0 errors
- 1 warning: `@next/next/no-img-element` on the existing use-case `<img>` (pre-existing; not switched to `next/image` because that was out of scope)

### extra (not required)

`src/app/site-performance-styles.test.ts`: 6/6 passed after the globals.css append.

## Left

Browser visual verification is a separate task. No commit.
