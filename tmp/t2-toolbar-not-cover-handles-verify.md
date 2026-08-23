# T2 工具条别挡手柄 — 验证

## 改动

- 选中 curve / ring：`CanvasSelectionToolbar` 不再放进字形选区盒子（`bottom-full`），改挂到画板顶部水平居中（`placement="artboard-top"`，`pointer-events-auto`）。仍是同一套工具条。
- 选中 `path.none` 直线文字：工具条仍在 `[aria-label=Selected layer controls]` 里、贴着蓝框上方。
- 弧/环手柄仍由 `CanvasTextPathOverlay` 后挂，DOM 上在工具条之后，可 pointerdown。

## 验证命令

```text
pnpm exec vitest run src/components/coat-of-arms/CanvasSelectionHandles.test.tsx src/components/coat-of-arms/CanvasSelectionToolbar.test.tsx src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx
```

```text
 RUN  v4.1.5 /Users/wusir/Desktop/开发项目集合/token-maker-app

 ✓ src/components/coat-of-arms/CanvasSelectionToolbar.test.tsx (13 tests) 187ms
 ✓ src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx (45 tests) 650ms
 ✓ src/components/coat-of-arms/CanvasSelectionHandles.test.tsx (10 tests) 481ms
     ✓ keeps the start handle on the dashed guide in a real 800×400 layout  372ms

 Test Files  3 passed (3)
      Tests  68 passed (68)
   Start at  19:52:46
   Duration  1.84s (transform 382ms, setup 0ms, import 1.38s, tests 1.32s, environment 1.39s)
```

exit 0

```text
pnpm typecheck
```

```text
> token-maker-app@0.1.0 typecheck /Users/wusir/Desktop/开发项目集合/token-maker-app
> tsc --noEmit
```

exit 0

## 文件

- src/components/coat-of-arms/CanvasSelectionHandles.tsx
- src/components/coat-of-arms/CanvasSelectionHandles.test.tsx
- src/components/coat-of-arms/CanvasSelectionToolbar.tsx
- src/components/coat-of-arms/CanvasSelectionToolbar.test.tsx
- src/components/coat-of-arms/CoatOfArmsCanvas.tsx
- src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx
