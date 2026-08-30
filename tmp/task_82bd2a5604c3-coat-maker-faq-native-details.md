# Coat Maker FAQ native details/summary

## Coding rules 1-8
1. High cohesion, low coupling: accordion owns markup and exclusive close; copy/images untouched.
2. Single responsibility: assert, id builders, sibling close, summary click, item render; export only composes.
3. Public exports only: `CoatMakerFaqAccordion`.
4. KISS: native `<details>/<summary>`, no class, no Strategy, no Base UI/shadcn accordion, no new library.
5. Fail Fast: empty locale, empty items, duplicate question, missing parent, non-details sibling — throw includes the failing value.
6. YAGNI: this FAQ only.
7. Precise names: no data/temp/helper/util/manager.
8. Followed 1-7 in the files below.

## Files modified
- `src/components/coat-of-arms/CoatMakerFaqAccordion.tsx`
- `src/components/coat-of-arms/CoatMakerSeoContent.test.tsx`

## Markup
- `<details name="coat-maker-faq">`
- `<summary id="coat-maker-faq-trigger-${locale}-${i}">` (jsdom `role="button"` so the kept five-item test still finds triggers)
- Panel `id="coat-maker-faq-panel-${locale}-${i}"` `aria-labelledby` the summary; answers stay in the DOM
- Tiny client `onClick` on summary closes sibling details (jsdom has no exclusive `name=` group; Chromium `name=` already exclusive). Native summary click still opens without hydration.

## Verification

### 1. vitest
```
pnpm exec vitest run src/components/coat-of-arms/CoatMakerSeoContent.test.tsx src/app/site-routes.test.tsx --reporter=verbose --color=false
Test Files  2 passed (2)
Tests  62 passed (62)
```

### 2. tsc
```
pnpm exec tsc --noEmit --pretty false 2>&1 | rg "CoatMakerFaq|CoatMakerSeo" || echo "no coat typecheck errors"
no coat typecheck errors
```

### 3. eslint
```
pnpm exec eslint src/components/coat-of-arms/CoatMakerFaqAccordion.tsx src/components/coat-of-arms/CoatMakerSeoContent.test.tsx
exit 0, no findings
```

### 4. ego-browser (http://127.0.0.1:3000)
SSR already contains `<details name="coat-maker-faq"><summary id="coat-maker-faq-trigger-en-0">`.

Native `summary.click()` and viewport CDP mouse events:

| step | open |
| --- | --- |
| EN first click | `[true, false]` |
| EN second click | `[false, true]` exclusive |
| EN second click again | `[false, false]` |
| EN CDP on trigger-0 | `[true, false]` |
| ZH first/second/close | same exclusive contract |
| ZH mobile 390x844 first | `[true, false]` |

Closed answers remain in the document.
