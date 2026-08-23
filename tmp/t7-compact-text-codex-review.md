# T7 · Codex 第二复审：紧凑文字（只读）

## 结论

发现 1 个紧凑文字相关 High，以及 1 个会阻断全量测试的 High 级验证问题。未修改 `src/` 产品文件，未 commit；弧/环手柄数量、默认创建 path、Fail Fast 边界与 typecheck 均通过重点核对。

## High

### H1 · 弧形/环形路径引导线与可拖动手柄在宽画布上使用了不同坐标映射

- **文件/行：** `src/components/coat-of-arms/CanvasSelectionHandles.tsx:189-193, 170-178, 306-310`；对照 `src/lib/coat-of-arms/scene-svg.ts:53`。
- **证据：** 新的 `CanvasTextPathOverlay` 将 guide SVG 设置为 `viewBox="0 0 100 110"` + `preserveAspectRatio="xMidYMid meet"`，与场景 SVG 相同；但按钮仍把 `(x, y)` 直接换算成父容器的 `x/100%`、`y/110%`。当默认画布为 `1800×1080`（父容器实测 `853.5625×512.1328`）时，浏览器几何探针用同一 `M10 72 Q50 30 90 72` guide 测得 start point 屏幕 `x=792.2699`，而按钮的 `left: 10%` 为 `x=637.075`，相差 **155.1949px**；Y 相同只是因为该点的 Y 比例恰好一致。
- **影响：** 默认宽画布下，弧形 start/control/end 和环形 radius 按钮不会落在虚线 guide/实际文字路径上，用户点击或拖动会抓不到目标；当前 215 个 focused tests 只断言了 `left: 10%` 与 SVG 属性，没有验证 `xMidYMid meet` 的非 `100:110` 画布几何。
- **最小修复方向：** 让按钮位置复用与场景 SVG 完全相同的 meet 映射（需要根据实际 viewport aspect 处理水平/垂直 letterbox），或将 guide 与按钮放进同一个可变换坐标层；补默认 `1800×1080` 的浏览器几何回归。
- **验证方式：** 选择 Curved Text/Ring Text 后读取 guide 与 handle 的 `getBoundingClientRect()`，断言每个 handle 中心落在对应 scene point/guide 上；至少覆盖默认 `1800×1080` 与 `100:110` 对照比例。

### H2 · 全量测试仍被 Ring Text 的旧半径断言阻断

- **文件/行：** `src/components/coat-of-arms/CoatOfArmsPanels.test.tsx:465-475`。
- **证据：** 产品创建实现 `src/components/coat-of-arms/text-creation-drag.ts:90-97` 的 Ring Text 默认 `radius: 18`；该测试仍断言 `radius: 40`。`pnpm test` 实际失败：`CoatOfArmsPanels.test.tsx > creates a ring text layer from the Ring Text card`，Expected `radius: 40`，Received `radius: 18`。
- **影响：** 全量 CI/合并门禁不绿；这是测试断言残留，不是把产品默认值改回 40 的理由。
- **最小修复方向：** 将该断言更新为当前已验证的 `radius: 18`，并保留 `TextMottoPanel.test.tsx` 与 `text-creation-drag.test.ts` 对 18 的契约覆盖。

## 重点排查结果（未发现 High）

- **弧/环手柄数量：** `CoatOfArmsCanvas.tsx:672-675` 在 curve/ring 选择时关闭 8 个 resize/rotate handles；`CanvasTextPathOverlay` 给 curve 渲染 3 个 handle（start/control/end），给 ring 渲染 1 个 radius handle。相关 focused tests 通过。
- **默认 path：** `text-creation-drag.ts:82-97` 新弧形为 `30/56 → 50/42 → 70/56`，新环半径为 `18`；源码中的 `10/90` 与 `radius: 40` 仅出现在 `commands.ts:2068-2094` 的旧草稿迁移 fallback，不是新建默认。
- **拖动越界：** `CoatOfArmsCanvas.tsx:1108-1148,1211-1230` 对坐标、半径、boxWidth 做 saturate；`completeInteraction` 的 `finally` 释放 pointer。有限的越界拖动不再 throw，NaN/损坏状态仍带实际值抛错；focused drag tests 通过。
- **silent catch：** compact text 相关 catch 均为可见错误报告或 `finally` 清理；`commands.ts:1433-1437,1497-1501` 将底层解码错误改成带上下文的具体错误，没有发现 silent swallow。
- **拆 prop/typecheck：** `CanvasSelectionHandles` 的新 props 在当前调用点已接通；`pnpm typecheck` exit 0。

## 实际验证输出

### 紧凑文字 focused tests

```text
pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx src/components/coat-of-arms/CanvasSelectionHandles.test.tsx src/components/coat-of-arms/TextSelectionToolbar.test.tsx src/components/coat-of-arms/TextMottoPanel.test.tsx src/components/coat-of-arms/text-creation-drag.test.ts src/lib/coat-of-arms/commands.test.ts src/lib/coat-of-arms/scene-svg.test.ts

Test Files  7 passed (7)
Tests       215 passed (215)
Start at    15:52:47
Duration    1.74s
```

### typecheck

```text
pnpm typecheck
> token-maker-app@0.1.0 typecheck /Users/wusir/Desktop/开发项目集合/token-maker-app
> tsc --noEmit
exit 0
```

### 全量测试

```text
pnpm test

Test Files  2 failed | 129 passed (131)
Tests       4 failed | 1391 passed (1395)
```

除 H2 外的 3 个失败均为 `CoatOfArmsMaker.test.tsx` 的既有/范围外 artboard CSS 几何断言（`100cqh`/短视口），本次未修改或处理。

### diff whitespace

```text
git diff --check
exit 0
```

