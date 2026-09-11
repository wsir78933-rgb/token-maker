# Kenku assemble verify

## `pnpm exec vitest run src/lib/blog/dnd-kenku.test.ts src/lib/blog/pagination.test.ts src/lib/blog/dnd-campaigns.test.ts src/lib/blog/index.test.ts src/app/sitemap.test.ts`

```
 RUN  v4.1.5 /Users/wusir/Desktop/开发项目集合/token-maker-app

 ✓ src/lib/blog/dnd-campaigns.test.ts (2 tests) 4ms
 ✓ src/lib/blog/pagination.test.ts (6 tests) 4ms
 ✓ src/app/sitemap.test.ts (38 tests) 22ms
 ✓ src/lib/blog/index.test.ts (127 tests) 60ms
 ✓ src/lib/blog/dnd-kenku.test.ts (2 tests) 31ms

 Test Files  5 passed (5)
      Tests  175 passed (175)
   Start at  01:24:04
   Duration  1.10s (transform 1.50s, setup 0ms, import 1.96s, tests 120ms, environment 533ms)
```

exit 0

## `pnpm typecheck`

```
> token-maker-app@0.1.0 typecheck /Users/wusir/Desktop/开发项目集合/token-maker-app
> tsc --noEmit
```

exit 0
