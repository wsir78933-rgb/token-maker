# task_6b3803796d4e fix

Leftover `fieldRegionId=dexter` on a per-fess wavy field no longer calls `fieldRegionDivisionLinePath`. Scene render uses the authored dexter path `M0 0H50V110H0Z`. Matching per-pale dexter and overall clips are unchanged.

## Changes

- `src/lib/coat-of-arms/scene-svg.ts`: both region-id and placement clips go through `getMatchingDivisionLineRegionPath`, which only uses the division-line path when the division supports a line and the region belongs to it.
- `src/lib/coat-of-arms/scene-svg.test.ts`: per-fess wavy + leftover dexter charge renders without throw.

## Verify

```
pnpm exec vitest run src/lib/coat-of-arms/scene-svg.test.ts src/lib/coat-of-arms/field-division-line.test.ts
```

```
 ✓ src/lib/coat-of-arms/field-division-line.test.ts (9 tests)
 ✓ src/lib/coat-of-arms/scene-svg.test.ts (46 tests)
 Test Files  2 passed (2)
      Tests  55 passed (55)
```

```
pnpm typecheck
```

Exit code 0.
