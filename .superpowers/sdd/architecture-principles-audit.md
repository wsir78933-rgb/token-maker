# Mobile performance diff: architecture-principles audit

## Scope and verdict

Read-only audit of the current uncommitted mobile-performance diff, focused on
`DeferredEditorLayout.tsx`, `Canvas.tsx`, `preview-rendering.ts`,
`ContentSiteTopbar.tsx`, and the two changed locale dictionaries.

**Verdict: changes requested before merge.** There is one confirmed P2 in the
hash listener. It is a clear module-interface / single-responsibility breach:
an event that means “the fragment changed” is evaluated through a predicate
that also means “the initial URL has editor search parameters.” The result is
an unrelated fragment navigation mounting the deferred editor. No other
clear violation of the eight reviewed principles was found. The duplicated
desktop media-query literal is a light maintainability deviation, not a
current behaviour defect.

No tests, build, lint, browser session, dependency install, or production
source files were run or changed by this audit. Evidence below is from the
current source, diff, and checked-in/untracked focused tests only.

## Classification summary

| Principle | Classification | Evidence |
| --- | --- | --- |
| High cohesion | Compliant | The new pure sizing policy is isolated in `src/components/editor/preview-rendering.ts:1-13`; `Canvas` remains its sole renderer-side consumer at `src/components/editor/Canvas.tsx:67-97`. |
| Low coupling | Slight deviation | The shared `<1280px` policy is independently encoded as `'(min-width: 1280px)'` in `DeferredEditorLayout.tsx:13` and `Canvas.tsx:13`, while the rendered layout uses Tailwind `xl:` at `EditorLayout.tsx:51-84`. A future breakpoint change has multiple owners. |
| Single responsibility | Clearly non-compliant for the listener | The fragment-change handler at `DeferredEditorLayout.tsx:96-104` delegates to a predicate that also evaluates search parameters at `:36-40`, so a hash event accidentally owns search-param intent. |
| KISS | Compliant except for the P2 coupling | The implementation uses native `matchMedia`, `ResizeObserver`, one small pure helper, and existing React hooks; it adds no framework or routing abstraction. The listener predicate reuse is the one simplification that changes semantics. |
| YAGNI | Compliant | The diff limits changes to the requested mobile mount gate, preview backing-store cap, and server topbar boundary. It adds no dependencies, telemetry, route, export-pipeline, or store changes. |
| Module interfaces | Clearly non-compliant for the listener; otherwise compliant | `getPreviewBackingSize` has a small explicit interface at `preview-rendering.ts:3-13`, and `ContentSiteTopbar` leaves analytics in the `TrackedEditorLink` client island at `ContentSiteTopbar.tsx:49-60`. Conversely, `hasDirectEditorIntent()` is incorrectly used as the fragment-event interface. |
| Fail fast | Compliant in this scope | The canvas applies a `512` fallback when computed backing size is not positive at `Canvas.tsx:68-75`; invalid retained measurements are discarded at `:76-89`. There is no new external/API input boundary that needs exception handling. |
| Precise naming | Slight deviation | `lastObservedPreviewCssSizeRef` and `mobileEditorLoadTimerIdRef` are precise (`Canvas.tsx:46`, `DeferredEditorLayout.tsx:51`). `hasDirectEditorIntent` accurately describes initial-load intent, but its broad name masks that it is unsafe as a hash-event predicate (`DeferredEditorLayout.tsx:36-40`, `:99-103`). |

## Clear non-compliance: P2 hash listener mounts on an unrelated fragment

**Files and lines:**

- `src/components/layout/DeferredEditorLayout.tsx:36-40` defines
  `hasDirectEditorIntent()` as `#editor-workspace` **or** any of
  `preset`, `mask`, `border`, `borderTint`, and `size`.
- `src/components/layout/DeferredEditorLayout.tsx:96-112` installs a
  `hashchange` listener; its handler calls that broad predicate at `:99-103`.
- `src/components/layout/DeferredEditorLayout.test.tsx:196-214` covers the
  positive `#editor-workspace` transition only. It has no negative case for
  another fragment after a supported search parameter is present.

**Verified code path:** On the mounted mobile launch screen, set the URL to
`/?preset=warrior` with `history.replaceState`, then navigate natively to
`#details`. The latter emits `hashchange`. At line 100,
`hasDirectEditorIntent()` is still true because of `preset`, so lines 102-103
schedule `setShouldLoadEditor(true)` even though the new hash is not
`#editor-workspace`.

This is not merely a naming concern. It violates the listener's interface
contract (respond to a particular fragment) and makes the URL-intent helper
serve two unrelated responsibilities (initial URL evaluation and a fragment
event). It can defeat the requested mobile lazy-loading gate for ordinary
in-page anchors.

**Validation method after a repair:** Add a mobile regression test that mounts
at `/`, changes the current URL to `/?preset=warrior` without remounting, then
changes the hash to `#details` and dispatches `hashchange`. Assert that
`mobile-editor-launch` remains visible and `editor-layout` is absent. Keep the
existing positive test at `DeferredEditorLayout.test.tsx:196-214`.

**Smallest bounded repair:** Give the listener a hash-specific predicate such
as `window.location.hash === '#editor-workspace'`. Keep initial search-param
loading in the existing initial-intent effect. If already-mounted Next
search-param navigation must also be supported, add that as a separate
explicit URL-state contract with its own listener/source and test; do not make
an arbitrary hash event trigger it.

## Slight deviation: breakpoint policy has three textual owners

**Files and lines:**

- `src/components/layout/DeferredEditorLayout.tsx:13,20-33`
- `src/components/editor/Canvas.tsx:13,67,92-97`
- `src/components/layout/EditorLayout.tsx:51,62,70,73,83-84` (the existing
  Tailwind `xl:` layout boundary)

The new components each declare the same runtime string. It is coherent today:
both runtime checks are exactly `(min-width: 1280px)`, matching Tailwind's
default `xl` boundary used by the editor layout. It is nevertheless a small
coupling risk because changing the editor's responsive boundary would require
coordinated edits in the layout CSS and both JavaScript constants.

This is intentionally classified as **slight**, not a required abstraction:
introducing a broad responsive-framework wrapper solely for two consumers
would conflict with KISS/YAGNI. A minimal shared editor-breakpoint constant is
appropriate only if this policy is expected to change or gains another runtime
consumer.

## Confirmed compliant areas

### `preview-rendering.ts` and `Canvas.tsx`

- `src/components/editor/preview-rendering.ts:1-13` is a focused pure policy:
  it receives CSS size, DPR, and layout mode, and returns a backing size. It
  neither reaches into React/browser state nor modifies export behaviour.
- `src/components/editor/Canvas.tsx:67-97` owns browser observation and
  applies the pure interface. It preserves the latest valid CSS size at
  `:76-80`, recalculates on a breakpoint-only change at `:82-90`, and removes
  both the `ResizeObserver` and the exact media-query listener at `:92-97`.
  That keeps lifecycle responsibility local to the component that owns the
  canvas.
- The output boundary is explicit and narrow:
  `Canvas.tsx:69-74` passes browser-derived values into
  `getPreviewBackingSize`, while `preview-rendering.ts:10-12` applies the
  mobile-only cap. No renderer pipeline, Zustand state, or PNG export module
  is imported or changed by the new helper.
- The focused tests encode the two policy modes at
  `src/components/editor/preview-rendering.test.ts:4-11` and breakpoint-only
  transitions at `src/components/editor/Canvas.test.tsx:243-283`.

### `DeferredEditorLayout.tsx` outside the P2

- The desktop subscription is explicit and cleanup-safe:
  `DeferredEditorLayout.tsx:20-34` obtains one `MediaQueryList`, subscribes,
  and returns the paired unsubscribe function. `useSyncExternalStore` at
  `:55-59` keeps browser state at the component boundary instead of leaking it
  into the editor store.
- Initial direct-link evaluation remains separate from passive desktop
  preload: `:61-85` checks initial intent first, skips observation for known
  mobile layouts at `:66`, and retains the original 120px observer contract at
  `:73-84`.
- The user-triggered mobile timer is named precisely and is cancelled on
  unmount (`:51`, `:87-94`, `:114-120`), so it does not add an unowned async
  update. The only exception is the semantic reuse in the hash listener
  described above.

### `ContentSiteTopbar.tsx`

- `src/components/site/ContentSiteTopbar.tsx:1-5` has no top-level
  `'use client'`, hooks, browser globals, or event handlers. The server
  shell receives all displayed data through the typed props in `:7-26`.
- The only interactive/analytics boundary is explicit at `:49-60`:
  `TrackedEditorLink` remains a child client component, while the static
  brand, locale link, and navigation remain server-renderable. This is a
  cohesive boundary reduction rather than a cross-module reach-in.
- `src/components/site/SiteTopbarVisibility.test.tsx:105-110` guards this
  boundary at the source level.

### i18n

- `src/components/layout/DeferredEditorLayout.tsx:54,142` consumes locale
  text only through the established `useI18n().t` interface; it does not add
  a mobile-only hard-coded string.
- Both dictionaries define the same two keys: English at
  `src/lib/i18n/en.ts:20-21` and Chinese at `src/lib/i18n/zh.ts:21-22`.
  `src/lib/i18n/index.tsx:8-12` maps the locale dictionaries behind a typed
  `t(key: I18nKey)` interface, and `zh.ts:200` derives `I18nKey` from the
  source-of-truth dictionary. The current additions therefore preserve the
  existing dictionary contract.

## Required decision

Resolve the P2 before considering the mobile lazy-load change ready. The
breakpoint duplication can remain within this narrow task unless the owner
wants a separately scoped shared-policy cleanup.
