# Direct hash regression audit

## Verdict

Confirmed regression for an **already-hydrated mobile homepage**: moving that document to
`/#editor-workspace` changes the fragment and scrolls to the placeholder, but does not mount
the editor. The DOM therefore remains `data-testid="mobile-editor-launch"`.

This is not a desktop breakpoint or an `IntersectionObserver` problem. It is an unobserved URL
state transition.

Important distinction: a cold document load whose initial URL already contains
`#editor-workspace` is covered by the current code path and test. The reported behavior occurs
when the page is already open (including a same-document address-bar/anchor navigation), so
there is no remount on which to re-read `window.location.hash`.

## Root cause

`DeferredEditorLayout` reads direct editor intent only from the effect at lines 61-85:

```ts
if (hasDirectEditorIntent()) {
  return scheduleEditorLoad(setShouldLoadEditor);
}
```

That effect depends only on `isDesktopEditorLayout`. At 390px the value becomes and remains
`false`; changing only the fragment does not change that dependency. The component does not
subscribe to `hashchange`, `popstate`, or an App Router URL source.

There is a real same-document entry point at `HomeSeoContent.tsx:244`:

```tsx
<a href="#editor-workspace" className="site-cta-primary">
```

Native fragment navigation updates `window.location.hash` and scrolls, but it does not rerun the
effect. This explains the observed URL/DOM mismatch.

The same state flow is relevant to Next client navigations as well: the App Router commits its
canonical URL with `history.pushState`, and browser `hashchange` is not emitted for History API
updates. Therefore, if the intended contract also includes in-app preset/search-param navigation
on an already-open homepage, the repair must observe the App Router search state in addition to
native fragment changes.

## Why the existing Vitest test is a false green

`DeferredEditorLayout.test.tsx:196-205` calls:

```ts
window.history.replaceState(null, '', '/#editor-workspace');
render(<DeferredEditorLayout />);
```

It sets the URL **before the first render**, so it only verifies a cold initial intent. It cannot
exercise the broken transition from `mobile-editor-launch` to a later `#editor-workspace`.
It also replaces `next/dynamic` with a synchronous `editor-layout` div and waits only for an
eventual result, so it does not exercise the real lazy chunk either.

The existing hydration test (`DeferredEditorLayout.test.tsx:131-157`) uses `/`, not a direct
editor URL. It checks the server snapshot / mobile observer boundary but not hydration with an
initial fragment.

Focused verification run:

```text
pnpm exec vitest run src/components/layout/DeferredEditorLayout.test.tsx --reporter=verbose
13 passed, 0 failed
```

The all-green result is expected because no test changes the hash after the component has mounted.

## Development, production, and Strict Mode

- `next.config.ts` does not set `reactStrictMode`; the resolved production config records
  `reactStrictMode: null`. Next 16 enables App Router Strict Mode by default, so development can
  replay mount effects. That replay is not the cause: it does not create a subscription to later
  URL changes.
- The active development server is this checkout (`next-server v16.2.4`, PID 9642), and its
  generated client chunk contains the same effect with dependency `[isDesktopEditorLayout]` and
  no URL-change listener.
- The current production build's client chunk (`.next/static/chunks/0ylg472izblw1.js`, build
  timestamp 2026-07-19 12:22:54) contains the same compiled logic: the URL predicate is evaluated
  only inside an effect dependent on the desktop snapshot. It contains no `hashchange` listener.
  Thus the defect is present in both dev and production builds. Production does not replay the
  effect as dev Strict Mode does, but the missing subscription remains.

I could not independently drive a production browser in this run because the available browser
automation surface reported no attachable browser. The production conclusion above is verified
from the generated production client code, and the same-document dev behavior was supplied in
the task report.

## Smallest repair recommendation

Keep the existing initial direct-intent check and desktop observer behavior. Add a dedicated,
single-purpose URL-intent listener that calls `setShouldLoadEditor(true)` when the fragment
becomes `#editor-workspace`, and clean it up on unmount. This closes the observed native anchor /
same-document fragment regression without weakening the mobile lazy-loading gate.

For complete parity with the existing declared contract for client-side preset/search-param links,
also make direct intent react to App Router search-param changes (using the supported router URL
state under the required Suspense boundary) rather than relying on raw `history` mutation. Do not
patch `history.pushState` in this component and do not broaden the desktop observer.

## Required regression coverage

1. Mobile, mounted at `/`: assert launch control is visible and editor is absent; then change the
   fragment through the browser path (`window.location.hash = 'editor-workspace'`, followed by a
   deterministic `hashchange` dispatch in jsdom) and await editor mount. Assert the launch control
   is gone. Do not use `history.replaceState` for this transition because it emits no
   `hashchange` event.
2. Preserve the existing cold-load fragment test, but name it as an initial/cold-load case.
3. Add mobile `renderToString` + `hydrateRoot` coverage with the initial hash already present,
   alongside the current no-hash hydration test.
4. If the repair supports Next client preset links, add one interaction-level case for an
   already-mounted mobile homepage changing to `?preset=...#editor-workspace`; assert both the
   editor mount and the intended search-param synchronization.
5. After implementation, run the focused layout tests, full `pnpm test`, `pnpm lint`, `pnpm
   build`, and an actual 390x844 dev **and** production `next start` browser pass.

## Files inspected

- `src/components/layout/DeferredEditorLayout.tsx`
- `src/components/layout/DeferredEditorLayout.test.tsx`
- `src/components/site/HomeSeoContent.tsx`
- `src/components/site/EditorLaunchButton.tsx`
- `src/components/site/HomeShowcase.tsx`
- `next.config.ts` and the resolved `.next/required-server-files.json`
- development and production compiled client chunks
