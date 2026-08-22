# Test-proof holes (task_03d0a5fed669)

Tests only. No production behavior change. No commit/push.

## Changes

1. `src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx`
   - In “fades only off-artboard pixels…”: after opacity/class checks, assert
     `overflowPass.nextElementSibling === artboardPass` and
     `overflowPass.compareDocumentPosition(artboardPass) & DOCUMENT_POSITION_FOLLOWING === DOCUMENT_POSITION_FOLLOWING`.
   - Swapping the two stacked divs in `CoatOfArmsCanvas.tsx` fails this test.

2. `src/components/coat-of-arms/ShieldFieldPanel.escutcheon.test.tsx`
   - Add Charge path asserts `transform.scale === NEWLY_PLACED_LIBRARY_ASSET_SCALE` (0.6)
     with Fail Fast type narrowing.
   - Reverting `ShieldFieldPanel.tsx` overwrite to `scale: 1` fails this test.

## Verification

```
$ pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx src/components/coat-of-arms/ShieldFieldPanel.escutcheon.test.tsx

 RUN  v4.1.5 /Users/wusir/Desktop/开发项目集合/token-maker-app

 ✓ src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx (33 tests) 731ms
 ✓ src/components/coat-of-arms/ShieldFieldPanel.escutcheon.test.tsx (15 tests) 762ms

 Test Files  2 passed (2)
      Tests  48 passed (48)
   Start at  21:58:50
   Duration  1.83s (transform 387ms, setup 0ms, import 757ms, tests 1.49s, environment 1.14s)
```

```
$ pnpm typecheck

> token-maker-app@0.1.0 typecheck /Users/wusir/Desktop/开发项目集合/token-maker-app
> tsc --noEmit
```

Exit code 0.
