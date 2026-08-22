# 布局视觉验收（只读）

日期：2026-08-22  
本机：`http://localhost:3000/coat-of-arms-maker`（localhost，不用 127.0.0.1）  
对照：`tmp/layout-arrange-recon.md`、`tmp/layout-names-recon.md`、`tmp/layout-upload-recon.md`  
方法：ego-browser task space `layout visual verify`；草稿 overlay 曾把 workbench 设成 `inert`，点了 **Discard draft**（只动 localStorage）后再测。未改 `src/`。  
视口：`1512×738`，`dpr=2`，`data-appearance="dark"`

截图：

- `tmp/layout-visual-arrange.png` — Position 展开 + Arrange（拖过图层后的 X/Y）
- `tmp/layout-visual-names.png` — Tools → Names
- `tmp/layout-visual-upload.png` — Charges → Upload

---

## 总评

三处都比改前整齐，recon 里点名的硬伤已经不在：

| 改前（recon） | 现在（实测） |
|---|---|
| Position 嵌套 gap `0`、缩进 `11.4px` | gap **`4.25px`**、缩进 **`26.5px`**（对齐竞品计算值） |
| Arrange 段间约 `38px` 空档 | 段头变成 `12px/600` 底边条；面板 `padding: 0 10px 6px`、`gap: 0` |
| X/Y 拖完变成 `3.556485355648533` | 拖完显示 **`4` / `11`**，没有超长浮点 |
| Names Generate 拉满一列、下拉带标签 | Generate **内容宽 `184px`** 左对齐；下拉无可见标签、描边可见 |
| Upload 是原生「选择文件」矮条 | 满宽 **`40×263`** 红色主按钮；真实 `input[type=file]` 被 clip 掉 |

栏内层级清楚：左栏树 → 资料栏标题/段头 → 控件。Arrange 用竞品段头节奏（`10px` 左右垫）；Names / Upload 仍走资料栏通用 `13.6px`（`0.85rem`）垫，和 Draw/Animals 一列。这是两套有意区分，不是漏改。

---

## 1. Position / Arrange

计算值（Arrange 选中、拖过图层）：

| Token | recon 竞品 | 现在 | 判定 |
|---|---|---|---|
| 嵌套 gap | `4.25px` | **`4.25px`** | 齐 |
| 嵌套缩进 | `26.5px` | **`26.5px`** | 齐 |
| 嵌套列表 margin / padding | `0 14.875` / `2.125 10.625` | 同 | 齐 |
| 子项高 / 字号 / 圆角 | `29.75` / `14.875` / `3.1875` | 同 | 齐 |
| 面板 padding / gap | `0 10px 6px` / 无 gap | **`0px 10px 6px` / `0`** | 齐 |
| 段头 | `12px/600`，`6px 10px`，`margin 0 -6px 8px`，高 `31` | 同 | 齐 |
| Order 按钮 | 高 `31.74`，gap `4.25`，半径 `3.1875`，底 `#3a3a3a` | 高 **`33.88`**，其余齐 | 略高 |
| number 输入 | 高 `36`，字 `14.875`，半径 `3.1875` | 高 **`37.06`**，字/半径齐 | 略高 |
| X/Y 显示 | 整数 | **`4` / `11`**，`xLooksFloat=false` | 齐 |

截图里 Arrange / Layers 不再贴在一起；段头底下有一条线，Order → Align → Position 节奏比改前紧。X/Y 是短整数。

### 仍差于竞品 chrome（不抄文案）

- Order/Align 按钮比竞品高约 `2px`（我们继承了更大的行高）。
- 数字框比竞品高约 `1px`。
- Size 仍是百分比（`72`），竞品是画布像素。recon 明确不要改单位。
- Rotation 仍在折页下，要滚一下。竞品同视口也能看到 Rotation 贴底。
- Field placement 仍在 charge 上；竞品 Arrange 没有这一段。recon 要求保留。
- 左栏嵌套变窄后，Shields 子项「Heater shield」会折成两行。竞品同宽 `117px` 也会挤；不是 Position 独有。

---

## 2. Names

| Token | recon 建议 | 现在 | 判定 |
|---|---|---|---|
| 可见「Name type / Language」标签 | 藏掉 | 截图和 `innerText` 前几行都没有这两句 | 齐 |
| 下拉并排 | 保持 | City + English 一行 | 齐 |
| 下拉外观 | 描边 `#636363`、底跟栏、半径 ~3–4px、高 ~34 | 边 `rgb(99,99,99)`，底 `#3a3a3a`，半径 `3.1875`，高 `34` | 齐 |
| 语言列 | 不要改成 EN/DE，English 约 90px | **`90.69px`**，文案仍是 English | 齐 |
| Generate | 内容宽、左对齐，不要 100% | **`183.98×38.25`**，`genFullWidth=false`，`#bb212c`，半径 `3.1875` | 齐 |
| 名单 | 卡片行、gap 8、8 条不要改成 5 | **8 条**，padding `6px 8px`，字 `14px`，偶数底 `#555` | 齐 |
| identity | 保留在名单下面 | Use project name / Add generated motto 仍在 Generate 下面 | 齐 |

截图：下拉和红色 Generate 已经是一组控件，不再是「两个黑胶囊 + 一条拉满的橙红」。名单是描边卡片，隔行底。

### 仍差于竞品 chrome

- 面板里仍有 h2「Names」。recon 说 utility 壳不要单拆。
- 仍是 8 条名字，不是 5 条。算法未改，正确。
- 行上没有复制图标。recon 说不是硬条件。
- identity 整块还在，名单一长就要滚。recon 说这是预期，不要搬家。
- Generate 有刷新图标；竞品也有。这是布局，不是文案。

---

## 3. Charges → Upload

| Token | recon 建议 | 现在 | 判定 |
|---|---|---|---|
| 栏 padding / gap | 沿用 `0.85rem` / `0.68rem` | **`13.6px` / `10.88px`** | 齐 |
| 标题 | 资料栏 h2，不要居中营销 h3 | 「Upload image」`16.8px` / 400 | 齐 |
| 控件 | 主按钮 + 隐藏真实 file | **`40×262.81`**，底 `#c0392b`；input `type=file` class `coat-custom-shield-upload-input`，clip 成 2×2 | 齐 |
| 原生 file 条 | 不要再露「未选择任何文件」 | `nativeChooser=false` | 齐 |
| 付费墙 | 禁止 | 无 PRO / Upgrade / 绿 CTA；未用 `.coat-custom-shield-uploads` | 齐 |
| 限制说明 | 原文保留、放按钮下 | 8 个 / 256 KB / 512 KB 仍在按钮下 | 齐 |
| `accept` / `multiple` | 不变 | 仍是 png/jpeg/webp/svg，`multiple=true` | 齐 |

截图：是一颗红主按钮，不是系统 file 条。下面大块空暗底还在。recon 写过：不要用 PRO 卡去填这个洞，Draw 同样留空。

### 仍差于竞品 chrome

- 按钮下到栏底仍有一大块空。竞品 Upload 也是空暗底（他们用锁卡填）。我们按 recon 不填。
- 主按钮圆角 **`8px`**（跟 Draw 走）。竞品 Animal 搜索是 `3.1875px`。recon 说 Upload 不要单开竞品半径。
- 字段说明和按钮文案都是「Upload crest image」，看起来重复一层。可用，只是啰嗦。
- 空列表时没有已上传清单（这次项目没有本地图）。

---

## 栏内 padding 是否一致

- **Names / Upload**：资料栏子 section 走同一套 `13.6px` 垫（Upload 已量到；Names 截图标题到边的留白同量级）。
- **Arrange**：按 recon 改成竞品 `.coa-panel-body` 的 `0 10px 6px`，所以左右是 **`10px`** 不是 `13.6px`。段头还用 `margin: 0 -6px` 往外出血。这是 Arrange 专项，不是漏对齐。

标题与控件层级：三栏都是「栏标题或段头 → 短说明/标签 → 控件」。没有再出现原生 file 条或超长浮点。

---

## 未覆盖

- 手机抽屉。
- 真的选一张 PNG 走上传命令（chrome 验收不需要）。
- 中文 locale。
- 没再开竞品页面；对比用的是 recon 里已经量过的计算 token。

未改 `src/`。未 commit。
