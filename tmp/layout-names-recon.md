# Names 面板 chrome 对照（只读测量）

Date: 2026-08-22  
Repo: `/Users/wusir/Desktop/开发项目集合/token-maker-app`  
本机: `http://localhost:3000/coat-of-arms-maker`（localhost，不是 127.0.0.1）  
竞品: `https://coamaker.com` Tools → Names  
截图: `tmp/layout-names-coamaker.png`、`tmp/layout-names-ours.png`  
方法: ego-browser 实机点击 + `getComputedStyle` / `getBoundingClientRect` + CDP 截图  
本任务未改 `src/`、tests、`globals.css`、WORKLOG。未改生成算法，未把竞品文案/商标/广告抄进 UI。

Setup: 本机 `coat-workbench-content[inert]` + 「Draft available」遮罩。浏览器里点了 Discard draft（只动 localStorage），然后 Tools → Names。

Viewport: 竞品 1512×738 dpr2；本机 1496×756 dpr2。左右栏宽度是固定像素，对照成立。

---

## 结论（先看这个）

竞品 Names 是 **一行无标签下拉 + 内容宽红色 Generate + 五张全宽名单卡片**。没有 identity 块。

我们已经是 **两个小下拉并排**，但：

1. 下拉带可见标签、语言列更宽、黑底胶囊而不是描边。
2. Generate 是 **全宽** 主按钮（共享 `width: 100%`），不是内容宽、左对齐。
3. 名单是 **紧的 8 条 ol**，无边框、无行卡片、无间距。
4. 下方有 identity 操作（使用项目名 / 添加格言）。竞品 Names **没有**对应块。测量 **不能** 证明该挪走或删除——保留，放在名单下面做次要操作。

对齐时只动 Names chrome，不要改 `name-generator` 算法，不要抄竞品选项文案（`City Names`、`EN`/`DE`）。

---

## 并排 token

| 部位 | 竞品（实测） | 我们（实测） | 差在哪 |
|---|---|---|---|
| 内容列宽 | 263px（`.coa-panel-body` 283px，padding `6px 10px`） | 247.81px（library 290px，utility padding `0.85rem`=13.6px） | 我们内容更窄 |
| 侧栏底 | `#3a3a3a` | `#3a3a3a` | 同 |
| 下拉行 | `flex items-center gap-2 mb-4`：高 34px，gap 8.5px，margin-bottom 17px | `.coat-target-form-fieldset-controls` grid `147.53px 90.69px`，gap 9.6px，**连标签总高 59.09px** | 我们多了一行标签，整行更高 |
| 类型下拉 | 192.5×34，`flex-1`，无 label，透明底，边 `1px #636363`，半径 3.19px | 147.53×36.89，黑底 `#04060b`，边合成约 `#3f3c38`，半径 8px | 我们更窄、更黑、圆角更大、描边几乎看不见 |
| 语言下拉 | **固定 62px**，`flex-shrink: 0`，选项 `EN`/`DE` | `minmax(0, auto)` → 90.69px，选项 `English`/`German` | 语言列被长文案撑宽（不要改成 EN/DE） |
| Generate 宽 | **198.83px hug-content**，`inline-flex shrink-0`，左对齐 | **247.81px = 100% 内容宽** | 主按钮不该吃满整列 |
| Generate 高 | 38.25px（`h-9`），padding `8.5px 12.75px` | 40px（`min-height: 2.5rem`），padding `8.8px 11.2px` | 接近 |
| Generate 色 | `#bb212c` / `rgb(187, 33, 44)`，无边框，白字 | `#c0392b` / `rgb(192, 57, 43)`，同色边，白字 | 差 5–14 通道；共享主色是 `#c0392b` |
| Generate 半径 | 3.19px | 8px（`0.5rem`） | 我们更圆 |
| Generate 图标 | lucide `refresh-cw` 17px + 字 | 无图标 | 布局差；加图标不是抄文案 |
| Generate 位置 | 下拉行下方，wrapper `margin-bottom: 15px` | 表单 grid gap `0.7rem`=11.2px | 都在下拉下面，我们更贴 |
| 名单容器 | `flex column`，gap **8px**，margin-bottom 20px，**5 条** | `<ol>` gap 无，padding/margin 0，**8 条** | 条数是算法，不要为了对齐去改 |
| 名单行 | 263×**52.25**，flex，padding `6px 8px`，边 `1px #636363`，半径 4px；底交替 `#3a3a3a` / `#555`；字 14px | 247.81×**24**，无边、无底、无 padding；字 16px / line-height 24 | 紧 ol vs 卡片行 |
| 行操作 | 右侧 clipboard 图标按钮（ghost） | 无 | 属交互，不是必须为了对齐而加 |
| 标题 | 面板内 **无** h2/h3 | h2「Names」16.8px；h3「Generated names」「Project identity actions」16px | 我们 utility 壳有标题 |
| identity | **Names 面板没有**。页面下方营销「Motto Generator」在 (516, 916)，不是这个面板 | 名单下整块：项目名 + 格言 + 三个全宽次按钮 | **保留，不挪、不删** |

---

## 竞品 Names 结构（DOM，不是要抄的文案）

`.coa-sidepanel-content`（289×599，底 `#3a3a3a`，y 滚动）  
→ `.coaChargesContainer`（283px）  
→ `.coa-panel-body`（padding `6px 10px`）

1. 一行：`div.flex.items-center.gap-2.mb-4`
   - 类型 `<select class="… flex-1 min-w-0">`，option value 如 `city`（可见文字带 `Names` 后缀——**不要抄进我们的 option**）
   - 语言 `<select style="width: 62px; flex-shrink: 0;">`，`en`/`de`，可见 `EN`/`DE`
2. Generate：`button[data-variant=primary][data-size=default]`，class 含 `bg-primary h-9 px-4 shrink-0 whitespace-nowrap`，CSS 变量 `--color-primary: #bb212c`
3. 名单：`div` `display:flex; flex-direction:column; gap:8px; margin-bottom:20px`
   - 每条：`padding:6px 8px; display:flex; align-items:center; gap:6px; font-size:14px; border:1px solid var(--color-border); border-radius:4px`
   - 工作台里 `--color-border:#636363`，`--color-background:#3a3a3a`，`--color-card:#555`
   - 左 `<span flex:1>` 名字，右 clipboard ghost 按钮

**无** project name / motto / identity 按钮。点 Generate 之前名单容器是空的（高 0）；点了才出现 5 条。

---

## 我们：file:line 与实测对应

### 结构 `src/components/coat-of-arms/NamePanel.tsx`

```41:80:src/components/coat-of-arms/NamePanel.tsx
    <section aria-label={copy.names} className="coat-target-utility-form coat-target-name-form">
      <h2 style={{ marginBottom: 0 }}>{copy.names}</h2>
      …
      <div className="coat-target-form-fieldset-controls" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, auto)' }}>
        <label className="coat-target-form-field">…类型 select…</label>
        <label className="coat-target-form-field">…语言 select…</label>
      </div>
      <button className="coat-target-action-button coat-target-action-button--primary" …>
        {copy.generateNames(selectedTypeName)}
      </button>
      <section aria-label={copy.nameResults} className="coat-target-utility-output">
        <h3>{copy.nameResults}</h3>
        <ol>{generatedNames.map(…)}</ol>
      </section>
      <section aria-label={copy.identityActions} className="coat-target-utility-output">
        …
        <div className="coat-target-form-actions">
          …Generate identity / Use project name / Add generated motto…
        </div>
      </section>
    </section>
```

- 两个小下拉已经并排（`1fr` + `auto`）。语言列被「English」撑到 90.69px。
- 主按钮跟 identity 按钮共用 `.coat-target-action-button`，所以主按钮被做成全宽。
- 名单是 `<ol>`，没有行 chrome class。
- identity 三个按钮是次要操作，测试锁在生成按钮下面。

### CSS `src/app/globals.css`

侧栏宽和底（library 290px / `#3a3a3a`）：

```1477:1477:src/app/globals.css
.coat-target-workbench .coat-target-library-panel { flex: 0 0 290px; width: 290px; min-width: 0; min-height: 0; overflow: auto; background: #3a3a3a; }
```

utility 内边距 / h2（Names 标题来自这里，不是 NamePanel 独有）：

```1645:1651:src/app/globals.css
.coat-target-workbench .coat-target-library-panel h2 { margin: 0 0 0.55rem; color: var(--coat-text); font-size: 1.05rem; }
.coat-target-workbench .coat-target-library-panel > section:not(.coat-target-shield-library):not(.coat-target-color-panel):not(.coat-escutcheon-panel),
.coat-target-workbench .coat-target-library-panel .coat-target-utility-panel { display: grid; align-content: start; gap: 0.68rem; padding: 0.85rem; color: var(--coat-text); }
```

表单、字段、全宽按钮、名单输出（**没有** `ol`/`li` 规则）：

```1968:1973:src/app/globals.css
.coat-target-workbench .coat-target-utility-form {
  display: grid;
  align-content: start;
  gap: 0.7rem;
  min-width: 0;
}
```

```1974:1996:src/app/globals.css
.coat-target-workbench .coat-target-form-field { … font-size: 0.83rem; }
.coat-target-workbench .coat-target-form-field > select {
  display: block; width: 100%; min-height: 2.25rem;
  border: 1px solid var(--coat-line); border-radius: 0.5rem;
  background: var(--coat-stage);
}
```

```2050:2072:src/app/globals.css
.coat-target-workbench .coat-target-form-actions { display: grid; gap: 0.55rem; width: 100%; }
.coat-target-workbench .coat-target-action-button {
  display: inline-flex; width: 100%; min-height: 2.5rem; … border-radius: 0.5rem;
  background: var(--coat-panel-raised);
}
.coat-target-workbench .coat-target-action-button--primary,
.coat-target-workbench .coat-target-action-button--primary:hover {
  border-color: #c0392b; background: #c0392b; color: #fff;
}
```

```2080:2082:src/app/globals.css
.coat-target-workbench .coat-target-utility-output { display: grid; gap: 0.55rem; }
.coat-target-workbench .coat-target-utility-output p { margin: 0; color: var(--coat-muted); font-size: 0.88rem; … }
.coat-target-workbench .coat-target-utility-output strong { color: var(--coat-text); font-weight: 700; }
```

`ol` 实测 `list-style-type: none; padding: 0; margin: 0`（Tailwind preflight，不是 Names 专用规则）。每条 li 高 24px，8 条共 192px。

### 工作台 token（dark）

| 变量 | 合成色 | 用在 |
|---|---|---|
| library 字面量 | `#3a3a3a` | 侧栏底 |
| `--coat-stage` | `#04060b` | 下拉填充 |
| `--coat-line` 叠在 `#3a3a3a` 上 | `#3f3c38` | 下拉/次按钮边，几乎融进侧栏 |
| `--coat-panel-raised` | `#1e2127` | identity 次按钮底 |
| `--coat-text` | `#f5f1ea` | 标题、名单、按钮字 |
| `--coat-muted` | `#aba497` | 字段 label、identity 说明 |
| `--coat-accent` | `#f1d492` | 不是 Generate 色 |
| 主按钮字面量 | `#c0392b` | Generate |
| 竞品主色 | `#bb212c` | 竞品 Generate；我们 Add-charge 也用过这个 |

Draw 面板也用同一套全宽 `--primary` 按钮（`DrawPanel.tsx:47`）。**不要改共享 `.coat-target-action-button` 的 `width: 100%`**，否则 Draw / identity 一起变。

### 测试锁（实现时要保留行为，不是本任务要改测试）

`NamePanel.test.tsx:43-51`：identity 必须在 Generate 下面，且 Generate 带 `--primary`。  
`NamePanel.test.tsx:31`：生成名单 8 条。  
文案：`workbench-copy.ts:748`（`Use project name` / `Add generated motto` / `Generate ${type} Names`）。

---

## 带证据的建议（给下一班实现，本任务不改代码）

范围只限 Names chrome。不要动 `src/lib/coat-of-arms/name-generator.ts`。不要把竞品的 `City Names`、`EN`/`DE`、广告、Go Pro 写进我们的 UI。

### 1. Generate：内容宽、左对齐（要做）

- 竞品 198.83px hug，左贴内容列；我们 247.81px 拉满。
- **只**覆盖 `.coat-target-name-form > .coat-target-action-button--primary`：`width: auto`（或 `max-content`），保持 `inline-flex`。不要改共享 `.coat-target-action-button`。
- 色：Names 可就地用 `#bb212c` 对齐竞品；共享 `#c0392b` 留给 Draw。不要为了 Names 改全局。
- 刷新图标是布局，不是文案。要加就用现有 lucide，aria 走我们自己的 copy。
- 半径 8px vs 3px：若只改 Names 主按钮，可收到 `0.25rem`；不要动共享 `0.5rem`。

### 2. 两个下拉：保持并排，收语言列、收标签高度（要做 chrome，不改文案）

- 并排已经对。不要改成上下堆。
- 可见 `<span>`（Name type / Language）让行高 59px vs 竞品 34px。`select` 已有 `aria-label`。建议 Names 里藏掉可见 label（仍保留 aria），行高才能接近 34–37px。这是 chrome，不是抄竞品句子。
- 语言列不要改成 `EN`/`DE`。要收宽度：给语言 `select` 一个 min 宽，让「English」还能完整显示（约 90px 现状可接受），类型列继续 `1fr`。
- 下拉外观：竞品透明底 + 实线 `#636363`；我们黑底 + 几乎看不见的 `--coat-line`。Names 下拉可边用 `#636363`、底透明或 `#3a3a3a`，半径收到 ~4px。**只作用在 `.coat-target-name-form select`**，不要改全局 `.coat-target-form-field > select`（Draw/Text 会跟着变）。

### 3. 名单：卡片行 chrome（要做）；条数保持 8（不要做）

- 给 `.coat-target-name-form ol` / `li` 加专用规则：列方向 gap 8px；每条全宽、padding `6px 8px`、边 `1px solid #636363`、半径 4px、字 14px；奇数/偶数底 `#3a3a3a` / `#555`。
- **不要**把 8 条改成 5 条（那是生成器）。
- **不要**填竞品那串名字。
- clipboard 是竞品功能，不是对齐布局的硬条件。下一班若加，用我们自己的 aria，不要抄他们的标记。没有复制按钮时，行高不必硬凑 52px（52px 主要是他们 ghost `h-9` 撑的）。

### 4. identity：「使用项目名 / 添加格言」——保留，不挪位置

证据：

- 竞品 `.coa-panel-body` 只有下拉 + Generate + 名单卡片。没有项目名、格言、Apply。
- 全页搜到的「Motto Generator」在编辑器下面 y=916 的营销区，不是 Names。
- 我们这块是产品能力（`set-project-name`、`add-text-layer` motto），测试明确写成 generator 下面的 secondary actions。

测量 **没有** 证明该挪到 Text/Settings。竞品只是没有这个功能，不是「他们把同一块放在别处」。

因此：

- **保留**「使用项目名」「添加生成的格言」（以及 Generate identity）。
- **位置保持**在 Generated names 下面，仍用次按钮（不要做成第二条大红主按钮）。
- 不要删，不要为了屏幕更像竞品把它们藏到别的面板。
- 名单改成卡片后侧栏会更高，靠 library 已有 `overflow: auto` 滚动即可。截图里 identity 说明已经露出来，三个按钮还要往下滚——这是预期，不是该搬家的证据。

### 5. 面板 h2「Names」

竞品面板内没有标题。我们 Draw/Text/Names 都有 h2，来自 library 通用规则。不建议只拆 Names 的 h2，否则 utility 壳不统一。可保留。

---

## 明确不要做

- 改 `generateCoatNames` / 类型表 / 默认 8 条。
- 把 option 改成 `City Names` 这种竞品文案，或把语言改成 `EN`/`DE`。
- 加新 generator 类型。
- 改共享 `.coat-target-action-button { width: 100% }`。
- 删或挪 identity。
- 动 Contact/SEO 文件。

---

## 截图里能直接看到的差

`tmp/layout-names-coamaker.png`：无标签的 City Names + 窄 EN；红色 Generate 只包住文字；五张描边卡片 + 复制图标。

`tmp/layout-names-ours.png`：Names 标题 + Name type/Language 标签；两个黑胶囊下拉；Generate 拉满一列偏橙红；八条无框名单；下面已露出 Project identity（项目名 House Falcon、格言 Truth before triumph）。Tools → Names 在树底部，被视口裁了一点，面板本身是完整的。
