# task_49e17027d67f verification

## Changes
- `src/lib/coat-of-arms/field-division-line.ts`: overall clips to full field; unknown style / invalid frequency (1–30) / amplitude (1–20) throw with the actual value.
- `src/lib/coat-of-arms/scene-svg.ts`: overall `fieldRegionId` uses full field path; legacy `fieldPlacement` on a matching line-style division uses `fieldRegionDivisionLinePath`; unmatched placements keep the straight rect.
- Tests in `field-division-line.test.ts` and `scene-svg.test.ts`.

## Commands

```
pnpm exec vitest run src/lib/coat-of-arms/scene-svg.test.ts src/lib/coat-of-arms/field-division-line.test.ts
```

```
 RUN  v4.1.5 /Users/wusir/Desktop/开发项目集合/token-maker-app

 ✓ src/lib/coat-of-arms/field-division-line.test.ts (9 tests) 3ms
 ✓ src/lib/coat-of-arms/scene-svg.test.ts (45 tests) 19ms

 Test Files  2 passed (2)
      Tests  54 passed (54)
   Start at  00:05:22
   Duration  345ms (transform 159ms, setup 0ms, import 205ms, tests 22ms, environment 0ms)
```

```
pnpm typecheck
```

```
> token-maker-app@0.1.0 typecheck /Users/wusir/Desktop/开发项目集合/token-maker-app
> tsc --noEmit
```

Exit code 0.
