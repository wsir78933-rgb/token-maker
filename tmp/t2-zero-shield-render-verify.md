# T2 · 0-shield scene render verification

## What changed

- `src/lib/coat-of-arms/scene-svg.ts`: if `clipToField` is set and no shield exists, draw the charge unclipped. If `fieldShieldLayerId` is set but missing, throw including that id. Custom shield brightness-mask clipping is unchanged.
- `src/lib/coat-of-arms/scene-svg.test.ts`: 0-shield background render; unclipped leftover charge; missing shield id Fail Fast.
- `src/lib/coat-of-arms/export.test.ts`: print + PNG export of a 0-shield project. `export.ts` itself needed no change.

## Commands

```
pnpm exec vitest run src/lib/coat-of-arms/scene-svg.test.ts src/lib/coat-of-arms/export.test.ts
```

```
 RUN  v4.1.5 /Users/wusir/Desktop/开发项目集合/token-maker-app

 ✓ src/lib/coat-of-arms/export.test.ts (45 tests) 68ms
 ✓ src/lib/coat-of-arms/scene-svg.test.ts (52 tests) 21ms

 Test Files  2 passed (2)
      Tests  97 passed (97)
   Start at  12:22:50
   Duration  1.37s (transform 396ms, setup 0ms, import 510ms, tests 89ms, environment 774ms)
```

```
pnpm typecheck
```

```
> token-maker-app@0.1.0 typecheck /Users/wusir/Desktop/开发项目集合/token-maker-app
> tsc --noEmit
```

exit 0
