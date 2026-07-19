# Integration validation

Scope: final command validation only. No application source files were edited and no commit was created by this validation pass.

## Baseline

- `package.json` scripts used:
  - `test`: `vitest run`
  - `lint`: `eslint`
  - `build`: `next build`
- The pre-validation working tree already contained the implementation diff and untracked task artifacts. This pass did not change those files.

## Commands and results

| Order | Command | Exit status | Result summary |
| --- | --- | --- | --- |
| 1 | `pnpm exec vitest run src/components/layout/DeferredEditorLayout.test.tsx src/components/editor/preview-rendering.test.ts src/components/editor/Canvas.test.tsx src/components/site/SiteTopbarVisibility.test.tsx --reporter=verbose` | 0 | 4 test files passed; 34 tests passed. |
| 2 | `pnpm test` | 0 | 49 test files passed; 292 tests passed. |
| 3 | `pnpm lint` | 0 | ESLint completed with no diagnostics. |
| 4 | `pnpm build` | 0 | Next.js 16.2.4 production build compiled, type-checked, and generated 92 static pages successfully. |

## Failure attribution and blockers

- No validation command failed, so there is no new-diff, pre-existing, or environment failure to attribute.
- No blockers remain for the commands requested in this validation pass.

## Post-P2 run

This is a fresh final validation after the P2 fix already present in the shared working tree. This validation pass did not edit application source files or create a commit.

| Order | Command | Exit status | Result summary |
| --- | --- | --- | --- |
| 1 | `pnpm exec vitest run src/components/layout/DeferredEditorLayout.test.tsx src/components/editor/preview-rendering.test.ts src/components/editor/Canvas.test.tsx src/components/site/SiteTopbarVisibility.test.tsx --reporter=verbose` | 0 | 4 test files passed; 36 tests passed. This includes the P2 same-document hash-navigation and non-editor-hash regression coverage in `DeferredEditorLayout`. |
| 2 | `pnpm test` | 0 | 49 test files passed; 294 tests passed. |
| 3 | `pnpm lint` | 0 | ESLint completed with no diagnostics. |
| 4 | `pnpm build` | 0 | Next.js 16.2.4 production build compiled, type-checked, and generated 92 static pages successfully. |

### Post-P2 attribution and blockers

- No command failed. Therefore, there is no current-diff, pre-existing, or environment failure to attribute.
- No blockers remain for the requested post-P2 validation.
