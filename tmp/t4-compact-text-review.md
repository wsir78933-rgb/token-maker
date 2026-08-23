# T4 复审 · 三种文字在画布上是紧凑物件（只读，High 才报）

- 范围：对照 coamaker 几何，不对照卡片文案。High 才报。未改 `src/`，未 commit。
- 标准：高内聚、低耦合、单一职责、KISS、Fail Fast（报错含值）、YAGNI、精确命名。
- T3 已接线：`CoatOfArmsCanvas` 把 `CanvasTextPathOverlay` 作为画板兄弟节点挂上，并关掉弧/环的 8 点缩放、旋转柄、蓝矩形。7 项都核了。

## High（2）

### H1. 弧手柄按钮按画板盒子做线性百分比，虚线 path 按 `viewBox 0 0 100 110` + `meet`，默认 1800×1080 画布上对不齐

- 文件
  - `src/components/coat-of-arms/CanvasSelectionHandles.tsx`
    - `CanvasTextPathOverlay` ~168：父级 `absolute inset-0` 盖住整块画板
    - `TextPathGuideSvg` ~189–193：`viewBox="0 0 100 110"` + `preserveAspectRatio="xMidYMid meet"`（与 `scene-svg.ts` L53 场景 SVG 相同）
    - `scenePointToOverlayStyle` ~306–310：`left = point.x / 100 * 100%`，`top = point.y / 110 * 100%`
  - `src/lib/coat-of-arms/scene-svg.ts` L53：场景同样 `viewBox="0 0 100 110"` + `meet`
  - `src/app/globals.css` L1580–1583：画板 `aspect-ratio` 跟项目画布（默认 1800×1080），`.coat-canvas svg { width:100%; height:100% }`
  - `src/components/coat-of-arms/CoatOfArmsCanvas.tsx` L377–380 / L781–793：指针仍把整块画板矩形线性映射到 100×110
- 验证
  - 默认画布 1800×1080，`meet` 的 scale = `min(1800/100, 1080/110) = 1080/110 ≈ 9.818`，左右留白 `offsetX ≈ 409`
  - 新弧起点 `(30, 56)`：虚线 path 画在屏幕 x ≈ `409 + 30×9.818 = 704`（约画板宽 39%）；HTML 按钮 `left: 30%` → x = 540。差约 **164 画布单位**（显示缩到 ~900px 宽仍有 ~80 CSS px）
  - 控制点 `(50, *)` 碰巧对齐，因为中心是 letterbox 中心。测试只锁了这一点：`CanvasSelectionHandles.test.tsx` L125–137「(50, 55) → left 50% / top 50%」
  - `CoatOfArmsCanvas.test.tsx` 用 1200×1200，场景仍是 10:11，同样只有中心对齐；没有断言起点 `(10,72)` 或紧凑起点 `(30,56)` 的 `style.left`
- 为什么是 High：T3 的目标就是手柄落在 100×110 场景坐标、跟字所在的 path 重合，而不是旧的选区 bbox 百分比。虚线 path 已经进了场景 viewBox（这项对了），可拖的圆钮还在用画板盒子线性百分比。默认 3:5 画布上，用户看见字和虚线在盾中部的短弧上，左右两个手柄却明显偏到内侧。环半径钮在 `(50, 50-r)`，x=50，默认横图画布上碰巧不太露。
- 这和徽记选框不是同一条路：徽记选框先 `getBoundingClientRect`（已经是 meet 之后的像素）再线性换算，误差对消。弧手柄用的是 **真实场景坐标** 直接线性铺到画板，没有对消。
- 改法：把圆钮画进同一张 `viewBox 0 0 100 110` + `meet` 的 SVG 里（`<circle>` / `<foreignObject>`），指针用这张 SVG 的 CTM 反变换；不要用覆盖画板的 HTML `%`。不要把 overlay SVG 改成 `preserveAspectRatio="none"`，那会跟场景文字错开。

### H2. 拖到画布上的直线文字没有 y=-47 基线补偿，落到盾中部会回到底部 y=102

- 文件
  - `src/components/coat-of-arms/text-creation-drag.ts` L31：只有 **没传** transform 时才用 `createStraightTextDefaultTransform()`（y = 55−102 = **−47**）
  - `src/components/coat-of-arms/text-creation-drag.ts` L69–89 测试写明「caller-supplied transform instead of stacking the default baseline offset」——调用方必须自己带上 −47
  - `src/components/coat-of-arms/CoatOfArmsCanvas.tsx` L377–380 `addTextCardAtScenePoint`：`y: scenePoint.y - 55`，没有 −47
  - `src/lib/coat-of-arms/scene-svg.ts` L728：直线文字仍是 `<text y="102">`
- 验证
  - 点击卡片：`TextMottoPanel.test.tsx` L51 `transform.y === -47`。基线 102−47=55，盾中部。这项过了。
  - 拖到画板中心 `(50, 55)`：传入 `{ x:0, y:0 }`，基线仍在 **102**（旧底部位置）。要落到落点，应变 `y = sceneY - 102`（即 `(sceneY-55) + (-47)`）
  - 卡片文案是 “Click to add or drag onto the canvas”。拖放是正式入口，不是边角。现有拖放测试只覆盖 **弧**（`CoatOfArmsCanvas.test.tsx` L160–186，`y ≈ -25`），没覆盖直线
- 为什么是 High：核对项 1 就是「新加点直线文字用 transform 把 y=102 基线移到盾中部」。点击加对了；拖到盾上（最自然的落点）会把字放回底部，紧凑物件目标对拖放路径失效。
- 改法：直线拖放写 `y: scenePoint.y - 102`（或显式加上 `STRAIGHT_TEXT_DEFAULT_CENTER_Y - STRAIGHT_TEXT_SVG_BASELINE_Y`）。弧/环 path 已在场景中部，继续用 `sceneY - 55`。

## 七项核对

| # | 项 | 结论 |
|---|---|---|
| 1 | 新加点直线文字 transform y=−47，旧草稿不改 scene-svg | 点击加：**过**（`text-creation-drag.ts` L47–53，`TextMottoPanel.test.tsx` L51）。scene-svg 仍 `y="102"`，旧草稿默认 transform `{0,0,1,0}` 基线仍在 102。**拖放见 H2**。 |
| 2 | 新加点弧 `(30,56) (50,42) (70,56)`，不是 `(10,72)/(90,72)` | **过**。`toTextPathPlacement('curved')` L83–88；面板测试 L60–68。旧草稿 `migrateLegacyTextPath` 仍迁成 `startX:10 startY:72 endX:90`（`commands.ts` L2074–2079），scene-svg 按落盘坐标画，不改写成紧凑弧。 |
| 3 | 新加点环 radius 18，不是 40 | **过**。`toTextPathPlacement('ring')` L91–97 `radius: 18`；面板测试 L77–83。旧环 `path.radius ?? 40`。 |
| 4 | 弧/环手柄在 100×110 场景坐标，不是选区 bbox 百分比 | T3 已离开 bbox：`CanvasTextPathOverlay` 是画板兄弟，guide 的 viewBox 是 `0 0 100 110`。**圆钮仍按画板线性 % 放，见 H1**。 |
| 5 | 弧/环选中无 8 点缩放、无旋转柄、无蓝矩形 | **过**。`isCurveOrRingTextSelection` → `showResizeHandles` / `showRotateHandle` / `showBoundingRect` 全关。`CoatOfArmsCanvas.test.tsx` L524–526、L594–596：resize 0、Rotate null、蓝框 undefined。 |
| 6 | 未改 chrome 99/50/40、未抄 PRO | **过**。`globals.css` L1401 `99px`、L1430 `50px`、L1490 `40px`。本次 globals diff 只删浅色主题块，没改这三个高度。`workbench-copy` 的 `textFeature` 无 Upgrade / PRO / City Names。 |
| 7 | T3 未接线则只核 T1/T2 | T3 **已接线**，4–5 已核。 |

## 非 High（备案，不修也可）

- 直线文字选中仍有旋转柄和蓝框（核对项 5 只约束弧/环）。
- `assertCoatLayer` 校验时可能原地写 `layer.path`（迁旧草稿）。history 已是新 shape 时 `migrate` 返回同一引用。T6 已记。
- overlay / 拖放测试夹具画布是 1200×1200 或只测中心点，盖不住默认 1800×1080 的 meet 错位。
- 未做浏览器实机（只读复审；证据来自源码 + 215 tests + typecheck）。

## 验证命令真实输出

```text
pnpm exec vitest run \
  src/components/coat-of-arms/text-creation-drag.test.ts \
  src/components/coat-of-arms/TextMottoPanel.test.tsx \
  src/components/coat-of-arms/CanvasSelectionHandles.test.tsx \
  src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx \
  src/components/coat-of-arms/TextSelectionToolbar.test.tsx \
  src/lib/coat-of-arms/commands.test.ts \
  src/lib/coat-of-arms/scene-svg.test.ts
```

```text
 RUN  v4.1.5 /Users/wusir/Desktop/开发项目集合/token-maker-app

 ✓ src/components/coat-of-arms/text-creation-drag.test.ts (5 tests) 3ms
 ✓ src/lib/coat-of-arms/commands.test.ts (93 tests) 221ms
 ✓ src/lib/coat-of-arms/scene-svg.test.ts (57 tests) 20ms
 ✓ src/components/coat-of-arms/TextMottoPanel.test.tsx (3 tests) 87ms
 ✓ src/components/coat-of-arms/CanvasSelectionHandles.test.tsx (5 tests) 100ms
 ✓ src/components/coat-of-arms/TextSelectionToolbar.test.tsx (10 tests) 289ms
 ✓ src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx (42 tests) 628ms

 Test Files  7 passed (7)
      Tests  215 passed (215)
   Start at  15:51:34
   Duration  1.70s (transform 618ms, setup 0ms, import 1.46s, tests 1.35s, environment 3.00s)
```

```text
pnpm typecheck
> token-maker-app@0.1.0 typecheck /Users/wusir/Desktop/开发项目集合/token-maker-app
> tsc --noEmit
exit 0
```
