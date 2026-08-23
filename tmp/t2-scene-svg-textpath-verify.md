# T2 scene-svg TextPathPlacement verify

## Commands

```text
pnpm exec vitest run src/lib/coat-of-arms/scene-svg.test.ts
```

```text
 RUN  v4.1.5 /Users/wusir/Desktop/开发项目集合/token-maker-app

 ✓ src/lib/coat-of-arms/scene-svg.test.ts (57 tests) 20ms

 Test Files  1 passed (1)
      Tests  57 passed (57)
   Start at  14:29:00
   Duration  711ms (transform 149ms, setup 0ms, import 186ms, tests 20ms, environment 340ms)
```

```text
pnpm typecheck
```

```text
> token-maker-app@0.1.0 typecheck /Users/wusir/Desktop/开发项目集合/token-maker-app
> tsc --noEmit
```

exit 0

## Coverage

- three-point Q path appears in SVG (`d="M12 70 Q41.5 33.25 88 69"`)
- ring `spacing: even` sets `textLength` + `lengthAdjust="spacing"`
- unknown path mode `spiral` throws including the value
- none + `boxWidth: 48` → `textLength="48"` (scene units, same 100-wide viewBox as converted fontSize)
- facing `in` uses sweep 0; layout `arc` is a short lower semicircle, not a full circle
