# task_f2922990164d — coat-of-arms-maker SEO two fixes

## What changed

### FIX 1 — use-case images (no crop)
In `CoatMakerSeoContent.tsx` `renderUseCaseCards` img only:
- `width={1254}` `height={1254}`
- `aspect-video` → `aspect-square`
- kept `object-cover`, `rounded-xl`, `ring-1 ring-white/10`, `mb-4`, `w-full`, `h-auto`
- did not replace assets; did not change src/alt or the Fail Fast `imageSrc`/`imageAlt` throws

### FIX 2 — FAQ accordion (approach A)
New client island `src/components/coat-of-arms/CoatMakerFaqAccordion.tsx` (`"use client"`).
Receives `locale` + `faqItems` and owns the Accordion tree so Root/Item/Trigger/Panel hydrate together.

Why A, not B:
- Root cause in the dispatch: Server Component mapped AccordionItems as RSC children of Base UI Accordion, so `useCompositeListItem()` never registered (`data-index="-1"`) on the live page.
- A is the first prescribed fix: keep existing Accordion primitives, move the map into one client island.
- B (local useState accordion) reserved if browser verify still sees `data-index="-1"` or click no-ops. Browser verify is a separate task.

Kept:
- same 5 FAQ Q/A from `getCoatMakerSeoCopy` (`coat-maker-seo-copy.ts` not edited)
- trigger ids `coat-maker-faq-trigger-${locale}-${index}`
- panel ids `coat-maker-faq-panel-${locale}-${index}`
- `aria-controls` / `aria-labelledby`
- `keepMounted` (answers stay in DOM when closed)
- Base UI default `multiple={false}` (single-select; click open item to close)

## Coding rules 1–8 (declared followed)

1. High cohesion, low coupling — FAQ interaction lives in its own client module; SEO layout stays in the server component.
2. Single responsibility — `CoatMakerFaqAccordion` only renders/owns the FAQ accordion; `renderUseCaseCards` still only renders use-case cards; main component only composes.
3. Public exports only — `CoatMakerSeoContent` uses the exported `CoatMakerFaqAccordion`; does not reach into Accordion internals.
4. KISS — ordinary functions, no new component library, no classes/Strategy.
5. Fail Fast — existing `imageSrc`/`imageAlt` throws unchanged; no new silent catch.
6. YAGNI — no global accordion rewrite, no new deps, no future abstraction.
7. Precise names — `CoatMakerFaqAccordion` / `CoatMakerFaqItem` / `faqItems` / `faqItem` / `faqIndex`; no data/temp/helper/util/manager.
8. Explicitly followed 1–7.

## Verification (real command output)

### 1. vitest

```
pnpm exec vitest run src/components/coat-of-arms/CoatMakerSeoContent.test.tsx src/app/site-routes.test.tsx --reporter=verbose --color=false
```

```
 Test Files  2 passed (2)
      Tests  62 passed (62)
   Start at  23:48:14
   Duration  3.41s (transform 1.29s, setup 0ms, import 2.18s, tests 1.38s, environment 1.53s)
```

All green, including:
- renders the 'en'/'zh' FAQ as a single-select collapsible accordion
- records the 'en'/'zh' keyphrase density

Keyphrase densities (same collector as the unit test: h1/h2/h3/p/li/a/th/td leaf text):

- **en** `coat of arms maker`: 9 occurrences × 4 tokens / 1063 tokens = **3.387%** (inside 2%–4%)
- **zh** `纹章制作器`: 8 occurrences × 5 tokens / 1235 tokens = **3.239%** (inside 2%–4%)

### 2. tsc filter

```
pnpm exec tsc --noEmit --pretty false 2>&1 | rg "CoatMakerSeo|CoatMakerFaq|coat-maker" || echo "no coat typecheck errors"
```

```
no coat typecheck errors
```

### 3. eslint on edited files

```
pnpm exec eslint src/components/coat-of-arms/CoatMakerSeoContent.tsx src/components/coat-of-arms/CoatMakerFaqAccordion.tsx
```

```
/Users/wusir/Desktop/开发项目集合/token-maker-app/src/components/coat-of-arms/CoatMakerSeoContent.tsx
  25:9  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` ...  @next/next/no-img-element

✖ 1 problem (0 errors, 1 warning)
```

0 errors. The `<img>` warning is pre-existing (task required keeping the img, not next/image). `CoatMakerFaqAccordion.tsx` is clean.

## Files modified

- `src/components/coat-of-arms/CoatMakerSeoContent.tsx`
- `src/components/coat-of-arms/CoatMakerFaqAccordion.tsx` (new)

Not modified: `coat-maker-seo-copy.ts`, schema, page.tsx, globals.css, tests (no aspect-video/1600x900 assertion), no commit.

## Left

Browser verify of square artwork + FAQ expand/`data-index` is a separate task.
