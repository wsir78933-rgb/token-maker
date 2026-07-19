# Desktop CLS: mobile and SSR/SEO acceptance review

Date: 2026-07-19 (Asia/Shanghai)  
Scope: read-only review of the current desktop-loading-fallback diff, its complete layout tests, plans, and existing validation material. No product source, configuration, dependency, or Git state was changed by this review.

## Verdict

**PASS — the reviewed desktop-only fallback preserves the specified mobile, URL/hash, timer/observer, and initial SSR/technical-SEO contracts.**

The current tracked diff is limited to `DeferredEditorLayout.tsx` and its test. It adds two wrappers and a desktop fallback; it does not alter the existing direct-intent, observer, hash, or mobile-launch functions. Fresh focused verification passed: 6 files / 32 tests; focused ESLint and `git diff --check` exited 0.

## Acceptance evidence

| Acceptance item | Result | Verified evidence |
| --- | --- | --- |
| Mobile initial state remains an explicit launch screen | **PASS** | The initial state remains `false` (`src/components/layout/DeferredEditorLayout.tsx:84-88`). The observer effect returns before observer construction unless the real client media query is desktop (`:96-105`); the pre-load render selects `mobile-editor-launch` only for the `false` mobile snapshot (`:161-183`). The no-observer/no-editor mobile test is at `DeferredEditorLayout.test.tsx:127-136`; SSR-to-mobile hydration is at `:138-164`. |
| Explicit mobile launch preserves feedback, next-task mount, and cleanup | **PASS** | The click handler sets feedback state, then owns one zero-delay timer in the ref (`DeferredEditorLayout.tsx:149-155`); unmount clears that timer (`:122-129`). Tests require feedback before the editor (`DeferredEditorLayout.test.tsx:325-339`) and zero pending timers after unmount (`:358-371`). |
| Mobile dynamic entry has no loading fallback | **PASS** | `DeferredMobileEditor` passes only `{ ssr: false }` (`DeferredEditorLayout.tsx:44`); the selected branch is exclusive (`:157-159`). The unresolved-module launch test proves `editor-layout` is selected and `desktop-editor-loading-fallback` is absent (`DeferredEditorLayout.test.tsx:341-356`). |
| Cold direct hash and all supported initial query URLs still start the editor | **PASS** | Cold intent accepts exactly `#editor-workspace` or one of the five editor search parameters (`DeferredEditorLayout.tsx:48-51, 70-76, 96-99`). Tests cover the cold hash (`DeferredEditorLayout.test.tsx:298-308`) and every named parameter (`:310-323`). |
| An already-open mobile page reacts only to the editor hash | **PASS** | The dedicated listener checks the exact editor hash (`DeferredEditorLayout.tsx:131-147`), rather than reusing the broader cold-load predicate. Tests cover positive same-document navigation (`DeferredEditorLayout.test.tsx:256-274`) and an unrelated hash after a later `preset` URL change (`:276-296`). |
| Desktop observer/120px behavior is retained and ownership changes safely at the breakpoint | **PASS** | The unchanged observer path retains `rootMargin: '120px 0px'`, mounts only on a desktop-intersecting entry, and disconnects on cleanup (`DeferredEditorLayout.tsx:101-120`). Tests assert the margin (`DeferredEditorLayout.test.tsx:201-208`) and disconnect/recreate behavior across the breakpoint (`:228-254`). |
| Desktop direct hydration selects the new desktop fallback while unresolved | **PASS** | The desktop entry alone has `loading` (`DeferredEditorLayout.tsx:39-42`), and is selected only for a true desktop snapshot (`:157-159`). Server-markup-to-desktop-hydration coverage starts with a direct hash and requires the fallback after its zero-delay intent task (`DeferredEditorLayout.test.tsx:166-199`). |
| Initial SSR stays placeholder-first; no editor HTML is introduced | **PASS** | Both dynamic entries remain `ssr: false` (`DeferredEditorLayout.tsx:39-44`), while SSR state is initially false and returns the pre-existing `#editor-workspace` placeholder (`:84-88, 161-183`). The project dev server returned HTTP 200 for `/` and `/zh`; each response contained `data-testid="deferred-editor-placeholder"`, not the editor layout. |
| Homepage metadata, canonical URLs, indexable body, and language variants remain available | **PASS** | Home pages still define the English canonical `/` and Open Graph URL (`src/app/(en)/page.tsx:14-45`) and Chinese canonical `/zh` and Open Graph URL (`src/app/(zh)/zh/page.tsx:14-45`). Each keeps the complete server page order — hero, deferred placeholder, showcase, SEO content — (`src/app/(en)/page.tsx:67-72`; `src/app/(zh)/zh/page.tsx:67-72`). Live SSR responses contained the expected title, description, canonical, alternate-language links, JSON-LD, H1, homepage SEO-section marker, and placeholder for both URLs. The locale metadata still permits indexing (`src/lib/site-metadata.ts:50-53`) and robots continues to allow public paths (`src/app/robots.ts:7-14`; assertion at `src/app/robots.test.ts:5-15`). |

## Fresh verification

```text
pnpm exec vitest run \
  src/components/layout/DeferredEditorLayout.test.tsx \
  src/components/layout/EditorLayout.test.tsx \
  src/components/site/HomeSeoContent.test.tsx \
  src/components/site/SiteFooter.test.tsx \
  src/lib/site-metadata.test.ts \
  src/app/robots.test.ts \
  --reporter=verbose
```

Result: exit 0; 6 test files, 32 tests passed.

```text
pnpm exec eslint src/components/layout/DeferredEditorLayout.tsx \
  src/components/layout/DeferredEditorLayout.test.tsx \
  src/components/layout/EditorLayout.tsx \
  src/components/layout/EditorLayout.test.tsx
git diff --check
```

Result: both exited 0 with no diagnostics.

Existing post-P2 project validation also records `pnpm test`, `pnpm lint`, and `pnpm build` all exit 0 (`.superpowers/sdd/integration-validation.md:31-36`). The final code-review evidence is consistent with the current source and confirms the exact native hash behavior (`.superpowers/sdd/task-1-review.md:7-15`).

## Residual validation boundary (not a failure)

No controllable real mobile browser was available in this review, so a 390px production-browser interaction was not freshly measured. The pass result above is based on the source path, JSDOM hydration/timer tests, live SSR HTTP responses, and recorded successful project validation; it does not claim a new device-level interaction or performance measurement.
