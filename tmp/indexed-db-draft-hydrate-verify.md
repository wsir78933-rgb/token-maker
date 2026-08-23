# Draft save/load/discard + store hydrate — verification

## Files modified (in scope)

- src/lib/coat-of-arms/project-storage.ts
- src/lib/coat-of-arms/project-storage.test.ts
- src/lib/coat-of-arms/store.ts
- src/lib/coat-of-arms/store.test.ts
- src/components/coat-of-arms/CoatOfArmsMaker.tsx

## pnpm exec vitest run src/lib/coat-of-arms/project-storage.test.ts src/lib/coat-of-arms/store.test.ts

```
 RUN  v4.1.5 /Users/wusir/Desktop/开发项目集合/token-maker-app

 ✓ src/lib/coat-of-arms/project-storage.test.ts (11 tests) 12ms
 ✓ src/lib/coat-of-arms/store.test.ts (9 tests) 11ms

 Test Files  2 passed (2)
      Tests  20 passed (20)
   Start at  10:45:12
   Duration  817ms (transform 226ms, setup 0ms, import 301ms, tests 22ms, environment 1.06s)
```

Exit code: 0

## pnpm typecheck

```
> token-maker-app@0.1.0 typecheck /Users/wusir/Desktop/开发项目集合/token-maker-app
> tsc --noEmit
```

Exit code: 0

## Extra (Maker draft recovery, not required)

`pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsMaker.test.tsx -t "draft"`
7 passed | 89 skipped.
