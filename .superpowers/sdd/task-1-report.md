# Task 1 Report: Gate passive mobile editor mounting

## Changed

- `DeferredEditorLayout` now uses `(min-width: 1280px)` to retain the existing `IntersectionObserver` preload only on desktop.
- Mobile and tablet viewports show a localized `mobile-editor-launch` button and do not create an observer during passive scrolling.
- The launch click shows loading feedback before scheduling the deferred editor mount.
- The desktop/mobile breakpoint is subscribed through `useSyncExternalStore`: a resize disconnects the old desktop observer, shows the mobile control below 1280px, and recreates the 120px preload observer when returning to desktop.
- The server and hydration-first breakpoint snapshot is now `null` (unknown): it preserves the existing skeleton, blocks observer creation until the real client media-query value arrives, and only shows the launch button for an explicit mobile snapshot.
- The mobile click timer is owned by an unmount cleanup so it cannot update an unmounted layout.
- Direct `#editor-workspace` URLs and every supported editor search parameter (`preset`, `mask`, `border`, `borderTint`, `size`) remain eager on every viewport.
- An already-mounted homepage now listens for native `hashchange` events and schedules the editor when `#editor-workspace` becomes the current direct intent; its listener and pending direct-load timer are both removed on unmount.
- Initial direct intent and same-document hash intent are separate: initial mount accepts the editor hash or supported search parameters, while the `hashchange` listener accepts only the exact editor hash. A later `?preset` plus `#details` does not start the editor.
- `popstate` is intentionally out of this repair: the confirmed in-scope entry point is native same-document fragment navigation, which emits `hashchange`; observing broader browser/App Router URL state would require separate behavior and regression coverage.
- Added English and Chinese launch/loading strings and viewport-gated regression coverage.

## Test evidence

- RED: `pnpm exec vitest run src/components/layout/DeferredEditorLayout.test.tsx --reporter=verbose`
  - Exit 1; 3 passed, 2 failed.
  - Expected failures: the new mobile tests could not find `data-testid="mobile-editor-launch"` in the pre-change component.
- GREEN: `pnpm exec vitest run src/components/layout/DeferredEditorLayout.test.tsx --reporter=verbose`
  - Exit 0; 1 test file passed, 10 tests passed.
- Review RED: the same focused Vitest command exited 1 with 10 passed and 2 failed after adding the resize and unmount regressions.
  - The pre-fix desktop observer was not disconnected after a media-query change.
  - The pre-fix mobile launch timer remained pending after unmount.
- Review RED: `pnpm exec eslint src/components/layout/DeferredEditorLayout.tsx src/components/layout/DeferredEditorLayout.test.tsx src/lib/i18n/en.ts src/lib/i18n/zh.ts`
  - Exit 1 with the pre-fix `react-hooks/set-state-in-effect` error at `DeferredEditorLayout.tsx:50`.
- Review GREEN: the focused Vitest command exited 0; 1 test file passed, 12 tests passed.
- Review GREEN: the reviewer ESLint command exited 0 with no output.
- Re-review RED: an SSR `renderToString` followed by mobile `hydrateRoot` recorded one `IntersectionObserver` construction with the prior `true` server snapshot.
- Re-review GREEN: the SSR-to-mobile-hydration regression records zero observer instances across the complete hydration lifecycle; the focused Vitest command exits 0 with 13 tests passed.
- Third-review RED: `pnpm exec tsc --noEmit --pretty false` reported `TS18047` for the nullable hydration root captured by the asynchronous unmount callback.
- Third-review GREEN: the hydration root is returned from `act` and assigned in the outer scope before cleanup. The same strict type check has no Task 1 `DeferredEditorLayout` errors.
- Whole-project type-check limitation: `pnpm exec tsc --noEmit --pretty false` still exits 2 because of three unchanged errors in `src/components/site/home-showcase-shared.test.ts` (lines 57-59).
- Direct-hash RED: the focused Vitest command exited 1 with the new mobile same-document `hashchange` test unable to find `editor-layout` after the fragment changed.
- Direct-hash GREEN: the same test now uses `window.location.hash` plus a real `HashChangeEvent`; the focused Vitest command exits 0 with 14 tests passed.
- Hash-intent P2 RED: with a later `?preset=rogue`, a `#details` hashchange incorrectly mounted the editor because the listener reused the initial hash-or-search predicate (14 passed, 1 failed).
- Hash-intent P2 GREEN: the listener now checks only `#editor-workspace`; the focused Vitest command exits 0 with 15 tests passed.
- `git diff --check` completed with exit 0.

## Unresolved issues

None observed within Task 1 scope. The only remaining strict type-check failures are the three unchanged `home-showcase-shared.test.ts` errors noted above. No dependency, configuration, commit, or unrelated source changes were made.
