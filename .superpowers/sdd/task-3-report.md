# Task 3 Report: Server-renderable homepage topbar

## Changed

- Removed the top-level `'use client'` directive from `ContentSiteTopbar`.
- Added a source-boundary regression test that verifies the topbar shell does not begin with a client directive and continues to import `TrackedEditorLink`.
- Left `TrackedEditorLink` unchanged as the existing client island for editor-link analytics.
- Did not change URLs, tracking behavior, link labels, or rendered structure.

## Red evidence

`pnpm exec vitest run src/components/site/SiteTopbarVisibility.test.tsx --reporter=verbose`

- Exited 1 before the production change.
- The new `keeps the topbar shell server-renderable` test failed as expected: `expected true to be false` at the check for `source.startsWith("'use client'")`.
- The existing five visibility tests passed in the same run.

## Green evidence

`pnpm exec vitest run src/components/site/SiteTopbarVisibility.test.tsx --reporter=verbose`

- Exited 0 after removing the directive.
- Passed: 1 test file and 6 tests, including the server-boundary regression and all existing visibility checks.

## Final checks

- `pnpm exec eslint src/components/site/ContentSiteTopbar.tsx src/components/site/SiteTopbarVisibility.test.tsx` exited 0 with no output.
- `git diff --check -- src/components/site/ContentSiteTopbar.tsx src/components/site/SiteTopbarVisibility.test.tsx` exited 0.

## Issues

None observed within Task 3 scope. No dependencies, configuration, Task 1/Task 2 files, or commits were changed.
