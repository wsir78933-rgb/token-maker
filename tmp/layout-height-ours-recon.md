# 编辑器垂直堆叠侦察（我们）

日期：2026-08-22  
任务：只读测量。未改 `src/`、tests、`globals.css`、`WORKLOG`。只写了 `tmp/`。  
本机：`http://localhost:3000/coat-of-arms-maker`（localhost，不用 127.0.0.1）  
竞品：`https://coamaker.com/` 编辑器（只量 chrome / 画布高度，不抄文案、商标、广告、付费墙）  
草稿 overlay：打开时 `.coat-workbench-content` **有** `inert`。已点 Discard draft，测量时 `inert=false`、`.coat-target-draft` 不在 DOM。  
视口：本机 `1512×738` `dpr=2` 根字号 `16px`；竞品 `1496×756` `dpr=2` 根字号 `17px`。

对照图 / 原始数据：

- `tmp/layout-height-ours.png` — 本机编辑器垂直带标注（topbar / actionbar / canvas-toolbar / wrap / artboard / zoom）
- `tmp/layout-height-ours-raw.json` — 计算样式与矩形

禁止实现时动：Shields 短名、Upload 付费墙、Contact / SEO 残留（`site-content.ts`、`InnerPageChrome.tsx`、`HomeSeoContent*`、`site-routes.test.tsx`）。

---

## 结论（给实现对齐）

编辑器 **100svh 锁高是通的**，底部 **没有** 再占布局的栏。50px actionbar 和 40px canvas-toolbar 已经和竞品对齐。画布之所以矮，不是这两根工具条，而是两件事叠在一起：

1. **站点顶栏吃进 100svh**：`.site-topbar` 实测 **128.77px**（竞品 header **99px**）。两行品牌 + 导航胶囊，外加 `py-4` / `mt-4`。
2. **画板被 30rem 正方形盖死**：`.coat-target-artboard` 的 `width: min(30rem, calc((100svh - 12rem) * 0.91), calc(100vw - 28rem))` 在这个视口绑定到 **480px**。竞品 `.lower-canvas` 是剩余工作区铺满 **1009×575**，不是居中小方板。`.coat-target-artboard-wrap` 再吃掉垂直 padding **14.76×2 = 29.52px**。

本机画布可视高度 **478px / 738vh = 64.8%**。竞品 **575 / 756 = 76.1%**。只瘦顶栏不够：不改 artboard 宽度公式，正方形仍停在 480。

**不要动** actionbar `height: 50px`、scene `grid-template-rows: 40px …`、canvas-toolbar `height: 40px`。这三处已经对上竞品 `.coa-top-bar h-[50px]` 和 `.coa-toolbar` 40px。

---

## 1. 实测垂直带（本机，discard 草稿后）

视口 `innerHeight = 738` = `100svh`。工作台 `overflow: hidden`，正好铺满第一屏。

| 带 | 选择器 | 实测 h | top→bottom | 来源 |
|---|---|---|---|---|
| 站点顶栏 | `.site-topbar` | **128.77** | 0 → 128.77 | `globals.css:957` 无 height；高度来自 `CoatOfArmsMaker.tsx:311-314` 的 inner class |
| 导出条 | `.coat-target-actionbar` | **50** | 128.77 → 178.77 | `globals.css:1421-1430` `height: 50px` |
| 画布工具条 | `.coat-target-canvas-toolbar` | **40** | 178.77 → 218.77 | `globals.css:1482-1483` scene `40px` + toolbar `height: 40px` |
| 画板槽 | `.coat-target-artboard-wrap` | **519.23** | 218.77 → 738 | `globals.css:1572` |
| wrap 垂直 padding | 同上 | **14.76 + 14.76** | — | `clamp(0.75rem, 2vh, 2rem)` @ 738vh → 14.76 |
| 画板 | `.coat-target-artboard` | **480** | 238.38 → 718.38 | `globals.css:1573` 宽被 `30rem=480` 绑死，1:1 |
| 画布 | `.coat-canvas` | **478** | 239.38 → 717.38 | artboard 1px 边框 |
| 缩放条 | `.coat-target-zoom` | **36** | 680.41 → 716.41 | `globals.css:1577` `position: absolute`，**不占布局** |

Chrome 合计：`128.77 + 50 + 40 = 218.77`（视口的 29.6%）。  
剩余给 scene 身体：`519.23`。扣 wrap padding 后内高 `489.71`，正方形画板只用了 `480`。

顶栏内部分解（`ContentSiteTopbar.tsx:47-81`）：

| 片段 | 实测 |
|---|---|
| inner `lg:px-8 lg` 实际 `py-4` | padding-top/bottom **16px**（`sm:py-4`） |
| 品牌行 | **40px**（top 16 → 56） |
| nav `sm:mt-4` | margin-top **16px** |
| 导航胶囊行 | **39.77px**（top 72 → 111.77） |
| `.site-topbar` border-bottom | **1px** `globals.css:958` |
| 合计 | **128.77** |

actionbar 里只有 Export（`109.38×38.25`，右对齐）。canvas-toolbar 是撤销/重做/磁铁 + Multi-select。都不是高度问题。

底部：

- `.coat-workbench-mobile-drawer` 在此视口 `display: none`（`globals.css:1410`），**不是底栏**。
- `.coat-target-zoom` 绝对定位 overlay，36px，和竞品 `.coa-zoom-controls` 一样。
- 没有 status bar / dock / 底工具条占布局。
- 工作台 **下面** 还有 SEO `1371px` + footer `359px`（`page.tsx:51-52`），`documentElement.scrollHeight = 2468`。这不吃 100svh 画布；实现这次不要拆 `CoatMakerSeoContent`。

---

## 2. 高度链（file:line + 计算值）

`html` / `body`：`display: block`，高度跟文档走 `2468`，**没有** `height: 100%`（`globals.css:231-244`）。

```
.coat-maker-page                                          globals.css:1256-1258
  display: block
  min-height: 100svh                                      计算 min-height 738px
  height: 2468                                            被子级撑开（workbench 738 + SEO 1371 + footer 359）

.coat-maker-page > .coat-target-workbench                 globals.css:1371-1374
  height: 100svh                                          计算 738px
  flex: none                                              父级不是 flex，这条 flex 实际不生效

.coat-workbench                                           globals.css:1265-1271
  flex: 1 1 auto; min-height: 0; overflow-x: clip
  被 .coat-target-workbench / 1371 覆盖，本页用不到 flex 长高

.coat-target-workbench                                    globals.css:1337-1357
  display: grid
  grid-template-rows: auto minmax(0, 1fr)                 计算 128.766px 609.234px
  height: 100svh                                          738
  min-height: 38rem                                       608
  overflow: hidden
  子：.site-topbar（auto）+ .coat-workbench-content（1fr）

.coat-workbench-content 通用                              globals.css:1273-1279
  height: 100%
  grid-template-rows: auto minmax(0, 1fr) auto            三行（含底栏位）

.coat-target-workbench .coat-workbench-content            globals.css:1403-1408
  height: auto                                            计算 609.234（grid stretch）
  grid-template-rows: auto minmax(0, 1fr)                 计算 50px 559.234px
  子：actionbar 50 + editor-grid 559；mobile drawer display:none

.coat-target-scene                                        globals.css:1482
  grid-template-rows: 40px minmax(0, 1fr)                 计算 40px 519.234px
  overflow: hidden
```

DOM 对应：`CoatOfArmsMaker.tsx:305-370`（`main.coat-workbench.coat-target-workbench` → topbar → `.coat-workbench-content` → actionbar + editor-grid + 隐藏的 mobile drawer）。

页面壳：`src/app/(maker-en)/coat-of-arms-maker/page.tsx:45-53`：`.coat-maker-page` 里 workbench、然后 `CoatMakerSeoContent`、然后 `SiteFooter`。

**链是闭合的。** 不要为了长高去改 `.coat-maker-page` 成 flex，除非同时把 SEO/footer 移出或改策略。现在画布高度的上限就是 `100svh − topbar − 50 − 40 − wrap padding`，再被 artboard `30rem` 截断。

`.coat-maker-page > .coat-workbench:not(.coat-target-workbench)`（`globals.css:1260-1263`）本页不命中。

---

## 3. 竞品对照（只记尺寸，不抄 UI）

竞品视口 `1496×756`。编辑器同样把站点 footer 放在工作区下面（footer top 764.3，scrollHeight 1431）。**也没有底栏。**

| 带 | 竞品 | 我们 | 差 |
|---|---|---|---|
| 站点 header | `header.elementor-location-header` **99**（28 other-sites + 71 主导航） | `.site-topbar` **128.77** | 我们高 **29.77** |
| 顶工具条 | `.coa-top-bar.h-[50px]` **50** | `.coat-target-actionbar` **50** | 已齐 |
| 画布工具条 | `.coa-toolbar` **40** / `min-height: 40px` | `.coat-target-canvas-toolbar` **40**；scene 第一行 `40px` | 已齐 |
| 画布槽 padding | `.coa-canvas-scroll` padding **0** | wrap `14.76` 上下 + `90.72` 左右 | 我们多一圈空白 |
| 画布本体 | `.lower-canvas` **1009×575**（铺满剩余） | artboard **480×480** / canvas **478** | 我们矮 **97**、窄一半 |
| 缩放 | `.coa-zoom-controls` 36 absolute | `.coat-target-zoom` 36 absolute | 已齐，都不是底栏 |
| chrome 合计 | 99+50+40 = **189** | 129+50+40 = **219** | 我们多 30 |
| 画布 / 视口 | 575/756 = **76.1%** | 478/738 = **64.8%** | 我们少约 11 个点 |

竞品画布从 y=189 铺到 y=764，几乎贴视口底（视口 756，工作区略溢出 8px）。我们 artboard 底在 718，下面还空着 wrap padding + 视口底。

---

## 4. 实现者应改的选择器

按收益排序。只改这些，别顺手动 Shields / Upload / Contact。

### A. 压缩进 100svh 的站点顶栏（最大 chrome）

- **改 props，不要改 Contact 路由文件。**  
  `CoatOfArmsMaker.tsx:306-317`  
  现在：
  - `contentClassName="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8"` → inner padding-Y 16
  - `navClassName="mt-3 flex flex-wrap items-center gap-2 sm:mt-4"` → nav 再 +16
- 结构：`ContentSiteTopbar.tsx:47-81` 两行（品牌 40 + 胶囊 40）。
- `.site-topbar` `globals.css:957-962` 只有边框/背景，没有 height。
- `.coat-target-workbench > .site-topbar` `globals.css:1399-1401` 只有 `font-family`。
- 工作台把顶栏放在 grid 第一行 auto：`globals.css:1349-1350`。顶栏有多高，画布就少多少。

目标大约 **99px**（对齐竞品 header），不是删掉 EDITOR / DICE / COAT / CONTACT / BLOG。CONTACT 链接留着，只把两行+大 padding 收成更矮的一条。

### B. 画板尺寸公式（不改这个，瘦顶栏也拉不高正方形）

`globals.css:1573` `.coat-target-workbench .coat-target-artboard`

```css
width: min(30rem, calc((100svh - 12rem) * 0.91), calc(100vw - 28rem));
aspect-ratio: var(--coat-canvas-aspect-ratio); /* 本页 1200/1200 → 1:1 */
```

本视口候选：`30rem=480`、`(738-192)*0.91=496.86`、`1512-448=1064` → **min 绑在 480**。  
`12rem=192` 还低估了真实 chrome（218.77）。即便删掉 `30rem`，仍会被 `* 0.91` 收到 ~497，而 wrap 内高已经只有 490。

建议：按剩余槽 `minmax(0,1fr)` 吃高度（`max-height: 100%` + `width: auto` 配 1:1），或把 `12rem` 改成真实 chrome（压顶栏后约 `99+50+40=189`）。竞品是铺满剩余工作区，不是 30rem 卡片。

### C. wrap 垂直 padding

`globals.css:1572` `.coat-target-workbench .coat-target-artboard-wrap`

```css
padding: clamp(0.75rem, 2vh, 2rem) clamp(1.25rem, 6vw, 8rem);
```

实测 `14.76 90.72`。竞品 `.coa-canvas-scroll` padding 0。垂直方向建议收到很小常数（或 0），否则 1:1 画板永远比槽矮一截。左右 90px 是水平问题，这次以高度为准，不要顺手大改水平除非同一选择器必须一起写。

### D. 保持不动（已对齐）

- `.coat-target-actionbar` `globals.css:1421-1430` `height: 50px` — 对齐 `.coa-top-bar h-[50px]`
- `.coat-target-scene` `globals.css:1482` `grid-template-rows: 40px minmax(0, 1fr)`
- `.coat-target-canvas-toolbar` `globals.css:1483` `height: 40px`
- `.coat-target-zoom` `globals.css:1577` 36px overlay — 不要改成占布局的底栏
- `.coat-target-workbench` `height: 100svh; overflow: hidden` `globals.css:1349-1353` 和 `1371-1374`

### E. 不要动

- Shields 树短名（Heater / French / Banner…）
- Upload / Custom 付费墙
- Contact 文案与 SEO 残留文件：`site-content.ts`、`InnerPageChrome.tsx`、`HomeSeoContent*`、`site-routes.test.tsx`
- 不要为了长高去删 `CoatMakerSeoContent`（它在 100svh 下面，不进这根高度账）

---

## 5. 验收口径（给下一手实现）

桌面 `1512×738`、丢弃草稿、无 inert：

1. `.coat-target-actionbar` 仍是 **50px**。
2. `.coat-target-canvas-toolbar` 仍是 **40px**。
3. `.site-topbar` 应接近竞品 **99px**，而不是现在的 129。
4. 画布可视高度应接近剩余槽，而不是被 `30rem` 锁在 480。目标量级：视口的 **~76%**（本视口约 560px 量级），至少明显高于 478。
5. 编辑器内部仍然 **没有** 占布局的底栏；zoom 继续 overlay。
6. 不改 Contact / Shields 短名 / Upload 付费墙。
