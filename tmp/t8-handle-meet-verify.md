# T8 · 手柄与虚线 meet 对齐

## 改动
- `CanvasTextPathOverlay` 内增加 100×110 的 meet 盒子（`xMidYMid meet` 同款 letterbox），SVG 虚线和 HTML 手柄都相对这个盒子用 `SELECTION_SCENE_WIDTH/HEIGHT` 百分比定位。
- 未改 `preserveAspectRatio`（仍是 `xMidYMid meet`），viewBox 仍是 `0 0 100 110`。
- 未改 `CoatOfArmsCanvas` 接线。

## 验证

```text
$ pnpm exec vitest run src/components/coat-of-arms/CanvasSelectionHandles.test.tsx src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx && pnpm typecheck

 RUN  v4.1.5 /Users/wusir/Desktop/开发项目集合/token-maker-app

 ✓ src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx (43 tests) 699ms
 ✓ src/components/coat-of-arms/CanvasSelectionHandles.test.tsx (8 tests) 300ms

 Test Files  2 passed (2)
      Tests  51 passed (51)
   Start at  16:13:06
   Duration  1.74s (transform 248ms, setup 0ms, import 1.14s, tests 999ms, environment 944ms)


> token-maker-app@0.1.0 typecheck /Users/wusir/Desktop/开发项目集合/token-maker-app
> tsc --noEmit
```

## 残留
`CoatOfArmsCanvas` 的 `toScenePoint` 仍把整块画板线性映射到 100×110。手柄视觉已与虚线/场景字对齐；在 1800×1080 letterbox 上拖动手柄时，写入的 path 坐标仍可能按拉伸映射（T5 报过，T8 范围禁止改画布接线）。
