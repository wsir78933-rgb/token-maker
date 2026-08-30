# Coat Maker comparison vote round 2 (Grok)

Read-only. No product files edited. No commit.

```
winner: revision
locked_identical: no
leftover_disagreements:
```

I would not ship grok, codex, or cursor with zero cell edits. The locked EN/ZH table below is the only text I would ship.

---

## Rejected locks

### grok — reject

EN Stay / CoaMaker: `the galleries behind upgrade cards`. ZH Stay / CoaMaker: `升级卡图库`. Logged-out CoaMaker still has free shield/charge galleries. Upgrade Now cards were on custom-shield upload, own-element upload, and extra elements. **Invented competitor facts.**

All other grok cells in the remaining-disagreement list are shippable.

### codex — reject

EN and ZH Account / CoaMaker: `upgrade cards` / `升级卡` on save. Save is How-to `How to Save Designs (PRO)`, not that card. **Invented competitor facts.**

ZH Surname / this-page: Latin `Names`. ZH workbench tab is `命名`.

EN and ZH Stay / Crest: I would replace `No use case could be verified` / `无法确认适用场景` with the grok+cursor visit-unseen line.

### cursor — reject

Same Account / CoaMaker invented save-as-upgrade-card in EN and ZH.

EN Surname / this-page drops the EN `Names` tool, which is the workbench tab. I would keep grok+codex.

No fifth competitor. No extra rows.

---

## Locked public copy

Shape unchanged: 4 columns, 6 rows, empty corner `th`. Crest stays visit-unseen. EN/ZH same article.

This lock is grok’s round-1 table with two cells swapped to codex Stay / CoaMaker. Nothing else from the remaining-disagreement list is changed.

Probe (same tokenizers as `CoatMakerSeoContent.test.tsx`; rest-of-page EN 708 / ZH 741):

| | Compare tokens | Page tokens | Keyphrase hits | Density |
|---|---:|---:|---:|---:|
| EN locked | 396 | **1104** | 8 (heading + column 0) | **2.90%** |
| ZH locked | 409 | **1150** | 7 (heading + column 0 + stay cell) | **3.04%** |

Band 1050–1150 / 2.7–3.3%. Do not add keyphrase outside heading + column 0 + the existing ZH stay cell.

---

## EN (locked)

```ts
comparisonHeading: 'This coat of arms maker next to three other makers',
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
      'Login is optional. Uploads, extra elements, and save showed paid gates. The free editor had ads.',
      'No login or paid upgrade was visible. The page had ads and asked for support.',
      'This visit did not show a sign-in, price, or paywall.',
    ],
  },
  {
    rowLabel: 'Surname and official arms',
    cellText: [
      'This editor does not look up a surname. The Names tool invents fantasy names, not official arms.',
      'No surname field on the maker. Their article says arms belong to people, not last names.',
      'No surname lookup or official-family claim was visible.',
      'This visit did not show a surname lookup or official-arms claim.',
    ],
  },
  {
    rowLabel: 'When to stay',
    cellText: [
      'Stay here to draw an original shield and export from the editor above.',
      'Use CoaMaker for its random coat button or its free and paid element galleries.',
      'Use Roll for Fantasy for a simple shield-plus-crest compositor. Image conversion was not verified.',
      'Do not plan a Crest and Arms job from this table. The visit did not show a live maker.',
    ],
  },
],
```

---

## ZH (locked)

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
      '登录可选。上传、额外元件和保存有付费项。有广告。',
      '未见登录或付费升级。有广告请支持。',
      '访问未见登录、价格或付费墙。',
    ],
  },
  {
    rowLabel: '姓氏与官方',
    cellText: [
      '不查姓氏。命名出奇幻名，不授官方纹章。',
      '无姓氏栏。其文写纹章属人、不属姓。',
      '未见姓氏查询或官方家族声明。',
      '访问未见姓氏查询或官方声明。',
    ],
  },
  {
    rowLabel: '何时留下',
    cellText: [
      '要画原创盾并导出，留在这个纹章制作器。',
      '要随机按钮或免费、付费元素库，用 CoaMaker。',
      '要盾加冠饰拼接，用 Roll for Fantasy。转图未核实。',
      '勿按本表用 Crest and Arms。未见制作器。',
    ],
  },
],
```

Diff vs grok lock: EN Stay / CoaMaker and ZH Stay / CoaMaker only (codex wording). Diff vs codex lock: Account / CoaMaker paid gates not upgrade cards; ZH Surname `命名`; Stay / Crest grok+cursor; ZH Edit `本地图`; ZH Account this-page grok+cursor. Diff vs cursor lock: heading `next to`; Account / CoaMaker paid gates; Surname Names / 命名; Stay / CoaMaker free and paid galleries.
