# T7 verify · drag handles saturate, pointer always released

## Change

- `CoatOfArmsCanvas.tsx`: move/up saturates boxWidth (8–100), curve coords (0–100 / 0–110), ring radius (10–50). Non-finite still throws with the value. `completeInteraction` computes next value in try, always `releasePointer` in finally, then persist.
- Old straight text without `boxWidth`: `gestureStartTextBoxWidth` saturates `defaultStraightTextBoxWidth` overflow to 8–100 (pick clamp, not skip).
- `commands.ts` untouched — persist still rejects out of range.
- Tests: removed “throws the out-of-range ring radius instead of clamping”; added saturate + canvas drag-past-bound + legacy missing boxWidth.

## Commands

```text
pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx src/components/coat-of-arms/CanvasSelectionHandles.test.tsx
```

```text
 RUN  v4.1.5 /Users/wusir/Desktop/开发项目集合/token-maker-app

 ✓ src/components/coat-of-arms/CanvasSelectionHandles.test.tsx (3 tests) 120ms
 ✓ src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx (42 tests) 673ms

 Test Files  2 passed (2)
      Tests  45 passed (45)
   Start at  15:02:42
   Duration  1.44s (transform 304ms, setup 0ms, import 606ms, tests 793ms, environment 692ms)
```

```text
pnpm typecheck
> token-maker-app@0.1.0 typecheck /Users/wusir/Desktop/开发项目集合/token-maker-app
> tsc --noEmit
exit 0
```
