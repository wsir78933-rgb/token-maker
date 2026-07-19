# Desktop Editor Stable Identity — Task 1 Report

## Status

Completed. The editor now has one stable `DeferredEditor` dynamic component, so breakpoint changes no longer replace its React component type after it has loaded.

## Modified files

- `src/components/layout/DeferredEditorLayout.tsx`
  - Replaced the desktop/mobile dynamic wrappers with one `DeferredEditor`.
  - Added `EditorLoadingFallback`, which subscribes to the existing viewport store and returns the desktop fallback only at `>=1280px`.
  - Kept `ssr: false`, `EDITOR_PRELOAD_MARGIN = '120px 0px'`, direct hash/search intent, timers, and observer logic unchanged.
- `src/components/layout/DeferredEditorLayout.test.tsx`
  - Added a stateful child to the existing `next/dynamic` mock.
  - Added the regression test for preserving editor state across the desktop breakpoint.
  - Verified unresolved mobile loading remains visually empty.

## RED evidence

Command:

```bash
pnpm exec vitest run src/components/layout/DeferredEditorLayout.test.tsx --reporter=verbose
```

Result before the production change: 18 tests passed and the new state-preservation test failed with `expected '' to be 'draft-token'`. This confirms that switching from `DeferredDesktopEditor` to `DeferredMobileEditor` remounted the stateful editor child.

The repository does not configure the `toHaveValue` matcher, so the supplied matcher was represented by an equivalent native input-value assertion. The initial attempt failed only with `Invalid Chai property: toHaveValue`; it was corrected before accepting the RED evidence above.

## GREEN evidence

Commands:

```bash
pnpm exec vitest run src/components/layout/DeferredEditorLayout.test.tsx --reporter=verbose
pnpm exec eslint src/components/layout/DeferredEditorLayout.tsx src/components/layout/DeferredEditorLayout.test.tsx
git diff --check
```

Results:

- Vitest: 1 file passed; 19 tests passed.
- ESLint: exit 0.
- `git diff --check`: exit 0.

## Scope confirmation

- Mobile: the explicit mobile launch, loading timer, hash behavior, and visual-empty unresolved state are retained. No mobile screen or interaction was added.
- SEO: no SEO files, metadata, routes, or page content were changed.
- No dependencies were installed and no commit was created.

## Unresolved issues

None within Task 1. Full-suite and browser acceptance checks are intentionally left to Task 2.
