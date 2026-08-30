# Coat Maker named-comparison table draft (Codex)

Date: 2026-08-30  
Status: read-only proposal; no product file changes  
Scope: this page vs CoaMaker vs Roll for Fantasy vs Crest and Arms only

## Recommendation

Use a real HTML `<table>`. The comparison has repeated row-to-column relationships, so a table is clearer and more accessible than four independent cards. On narrow screens, keep the table intact inside a horizontally scrollable wrapper; do not convert it into unrelated cards.

The localized public-copy shape stays small:

```ts
comparisonHeading: string;
comparisonLead: string;
comparisonColumns: readonly string[];
comparisonRows: readonly {
  rowLabel: string;
  cellText: readonly string[];
}[];
```

For each locale, `comparisonColumns` contains the four product-column labels in display order. Each `comparisonRows` entry has one `rowLabel` plus four `cellText` values in that same order. Fail fast if a row does not contain exactly four `cellText` values or if any label/cell is blank.

Evidence markers such as `[O1]` are review annotations, not public copy. They make every proposed cell traceable to an Ego-visible fact. `Unseen` / `未看到` is intentional copy where the visit could not verify a product.

## English table copy

`comparisonHeading`: **Compare coat of arms makers before you start**

`comparisonLead`: **Choose by the job you need to finish. This page is a browser editor for an original shield; the other columns contain only facts visible during each competitor visit, and “Unseen” means the product could not be verified.**

`comparisonColumns`: **This page** · **CoaMaker** · **Roll for Fantasy** · **Crest and Arms**

| `rowLabel` | This page | CoaMaker | Roll for Fantasy | Crest and Arms |
|---|---|---|---|---|
| Start | The editor is on this page. Stay here when you want to make an original shield in the browser. [O1] | The root page opens directly in the editor with a default shield, and drawing can start while logged out. [C1] | The editor loads inline below the instructions, with no separate Start button; its controls worked without an account. [R1] | Unseen. The specified maker URL did not load, and the parent domain showed a GoDaddy parking page instead of an editor. [X1] |
| Build the design | Choose a shield cut and field pattern, place charges, add text, and use layers until the shield reads clearly at thumbnail size. [O2] | Pick or drag shields and charges onto the canvas, then duplicate, align, reorder, delete, lock, or hide the selected item. A separate random control can generate a design. [C2] | Use the Shields, Crests, and Color Styles tabs, then add crest pieces and drag, resize, or clear them on the canvas. [R2] | Unseen. No editor or design controls were visible on either loaded page. [X2] |
| Library and custom elements | The page offers shield styles, field patterns, charges, text, layers, and drawing tools. [O3] | Browse shield cuts, charges, top ornaments, colours, text, and drawing tools. Uploading a custom charge or shield outline was marked PRO. [C3] | Choose shield, crest, and colour-style tiles, plus two background-colour pickers. The visible crest tile count did not match the page’s written count. [R3] | Unseen. The visit exposed no library, custom-element control, or product inventory. [X3] |
| Export | Export PNG or JPEG images, a PDF document, print output, or several sizes with batch export. [O4] | The logged-out Export dialog showed PNG, JPG, and PDF, plus quality, transparent background, Share, and Print controls. No SVG option was visible. [C4] | The page says to use “Turn to image” and then save the generated image with the browser. No generated image or download link became visible during the visit, so completed export is unseen. [R4] | Unseen. No export or share control was visible. [X4] |
| Return to a project | A recent draft can be restored if this browser still retains it; export an image when you want a finished copy. [O5] | The visible How-to list marked saving designs and using templates as PRO. [C5] | “Save local” is described as downloading the project state as a text file, and “Load file” restores it later. [R5] | Unseen. No save, load, or return-to-project flow was visible. [X5] |
| Account, payment, and use | This page states that a design can be created and exported in the browser without a paid plan. [O6] | The editor was usable while logged out and showed ads. Custom uploads, extra elements, saving, and templates showed paid gates; commercial use was tied to Advanced or Lifetime Pro. [C6] | No login, subscription, price, or paywall was visible. The page permits non-commercial project use and says commercial use requires the owner’s permission. [R6] | Unseen. The pages that loaded showed no maker account, plan, price, or usage terms. [X6] |
| Surnames and official arms | This page draws an original graphic; it is not a historical record or an inherited shield attached to a surname. [O7] | The editor has no surname-to-arms lookup. CoaMaker’s own surname article says arms were tied to individuals rather than surnames and that research may not yield a definite result. [C7] | No surname or genealogy lookup and no official, registered, authentic, or historical-arms claim was visible in the tool. [R7] | Unseen. Parking-page topic links are ads, not evidence of a surname lookup or an official-arms service. [X7] |

## 中文表格文案

`comparisonHeading`: **开始前比较这几种纹章制作器**

`comparisonLead`: **按你要完成的工作来选。本页是在浏览器里绘制原创盾面的编辑器；其他列只写本次访问中看得到的竞品事实，“未看到”表示无法验证该产品功能。**

`comparisonColumns`: **本页** · **CoaMaker** · **Roll for Fantasy** · **Crest and Arms**

| `rowLabel` | 本页 | CoaMaker | Roll for Fantasy | Crest and Arms |
|---|---|---|---|---|
| 开始方式 | 编辑器就在本页。想在浏览器里制作原创盾面时，留在这里继续。 [O1] | 打开首页就直接进入编辑器，画布上已有默认盾牌；未登录也能开始绘制。 [C1] | 编辑器直接显示在说明文字下方，没有单独的“开始”按钮；不登录也能操作控件。 [R1] | 未看到。指定的制作器网址无法加载，主域名显示的是 GoDaddy 停放页，不是编辑器。 [X1] |
| 制作方式 | 选择盾形和底纹，放置图形，添加文字并使用图层，直到缩略图仍然清楚。 [O2] | 点击或拖动盾形和图形到画布，再对选中元素执行复制、对齐、排序、删除、锁定或隐藏；另有独立的随机生成按钮。 [C2] | 在 Shields、Crests 和 Color Styles 三个标签中选择素材，再在画布上增加、拖动、缩放或清除纹章元素。 [R2] | 未看到。成功加载的页面上没有编辑器或设计控件。 [X2] |
| 素材与自定义 | 本页提供盾牌样式、底纹、图形、文字、图层和绘图工具。 [O3] | 可浏览盾形、图形、顶部装饰、颜色、文字和绘图工具；上传自定义图形或盾形轮廓标为 PRO。 [C3] | 可选择盾形、纹章图形和配色样式，并有两个背景色选择器；页面可见的纹章图形数量与文字说明不一致。 [R3] | 未看到。本次访问没有显示素材库、自定义元素控件或产品库存。 [X3] |
| 导出 | 可导出 PNG 或 JPEG 图片、PDF 文档、打印结果，或用批量导出生成多个尺寸。 [O4] | 未登录时的导出窗口显示 PNG、JPG 和 PDF，并有质量、透明背景、分享和打印控件；没有看到 SVG。 [C4] | 页面说明先点“Turn to image”，再用浏览器保存生成的图片；本次访问没有看到生成图片或下载链接，因此无法确认导出完成。 [R4] | 未看到。页面上没有导出或分享控件。 [X4] |
| 下次继续 | 如果这个浏览器仍保留最近草稿，可以恢复后继续；需要成品时再导出图片。 [O5] | 可见的 How-to 列表把保存设计和使用模板标为 PRO。 [C5] | “Save local”说明会把项目状态下载为文本文件，“Load file”可在以后恢复。 [R5] | 未看到。页面上没有保存、加载或继续项目的流程。 [X5] |
| 账号、付费与用途 | 本页说明可以在浏览器里免费创建并导出设计，不需要付费方案。 [O6] | 未登录也能使用编辑器，页面带广告；自定义上传、额外元素、保存和模板有付费限制，商业用途对应 Advanced 或 Lifetime Pro。 [C6] | 页面上没有登录、订阅、价格或付费墙；页面允许用于非商业项目，商业使用需要得到站点所有者许可。 [R6] | 未看到。成功加载的页面没有显示制作器账号、方案、价格或使用条款。 [X6] |
| 姓氏与官方纹章 | 本页绘制的是原创图形，不是历史记录，也不是挂在姓氏下的继承盾徽。 [O7] | 编辑器没有按姓氏查纹章的功能；CoaMaker 自己的文章说明纹章原本属于个人而非姓氏，研究也未必得到确定结果。 [C7] | 工具里没有看到姓氏或家谱查询，也没有看到官方、注册、真实或历史纹章的声明。 [R7] | 未看到。停放页里的相关主题是广告，不能证明存在姓氏查询或官方纹章服务。 [X7] |

## Evidence ledger

The English and Chinese cells share the same evidence because they are the same article structure and the same factual claims.

| Marker | Verified source |
|---|---|
| O1 | Current local comparison heading, lead, and “This browser coat of arms maker” row in `src/components/coat-of-arms/coat-maker-seo-copy.ts`; the same heading/row was visible in all three Ego research visits. |
| O2 | Current local comparison row: shield cut, field pattern, charges, text, layers, and thumbnail-size check. |
| O3 | Current local `verifiedCapabilities`: shield styles, field patterns, charges, text, layers, and drawing tools. |
| O4 | Current local comparison row and FAQ: PNG, JPEG, PDF, print, and batch export. |
| O5 | Current local verified capability and FAQ: browser draft recovery after reload and export for a finished copy. |
| O6 | Current local FAQ visible on the page: create and export in the browser without a paid plan. |
| O7 | Current local comparison lead and genealogy row: original shield editor, not a surname record. |
| C1 | `tmp/coat-maker-comp-coamaker.md` §§2 and 6: root opens the editor, default shield visible, no signup wall to start. |
| C2 | CoaMaker note §§3–4: click/drag, canvas selection actions, and separate Random tool. |
| C3 | CoaMaker note §4: Shields, Charges, Top, Colors, Text/Draw; custom charge and shield uploads visibly gated. |
| C4 | CoaMaker note §5: live logged-out export dialog; PNG/JPG/PDF, quality, transparency, Share/Print, no SVG. |
| C5 | CoaMaker note §§4–5: visible How-to labels save and templates as PRO. |
| C6 | CoaMaker note §§2, 6, and 9: logged-out use, ads, visible paid gates, commercial-license placement. |
| C7 | CoaMaker note §§7–8: no surname lookup; own article says arms attach to individuals and may not yield definite results. |
| R1 | `tmp/coat-maker-comp-rollforfantasy.md`, Start flow and editor type: inline editor, no Start control, no account required. |
| R2 | Roll for Fantasy note, Start flow and editor type: Shields/Crests/Color Styles plus add, drag, resize, and clear controls. |
| R3 | Roll for Fantasy note, Shield/Crest/Color pickers: tile pickers, two native colour inputs, and visible 130-versus-135 discrepancy. |
| R4 | Roll for Fantasy note, Export and local persistence: documented Turn to image/right-click flow; no output visible during the visit. |
| R5 | Roll for Fantasy note, Export and local persistence: Save local text file and Load file description. |
| R6 | Roll for Fantasy note, Account/paywall and free-versus-paid position: no account/paywall UI; visible non-commercial/commercial-use terms. |
| R7 | Roll for Fantasy note, Surname lookup and official-arms claims: neither was visible or described. |
| X1 | `tmp/coat-maker-comp-crestandarms.md` §§2–3: maker host failed; parent redirected to GoDaddy parking lander. |
| X2 | Crest and Arms note §4: editor type is `visit-unseen`. |
| X3 | Crest and Arms note §§3–4: no maker/library UI; product fields are `visit-unseen`. |
| X4 | Crest and Arms note §4: export/share is `visit-unseen`. |
| X5 | Crest and Arms note §4: no live product or project flow was visible. |
| X6 | Crest and Arms note §4: account/paywall and free-vs-paid are `visit-unseen`. |
| X7 | Crest and Arms note §§3–5: parking-topic chips are ads and cannot prove surname lookup or official-arms claims. |

## Semantic table and test contract

Render one `<table aria-labelledby="comparison-heading">` under the existing comparison `<section>`:

- `<thead>` contains one row with five `<th scope="col">` cells: one **Comparison point / 比较项** header plus the four `comparisonColumns` values.
- `<tbody>` contains seven rows. Each row starts with one `<th scope="row">` for `rowLabel`, followed by four `<td>` elements for the row’s `cellText` values.
- Expected semantic counts per locale: **8 rows**, **12 `<th>` elements** (5 column headers + 7 row headers), and **28 `<td>` elements** (7 rows × 4 products).
- The component contract test should query the comparison section’s table, then assert 5 `columnheader` roles, 7 `rowheader` roles, 28 `cell` roles, and 8 `row` roles. Replace the current assertions for three comparison `<article>` elements and three H3 headings.
- Assert each `comparisonColumns` label as a column header, each `comparisonRows[].rowLabel` as a row header, and each ordered `cellText` value in its expected row. This catches a shifted column as well as a missing value.

The current visible-text collector selects `h1, h2, h3, p, li, a`. Update both its selection and leaf-element filter to `h1, h2, h3, p, li, a, th, td`. With direct text inside each header/data cell, every `rowLabel`, column label, and `cellText` is counted exactly once; `table`, `thead`, `tbody`, and `tr` contribute no text themselves. Extend the collector fixture with a small table and include its `<th>`/`<td>` strings in the expected result. Then rerun the density test and change any token-count bounds only to match measured output.

## Section placement

Keep the content order **Use cases → comparison table → Steps + Tools**. Steps and Tools remain together below Use cases. This draft does not add another comparison section, competitor, DR row, traffic row, or speculative feature.
