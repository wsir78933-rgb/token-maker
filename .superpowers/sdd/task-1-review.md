# Task 1 code review — Same-document editor-hash regression (final)

## Verdict: APPROVED

The hash-intent P2 is fixed. No P1 or P2 issue remains in the current Task 1 diff.

## Verified

- `hasInitialDirectEditorIntent` has the intended cold-load responsibility: it accepts either the exact editor hash or a supported editor search parameter. `hasEditorWorkspaceHash` has the narrower native-fragment responsibility and is the only predicate used by the `hashchange` listener.
- Cold mobile editor-hash links and all five initial search-parameter links still mount the editor. A mounted mobile launch screen now starts the editor after a native `#editor-workspace` change.
- The negative regression is real: it writes `?preset=rogue` after mount, changes the fragment to `#details`, dispatches a `HashChangeEvent`, and flushes timers. The editor remains absent, proving the listener does not reuse the search-parameter predicate.
- The hash listener unregisters its exact handler and cancels its own pending timer on unmount. The original initial-intent and mobile-click timers retain independent cleanup paths.
- No desktop or breakpoint regression was introduced: the observer remains at `120px 0px`, mobile transition disconnects it, and a return to desktop recreates it.
- `pnpm exec vitest run src/components/layout/DeferredEditorLayout.test.tsx --reporter=verbose`: passed (1 file, 15 tests).
- Relevant ESLint and `git diff --check` passed. `pnpm exec tsc --noEmit --pretty false` reports no Task 1 errors; only the three unchanged `src/components/site/home-showcase-shared.test.ts` errors remain.
