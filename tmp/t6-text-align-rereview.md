# T6 复审 · 文字三件套对齐（只读，High 才报）

- 范围：普通文字 `boxWidth`、弧形三手柄 + Q、环形虚线圆/半径/IN/OUT/ARC/EVEN、旧 curve/ring 草稿、chrome 99/50/40、不抄 PRO。
- 标准：高内聚低耦合、单一职责、KISS、Fail Fast、YAGNI、精确命名。
- 未改产品文件，未 commit。

## High（1）

### H1. 拉宽 / 弧点 / 半径越界时 throw，pointerup 也走同一条路，手柄会卡住

- 文件：`src/components/coat-of-arms/CoatOfArmsCanvas.tsx`
  - `getNextTextBoxWidth` ~1120
  - `getNextCurveStartPath` / `getNextCurveControlPath` / `getNextCurveEndPath` ~1083
  - `getNextRingRadiusPath` ~1113
  - `handlePointerMove` ~429
  - `completeInteraction` ~470
  - `useCanvasScenePoint` ~757（不夹紧）
- 验证：`CoatOfArmsCanvas.test.tsx` 已写明「throws the out-of-range ring radius instead of clamping it」。配套实测（见下方命令输出）：半径 55、boxWidth 108.5、起点 x=-1 都会 throw。
- 为什么是 High：这不是落盘脏数据，是用户拖动手柄时指针必然会越出 8–100 / 0–100×0–110 / 10–50。`toScenePoint` 不夹紧；pointer capture 后可以拖出画板。默认环半径 40，上限 50，手柄在 `y=10`，拖到画板上沿就是 50，再出去 1px 就炸。`completeInteraction` 先算下一值再 `releasePointer`，pointerup 同样 throw，capture 不会放。
- Fail Fast 用错地方：`commands.ts` 拒绝非法草稿是对的。指针坐标应先收进合法区间，只有收完仍非法（NaN）才该 throw。
- 同路：旧直线文字没有 `boxWidth` 时，`beginTextBoxWidthInteraction` 会跑 `defaultStraightTextBoxWidth`。字号 40 的 36 个拉丁字母算出 103，直接 throw，点宽度手柄就会炸。新卡片有 `boxWidth: 57`，主要打旧草稿。
- 改法：move/up 里对 boxWidth / 坐标 / 半径做 saturate（`Math.min/max`），`try/finally` 里释放 pointer。persist 边界继续 throw。

## 五项核对

| # | 项 | 结论 |
|---|---|---|
| 1 | 普通文字可选中拉宽 `boxWidth` | 有两根宽度条、选中后关掉 8 个缩放手柄、`update-layer` 只写 `boxWidth` 不改 scale。越界见 H1。 |
| 2 | 弧形三手柄 + Q | overlay `d="M10 72 Q50 30 90 72"`；scene-svg `M12 70 Q41.5 33.25 88 69`。越界见 H1。 |
| 3 | 环形虚线圆、半径、IN/OUT/ARC/EVEN | 虚线圆 `stroke-dasharray="3 3"`；半径手柄；工具条 IN/OUT/ARC/EVEN；even 写 `textLength`。越界见 H1。 |
| 4 | 旧 curve/ring 草稿能加载 | `migrateLegacyTextPath`：`curve:'upper'` → 三点 Q；`ring curve:'clockwise'` → `facing:'out', layout:'full', spacing:'natural'`。`loadProjectDraft` → `assertCoatProject`。写入仍拒绝旧 shape。 |
| 5 | 未改 chrome / 未抄 PRO | topbar 99 / actionbar 50 / toolbar 40 仍在。文字文案无 Upgrade/PRO/City Names。工作区另有删浅色主题（范围外，非本五项 High）。 |

## 非 High（不修也可合并，仅备案）

- `assertCoatLayer` 在校验时原地改 `layer.path`。当前加载路径是未冻结 JSON，能迁；history 已是新 shape 时 `migrate` 返回同一引用，不会给冻结对象赋值。
- 没有 `project-storage` 专项旧草稿测试，覆盖在 `commands.test.ts` 的 `assertCoatProject`。
- 直线文字旋转后，宽度条仍按场景 `deltaX` 算，不跟局部轴。

## 验证命令真实输出

```text
pnpm exec vitest run \
  src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx \
  src/components/coat-of-arms/CanvasSelectionHandles.test.tsx \
  src/components/coat-of-arms/TextSelectionToolbar.test.tsx \
  src/components/coat-of-arms/TextMottoPanel.test.tsx \
  src/components/coat-of-arms/text-creation-drag.test.ts \
  src/lib/coat-of-arms/commands.test.ts \
  src/lib/coat-of-arms/scene-svg.test.ts
```

```text
 RUN  v4.1.5 /Users/wusir/Desktop/开发项目集合/token-maker-app

 ✓ src/components/coat-of-arms/text-creation-drag.test.ts (4 tests) 2ms
 ✓ src/lib/coat-of-arms/commands.test.ts (93 tests) 243ms
 ✓ src/lib/coat-of-arms/scene-svg.test.ts (57 tests) 19ms
 ✓ src/components/coat-of-arms/TextMottoPanel.test.tsx (3 tests) 83ms
 ✓ src/components/coat-of-arms/CanvasSelectionHandles.test.tsx (3 tests) 109ms
 ✓ src/components/coat-of-arms/TextSelectionToolbar.test.tsx (10 tests) 308ms
 ✓ src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx (36 tests) 667ms

 Test Files  7 passed (7)
      Tests  206 passed (206)
   Start at  14:50:24
   Duration  1.71s
```

```text
pnpm typecheck
> token-maker-app@0.1.0 typecheck
> tsc --noEmit
exit 0
```

越界 throw 证据（与现有测试同路径，按源码公式）：

- 环：`hypot(0, 55)=55` → `Invalid text path radius: 55; expected 10-50`（测试已覆盖 y=-5）
- 宽：`57 + (130 - 78.5) = 108.5` → `Invalid text box width: 108.5; expected 8-100 scene units`
- 弧起点：`x=-1` → `Invalid text path start x: -1; expected 0-100`
- 无 boxWidth 的长字：`round(40/7 * 0.5 * 36) = 103` → `defaultStraightTextBoxWidth` throw

chrome：`src/app/globals.css` L1401 `99px`、L1430 `50px`、L1490 `40px`。本次 globals diff 只删浅色主题块，没改这三个高度。

未做浏览器实机（只读复审，证据来自源码 + 206 tests + typecheck）。
