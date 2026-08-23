# LocalUpload dual encoding — verification

## Files modified (in scope)

- src/lib/coat-of-arms/types.ts
- src/lib/coat-of-arms/commands.ts
- src/lib/coat-of-arms/commands.test.ts

## pnpm exec vitest run src/lib/coat-of-arms/commands.test.ts

```
 RUN  v4.1.5 /Users/wusir/Desktop/开发项目集合/token-maker-app

 ✓ src/lib/coat-of-arms/commands.test.ts (88 tests) 182ms

 Test Files  1 passed (1)
      Tests  88 passed (88)
   Start at  10:36:30
   Duration  453ms (transform 121ms, setup 0ms, import 159ms, tests 182ms, environment 0ms)
```

Exit code: 0

## pnpm typecheck

```
> token-maker-app@0.1.0 typecheck /Users/wusir/Desktop/开发项目集合/token-maker-app
> tsc --noEmit

src/components/coat-of-arms/LayerPanel.tsx(252,70): error TS2339: Property 'data' does not exist on type 'LocalUpload'.
  Property 'data' does not exist on type '{ id: string; mimeType: LocalUploadMimeType; encoding: "indexed-db"; byteLength: number; }'.
src/lib/coat-of-arms/scene-svg.ts(280,69): error TS2339: Property 'data' does not exist on type 'LocalUpload'.
  Property 'data' does not exist on type '{ id: string; mimeType: LocalUploadMimeType; encoding: "indexed-db"; byteLength: number; }'.
src/lib/coat-of-arms/scene-svg.ts(626,192): error TS2339: Property 'data' does not exist on type 'LocalUpload'.
  Property 'data' does not exist on type '{ id: string; mimeType: LocalUploadMimeType; encoding: "indexed-db"; byteLength: number; }'.
src/lib/coat-of-arms/scene-svg.ts(693,57): error TS2339: Property 'data' does not exist on type 'LocalUpload'.
  Property 'data' does not exist on type '{ id: string; mimeType: LocalUploadMimeType; encoding: "indexed-db"; byteLength: number; }'.
```

Exit code: 2 (tsc --noEmit failed; pnpm reported ELIFECYCLE).

These four errors are out of scope (LayerPanel / scene-svg still read `upload.data` without narrowing `encoding`). Not mass-fixed.

## Notes

- `COAT_PROJECT_LIMITS.maxLocalUploadBytes` is now 8_388_608; `maxTotalLocalUploadBytes` is 16_777_216.
- Base64 size is computed from encoded length before decoding so an 8MiB+1 fixture does not overflow the previous whole-string regex.
- Base64 alphabet checks run in 4096-char chunks for the same reason.
