# Coat Maker comparison table draft (Cursor)

**Task:** `task_217145dde9ab`  
**Date:** 2026-08-30  
**Kind:** read-only copy draft. No product files edited. No commit.

EN and ZH are the same article: same four columns, same seven rows, same meaning. Crest and Arms cells that have no live maker UI say **unseen** / **未见**. No traffic, DR, price, inventory-count, STL, AI, Token Maker, or Dice rows.

---

## 1. Current live fields (do not ship these as the table)

`src/components/coat-of-arms/coat-maker-seo-copy.ts` still uses category cards, not named tools.

| Field | EN | ZH |
|---|---|---|
| `comparisonHeading` | When to stay on this coat of arms maker | 这个浏览器编辑器和别的做法怎么选 |
| `comparisonLead` | This page draws an original shield in the browser. General drawing apps start from a blank canvas, and a family-history search finds a record instead of a file from this editor, so pick the row that matches the job you came to finish. | 本页在浏览器里画原创的盾。一般绘图软件从空白画布开始；姓氏查询找到的是记录。 |
| `comparisonItems` | 3 cards: This browser coat of arms maker / General design software / Genealogy and surname lookup | 3 cards: 这个浏览器里的纹章制作器 / 一般绘图软件 / 家谱与姓氏查询 |
| Card fields | `title`, `job`, `youLeaveWith`, `stayOnThisPage` | same keys |

Ego on `http://localhost:3001/coat-of-arms-maker` and `/zh/coat-of-arms-maker` (`tmp/task_802c510bf209-coat-maker-ego-verify.md`) saw those three H3s. Named brands are not on the live block.

This draft **replaces** `comparisonItems` with a four-tool table. It does not keep the general-software or genealogy cards.

---

## 2. Public copy shape

Talk only through these public fields. Drop `CoatMakerSeoComparisonItem` and `comparisonItems`.

```ts
comparisonHeading: string
comparisonLead: string
comparisonColumns: readonly string[] // length 4
comparisonRows: readonly {
  rowLabel: string
  cellText: readonly string[] // length 4, same order as comparisonColumns
}[]
```

Column order is fixed:

0. This page / 本页  
1. CoaMaker  
2. Roll for Fantasy  
3. Crest and Arms  

`cellText[i]` is the cell for `comparisonColumns[i]`. Do not add a fifth product. Do not add a Token Maker or Dice column.

Assert at the copy getter (when this is implemented later):

- `comparisonColumns.length === 4`
- `comparisonRows.length === 7`
- every `cellText.length === 4`
- every string `trim().length > 0`
- Crest cells (`cellText[3]`) contain `unseen` (EN) or `未见` (ZH)

---

## 3. How `th` / `td` are counted

Use one real HTML `<table>`, not a Strategy, not a card grid pretending to be a matrix on desktop.

```
+------------------+-----------+----------+------------------+----------------+
| (row-label th)   | This page | CoaMaker | Roll for Fantasy | Crest and Arms |
+------------------+-----------+----------+------------------+----------------+
| rowLabel (th)    | td[0]     | td[1]    | td[2]            | td[3]          |
| × 7 body rows    |           |          |                  |                |
+------------------+-----------+----------+------------------+----------------+
```

| Piece | Markup | Count |
|---|---|---|
| Columns including the row-label column | 1 label + 4 products | **5** |
| Header row | 5 × `<th scope="col">` | **5 `th`** |
| Body | 7 rows × (`<th scope="row">` + 4 `<td>`) | **7 `th` + 28 `td`** |
| Whole table | header + body | **12 `th` + 28 `td` = 40 cells** |

Header `th[0]` is the row-label header (`Compare` / `对比项`).  
Body `th` is `rowLabel`.  
Body `td` is `cellText[0..3]`.

Implementation check (later, not run in this draft):

```
thead th === 5
tbody th === 7
tbody td === 28
table th === 12
table td === 28
```

Mobile: do not sideways-scroll this 5-column table. Reuse the same `comparisonRows` as stacked cards (`lg:hidden`): each card heading is `rowLabel`; four labeled lines use `comparisonColumns`. Desktop keeps `hidden lg:block` + the `<table>`. Same copy, two presentations.

Highlight the **This page** column (`td:nth-child(2)` / first product), not the first body row. Products are columns now.

---

## 4. Page order: steps + tools stay; table stays below use cases

Ego-verified DOM (`tmp/task_802c510bf209-coat-maker-ego-verify.md` and `CoatMakerSeoContent.tsx`):

1. Workbench (`CoatOfArmsMaker`)  
2. H1 + one intro  
3. Steps \| tools/features (`lg:grid-cols-2`)  
4. Use cases  
5. **Comparison** ← this table  
6. Privacy, FAQ, related chips  

Do not move steps or the three tool chips into the table. Do not put the table above use cases. Do not add a HowTo or extra tool list inside comparison. Steps and tools stay the existing 2-column block they already are (above use cases). The table is the next section after use cases.

---

## 5. Evidence rules used for every cell

| Column | Ego source | Bound |
|---|---|---|
| This page | `http://localhost:3001/coat-of-arms-maker` and `/zh/...` in `tmp/task_802c510bf209-coat-maker-ego-verify.md`, plus the on-page SEO strings those visits showed | Workbench first; Export visible; FAQ/features/privacy/comparison headings as recorded. No drag-drop claim. No Login/Go Pro claim (not recorded on the workbench). No cloud-export product claim. |
| CoaMaker | `tmp/coat-maker-comp-coamaker.md` (logged-out `https://coamaker.com/` and linked CoaMaker pages) | Live Export dialog beats stale docs. No prices, no “624 extra elements”, no traffic, no sister products, no STL, no AI wording. |
| Roll for Fantasy | `tmp/coat-maker-comp-rollforfantasy.md` | Extensionless URL is 404; `.php` is the live tool. Crest count 130 vs 135 is **not** a row. Export file is **unseen**. No inventory or “millions of colors” row. |
| Crest and Arms | `tmp/coat-maker-comp-crestandarms.md` | Specified maker host did not load. Parent host is a GoDaddy parking lander. Every product field is **unseen**. Do not copy parking copy as a product fact. |

Rows refused (YAGNI / Fail Fast):

- Traffic, DR, “millions of users”
- Plan prices (`$5.99` / `$18.99` / `$99`)
- Shield/crest/scheme inventory counts
- License legal text as our terms
- STL / 3D print
- AI generator
- Token Maker, Dice Roller, Flag Creator, Heroic Token
- GoDaddy “parked free” as a Crest plan

---

## 6. EN copy

### comparisonHeading

This coat of arms maker compared with three other tools

### comparisonLead

This table compares this page with CoaMaker, Roll for Fantasy, and Crest and Arms using only what a logged-out visit showed. Crest and Arms cells say unseen because that maker did not load.

### comparisonColumns

1. This page  
2. CoaMaker  
3. Roll for Fantasy  
4. Crest and Arms  

Header `th` for the label column: `Compare`

### comparisonRows

#### Row 1 — `rowLabel`: How you start

| Column | `cellText` |
|---|---|
| This page | The coat-of-arms-maker URL opens a browser workbench first. Ego saw the editor, shield controls, and Export before the SEO headings. |
| CoaMaker | Opening the CoaMaker root URL puts you in the editor with a default shield already on the canvas. There is no signup wall to start. Login is optional in the header. |
| Roll for Fantasy | The extensionless coat-of-arms-creator URL redirected to a 404. The live tool is the `.php` page, where the editor loads under the instructions. No Start button. No account was required to use the controls. |
| Crest and Arms | unseen. The specified maker host did not load (connection closed, DNS NXDOMAIN). The parent host showed a parking lander with no start control. |

#### Row 2 — `rowLabel`: Editor type

| Column | `cellText` |
|---|---|
| This page | On-page tools copy names shield styles, field patterns, charges, text, layers, and drawing tools. Ego saw shield search and the workbench. This visit did not record drag-and-drop on this canvas. |
| CoaMaker | Click a charge thumbnail to place it. Charge gallery images are also draggable. Tools include Text (click or drag), Draw, and Create Random Coat of Arms. There was no AI prompt box. |
| Roll for Fantasy | A browser canvas compositor with tabs Shields, Crests, and Color Styles. Controls add crest pieces, drag, resize, clear, and accept a custom-image value. Selecting tiles filled a previously blank 248×275 canvas after assets loaded. |
| Crest and Arms | unseen. No editor loaded on either Crest host. |

#### Row 3 — `rowLabel`: Export we saw

| Column | `cellText` |
|---|---|
| This page | The workbench shows Export. On-page FAQ and tools copy name PNG, JPEG, PDF, print, and batch export from this editor. |
| CoaMaker | The logged-out Export dialog offered PNG, JPG, and PDF, plus quality, transparent background, Download PNG, Share, and Print. That dialog had no SVG and no STL. |
| Roll for Fantasy | unseen as a completed file. The page documents Turn to image, then a right-click save, or a screenshot fallback. Save local / Load file are described as a text-file project. This visit produced no visible generated image after Turn to image. |
| Crest and Arms | unseen. No export or share control on the pages that loaded. |

#### Row 4 — `rowLabel`: Account or paid gate

| Column | `cellText` |
|---|---|
| This page | The FAQ on this page says you can create and export without a paid plan. Privacy copy says exports stay on your device without sending a design to an account. This visit did not record a Login or Go Pro control on the workbench. |
| CoaMaker | The header shows Login and Go Pro. The logged-out editor shows Upgrade Now on custom shield upload, own-element upload, and extra elements. Ads were on the free editor. Plan prices are not listed in this table. |
| Roll for Fantasy | No login, registration, subscription, upgrade, or checkout control was visible. The editor accepted selections without sign-in. The page has advertising and a support ask. No paid tier was shown. |
| Crest and Arms | unseen. No sign-in, price, or paywall UI. Parking-page “free” copy is not a maker plan. |

#### Row 5 — `rowLabel`: Surname-to-arms lookup

| Column | `cellText` |
|---|---|
| This page | This page’s live comparison treats genealogy as a different job. The maker is an original-shield editor, not a surname search that returns a family file. |
| CoaMaker | No surname field on the maker. Search Shields and Search Charges search the symbol library. Tools → Names is a fantasy name generator, not a family database. |
| Roll for Fantasy | No surname, family-name, genealogy, or ancestry lookup was visible or described. |
| Crest and Arms | unseen. No surname search on the lander. Related-topic chips on that lander are parking ads, not a first-party lookup. |

#### Row 6 — `rowLabel`: Official or inherited arms

| Column | `cellText` |
|---|---|
| This page | On-page comparison says this editor finishes an original shield, not a historical file attached to a surname. No grant or registry claim was on the Ego-visible headings. |
| CoaMaker | Does not claim to grant, register, or retrieve official inherited arms. Its own surname article says arms were tied to individuals, not surnames, and that a last name does not return a file. |
| Roll for Fantasy | No official, registered, authentic, historical, or real-family arms claim was visible. The page describes the tool as inspiration. |
| Crest and Arms | unseen. No official-arms, grant, or registry claim on the pages that loaded. |

#### Row 7 — `rowLabel`: What you leave with

| Column | `cellText` |
|---|---|
| This page | A file from this editor: PNG or JPEG for an image, PDF for a document, plus print or batch when those tools fit. The files come from the workbench on this page. |
| CoaMaker | A PNG, JPG, or PDF from the live Export dialog, or Print / Share. That is a design you drew. It is not a granted achievement. |
| Roll for Fantasy | unseen as a downloaded image in this visit. The page shows a composition on a small canvas and documents a later image-save step. It is not a family record. |
| Crest and Arms | unseen. No maker file and no download. |

---

## 7. ZH copy (same article)

### comparisonHeading

这个纹章制作器和另外三个工具怎么比

### comparisonLead

这张表用未登录访问里见到的事实，对比本页、CoaMaker、Roll for Fantasy 和 Crest and Arms。Crest and Arms 各格写「未见」，因为那个制作器没有打开。

### comparisonColumns

1. 本页  
2. CoaMaker  
3. Roll for Fantasy  
4. Crest and Arms  

表头行标签列：`对比项`

### comparisonRows

#### 第 1 行 — `rowLabel`: 怎么开始

| 列 | `cellText` |
|---|---|
| 本页 | 打开本页先出现浏览器工作台。Ego 见到编辑器、盾形控件和「导出」，SEO 标题在下方。 |
| CoaMaker | 打开 CoaMaker 根地址就是编辑器，画布上已有默认盾。开始画不必注册。页头有可选 Login。 |
| Roll for Fantasy | 无后缀的 coat-of-arms-creator 地址进了 404。现用页是 `.php`，编辑器直接出现在说明下方。没有 Start。操作控件不要求账号。 |
| Crest and Arms | 未见。指定制作器主机打不开（连接关闭，DNS NXDOMAIN）。父域是停放页，没有开始控件。 |

#### 第 2 行 — `rowLabel`: 编辑器类型

| 列 | `cellText` |
|---|---|
| 本页 | 页上工具文案写了盾形、底纹、图形、文字、图层和绘图。Ego 见到盾形搜索和工作台。这次没有记下本页画布的拖放。 |
| CoaMaker | 点图形缩略图即可放置。图形库也可拖。工具有文字（点击或拖）、绘图，以及 Create Random Coat of Arms。没有 AI 提示框。 |
| Roll for Fantasy | 浏览器画布合成，可见标签是 Shields、Crests、Color Styles。可加纹饰、拖、缩放、清除，并有自定义图值。选中图块后，原空白 248×275 画布在资源加载后出现合成图。 |
| Crest and Arms | 未见。两个 Crest 地址都没有编辑器。 |

#### 第 3 行 — `rowLabel`: 见到的导出

| 列 | `cellText` |
|---|---|
| 本页 | 工作台有「导出」。页上常见问题和工具文案写了本页编辑器的 PNG、JPEG、PDF、打印和批量导出。 |
| CoaMaker | 未登录时 Export 对话框有 PNG、JPG、PDF，以及质量、透明底、Download PNG、Share、Print。该对话框里没有 SVG 和 STL。 |
| Roll for Fantasy | 未见已生成的文件。页上写 Turn to image 后右键保存，不行就截屏。Save local / Load file 写成文本状态。这次点 Turn to image 后没有见到生成图。 |
| Crest and Arms | 未见。已打开的页面没有导出或分享控件。 |

#### 第 4 行 — `rowLabel`: 账号或付费门槛

| 列 | `cellText` |
|---|---|
| 本页 | 本页常见问题写可免费创建并导出，不必付费方案。隐私文案写导出留在设备，不把设计送到账号。这次工作台上没有记下 Login 或 Go Pro。 |
| CoaMaker | 页头有 Login 和 Go Pro。未登录编辑器在自定义盾上传、自有元件上传和额外元件上显示 Upgrade Now。免费编辑器有广告。价格不写入本表。 |
| Roll for Fantasy | 工具内容里未见登录、注册、订阅、升级或结账。不登录也能选。页上有广告和赞助请求。未见付费档。 |
| Crest and Arms | 未见。没有登录、价格或付费墙。停放页上的 “free” 不是制作器方案。 |

#### 第 5 行 — `rowLabel`: 姓氏查纹章

| 列 | `cellText` |
|---|---|
| 本页 | 本页现有对比把家谱查询当成另一份工作。制作器是画原创盾，不是用姓氏找回家族档案。 |
| CoaMaker | 制作器里没有姓氏栏。Search Shields 和 Search Charges 搜的是符号库。Tools → Names 是奇幻名字生成，不是家谱库。 |
| Roll for Fantasy | 工具内容里未见姓氏、家谱或祖先查询。 |
| Crest and Arms | 未见。停放页没有姓氏搜索。相关主题词是停放广告，不是第一方面查询。 |

#### 第 6 行 — `rowLabel`: 官方或世袭纹章

| 列 | `cellText` |
|---|---|
| 本页 | 页上对比写本编辑器完成的是原创盾，不是挂在姓氏上的历史档案。Ego 见到的标题里没有授予或登记声称。 |
| CoaMaker | 不声称授予、注册或取回官方世袭纹章。其姓氏文章写纹章原属个人而非姓氏，姓氏不会直接返回一份档案。 |
| Roll for Fantasy | 未见官方、注册、真实或家族纹章声称。该页把工具写成灵感来源。 |
| Crest and Arms | 未见。已打开的页面没有官方纹章、授予或登记声称。 |

#### 第 7 行 — `rowLabel`: 离开时带走什么

| 列 | `cellText` |
|---|---|
| 本页 | 从本页编辑器带走文件：图片用 PNG 或 JPEG，文档用 PDF，需要时还有打印或批量导出。文件来自本页工作台。 |
| CoaMaker | 从现场 Export 对话框带走 PNG、JPG 或 PDF，或 Print / Share。那是你自己画的设计，不是授予的纹章。 |
| Roll for Fantasy | 这次未见已下载的图。页上是小画布合成，并写了随后的存图步骤。不应写成家族记录。 |
| Crest and Arms | 未见。没有制作器文件，也没有下载。 |

---

## 8. Ready-to-paste field values

### EN

```ts
{
  comparisonHeading: 'This coat of arms maker compared with three other tools',
  comparisonLead:
    'This table compares this page with CoaMaker, Roll for Fantasy, and Crest and Arms using only what a logged-out visit showed. Crest and Arms cells say unseen because that maker did not load.',
  comparisonColumns: ['This page', 'CoaMaker', 'Roll for Fantasy', 'Crest and Arms'] as const,
  comparisonRows: [
    {
      rowLabel: 'How you start',
      cellText: [
        'The coat-of-arms-maker URL opens a browser workbench first. Ego saw the editor, shield controls, and Export before the SEO headings.',
        'Opening the CoaMaker root URL puts you in the editor with a default shield already on the canvas. There is no signup wall to start. Login is optional in the header.',
        'The extensionless coat-of-arms-creator URL redirected to a 404. The live tool is the .php page, where the editor loads under the instructions. No Start button. No account was required to use the controls.',
        'unseen. The specified maker host did not load (connection closed, DNS NXDOMAIN). The parent host showed a parking lander with no start control.',
      ],
    },
    {
      rowLabel: 'Editor type',
      cellText: [
        'On-page tools copy names shield styles, field patterns, charges, text, layers, and drawing tools. Ego saw shield search and the workbench. This visit did not record drag-and-drop on this canvas.',
        'Click a charge thumbnail to place it. Charge gallery images are also draggable. Tools include Text (click or drag), Draw, and Create Random Coat of Arms. There was no AI prompt box.',
        'A browser canvas compositor with tabs Shields, Crests, and Color Styles. Controls add crest pieces, drag, resize, clear, and accept a custom-image value. Selecting tiles filled a previously blank 248×275 canvas after assets loaded.',
        'unseen. No editor loaded on either Crest host.',
      ],
    },
    {
      rowLabel: 'Export we saw',
      cellText: [
        'The workbench shows Export. On-page FAQ and tools copy name PNG, JPEG, PDF, print, and batch export from this editor.',
        'The logged-out Export dialog offered PNG, JPG, and PDF, plus quality, transparent background, Download PNG, Share, and Print. That dialog had no SVG and no STL.',
        'unseen as a completed file. The page documents Turn to image, then a right-click save, or a screenshot fallback. Save local / Load file are described as a text-file project. This visit produced no visible generated image after Turn to image.',
        'unseen. No export or share control on the pages that loaded.',
      ],
    },
    {
      rowLabel: 'Account or paid gate',
      cellText: [
        'The FAQ on this page says you can create and export without a paid plan. Privacy copy says exports stay on your device without sending a design to an account. This visit did not record a Login or Go Pro control on the workbench.',
        'The header shows Login and Go Pro. The logged-out editor shows Upgrade Now on custom shield upload, own-element upload, and extra elements. Ads were on the free editor. Plan prices are not listed in this table.',
        'No login, registration, subscription, upgrade, or checkout control was visible. The editor accepted selections without sign-in. The page has advertising and a support ask. No paid tier was shown.',
        'unseen. No sign-in, price, or paywall UI. Parking-page “free” copy is not a maker plan.',
      ],
    },
    {
      rowLabel: 'Surname-to-arms lookup',
      cellText: [
        'This page’s live comparison treats genealogy as a different job. The maker is an original-shield editor, not a surname search that returns a family file.',
        'No surname field on the maker. Search Shields and Search Charges search the symbol library. Tools → Names is a fantasy name generator, not a family database.',
        'No surname, family-name, genealogy, or ancestry lookup was visible or described.',
        'unseen. No surname search on the lander. Related-topic chips on that lander are parking ads, not a first-party lookup.',
      ],
    },
    {
      rowLabel: 'Official or inherited arms',
      cellText: [
        'On-page comparison says this editor finishes an original shield, not a historical file attached to a surname. No grant or registry claim was on the Ego-visible headings.',
        'Does not claim to grant, register, or retrieve official inherited arms. Its own surname article says arms were tied to individuals, not surnames, and that a last name does not return a file.',
        'No official, registered, authentic, historical, or real-family arms claim was visible. The page describes the tool as inspiration.',
        'unseen. No official-arms, grant, or registry claim on the pages that loaded.',
      ],
    },
    {
      rowLabel: 'What you leave with',
      cellText: [
        'A file from this editor: PNG or JPEG for an image, PDF for a document, plus print or batch when those tools fit. The files come from the workbench on this page.',
        'A PNG, JPG, or PDF from the live Export dialog, or Print / Share. That is a design you drew. It is not a granted achievement.',
        'unseen as a downloaded image in this visit. The page shows a composition on a small canvas and documents a later image-save step. It is not a family record.',
        'unseen. No maker file and no download.',
      ],
    },
  ],
}
```

### ZH

```ts
{
  comparisonHeading: '这个纹章制作器和另外三个工具怎么比',
  comparisonLead:
    '这张表用未登录访问里见到的事实，对比本页、CoaMaker、Roll for Fantasy 和 Crest and Arms。Crest and Arms 各格写「未见」，因为那个制作器没有打开。',
  comparisonColumns: ['本页', 'CoaMaker', 'Roll for Fantasy', 'Crest and Arms'] as const,
  comparisonRows: [
    {
      rowLabel: '怎么开始',
      cellText: [
        '打开本页先出现浏览器工作台。Ego 见到编辑器、盾形控件和「导出」，SEO 标题在下方。',
        '打开 CoaMaker 根地址就是编辑器，画布上已有默认盾。开始画不必注册。页头有可选 Login。',
        '无后缀的 coat-of-arms-creator 地址进了 404。现用页是 .php，编辑器直接出现在说明下方。没有 Start。操作控件不要求账号。',
        '未见。指定制作器主机打不开（连接关闭，DNS NXDOMAIN）。父域是停放页，没有开始控件。',
      ],
    },
    {
      rowLabel: '编辑器类型',
      cellText: [
        '页上工具文案写了盾形、底纹、图形、文字、图层和绘图。Ego 见到盾形搜索和工作台。这次没有记下本页画布的拖放。',
        '点图形缩略图即可放置。图形库也可拖。工具有文字（点击或拖）、绘图，以及 Create Random Coat of Arms。没有 AI 提示框。',
        '浏览器画布合成，可见标签是 Shields、Crests、Color Styles。可加纹饰、拖、缩放、清除，并有自定义图值。选中图块后，原空白 248×275 画布在资源加载后出现合成图。',
        '未见。两个 Crest 地址都没有编辑器。',
      ],
    },
    {
      rowLabel: '见到的导出',
      cellText: [
        '工作台有「导出」。页上常见问题和工具文案写了本页编辑器的 PNG、JPEG、PDF、打印和批量导出。',
        '未登录时 Export 对话框有 PNG、JPG、PDF，以及质量、透明底、Download PNG、Share、Print。该对话框里没有 SVG 和 STL。',
        '未见已生成的文件。页上写 Turn to image 后右键保存，不行就截屏。Save local / Load file 写成文本状态。这次点 Turn to image 后没有见到生成图。',
        '未见。已打开的页面没有导出或分享控件。',
      ],
    },
    {
      rowLabel: '账号或付费门槛',
      cellText: [
        '本页常见问题写可免费创建并导出，不必付费方案。隐私文案写导出留在设备，不把设计送到账号。这次工作台上没有记下 Login 或 Go Pro。',
        '页头有 Login 和 Go Pro。未登录编辑器在自定义盾上传、自有元件上传和额外元件上显示 Upgrade Now。免费编辑器有广告。价格不写入本表。',
        '工具内容里未见登录、注册、订阅、升级或结账。不登录也能选。页上有广告和赞助请求。未见付费档。',
        '未见。没有登录、价格或付费墙。停放页上的 “free” 不是制作器方案。',
      ],
    },
    {
      rowLabel: '姓氏查纹章',
      cellText: [
        '本页现有对比把家谱查询当成另一份工作。制作器是画原创盾，不是用姓氏找回家族档案。',
        '制作器里没有姓氏栏。Search Shields 和 Search Charges 搜的是符号库。Tools → Names 是奇幻名字生成，不是家谱库。',
        '工具内容里未见姓氏、家谱或祖先查询。',
        '未见。停放页没有姓氏搜索。相关主题词是停放广告，不是第一方面查询。',
      ],
    },
    {
      rowLabel: '官方或世袭纹章',
      cellText: [
        '页上对比写本编辑器完成的是原创盾，不是挂在姓氏上的历史档案。Ego 见到的标题里没有授予或登记声称。',
        '不声称授予、注册或取回官方世袭纹章。其姓氏文章写纹章原属个人而非姓氏，姓氏不会直接返回一份档案。',
        '未见官方、注册、真实或家族纹章声称。该页把工具写成灵感来源。',
        '未见。已打开的页面没有官方纹章、授予或登记声称。',
      ],
    },
    {
      rowLabel: '离开时带走什么',
      cellText: [
        '从本页编辑器带走文件：图片用 PNG 或 JPEG，文档用 PDF，需要时还有打印或批量导出。文件来自本页工作台。',
        '从现场 Export 对话框带走 PNG、JPG 或 PDF，或 Print / Share。那是你自己画的设计，不是授予的纹章。',
        '这次未见已下载的图。页上是小画布合成，并写了随后的存图步骤。不应写成家族记录。',
        '未见。没有制作器文件，也没有下载。',
      ],
    },
  ],
}
```

---

## 9. Cell audit (Fail Fast)

| Row | This page | CoaMaker | Roll for Fantasy | Crest and Arms |
|---|---|---|---|---|
| How you start | Ego workbench-first + Export | Live root editor, default shield, optional Login | 404 then `.php`; inline editor; no account | unseen |
| Editor type | On-page tools copy + shield search; drag-drop not recorded | Click, drag, text, draw, random; not AI | Tabs + drag/resize; 248×275 | unseen |
| Export | Workbench Export + FAQ/tools formats | Live PNG/JPG/PDF dialog; no SVG/STL | unseen as a file; documented path only | unseen |
| Account / paid | FAQ free; privacy no account send; Login unseen on workbench | Login, Go Pro, Upgrade Now, ads; no prices | No paywall UI; ads + support ask | unseen |
| Surname lookup | Live comparison: not this editor | No surname field; library search; fantasy names | None visible | unseen |
| Official arms | Original shield, not a surname file; no grant heading | No grant/register/retrieve claim | Inspiration; no official claim | unseen |
| Leave with | PNG/JPEG/PDF/print/batch from this workbench | PNG/JPG/PDF or Print/Share; not a grant | unseen download; not a family record | unseen |

Crest column: 7/7 cells contain unseen / 未见.  
Roll export and Roll “leave with” do not invent a working download.  
No DR/traffic row. No price row. No inventory row.

---

## 10. What a later implementer must change (out of this draft)

Product files were **not** edited here. Shipping this table later needs:

- `coat-maker-seo-copy.ts` — swap `comparisonItems` for the fields above; update `assertCoatMakerSeoCopyFields` (`comparisonItems.length !== 3` becomes columns=4, rows=7).
- `CoatMakerSeoContent.tsx` — replace the 3-card grid with the 5-column table (desktop) + stacked cards (mobile).
- `CoatMakerSeoContent.test.tsx` and `site-routes.test.tsx` — they currently lock 3 comparison articles.

Earlier research notes said not to name CoaMaker / Crest and Arms on the live headings. This draft names them because the current task asked for this four-tool table.

---

## 11. Verification for this draft

Read-only. No `pnpm` product tests (no product files changed).

Checked before writing:

- `tmp/coat-maker-comp-coamaker.md`
- `tmp/coat-maker-comp-rollforfantasy.md`
- `tmp/coat-maker-comp-crestandarms.md`
- `src/components/coat-of-arms/coat-maker-seo-copy.ts` comparison fields
- `CoatMakerSeoContent.tsx` section order
- `tmp/task_802c510bf209-coat-maker-ego-verify.md`

Draft path: `tmp/coat-maker-compare-draft-cursor.md`
