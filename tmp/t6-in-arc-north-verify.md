# T6 IN+ARC north semicircle

## Change

`layout==='arc' && facing==='in'` now draws the north semicircle west → east:

`M(50-r) 50 A r r 0 0 1 (50+r) 50`

so the path goes through `(50, 50-r)` and glyphs read upright on the upper half.

`layout==='arc' && facing==='out'` stays the south semicircle:

`M(50+r) 50 A r r 0 0 1 (50-r) 50`

Full-circle ring paths were not changed. Toolbar and default radius/facing/layout numbers were not changed.

## Verification

```text
pnpm exec vitest run src/lib/coat-of-arms/scene-svg.test.ts
```

```text
 RUN  v4.1.5 /Users/wusir/Desktop/开发项目集合/token-maker-app

 ✓ src/lib/coat-of-arms/scene-svg.test.ts (58 tests) 19ms

 Test Files  1 passed (1)
      Tests  58 passed (58)
   Start at  20:14:16
   Duration  945ms (transform 147ms, setup 0ms, import 186ms, tests 19ms, environment 601ms)
```

```text
pnpm typecheck
```

```text
> token-maker-app@0.1.0 typecheck /Users/wusir/Desktop/开发项目集合/token-maker-app
> tsc --noEmit
```

exit 0

## Files

- src/lib/coat-of-arms/scene-svg.ts
- src/lib/coat-of-arms/scene-svg.test.ts

Not committed.
