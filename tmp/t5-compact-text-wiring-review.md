# T5 接线复审 · 画布实际选中态（只读，High 才报）

- 范围：T1+T3 完成后的画布选中态。High 才报。未改 `src/` 产品文件，未 commit。
- 标准：高内聚、低耦合、单一职责、KISS、Fail Fast（报错含值，禁止 silent fail）、YAGNI、精确命名。
- 未做浏览器实机；证据来自源码 + 指定 vitest + typecheck。默认画板 1800×1080 的 letterbox 用既有截图 `tmp/visual-canvas-align-fresh.png` 对照。

## High（1）

### H1. 弧/环选中：虚线在盾上，圆点手柄在画板百分比上，默认 1800×1080 对不齐

同一颗 `CanvasTextPathOverlay` 里两套坐标：

| 层 | 映射 | 文件 |
|---|---|---|
| 场景 SVG、overlay 虚线 | `viewBox="0 0 100 110"` + `preserveAspectRatio="xMidYMid meet"` | `scene-svg.ts` L53；`CanvasSelectionHandles.tsx` L189–193 |
| 圆点手柄（HTML button） | `left: x/100*100%`，`top: y/110*100%`，相对 overlay 根 `absolute inset-0`（整块画板） | `CanvasSelectionHandles.tsx` L168–176、L306–310 |

画板不是 10:11。默认画布 `DEFAULT_COAT_CANVAS_WIDTH/HEIGHT = 1800/1080`（`assets.ts` L261–262）。工作台把 `.coat-canvas` 的 `aspect-ratio` 设成 `1800 / 1080`（`globals.css` L1580–1583）。`meet` 按高度塞进 10:11 内容：缩放 `1080/110 ≈ 9.818`，内容宽 `981.8`，左右各空 `409` px。

默认弧 `(30,56) (50,42) (70,56)` 点下去：

| 点 | 虚线实际画在画板 | HTML 手柄 `style` |
|---|---|---|
| start 30,56 | x = 39.09%，y = 50.91% | left 30%，top 50.91% |
| control 50,42 | x = 50%，y = 38.18% | left 50%，top 38.18% |
| end 70,56 | x = 60.91%，y = 50.91% | left 70%，top 50.91% |

Y 碰巧对齐（高度撑满）。X 差约 9% 画板宽 ≈ **162 px**。起点/终点手柄会落到盾左边/右边的白边上，不在虚线上。环半径手柄同样走 `scenePointToOverlayStyle`，同一套错位。

既有截图 `tmp/visual-canvas-align-fresh.png` 已是这块横向白边 + 中间 10:11 盾，不是拉伸铺满。

测试没盖到：

- `CoatOfArmsCanvas.test.tsx` L58–62 把 `getBoundingClientRect` 默认嘲成 **100×110**，letterbox 为 0。
- `CanvasSelectionHandles.test.tsx` L125–138 只断言中心点 `(50, 55) → 50%/50%`。中心点在 `xMidYMid` 下永远重合，测不出 X 偏移。
- 画布集成测试只查 `viewBox="0 0 100 110"`，不查手柄 `left/top` 相对虚线。

`useCanvasScenePoint`（`CoatOfArmsCanvas.tsx` L780–792）也按整块画板线性映射。所以现在拖错位的手柄，写入的 `startX=30` 仍是对的路径值；虚线跟字对齐，手柄跟指针对齐，**手柄跟虚线不对齐**。若只把圆点塞进 SVG、不改指针映射，一点手柄就会把 `30` 写成约 `39`。

改法（T5 只报不改）：手柄和虚线必须走同一套 `meet` 视口（SVG 圆点，或先算出 letterbox 再百分比）。指针 `toScenePoint` 必须用同一套逆映射。不要把 overlay 改成 `preserveAspectRatio="none"`——那会跟场景字错开，也违反核对第 4 条。

## 六条核对

| # | 项 | 结论 |
|---|---|---|
| 1 | `CoatOfArmsCanvas` 使用公开导出的 `CanvasTextPathOverlay`，挂在画布 `absolute inset-0`，不是选区盒子里 | **接线本身通过。** `export function CanvasTextPathOverlay`（`CanvasSelectionHandles.tsx` L160）。画布 L44–45 从该文件公开导入。L683–688 与 `CanvasSelectionHandles` 并列，都是 `role="application"` 画布根的直接子节点。overlay 根 class 是 `absolute inset-0 z-20`（L168），不在选区 `style left/top/width/height` 盒子（L99–111）里。**选中态仍见 H1。** |
| 2 | 单选 curve/ring：无 `[data-resize-handle]`、无旋转柄、无蓝矩形 | **通过。** L206–207 + L672–675：`showResizeHandles` / `showRotateHandle` / `showBoundingRect` 在 curve/ring 为 false。测试 L524–526、L594–596：0 个 resize、无 Rotate 按钮、`selectedLayerBoundingRect()` 为 undefined。仍会挂工具条（IN/OUT 等），任务没禁止。 |
| 3 | 单选 none 文字：左右宽度条 + 旋转，无 8 点缩放 | **通过。** L203–205、L672–674：`showTextBoxWidthHandles`、`showRotateHandle`，关掉 8 点。测试 L676–678：2 根 `data-text-box-width-handle`、0 个 `data-resize-handle`、有 Rotate。 |
| 4 | overlay SVG `viewBox 0 0 100 110`，`preserveAspectRatio` 不是 `none` | **属性通过，坐标见 H1。** L192–193：`viewBox={0 0 100 110}`，`preserveAspectRatio="xMidYMid meet"`。Handles 测试 L121–122 锁了这两项。 |
| 5 | 未改 chrome、未抄 PRO | **通过。** `globals.css` L1401 `99px`、L1430 `50px`、L1489–1490 `40px` 仍在。本次 globals diff 只删浅色主题块，没动这三个高度。`workbench-copy.ts` 无 Upgrade / PRO / City Names；新文案是手柄 aria 和 IN/OUT/ARC/EVEN。 |
| 6 | T1 默认值仍是弧 `(30,56)(50,42)(70,56)`、环 `radius 18`、直线 `transform.y -47` | **通过。** `text-creation-drag.ts` L47–53、L80–97：`y = 55-102 = -47`；curve 三点；ring `radius: 18`。`text-creation-drag.test.ts` 与 `TextMottoPanel.test.tsx` L41–84 锁死。点击加弧/环不带 transform，命令层走 `defaultTransform()` `{x:0,y:0,scale:1,rotation:0}`，不会把直线的 -47 套到弧/环上。 |

## 非 High（不修也可，仅备案）

- `motto` 文字不是 curve/ring/none，会走普通 8 点框；T5 核对不含 motto。
- `appearanceLight` 从 copy / 浅色主题 CSS 删了，与 chrome 99/50/40 无关。
- `readLayerClientRect` 找不到节点时返回 0×0，不 throw。选区有 scene 回退，弧/环 overlay 不靠它定位。
- 直线宽度条仍按场景 `deltaX`，旋转后不跟局部轴（T6 已备案）。

## 验证命令真实输出

```text
pnpm exec vitest run \
  src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx \
  src/components/coat-of-arms/CanvasSelectionHandles.test.tsx \
  src/components/coat-of-arms/text-creation-drag.test.ts \
  src/components/coat-of-arms/TextMottoPanel.test.tsx
```

```text
 RUN  v4.1.5 /Users/wusir/Desktop/开发项目集合/token-maker-app

 ✓ src/components/coat-of-arms/text-creation-drag.test.ts (5 tests) 2ms
 ✓ src/components/coat-of-arms/TextMottoPanel.test.tsx (3 tests) 83ms
 ✓ src/components/coat-of-arms/CanvasSelectionHandles.test.tsx (5 tests) 97ms
 ✓ src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx (42 tests) 608ms

 Test Files  4 passed (4)
      Tests  55 passed (55)
   Start at  15:56:54
   Duration  1.63s (transform 429ms, setup 0ms, import 893ms, tests 789ms, environment 1.63s)
```

```text
pnpm typecheck
> token-maker-app@0.1.0 typecheck
> tsc --noEmit
```

exit 0
