# T5 · Codex 第二复审：文字使用（只读，High 才报）

## 结论

发现 1 个 High：普通直线文字的选区工具条仍由选区盒子渲染并接收指针事件，当前测试还明确把这个结构锁死为“工具条在选区盒子内”。新建弧形/环形默认值、相关 Fail Fast/catch 处理未发现 High；本次未修改 `src/`，未 commit。

## High

### H1 · 工具条仍挂在选区盒子内，可能覆盖选区控制层并抢占手柄交互

- **文件/行：**
  - `src/components/coat-of-arms/CanvasSelectionHandles.tsx:101-113,150-157`
  - `src/components/coat-of-arms/CanvasSelectionToolbar.tsx:205-212`
  - `src/components/coat-of-arms/CoatOfArmsCanvas.tsx:681-699`
  - `src/components/coat-of-arms/CanvasSelectionHandles.test.tsx:336-343`
- **违反原则：**低耦合、单一职责；选区盒子应只负责选区框/手柄，工具条应由画布层独立定位，避免 overlay 层互相遮挡。
- **已验证证据：**
  - `CanvasSelectionHandles` 根节点以选区 `left/top/width/height` 定位（`101-113`），同一节点内先渲染直线文字宽度手柄（`150-155`），再渲染 `CanvasSelectionToolbar`（`156`）。
  - `CanvasSelectionToolbar` 默认使用 `above-selection`，其定位类仍是 `absolute ... bottom-full ... z-30`（`205-208`），且 `pointer-events-auto`；因此它仍属于选区控制 overlay 的可交互子树，而不是独立的画布级 sibling。
  - `CoatOfArmsCanvas` 只对 curve/ring 在画布层单独渲染 `placement="artboard-top"`（`697-699`）；普通直线文字走 `CanvasSelectionHandles` 的默认嵌套工具条（`681-695`、`showSelectionToolbar={!isCurveOrRingTextSelection}`）。
  - 现有测试不是防回归，而是明确断言该问题结构：`controls.contains(toolbar) === true` 且 class 含 `bottom-full`（`CanvasSelectionHandles.test.tsx:336-343`）。因此 focused tests 全绿不能证明工具条不会挡选区手柄。
- **影响：**直线文字的宽度两侧手柄、旋转控制和选区 overlay 共用一个绝对定位/堆叠上下文；工具条及其下拉菜单会随着选区盒子移动，可能覆盖或抢占同一控制区域，尤其是靠近画布边缘或选区尺寸紧凑时。该问题直接违反本次“工具条仍在选区盒子里挡手柄”的验收条件。
- **最小修复方向：**让 `CanvasSelectionHandles` 只渲染选区框和手柄；将普通直线文字工具条像 curve/ring 一样从 `CoatOfArmsCanvas` 作为画布 overlay sibling 渲染，并使用独立的画布级 placement。随后把 `CanvasSelectionHandles.test.tsx:336-343` 改成断言工具条不在 controls 内，并增加直线文字宽度手柄仍可点击的 DOM/浏览器回归。
- **验证方式：**选中新建 Straight Text，在默认画布与靠近画布上边缘的紧凑选区上读取工具条和左右宽度手柄的 `getBoundingClientRect()`，用真实 pointer click/drag 验证事件目标始终是对应手柄；同时断言 `controls.contains(toolbar)` 为 `false`。

## 重点核对结果（未发现其他 High）

- **默认弧/环没有回退：**`src/components/coat-of-arms/text-creation-drag.ts:79-98` 当前新建弧为 `28,62 → 50,28 → 72,62`，环为 `radius:18, facing:'in', layout:'arc', spacing:'natural'`；`TextMottoPanel.tsx` 使用每张卡片自己的 `defaultText`。旧草稿迁移里的 `out + full` 属于兼容旧数据，不是新建默认。
- **相关 catch 未静默吞错：**`TextSelectionToolbar.tsx:85-105` 均调用 `reportError`；`CoatOfArmsCanvas.tsx:1282-1288` 对无法识别的异常重新抛出，只有带具体数值的默认宽度越界错误才转为合法上限。未找到本次紧凑文字改动新增的 silent catch。
- **测试不是只改断言来掩盖默认值：**新建路径实现和 `text-creation-drag.test.ts`、`TextMottoPanel.test.tsx` 均同步覆盖 18 半径和紧凑弧；旧的 Ring Text 40 半径断言已在当前 diff 改为 18。

## 验证命令真实输出

### 相关测试

```text
pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx src/components/coat-of-arms/CanvasSelectionHandles.test.tsx src/components/coat-of-arms/CanvasSelectionToolbar.test.tsx src/components/coat-of-arms/TextSelectionToolbar.test.tsx src/components/coat-of-arms/TextMottoPanel.test.tsx src/components/coat-of-arms/text-creation-drag.test.ts src/lib/coat-of-arms/commands.test.ts src/lib/coat-of-arms/scene-svg.test.ts

Test Files  8 passed (8)
Tests       236 passed (236)
Duration    1.82s
```

### typecheck

```text
pnpm typecheck
> token-maker-app@0.1.0 typecheck /Users/wusir/Desktop/开发项目集合/token-maker-app
> tsc --noEmit

exit 0
```

### 全量测试（额外检查）

```text
pnpm test

Test Files  1 failed | 130 passed (131)
Tests       3 failed | 1403 passed (1406)
```

3 个失败均在 `src/components/coat-of-arms/CoatOfArmsMaker.test.tsx` 的 artboard CSS/短视口几何断言（`1436`、`1469`、`1491`），不是本次文字复审的 focused 测试失败；需另行处理，不能把全量测试称为通过。

### diff check

```text
git diff --check exit 0
```
