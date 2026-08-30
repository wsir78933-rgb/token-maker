# Coat Maker compare vote (Cursor)

**Task:** `task_2b81cefcc164`  
**Date:** 2026-08-30  
**Kind:** read-only unanimous vote. No product files edited. No commit.

```
winner: revision
locked_identical: no
leftover_disagreements: (empty — this file is the lock)
```

I would not ship any of the three drafts with zero cell edits. The locked EN and ZH tables below are the only copy I would ship.

---

## 1. Why no draft is BEST

User lock: BEST only if I would ship that exact EN and ZH table with zero cell edits. Original draft spec: 4–6 job rows; columns `This coat of arms maker | CoaMaker | Roll for Fantasy | Crest and Arms`; competitor cells only from Ego notes; if unseen, write that the visit did not show it; steps+tools below use-case cards. Coordinator lock: use cases (with images) THEN steps+tools THEN the table; Crest column stays, all cells visit-unseen; no traffic/DR.

### grok — closest, still not zero-edit

Layout, column names, 6 rows, token band, Crest “visit did not show”, and no Ego / `.php` / 404 / prices / inventory / license text are shippable. Two cells are not:

| Locale | Row | Column | Draft cell I would not ship | Why |
|---|---|---|---|---|
| EN | Surname and official arms | This coat of arms maker | `The Names tool invents fantasy names, not official arms.` | Names is a workbench utility (`NamePanel`). The ZH label is `命名`, not `Names`. Grok’s own Latin-UI rule is for competitor visits, not this locale’s chrome. The surname job is “no lookup / no official arms,” not a Names ad. |
| ZH | 姓氏与官方 | 这个纹章制作器 | `Names 出奇幻名，不授官方纹章。` | Same cell. ZH workbench copy is `命名`, not `Names`. |
| EN | When to stay | CoaMaker | `Use CoaMaker for their random coat button or the galleries behind upgrade cards.` | Logged-out CoaMaker still has free shield/charge galleries. Upgrade cards sat on extra elements, uploads, and save — not “the galleries.” Misleading. |
| ZH | 何时留下 | CoaMaker | `要随机按钮或升级卡图库，用 CoaMaker。` | Same claim. |

Heading `next to three other makers` is also weaker than `compared with`, so the locked heading is not Grok’s heading either. Everything else in Grok’s tables is kept.

### codex — reject

- **7 rows.** Draft spec is 4–6. Extra `Library and custom elements` / `Return to a project` rows plus split surname/official blow the 1150 ZH band.
- **Layout:** `Use cases → comparison table → Steps + Tools`. Coordinator lock forbids this.
- **Public cells include review markers** `[O1]`…`[X7]`. I would strip them. That is a cell edit.
- Exact unshippable phrases (research “do not copy”):
  - `the parent domain showed a GoDaddy parking page`
  - `commercial use was tied to Advanced or Lifetime Pro`
  - `The page permits non-commercial project use and says commercial use requires the owner's permission.`
  - `The visible crest tile count did not match the page’s written count.`
- Column 0 is `This page` / `本页`, not the specified `This coat of arms maker` / `这个纹章制作器`. Dropping that keyphrase from the column would put EN density at 7×4/page < 2.7% after the old comparison title is removed.

### cursor — reject (my own draft)

- **7 rows.** Same 4–6 violation. Cells are paragraphs; ZH would leave 1150.
- **Layout:** steps+tools stay above use cases. Violates the approved move and the coordinator lock.
- Exact unshippable public phrases (research internals, not user jobs):
  - `Ego saw the editor, shield controls, and Export`
  - `The extensionless coat-of-arms-creator URL redirected to a 404.`
  - `The live tool is the .php page`
  - `248×275 canvas`
  - `connection closed, DNS NXDOMAIN`
  - `This visit did not record drag-and-drop on this canvas.`
- Column 0 is `This page` / `本页` — same density miss as Codex.

---

## 2. Locked public fields

Talk only through `comparisonHeading`, `comparisonLead`, `comparisonColumns`, `comparisonRows` (`rowLabel`, `cellText[4]`). Drop `comparisonItems`. Corner `<th>` stays empty (no counted `Job` / `工作`). Getter asserts: 4 columns, 6 rows, each `cellText.length === 4`, every string non-empty.

`comparisonColumns` order is fixed: This coat of arms maker, CoaMaker, Roll for Fantasy, Crest and Arms.

---

## 3. Locked EN table

```ts
comparisonHeading: 'This coat of arms maker compared with three other makers',
comparisonLead:
  'This page draws an original shield in the browser. Each row is a job you came to finish.',
comparisonColumns: [
  'This coat of arms maker',
  'CoaMaker',
  'Roll for Fantasy',
  'Crest and Arms',
],
comparisonRows: [
  {
    rowLabel: 'Start',
    cellText: [
      'Open this page. The editor is already on the canvas. No login to start.',
      'Opening the site puts you in the editor. A default shield is on the canvas, and login is optional.',
      'The page loads the editor under the instructions. There is no separate start button.',
      'This visit did not show a start control. The named URL did not load.',
    ],
  },
  {
    rowLabel: 'Edit',
    cellText: [
      'Shields, field patterns, charges, text, layers, and drawing tools. Local images need no paid plan.',
      'Click or drag charges onto the canvas. Shields, text, draw, and a random coat button were free. Not an AI prompt.',
      'Pick Shields, Crests, and Color Styles, then drag or resize. No account required.',
      'This visit did not show an editor.',
    ],
  },
  {
    rowLabel: 'Export',
    cellText: [
      'Export PNG, JPEG, or PDF. Print and batch ZIP are in the same menu.',
      'Logged-out Export showed PNG, JPG, and PDF, plus print and share. No SVG in that dialog.',
      'The page says turn the canvas to an image and save from the browser. This visit did not show a download.',
      'This visit did not show export or share controls.',
    ],
  },
  {
    rowLabel: 'Account',
    cellText: [
      'No login and no paid plan. A browser draft can be restored after a reload.',
      'Login is optional. Uploads, extra elements, and save showed upgrade cards. The free editor had ads.',
      'No login or paid upgrade was visible. The page had ads and asked for support.',
      'This visit did not show a sign-in, price, or paywall.',
    ],
  },
  {
    rowLabel: 'Surname and official arms',
    cellText: [
      'This editor does not look up a surname. It draws an original shield, not official arms.',
      'No surname field on the maker. Their article says arms belong to people, not last names.',
      'No surname lookup or official-family claim was visible.',
      'This visit did not show a surname lookup or official-arms claim.',
    ],
  },
  {
    rowLabel: 'When to stay',
    cellText: [
      'Stay here to draw an original shield and export from the editor above.',
      'Use CoaMaker for the random coat button. Extra elements showed upgrade cards.',
      'Use Roll for Fantasy for a simple shield-plus-crest compositor. Image conversion was not verified.',
      'Do not plan a Crest and Arms job from this table. The visit did not show a live maker.',
    ],
  },
],
```

| | This coat of arms maker | CoaMaker | Roll for Fantasy | Crest and Arms |
|---|---|---|---|---|
| Start | Open this page. The editor is already on the canvas. No login to start. | Opening the site puts you in the editor. A default shield is on the canvas, and login is optional. | The page loads the editor under the instructions. There is no separate start button. | This visit did not show a start control. The named URL did not load. |
| Edit | Shields, field patterns, charges, text, layers, and drawing tools. Local images need no paid plan. | Click or drag charges onto the canvas. Shields, text, draw, and a random coat button were free. Not an AI prompt. | Pick Shields, Crests, and Color Styles, then drag or resize. No account required. | This visit did not show an editor. |
| Export | Export PNG, JPEG, or PDF. Print and batch ZIP are in the same menu. | Logged-out Export showed PNG, JPG, and PDF, plus print and share. No SVG in that dialog. | The page says turn the canvas to an image and save from the browser. This visit did not show a download. | This visit did not show export or share controls. |
| Account | No login and no paid plan. A browser draft can be restored after a reload. | Login is optional. Uploads, extra elements, and save showed upgrade cards. The free editor had ads. | No login or paid upgrade was visible. The page had ads and asked for support. | This visit did not show a sign-in, price, or paywall. |
| Surname and official arms | This editor does not look up a surname. It draws an original shield, not official arms. | No surname field on the maker. Their article says arms belong to people, not last names. | No surname lookup or official-family claim was visible. | This visit did not show a surname lookup or official-arms claim. |
| When to stay | Stay here to draw an original shield and export from the editor above. | Use CoaMaker for the random coat button. Extra elements showed upgrade cards. | Use Roll for Fantasy for a simple shield-plus-crest compositor. Image conversion was not verified. | Do not plan a Crest and Arms job from this table. The visit did not show a live maker. |

---

## 4. Locked ZH table (same article)

```ts
comparisonHeading: '这个纹章制作器对比三家',
comparisonLead: '本页在浏览器里画原创的盾。每行一项工作。',
comparisonColumns: [
  '这个纹章制作器',
  'CoaMaker',
  'Roll for Fantasy',
  'Crest and Arms',
],
comparisonRows: [
  {
    rowLabel: '开始',
    cellText: [
      '打开本页。编辑器已在画布上，不用登录。',
      '打开即进编辑器。已有默认盾，登录可选。',
      '说明下直接载入编辑器，无开始按钮。',
      '访问未见开始控件。指定网址打不开。',
    ],
  },
  {
    rowLabel: '编辑',
    cellText: [
      '盾形、底纹、图形、文字、图层、绘图。本地图免费。',
      '点选或拖图形。盾、文字、画笔和随机按钮免费。非 AI。',
      '选 Shields、Crests、Color Styles，可拖可缩放。不用账号。',
      '访问未见编辑器。',
    ],
  },
  {
    rowLabel: '导出',
    cellText: [
      '导出 PNG、JPEG 或 PDF。可打印和批量 ZIP。',
      '未登录 Export 有 PNG、JPG、PDF，可打印和分享。无 SVG。',
      '页面写转成图再保存。未见下载。',
      '访问未见导出或分享。',
    ],
  },
  {
    rowLabel: '账号',
    cellText: [
      '无登录无付费。草稿重开后可恢复。',
      '登录可选。上传、额外元件和保存有升级卡。有广告。',
      '未见登录或付费升级。有广告请支持。',
      '访问未见登录、价格或付费墙。',
    ],
  },
  {
    rowLabel: '姓氏与官方',
    cellText: [
      '不查姓氏。画原创盾，不授官方纹章。',
      '无姓氏栏。其文写纹章属人、不属姓。',
      '未见姓氏查询或官方家族声明。',
      '访问未见姓氏查询或官方声明。',
    ],
  },
  {
    rowLabel: '何时留下',
    cellText: [
      '要画原创盾并导出，留在这个纹章制作器。',
      '要随机按钮，用 CoaMaker。额外元件有升级卡。',
      '要盾加冠饰拼接，用 Roll for Fantasy。转图未核实。',
      '勿按本表用 Crest and Arms。未见制作器。',
    ],
  },
],
```

| | 这个纹章制作器 | CoaMaker | Roll for Fantasy | Crest and Arms |
|---|---|---|---|---|
| 开始 | 打开本页。编辑器已在画布上，不用登录。 | 打开即进编辑器。已有默认盾，登录可选。 | 说明下直接载入编辑器，无开始按钮。 | 访问未见开始控件。指定网址打不开。 |
| 编辑 | 盾形、底纹、图形、文字、图层、绘图。本地图免费。 | 点选或拖图形。盾、文字、画笔和随机按钮免费。非 AI。 | 选 Shields、Crests、Color Styles，可拖可缩放。不用账号。 | 访问未见编辑器。 |
| 导出 | 导出 PNG、JPEG 或 PDF。可打印和批量 ZIP。 | 未登录 Export 有 PNG、JPG、PDF，可打印和分享。无 SVG。 | 页面写转成图再保存。未见下载。 | 访问未见导出或分享。 |
| 账号 | 无登录无付费。草稿重开后可恢复。 | 登录可选。上传、额外元件和保存有升级卡。有广告。 | 未见登录或付费升级。有广告请支持。 | 访问未见登录、价格或付费墙。 |
| 姓氏与官方 | 不查姓氏。画原创盾，不授官方纹章。 | 无姓氏栏。其文写纹章属人、不属姓。 | 未见姓氏查询或官方家族声明。 | 访问未见姓氏查询或官方声明。 |
| 何时留下 | 要画原创盾并导出，留在这个纹章制作器。 | 要随机按钮，用 CoaMaker。额外元件有升级卡。 | 要盾加冠饰拼接，用 Roll for Fantasy。转图未核实。 | 勿按本表用 Crest and Arms。未见制作器。 |

Brand names, Roll tab labels (`Shields`, `Crests`, `Color Styles`), and UI words seen in English on competitor pages (`Export`, `PNG`) stay Latin in ZH. This page’s ZH stay cell keeps `纹章制作器` so density stays in band.

---

## 5. Cell evidence

### This coat of arms maker

| Row | Claim | Source |
|---|---|---|
| Start | Editor already on the page; no login | `CoatOfArmsMaker.test.tsx` “contains no account or paid-tier action”; ego verify workbench-first (`tmp/task_802c510bf209-coat-maker-ego-verify.md`) |
| Edit | Shields, field patterns, charges, text, layers, drawing tools | `verifiedCapabilities` |
| Edit | Local images, no paid plan | `UploadPanel` / Charges Upload + the same no-PRO test |
| Export | PNG, JPEG, PDF, print, batch ZIP | `verifiedCapabilities`, FAQ, workbench `exportBatch: 'Export batch ZIP'` / `导出批量 ZIP` |
| Account | No login, no paid plan, restore draft | FAQ + `project-storage` draft recovery |
| Surname | No surname lookup; original shield, not official arms | Current comparison copy + `NamePanel` types (city, knight, …) are fantasy, not a lookup. Names is not named on-page. |
| Stay | Draw original shield, export from editor above | Same page job as current compare row 1 |

Not claimed: silent R2 upload on Download. Privacy/FAQ stay unchanged.

### CoaMaker (`tmp/coat-maker-comp-coamaker.md`)

| Row | Claim | Note |
|---|---|---|
| Start | Root URL is the editor; default shield; login optional | §2 |
| Edit | Click and drag charges; text; draw; random coat button; not AI | §3 |
| Export | Logged-out dialog PNG/JPG/PDF, print, share; no SVG in that dialog | §5 live editor |
| Account | Login optional; upgrade cards on upload / extra elements / save; ads | §6, §9 |
| Surname | No surname field; article says arms belong to people, not last names | §7, §8 |
| Stay | Random button; extra elements showed upgrade cards | §3, §4 paywall cards — not the free galleries |

### Roll for Fantasy (`tmp/coat-maker-comp-rollforfantasy.md`)

| Row | Claim | Note |
|---|---|---|
| Start | Editor loads under instructions; no start button | Start flow |
| Edit | Tabs Shields / Crests / Color Styles; drag or resize; no account | Editor type |
| Export | Page-documented turn-to-image + browser save; download not seen | Export section |
| Account | No login/paywall; ads + support ask | Account section |
| Surname | No lookup; no official-family claim | Surname section |
| Stay | Simple compositor; conversion unverified | Same |

Do not put the `.php` URL or the extensionless 404 on the page. Do not copy 60/130/38 inventory counts.

### Crest and Arms (`tmp/coat-maker-comp-crestandarms.md`)

Every product cell is visit-unseen. Specified maker host: `ERR_CONNECTION_CLOSED` / NXDOMAIN. Parent `crestandarms.com` → GoDaddy parking lander. No editor, export, account, or surname UI. Locked cells say the visit did not show the control / `未见`. They do not copy parking lines (`parked free`, `Get This Domain`).

---

## 6. Token probe (test tokenizer, not a live render)

Same counters as `CoatMakerSeoContent.test.tsx`. Rest-of-page is today’s page minus today’s comparison `h2`/`p`/`h3`/`li`, counted from `getCoatMakerSeoCopy`: EN **708** (6 keyphrase hits), ZH **741** (4 hits). Comparison `h3`+`li` go away; `th`+`td` come in after the collector adds those tags.

Locked comparison block tokens (heading + lead + 4 column names + 6 row labels + 24 cells):

| | Compare tokens | Page tokens | Keyphrase hits | Density |
|---|---:|---:|---:|---:|
| EN now | 382 | 1090 | 8 | 2.936% |
| EN locked | 393 | **1101** | 8 (heading + column 0) | **2.91%** |
| ZH now | 377 | 1118 | 7 | 3.131% |
| ZH locked | 407 | **1148** | 7 (heading + column 0 + stay cell) | **3.05%** |

Band: 1050–1150 tokens, density 2.7–3.3%. Do not add the keyphrase in other cells. Do not add a counted corner label on ZH. After wiring, re-run `CoatMakerSeoContent.test.tsx` and believe that number.

---

## 7. Layout lock (not cell text)

Inside `data-testid="coat-maker-seo-content"`:

```
H1 + one intro
use-case cards          (images unchanged)
steps | tools           (BELOW use-case cards)
comparison TABLE        (this lock)
privacy
FAQ                     (unchanged)
related chips
```

One real HTML `<table>`. Wrap in `overflow-x-auto`. Do not clone the table as mobile `article` cards (that would double-count tokens). Highlight the this-page column (`td` index 0), not row 0. Collector must add `th, td`. Put row labels in `<th scope="row">` and cell copy as plain text in `<td>` (no nested `p`/`li`).

---

## 8. leftover_disagreements

None. The locked tables in §§3–4 are the full EN/ZH text I would ship.

Vote path: `tmp/coat-maker-compare-vote-cursor.md`
