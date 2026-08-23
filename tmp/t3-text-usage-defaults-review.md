# T3 复审 · 文字默认用法（只读，High 才报）

- 范围：T1+T2 完成后的新建弧/环默认值、选中工具条位置、直线文字默认与 chrome/PRO。High 才报。未改 `src/` 产品文件，未 commit。
- 标准：高内聚、低耦合、单一职责、KISS、Fail Fast（报错含值，禁止 silent fail）、YAGNI、精确命名。
- 证据：源码 + 指定 vitest + `pnpm typecheck`。未做浏览器实机。

## High

无。

## 五条核对

| # | 项 | 结论 |
|---|---|---|
| 1 | 新弧 path 是 start(28,62) control(50,28) end(72,62)，不是浅弧 30/56/42，也不是场景级 10/90 | **通过。** 唯一新建入口 `toTextPathPlacement('curved')`（`text-creation-drag.ts` L80–90）写出这六点。点击加：`TextMottoPanel.test.tsx` L60–68 锁死。命令工厂：`text-creation-drag.test.ts` L33–41 锁死。面板/画布都走 `createTextCreationCommand`。源码里没有 `startX: 30` / `startY: 56` / `controlY: 42` 的产品默认。`startX: 10` / `endX: 90` 只出现在 `migrateLegacyTextPath`（`commands.ts` L2068–2080，旧草稿 `{ mode:'curve', curve:'upper' }` → 场景级宽弧）和手柄/渲染夹具，不进新建命令。 |
| 2 | 新环 facing in、layout arc、radius 18，不是 out+full | **通过。** `toTextPathPlacement('ring')` L91–97：`radius: 18, facing: 'in', layout: 'arc', spacing: 'natural'`。`text-creation-drag.test.ts` L55–61、`TextMottoPanel.test.tsx` L77–83、`CoatOfArmsPanels.test.tsx` L465–475 锁死。旧草稿 `curve: 'clockwise'` 仍迁成 `facing: 'out', layout: 'full', radius ?? 40`（`commands.ts` L2082–2094），scene-svg 按落盘画，不把旧环改写成新默认。 |
| 3 | 选中 curve/ring 时 `CanvasSelectionToolbar` 不在字形选区盒子里压着手柄 | **通过。** `CoatOfArmsCanvas.tsx` L689：`showSelectionToolbar={!isCurveOrRingTextSelection}`，选区盒子默认 `bottom-full` 工具条关掉。L697–698：curve/ring 另挂 `placement="artboard-top"`（`top-2 left-1/2`，不在选区 `style` 盒子里）。手柄在之后的 `CanvasTextPathOverlay` 里。集成测试 L605–610、L682–687：`controls.contains(toolbar) === false`、`canvas.contains(toolbar)`、`className` 含 `top-2` 不含 `bottom-full`；L618、L694：`toolbar.contains(handle) === false`。组件测试：`CanvasSelectionHandles.test.tsx` L345–351 关工具条后选区盒子内无 toolbar；`CanvasSelectionToolbar.test.tsx` L168–176 锁 `artboard-top`。 |
| 4 | 直线文字默认和工具条位置没被误改 | **通过。** 点击加：`path: { mode:'none' }`、`fontSize: 40`、`boxWidth: 57`、`transform.y === -47`（`text-creation-drag.ts` L47–53、`TextMottoPanel.test.tsx` L41–52）。拖到 `(50,55)`：`y = 55 - 102 = -47`（`CoatOfArmsCanvas.tsx` L385–387，`CoatOfArmsCanvas.test.tsx` L234–258）。选中直线：工具条仍在 `[aria-label=Selected layer controls]` 里、`bottom-full`（画布测试 L773–776；Handles 测试 L336–343；Toolbar 测试 L159–166 默认不含 `top-2`）。弧/环点击加不带直线的 −47（命令层走 `defaultTransform()` `{x:0,y:0,scale:1,rotation:0}`）。 |
| 5 | 未改 chrome、未抄 PRO | **通过。** `globals.css` L1401/1402/1406 `99px`、L1430 `50px`、L1489–1490 `40px` 仍在。本次 globals diff 只删 `[data-appearance='light']` 主题块，没动这三个高度。`workbench-copy.ts` 无 Upgrade / PRO / `City Names`；新文案是手柄 aria 和 IN/OUT/ARC/EVEN。 |

## 非 High（备案，不修也可）

- 手柄/虚线夹具仍用场景级 `M10 72 Q50 30 90 72`、浅弧 `(30,56)(50,42)(70,56)`、环 `radius 40 facing out layout full`。那是对齐/拖动手势夹具，不是新建默认。拖放弧的集成测试只断言 `path.mode === 'curve'`，精确六点由工厂和面板测试锁。
- 环 `layout: 'arc'` 时 overlay 虚线仍是整圆 `<circle>`，字在半弧上。核对项 2 约束的是落盘 path，不是虚线形状。
- 旧草稿迁移继续写成 10/90 与 out+full，这是有意保留旧文档几何。
- `appearanceLight` 从 copy / 浅色主题 CSS 删了，与 chrome 99/50/40 无关。
- `readLayerClientRect` 找不到节点时返回 0×0，不 throw。弧/环 overlay 不靠它定位。

## 验证命令真实输出

```text
pnpm exec vitest run \
  src/components/coat-of-arms/text-creation-drag.test.ts \
  src/components/coat-of-arms/TextMottoPanel.test.tsx \
  src/components/coat-of-arms/CanvasSelectionHandles.test.tsx \
  src/components/coat-of-arms/CanvasSelectionToolbar.test.tsx \
  src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx \
  src/components/coat-of-arms/CoatOfArmsPanels.test.tsx \
  src/components/coat-of-arms/TextSelectionToolbar.test.tsx \
  src/lib/coat-of-arms/commands.test.ts \
  src/lib/coat-of-arms/scene-svg.test.ts
```

```text
 RUN  v4.1.5 /Users/wusir/Desktop/开发项目集合/token-maker-app

 ✓ src/components/coat-of-arms/text-creation-drag.test.ts (5 tests) 3ms
 ✓ src/lib/coat-of-arms/commands.test.ts (93 tests) 253ms
 ✓ src/lib/coat-of-arms/scene-svg.test.ts (57 tests) 21ms
 ✓ src/components/coat-of-arms/TextMottoPanel.test.tsx (3 tests) 95ms
 ✓ src/components/coat-of-arms/CanvasSelectionToolbar.test.tsx (13 tests) 195ms
 ✓ src/components/coat-of-arms/TextSelectionToolbar.test.tsx (10 tests) 307ms
 ✓ src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx (45 tests) 733ms
 ✓ src/components/coat-of-arms/CanvasSelectionHandles.test.tsx (10 tests) 276ms
 ✓ src/components/coat-of-arms/CoatOfArmsPanels.test.tsx (57 tests) 7169ms

 Test Files  9 passed (9)
      Tests  293 passed (293)
   Start at  19:59:32
   Duration  8.47s (transform 1.19s, setup 0ms, import 3.16s, tests 9.05s, environment 4.41s)
```

```text
pnpm typecheck
> token-maker-app@0.1.0 typecheck /Users/wusir/Desktop/开发项目集合/token-maker-app
> tsc --noEmit
```

exit 0
