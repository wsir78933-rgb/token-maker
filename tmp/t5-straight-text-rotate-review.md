# T5 只读审查：直线文字原地旋转 + 工具条不挡旋转点

审查范围：当前 worktree 未提交改动（相对 HEAD）。未改任何文件（本报告除外）。未 commit/push。

验证命令（已跑，134 passed / 4 files）：

```
pnpm exec vitest run src/lib/coat-of-arms/scene-svg.test.ts \
  src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx \
  src/components/coat-of-arms/CanvasSelectionToolbar.test.tsx \
  src/components/coat-of-arms/CanvasSelectionHandles.test.tsx --reporter=verbose
```

结论：**有条件通过。** 默认居中直线文字：图层 `rotation=90` 时 `x/y` 不变，SVG `rotate` 绕文字锚点而不是盾心；盾/charge/弧/环的**图层** `transform.rotation` 仍绕 `50 55`。工具条 `mb-14` 从 class 上离开了旋转点。无本任务相关 commit。有 Medium 缺口（左右对齐枢轴、测试用 stub 钉在基线上、环形 startAngle 混在同一批未提交 diff）。

---

## 1. 是否只改了直线文字；盾/charge/弧/环图层旋转有没有被误伤

**图层旋转：没有误伤。**

- `renderTransform` 默认枢轴仍是 `SCENE_LAYER_ROTATE_ORIGIN = { x: 50, y: 55 }`（`scene-svg.ts` 30–31, 887–894, 897–909）。只有 `path.mode === 'none'` 的直线文字传入自定义 `rotateOrigin`（739–741）。曲线/环形文字走默认参数（747）。
- 盾/charge 仍断言 `rotate(15 50 55)`：`scene-svg.test.ts` 1114–1116，测试通过。
- 弧/环图层旋转仍断言 `rotate(90 50 55)` 且不含 `rotate(90 50 102)`：`scene-svg.test.ts` 889–908，测试通过。
- Charge 手势旋转仍是 `scale: 1.25, rotation: 90`：`CoatOfArmsCanvas.test.tsx` 585–604，测试通过。
- 手势特判只在「单选 + 直线文字 + rotate」：`CoatOfArmsCanvas.tsx` 913–934。盾/charge/多选/resize/drag 仍用 `getTransformSelectionCenter`。

**同一 worktree 里环形 path 被改了（不是图层 rotation）。**

未提交 diff 同时加了 `startAngle`、重写了 `getRingFullTextPathData` / `getRingArcTextPathData`、环形手柄拖动能改极角。这不是直线旋转的回归，但是「只改直线文字」不成立。默认 `startAngle: 0` 时 IN/OUT/ARC 测试仍通过。

怎么验证：`git diff -- src/lib/coat-of-arms/scene-svg.ts src/components/coat-of-arms/CoatOfArmsCanvas.tsx src/lib/coat-of-arms/types.ts`；跑上面的 vitest。

---

## 2. SVG rotate 枢轴 vs 手势枢轴（字会不会飞）

### 默认居中：锚点一致，字不会绕盾心飞

默认直线文字 `transform = { x: 0, y: -47 }`（`text-creation-drag.ts` 47–53：`55 - 102`）。

- SVG：`translate(0 -47) rotate(90 50 102)`（`scene-svg.ts` 725–727, 739–741）。锚点场景坐标 `(50, 102-47) = (50, 55)`。
- 手势：`getNextTransform` 的 rotate 分支只改 `rotation`，不改 `x/y`（`CoatOfArmsCanvas.tsx` 946–950）。
- 90° 测试：`CoatOfArmsCanvas.test.tsx` 850–884，`rotation ≈ 90`，`x === 0`，`y === -47`。通过。

旧枢轴 `rotate(90 50 55)` 会把基线点 `(50,102)` 转到别处，字会飞；新锚点让基线留在原地。

### Medium：注释/测试名 vs 真实 SVG 枢轴

| 位置 | 声称 | 实际 |
|---|---|---|
| `CoatOfArmsCanvas.tsx` 924–931 | 「绕 painted glyph box」 | 手势只用字盒中心算**角度**；落盘仍只写 `rotation` |
| `scene-svg.ts` 724–727 | 绕 alignment x + `<text y>`（基线） | 是这个 |
| `CoatOfArmsCanvas.test.tsx` 850 | 「around the measured glyph box」 | 只断言 `x/y` 不变，不断言字盒中心没动 |
| stub `107–126` | 字盒 `y:50 h:10` → 中心 `(50,55)` | 把字盒中心钉在基线上，真实字形在基线上方 |

真实 `fontSize=40` 约 `40/7≈5.71` scene 单位高。视觉中心大约在基线上方 ~2.8。90° 时字形会绕基线甩这么多，不是旧的 47 单位绕盾心。

左右对齐更明显：SVG 绕 `x=8` 或 `x=92`（`scene-svg.ts` 726–728；测试 866–887），手势绕**整段字的盒中心**。左对齐时字会绕左边甩。没有左右对齐的手势测试。

怎么验证：

1. 居中：现有两个测试。
2. 左对齐：加一层 `alignment:'left'` 的直线文字，旋转 90°，看视觉中心是否还在原地；或对比 `straightTextLocalRotateOrigin('left')` 的场景坐标 vs `getSelectionOverlayCenter(paintedBounds)`。
3. 把 stub 的 `top` 改成基线上方（例如 `top: 45, height: 10`，中心 y=50 而不是 55），现有 90° 测试对 `x/y` 仍会绿，说明它证明不了「绕字盒」。

### Low：painted bounds 失败时回退到盾心盒

`CoatOfArmsCanvas.tsx` 1024–1033：`paintedBounds ?? getTransformedSelectionBounds(...)`。`selection-bounds.ts` 88–110 仍绕 `SCENE_PIVOT (50,55)` 转整个 100×110 crop。直线文字 `y=-47` 时回退中心约 `(50, 8)`，不是 `(50, 55)`。jsdom 不 stub `getBoundingClientRect` 就会走到这条路。浏览器里 SVG 有尺寸则没事。

---

## 3. 编码原则

未发现 High 违规。

- 无新 `interface` 文件。无 class / Strategy。直线旋转是普通函数：`straightTextLocalRotateOrigin`、`isSingleStraightTextLayer`、`selectionCenterForCanvasGesture`。
- Fail Fast：未知 alignment 抛出值（`scene-svg.ts` 729；测试 911–913）。未知工具条 placement 同样抛值（`CanvasSelectionToolbar.tsx` 215）。
- 命名清楚。没有新建模糊 util/manager。
- YAGNI：`renderTransform` 多一个默认参数，够用。
- Low：`STRAIGHT_TEXT_LOCAL_Y`（`scene-svg.ts` 32）和 `STRAIGHT_TEXT_SVG_BASELINE_Y`（`text-creation-drag.ts` 17）都是 102，靠注释锁步，不是新抽象。
- Low：`CoatOfArmsCanvas.tsx` 924 注释写「painted glyph box」，和 SVG 锚点实现不一致。

---

## 4. 测试覆盖

**有：90° 且 x/y 不变。** `CoatOfArmsCanvas.test.tsx` 881–883。配合 `scene-svg.test.ts` 850–864 的 `rotate(90 50 102)`。

**有：工具条 class/间距。**

- `mb-9` → `mb-14`：`CanvasSelectionToolbar.tsx` 207。
- 直线：`bottom-full` + `mb-14`（`CoatOfArmsCanvas.test.tsx` 829–833；`CanvasSelectionHandles.test.tsx` 336–344；`CanvasSelectionToolbar.test.tsx` 159–165）。
- 弧/环：`artboard-bottom` → `top-auto bottom-2`，且 **不含** `mb-14`（`CoatOfArmsCanvas.test.tsx` 627–635, 707–715）。

**间距算术（class，不是实测像素）：** 旋转点 `top-0 -translate-y-8 h-6`（`CanvasSelectionHandles.tsx` 139–141）顶端约 `2.75rem`；工具条 `bottom-full mb-14` 底边 `3.5rem`。间隙约 `0.75rem`。工具条 `z-30`，手柄无更高 z。

**缺口（Medium/Low）：** 没有 `getBoundingClientRect` 相交断言；没有 `toolbar.contains(rotateHandle) === false` 的直线用例（弧/环只对 path 手柄做了这个）。`mb-14` 会作用在所有 `above-selection` 工具条上，包括盾/charge，不只是直线文字。

---

## 5. 有无 commit

直线旋转 + `mb-14` **没有进 commit**。

- `git log origin/main..HEAD` 只有 `d228272`、`c3928d2`，其中没有 `straightTextLocalRotateOrigin` / `mb-14`。
- 这些改动在 `git status` 未提交文件里。
- 禁止的 commit/push 未发生。

---

## 问题清单

### Medium

1. **SVG 锚点 ≠ 手势字盒中心（左右对齐会甩）。**  
   文件：`scene-svg.ts` 724–728；`CoatOfArmsCanvas.tsx` 924–931；测试缺口 `CoatOfArmsCanvas.test.tsx` 850–884（只有居中）。  
   验证：左对齐旋转 90°，看字是否绕 x=8 甩，而手柄角度绕字盒中心。

2. **90° 测试不能单独证明枢轴一致。**  
   `getNextTransform` 本来就不改 x/y。旧 `rotate(90 50 55)` 也能让这条测试变绿。真正锁 SVG 的是 `scene-svg.test.ts` 850–864。stub 把字盒中心钉在 `(50,55)`，等于基线，不是真实字形盒。

3. **未提交 diff 混入环形 startAngle。**  
   `scene-svg.ts` 780+、`CoatOfArmsCanvas.tsx` 1133+、`types.ts` 442+、`TextSelectionToolbar.tsx`、`commands.ts` 2094+。  
   图层旋转没误伤；环形 path 极角是新行为。无法按 T1/T2/T3 切开。

### Low

4. **工具条测试只锁 class，不锁重叠。** `CanvasSelectionToolbar.tsx` 207 vs `CanvasSelectionHandles.tsx` 139–141。  
5. **`getTransformedLayerBounds` 未改直线枢轴。** `selection-bounds.ts` 88–110；回退路径 `CoatOfArmsCanvas.tsx` 1033。  
6. **注释与实现不符。** `CoatOfArmsCanvas.tsx` 924。  
7. **`mb-14` 影响盾/charge 的 above-selection 工具条**，不只直线。行为无害，范围不纯。

无 High（图层旋转误伤、吞错、新 interface 文件、本任务 commit 均未出现）。
