# Mobile performance diff: lifecycle and failure-mode audit

## Verdict

**Changes are required before merge: one confirmed P2 remains.** The new
`hashchange` listener can mount the deferred editor for an unrelated fragment
when a supported editor search parameter is present. That defeats the mobile
lazy-load gate and is a listener-scope error, not a cleanup leak.

Other than that P2, the inspected changed production code has paired cleanup
for its timers, observers, media-query subscriptions, and animation frame. No
new swallowed exception was found. The focused tests pass, but they do not
exercise the listener cleanup paths or the hash listener's negative case.

## Scope and evidence

Inspected current uncommitted changes in:

- `src/components/layout/DeferredEditorLayout.tsx`
- `src/components/editor/Canvas.tsx`
- `src/components/editor/preview-rendering.ts`
- their focused tests

Executed:

```text
pnpm exec vitest run src/components/layout/DeferredEditorLayout.test.tsx \
  src/components/editor/Canvas.test.tsx \
  src/components/editor/preview-rendering.test.ts --reporter=verbose

3 files passed; 29 tests passed.
```

Focused ESLint completed without diagnostics. A direct `pnpm exec tsc --noEmit`
did not complete because of existing errors in the unmodified
`src/components/site/home-showcase-shared.test.ts:57-59`; none of the changed
files reported a TypeScript diagnostic before that failure.

## Findings

### P2 — a hash event is broadened into search-parameter intent

**Categories:** event listener, asynchronous work, URL-input boundary, precise
naming/single responsibility.

**Files and lines:**

- `src/components/layout/DeferredEditorLayout.tsx:36-40`
- `src/components/layout/DeferredEditorLayout.tsx:96-112`
- missing negative regression case near
  `src/components/layout/DeferredEditorLayout.test.tsx:196-214`

`hasDirectEditorIntent()` correctly represents the initial-load policy: the
editor should load for either `#editor-workspace` or a supported editor search
parameter. The `hashchange` handler reuses that broader predicate, even though
its event only says that the fragment changed.

**Reproducible condition:** on a hydrated mobile homepage while the launch
button is still displayed, add `?preset=rogue` (or `mask`, `border`,
`borderTint`, or `size`) through same-document client routing/history without
mounting the editor, then navigate to an unrelated fragment such as
`#details`. The browser emits `hashchange`; line 100 is true from the search
parameter, lines 102-103 schedule the zero-delay load, and the complete editor
mounts despite the fragment not being `#editor-workspace`.

The current positive test proves only that `#editor-workspace` mounts the
editor. It does not prove that another fragment remains lazy when the current
URL has an editor search parameter.

**Bounded repair:** make this listener test only
`window.location.hash === '#editor-workspace'`. Keep the initial search-parameter
check separate. If in-app query-only navigation must mount the editor, give it
an explicit supported URL-state subscription and its own tests; do not infer it
from a fragment event.

### P3 — lifecycle cleanup exists but two listener classes lack regression tests

**Category:** lifecycle cleanup and asynchronous/event-listener coverage.

**Files and lines:**

- production cleanup: `DeferredEditorLayout.tsx:28-34,73-85,87-94,96-112`
- production cleanup: `Canvas.tsx:64-98,166-174`
- test gaps: `DeferredEditorLayout.test.tsx:259-272` and
  `Canvas.test.tsx:35-97,151-155`

Source review verifies the production cleanup pairs:

- `MediaQueryList.addEventListener` / `removeEventListener` are paired in both
  components.
- `IntersectionObserver.disconnect`, `ResizeObserver.disconnect`, mobile and
  direct-load timer cancellation, and `cancelAnimationFrame` are all returned
  from their owning effect or unmount cleanup.

There is no confirmed resource leak in that source. The risk is regression
coverage: the layout test verifies only the mobile button timer is cleared; it
does not unmount and prove that the hash listener or media-query subscription
is removed. The Canvas mock exposes `disconnect()` as a no-op and the tests do
not unmount then dispatch a media-query change, so removal of either observer
or listener could regress without a focused failure.

**Reproducible regression condition:** remove either cleanup call in a future
change, unmount the component, then dispatch `hashchange` or a media-query
change. The retained callback can schedule a state update after unmount.

**Required tests:** track `disconnect` and listener removal in the mocks;
unmount; dispatch the corresponding event; assert no callback remains and no
timer/state update is scheduled.

### P3 — browser-API capability is an unguarded runtime boundary

**Categories:** Fail Fast and browser-boundary input.

**Files and lines:**

- `DeferredEditorLayout.tsx:28-33`
- `Canvas.tsx:67,92-97`

Both new media-query paths assume that a returned `MediaQueryList` implements
`addEventListener` and `removeEventListener`. If the supported browser matrix
includes an environment that exposes `window.matchMedia` but only its legacy
`addListener`/`removeListener` API, these calls throw `TypeError` during mount.
This is deterministic under that capability condition; the present tests mock
the modern API only.

This is not a silently swallowed failure — there is no catch block — and it is
not classified as a confirmed user-facing regression because the target browser
support matrix was not supplied. Before declaring older browsers supported,
either feature-detect and use a paired legacy fallback or make modern
`MediaQueryList` event methods an explicit compatibility requirement and test
that decision.

## Categories with no additional defect found

| Category | Verified result |
| --- | --- |
| Timer, observer, and animation-frame ownership | No additional production leak: every new timer/listener/observer/frame has a visible paired cleanup in its owning lifecycle. |
| Async completion after unmount | `Canvas` guards asset-refresh state through `isMountedRef` (`Canvas.tsx:45,51-54,166-174`); the new mobile timer is cancelled on unmount (`DeferredEditorLayout.tsx:87-94`). |
| Silent exception handling | No new `try/catch`, empty catch, promise rejection suppression, or error swallowing exists in the inspected diff. |
| Valid browser measurement fallback | Non-positive computed backing sizes fall back to `512` in `Canvas.tsx:68-75`; a missing prior `ResizeObserver` measurement also falls back to `512` on breakpoint change at `:82-89`. |
| Naming outside the P2 | `mobileEditorLoadTimerIdRef`, `lastObservedPreviewCssSizeRef`, `getPreviewBackingSize`, and `scheduleEditorLoad` accurately describe their values or actions. |

## Boundary-test additions worth keeping narrow

1. Add the P2 negative hash case: `?preset=rogue` plus `#details` must leave
   `mobile-editor-launch` visible and editor absent.
2. Add unmount cleanup assertions for the `hashchange`, media-query, resize
   observer, and animation-frame paths.
3. Extend `preview-rendering.test.ts` with a fractional DPR rounding case and
   cap-adjacent values. The production caller already falls back for
   non-positive results, so this is coverage strengthening rather than a
   confirmed current defect.
