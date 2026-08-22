# Arrange / Position 布局侦察

日期：2026-08-22  
任务：只读测量。未改 `src/`、tests、`globals.css`、`WORKLOG`。  
本机：`http://localhost:3000/coat-of-arms-maker`（localhost，不用 127.0.0.1）  
竞品：`https://coamaker.com/` 编辑器左栏 Position → Arrange  
草稿 overlay：本机 `coat-workbench-content` **没有** `inert`，未丢草稿。  
视口：本机 `1512×738` `dpr=2` 根字号 `16px`；竞品 `1496×756` `dpr=2` 根字号 `17px`（`html { font-size: 106.25%; }`）。

对照图：

- `tmp/layout-arrange-coamaker.png` — 竞品 Position 展开 + Arrange 属性栏（截去广告）
- `tmp/layout-arrange-ours.png` — 本机 Position 展开 + Arrange 属性栏（拖过图层后，X/Y 露出浮点）
- `tmp/layout-arrange-ours-lower.png` — 本机滚到底：Rotation / Opacity / Field placement

原始计算样式：

- `tmp/layout-arrange-ours-raw.json`
- `tmp/layout-arrange-coamaker-raw.json`
- `tmp/layout-arrange-coamaker-panel.json`

禁止抄进我们 UI：竞品商标、广告（截图里出现过的付费药广告）、Go Pro、Upgrade Now、付费墙 CTA。本文件只记布局/字号/间距/数字显示。

---

## 结论（给实现对齐）

左栏 Position 嵌套和 Arrange 属性栏的骨架已经对上（Arrange / Layers 两行；Order 2×2；Align 3×2；X/Y；Size+锁；Rotation；Opacity）。差的是 **嵌套缩进与行距**、**属性栏段头条**、**按钮/输入的高度圆角字号**、以及 **X/Y 浮点串**。

最大的三处错位：

1. **Position 嵌套**：竞品 Arrange 与 Layers 之间 `gap: 4.25px`，子项左缘相对 Position 行缩进 `26.5px`。我们 gap 是 `0`，缩进只有 `11.4px`。
2. **属性栏垂直节奏**：竞品段头是一条 `12px/600` 底边栏，段与段靠 `margin-bottom: 8px` + 网格 `mb-3 = 12.75px`。我们每个 `fieldset` 上下各 `13.6px`，再被库面板规则加上 `gap: 10.88px`，两段内容之间大约 `38px`，看起来空一截。
3. **数字显示**：拖一下图层后，竞品 X/Y 仍是整数（`640` / `220`）；我们直接绑 `selectedLayer.transform.x`，输入框出现 `3.556485355648533`。只做 DISPLAY 取整，store 保持精度。

根字号不同：竞品 `17px`，我们 `16px`。仓库左栏已经用 `8.5px` 这种字面量去对齐竞品 `0.5rem @ 17px`（见 `globals.css:1452`）。实现继续对齐 **计算出来的 CSS px**，不要改成 `16px` 根下的裸 rem，否则会再缩一圈。

---

## 1. 左栏 Position 嵌套（Arrange / Layers）

### 目标节点

竞品：

```
button[data-sidebar="menu-button"]   // Position 父行
ul[data-sidebar="menu-sub"]          // class: mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5
a[data-sidebar="menu-sub-button"]    // Arrange / Layers；class 含 h-7 px-2 gap-2 rounded-md text-sm
```

我们：

```
[data-tool-id="position"] > button                          // Position 父行  ReferenceToolRail.tsx:100-114
[data-tool-id="position"] .coat-target-tool-tree-branch     // globals.css:1464
.coat-target-tool-tree-branch button                       // globals.css:1465  Arrange / Layers
```

树数据：`CoatOfArmsMaker.tsx:150-153`（`arrange` / `layers`）。

### 对比表（计算样式）

| Token | 竞品 | 我们 | 差 |
|---|---|---|---|
| 根字号 | `17px` | `16px` | 竞品 `html { font-size: 106.25% }` |
| 左栏宽 | `170px`（`--sidebar-width`） | `170px`（`globals.css:1447`） | 已齐 |
| 树底 | `#474747` | `#474747` | 已齐 |
| Position 父行高 | `34px` | `34px` | 已齐 |
| Position 父行字号 | `14.875px` / 500 | `14.875px` / 500 | 已齐 |
| 嵌套列表 | `flex; flex-col; gap: 4.25px` | `display: grid; gap: normal`（行距 0） | **缺 4.25px 行距** |
| 嵌套列表 margin | `0 14.875px`（`mx-3.5`） | `0 0 1.28px 10.4px`（`0 0 0.08rem 0.65rem`） | 左右缩进不够 |
| 嵌套列表 padding | `2.125px 10.625px`（`py-0.5 px-2.5`） | `2.24px 0 4.48px`（`0.14rem 0 0.28rem`） | 缺水平 padding |
| 嵌套左边线 | `1px solid #636363`（`--sidebar-border`） | `1px solid var(--coat-line)` → 半透明 oklab，不是 `#636363` | 颜色偏弱 |
| 子项相对父行左缩进 | **`26.5px`** | **`11.4px`** | 少约 15px |
| Arrange↔Layers 间隙 | **`4.25px`** | **`0`** | 贴在一起 |
| 子项高度 | `29.75px`（`h-7` = `1.75rem×17`） | `28px`（`min-height: 1.75rem`×16） | 矮 1.75px |
| 子项 padding | `0 8.5px` | `0 8px` | 差 0.5px |
| 子项 gap（图标-文字） | `8.5px` | `8px` | 差 0.5px |
| 子项字号 | `14.875px` / 400 | `14px` / 400 | 差 0.875px |
| 子项圆角 | `3.1875px`（`--radius-md: .1875rem`×17） | `3px`（`0.1875rem`×16） | 差 0.1875px |
| 选中 Arrange 底 | `#5a5a5a` | `#5a5a5a` | 已齐 |
| 未选 Layers 底 | 透明 | 透明 | 已齐 |

竞品嵌套列表的缩进拆开：`margin-left 14.875` + `padding-left 10.625` + `translate-x: 1px` ≈ `26.5`。我们只有 `margin-left: 10.4px`、水平 padding `0`。

### 应对齐的 CSS（计算 px，按仓库现有 8.5px 写法）

`src/app/globals.css:1464-1469` `.coat-target-tool-tree-branch`：

- `display: flex; flex-direction: column;`
- `margin: 0 14.875px;`
- `padding: 2.125px 10.625px;`
- `gap: 4.25px;`
- `border-left: 1px solid #636363;`
- 子按钮：`min-height: 29.75px; padding: 0 8.5px; gap: 8.5px; font-size: 14.875px; border-radius: 3.1875px;`

不要改树文案、不要抄竞品图标资源。Chevron 竞品展开是朝上、我们是 `ChevronDown` 朝下（`ReferenceToolRail.tsx:114`）——可选，不是本任务主缺口。

---

## 2. Arrange 属性栏排版

### 目标节点

竞品：`.coa-sidepanel-content`（底 `#3a3a3a`，宽约 `289px`）→ `.coa-panel-body`（`padding: 0 10px 6px`）→ `.coa-section-header` + Tailwind grid。

我们：`.coat-target-library-panel`（`globals.css:1477`，`290px` / `#3a3a3a`）→ `.coat-target-arrange-panel`（`ArrangePanel.tsx:49`，`globals.css:1824`）。

整列外框已经接近：竞品 `.pro-side-panel` 宽 `460px` = `170 + 290`，我们 `.coat-target-editor-grid` 也是 `460px`（`globals.css:1443`）。

### 覆盖问题（必须先读）

`.coat-target-arrange-panel` 写了 `gap: 0`（`globals.css:1824`），但被更高优先级规则盖掉：

```
src/app/globals.css:1646-1647
.coat-target-library-panel > section:not(.coat-target-shield-library):not(.coat-target-color-panel):not(.coat-escutcheon-panel)
  { display: grid; gap: 0.68rem; padding: 0.85rem; }
```

选择器含 3 个 `:not`，特异性高于 `.coat-target-arrange-panel`。实测面板：

| | 声明 | 计算 |
|---|---|---|
| padding | 被 1647 写成 `0.85rem` | **`13.6px` 四周** |
| gap | 被 1647 写成 `0.68rem`（1824 的 `gap: 0` 输掉） | **`10.88px`** |

竞品 `.coa-panel-body` 只有 `padding: 0 10px 6px`，**没有**段间 grid gap。

实现：把 arrange-panel 从 1646 的 `> section` 规则里排除，或在 1824 用更高特异性把 padding/gap 设回竞品值。不要把 1646 整条删掉（Shields 以外的库面板还在用）。

### 段头

竞品 `.coa-section-header` 规则原文：

```
border-bottom: 1px solid var(--color-border); /* #636363 */
background-color: var(--color-neutral-50);    /* #3a3a3a */
color: var(--color-foreground);               /* #f3f0eb */
justify-content: space-between;
align-items: center;
gap: 8px;
margin: 0 -6px 8px;
padding: 6px 10px;
font-size: 12px;
font-weight: 600;
display: flex;
```

计算：高 `31px`（Size 带锁 `33.5px`）。

我们 `fieldset.coat-target-arrange-section > legend`（`globals.css:1827-1829`）：

| Token | 竞品段头 | 我们 legend | 差 |
|---|---|---|---|
| 字号/字重 | `12px` / 600 | `14.72px`（`0.92rem`）/ 650 | 更大更重 |
| padding | `6px 10px` | `0` | 没有条 |
| margin | `0 -6px 8px`（左右出血） | `0` | 没有底栏 |
| 底边 | 头上 `1px #636363` | 整段 fieldset `border-bottom` + `padding: 13.6px 0` | 线在段底，不在标题下 |
| 背景 | `#3a3a3a`（和列同色，靠底边分） | 透明 | — |

Size 锁：竞品在段头右侧，`12×12` lucide，`title="Lock aspect ratio"`。我们同样在 legend 右侧（`ArrangePanel.tsx:92-101`），按钮 `1.5rem`、图标 `0.95rem`（`globals.css:1830-1831`）。位置对，尺寸偏大。

### Order / Align 按钮

| Token | 竞品 | 我们 | 来源 |
|---|---|---|---|
| Order 网格 | `grid-cols-2 gap-1 mb-3` → gap **`4.25px`**，下边距 **`12.75px`** | `.coat-target-arrange-order-grid` gap **`7.2px`**（`0.45rem`） | `globals.css:1832-1834` |
| Align 网格 | `grid-cols-3 gap-1 mb-3` → gap **`4.25px`** | `.coat-target-arrange-align-grid` 3 列，gap **`7.2px`** | `globals.css:1835` |
| 按钮高 | **`31.74px`**（`py-1.5`，无 min-height） | **`min-height: 37.6px`**（`2.35rem`） | `globals.css:1836` |
| 按钮 padding | `6.375px 8.5px` | `5.6px 8px`（`0.35rem 0.5rem`） | 同上 |
| 按钮字号 | `12.75px`（`text-xs`） | `12.48px`（`0.78rem`） | 同上 |
| 按钮圆角 | `3.1875px` | `6.4px`（`0.4rem`） | 同上 |
| 按钮底 | `#3a3a3a`（与列同色） | `--coat-panel-raised` → 更深的 `oklab(0.247…)` | 同上 |
| 按钮边 | `1px solid #636363` | `1px solid var(--coat-line)`（半透明） | 同上 |
| 图标 | lucide `14×14` stroke | lucide，CSS `0.95rem` ≈ `15.2px` | `globals.css:1837` |
| 图标-文字 gap | `4.25px` | `6.4px`（`0.4rem`） | `globals.css:1836` |

文案（Forward / Backward / To front / To back / Left…Bottom）已经是我们自己的 copy，不要改成竞品商标句。

### X / Y / Size / Rotation / Opacity

| Token | 竞品 | 我们 | 来源 |
|---|---|---|---|
| X/Y、Width/Height 网格 | `grid-cols-2 gap-2 mb-3` → gap **`8.5px`** | `.coat-target-arrange-pair` gap **`8.8px`**（`0.55rem`） | `globals.css:1838` |
| 字段标签 | `text-xs text-muted-foreground mb-1 block`：`12.75px`、`#b0b0b0`、`margin-bottom: 4.25px` | `label`：`12px`（section 规则）或库面板 `0.83rem`；`gap: 0.28rem = 4.48px` | `globals.css:1839`、`1648` |
| number 输入高 | **`36px`** | **`33.6px`**（`min-height: 2.1rem`） | `globals.css:1840-1841` |
| number 字号 | **`14.875px`**（`text-sm`） | **`12px`** | 同上 + 未设 font-size，被压缩 |
| number padding | `6.375px 8.5px` | `4.8px 8px` | 同上 |
| number 圆角 | `3.1875px` | `6.4px` | 同上 |
| number 底 | `#3a3a3a` | `--coat-stage`（更黑） | 同上 |
| Rotation | 通栏 number，外包 `mb-3` | 通栏 number，包在 fieldset 里 | `ArrangePanel.tsx:114-118` |
| Opacity | `input[type=range]` 高 **`18px`**，`min=0 max=1 step=0.05` | 同一数值范围，但被 **所有 input 的 `min-height: 2.1rem`** 拉成 **`33.6px`** | `globals.css:1840` vs `1842` |
| Field | **竞品 Arrange 没有 Field** | charge 才有 Field placement + clip（`ArrangePanel.tsx:135-141`） | 保留现有功能，只把段头/间距收成和其它段一样。不要删，也不要抄竞品去加广告位 |

Size 单位：竞品 Width/Height 是画布像素（实测 `478` / `600`）。我们是 `(scaleX ?? scale) * 100` 百分比（`ArrangePanel.tsx:106-110`）。这是坐标语义，不是间距。本任务不要改单位、不要加新 Arrange 功能。

Opacity 滑条：竞品 `accent-color: auto`；我们 `accent-color: #c0392b`（`globals.css:1842`）。色相不必抄竞品品牌红；把高度从 33.6 降到约 18，并让 range 不再吃通用 input 的 min-height。

### 段与段的垂直空白（为什么我们更空）

竞品一段内容到下一段头 ≈ 网格 `margin-bottom: 12.75px`。

我们一段内容到下一段内容 ≈ `padding-bottom 13.6` + `panel gap 10.88` + `padding-top 13.6` ≈ **`38px`**，再加 1px 底边。

实现：fieldset 上下 padding 收到接近 0；段头改成竞品那种底边条；Order/Align 网格加 `margin-bottom: 12.75px`；拿掉 arrange-panel 上那 10.88px gap。

---

## 3. 数字显示：取整 vs 浮点串

### 实测

本机 `ArrangePanel.tsx:83-87` 直接：

```tsx
<input … type="number" value={selectedLayer.transform.x} … />
<input … type="number" value={selectedLayer.transform.y} … />
```

Rotation（117）、Width/Height（106/110）同样把 store 浮点塞进 `value`。

在本机画布上把选中 charge 拖一小段后，输入框值为：

- X = `3.556485355648533`
- Y = `11.071129707112974`

见 `tmp/layout-arrange-ours.png`。

竞品同一操作两次拖拽，X/Y 始终是整数：`594 → 640 → 654`，`200 → 220 → 225`。`input.step` 为空（number 默认 1）。未在竞品输入框里看到长浮点串。

### 建议（只做 DISPLAY 取整）

不要在 store / command / canvas 数学里 `Math.round`。拖拽精度留着。

在 `ArrangePanel.tsx` 里用一个只负责显示的函数，例如 `formatArrangeNumberForDisplay(value: number): string`，对 **X / Y / Rotation / Width / Height** 的受控 `value` 使用 `String(Math.round(value))`。`onChange` 仍 `Number(event.target.value)` 写回 store。

不要 round opacity（0–1 滑条）。不要 silent fail：`Number(...)` 得到 `NaN` 时不要写进 store，应抛或直接 return 并带上非法字符串。

测试：

- `ArrangePanel.test.tsx:42-54` 已经用 `fireEvent.change(..., '12')` 断言 store，DISPLAY 取整不会破坏。
- 建议补一条：store 里 `x: 3.556485355648533` 时，输入框 `.value === '4'`（或你们选定的 round 规则），store 仍是原浮点。
- `CoatOfArmsMaker.test.tsx:694-695` 断言 `xInput.value === '0'`，整数不受影响。

---

## 4. 实现者应改文件

只改布局/显示，不改画布 cursor，不加新 Arrange 功能，不碰 Contact/SEO 文件。

| 文件 | 改什么 |
|---|---|
| `src/app/globals.css:1464-1469` | Position 嵌套 `.coat-target-tool-tree-branch` 的 margin / padding / gap / 边线色；子按钮 height / padding / font-size / radius |
| `src/app/globals.css:1646-1647` | 把 `.coat-target-arrange-panel` 排除出库面板 `gap: 0.68rem; padding: 0.85rem`，否则 1824 的 `gap: 0` 赢不了 |
| `src/app/globals.css:1824-1842` | `.coat-target-arrange-*`：段头条、fieldset padding、Order/Align gap 与按钮高/圆角/底、pair gap、input 高/字号/圆角、range 不要吃 min-height |
| `src/components/coat-of-arms/ArrangePanel.tsx:83-87` 以及 `106, 110, 117` | DISPLAY 取整；store 保持精度 |
| `src/components/coat-of-arms/ArrangePanel.test.tsx` | 补一条「store 浮点 → 输入框整数」；现有 command 测试可留 |

可选、非必须：`ReferenceToolRail.tsx` 展开 Chevron 朝向。不要为对齐去改 Size 的百分比语义，也不要删 Field placement。

不要改：`src/lib/site-content.ts`、`InnerPageChrome.tsx`、`HomeSeoContent.tsx`、`site-routes.test.tsx`、`src/lib/coat-of-arms/store` 的精度、画布 cursor。

---

## 5. 方法与边界

- 本机 ego-browser task space `layout arrange recon`。先点 Layers 选 Dragon Passant，再回 Arrange。
- 竞品先点 Layers 选 Eagle，再回 Arrange。空状态文案两边都是 “Select an element to see position options.”（我们自己的 copy，不是抄来的品牌句）。
- 计算值来自 `getComputedStyle` + `getBoundingClientRect`，不是目测。
- 竞品页面底部有广告 iframe；属性栏截图已裁掉。不要把广告或 Go Pro 带进产品。
- 本任务未改代码、未 commit、未新建 worktree。
