# Coat Maker comparison vote (Grok)

Read-only vote. No product files edited. No commit.

```
winner: revision
locked_identical: no
leftover_disagreements:
```

I would not ship grok, codex, or cursor with zero cell edits. The locked EN/ZH table below is the only text I would ship.

---

## Rejected drafts

### grok — closest, not shippable as written

Shape is right: 4 columns, 6 job rows, empty corner `th`, no fifth competitor, no Token Maker / Dice / DR / traffic / price / inventory rows. Probe math fits the live band (EN compare 395 → page **1103**; ZH compare 406 → page **1147**; density 2.90% / 3.05%). Crest cells stay visit-unseen without GoDaddy / NXDOMAIN / parking copy. Roll cells omit `.php`, the 404, and 60/130/38 counts.

Would still edit two competitor/this-page cells:

- CoaMaker Account says save “showed upgrade cards”. The CoaMaker note shows Upgrade Now cards on custom-shield upload, own-element upload, and extra elements. Save is a How-to label `How to Save Designs (PRO)`, not that card. **Invented competitor facts.** Locked cell uses “paid gates” / “付费项”.
- ZH this-page Surname keeps Latin `Names`. The ZH workbench label is `命名` (`workbench-copy.ts`). Locked cell uses `命名`.

### codex — would not ship any cell as written

- 7 rows plus a counted “Comparison point / 比较项” corner. Rest-of-page is EN 708 / ZH 741. This grid is ~613 EN compare tokens → page **~1321**, over 1150.
- Column 0 is `This page`. Heading is `coat of arms makers` (plural), which does not match `\bcoat of arms maker\b`. Comparison then adds **0** keyphrase hits; page density falls below 2.7%.
- Public grid includes `[O1]` markers, GoDaddy parking, Roll 130-vs-135 inventory, CoaMaker Advanced / Lifetime Pro, and Roll commercial-permission terms. Those are notes to keep off the page.
- Crest cells name a parking page. The Crest note forbids copying parking copy.

### cursor — would not ship any cell as written

- 7 rows, counted `Compare` / `对比项`, plus a mobile card clone of the same strings. EN compare ~773 tokens → page **~1481**, over 1150. Duplicate cards would count twice.
- Column 0 is `This page` (one keyphrase hit in the heading only). Even if tokens were cut to 1150, 7 hits × 4 / 1150 = **2.43%**, under 2.7%.
- Public cells dump research internals: `Ego saw`, `.php`, extensionless 404, `DNS NXDOMAIN`, `248×275`, `custom-image value`. The Roll note says not to put the `.php` URL or the 404 on the page.

No fifth competitor in any draft.

---

## Locked public copy

Same article in EN and ZH. 4 columns, 6 rows, `cellText[i]` matches `comparisonColumns[i]`. Corner header is empty (not a counted `Job` / `对比项`). No evidence markers in cells.

Probe with the unit-test tokenizers, rest-of-page = today’s page minus today’s comparison `h2`/`p`/`h3`/`li` (EN 708, ZH 741):

| | Compare tokens | Page tokens | Keyphrase hits | Density |
|---|---:|---:|---:|---:|
| EN locked | 395 | **1103** | 8 (heading + column 0) | **2.90%** |
| ZH locked | 407 | **1148** | 7 (heading + column 0 + stay cell) | **3.05%** |

Band 1050–1150 / 2.7–3.3%. Do not add keyphrase in other cells. After wiring, believe `CoatMakerSeoContent.test.tsx`, not this probe.

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
      'Use CoaMaker for their random coat button or the galleries behind upgrade cards.',
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
| Account | No login and no paid plan. A browser draft can be restored after a reload. | Login is optional. Uploads, extra elements, and save showed paid gates. The free editor had ads. | No login or paid upgrade was visible. The page had ads and asked for support. | This visit did not show a sign-in, price, or paywall. |
| Surname and official arms | This editor does not look up a surname. The Names tool invents fantasy names, not official arms. | No surname field on the maker. Their article says arms belong to people, not last names. | No surname lookup or official-family claim was visible. | This visit did not show a surname lookup or official-arms claim. |
| When to stay | Stay here to draw an original shield and export from the editor above. | Use CoaMaker for their random coat button or the galleries behind upgrade cards. | Use Roll for Fantasy for a simple shield-plus-crest compositor. Image conversion was not verified. | Do not plan a Crest and Arms job from this table. The visit did not show a live maker. |

Diff vs grok draft: CoaMaker Account `upgrade cards` → `paid gates`. All other EN heading / lead / columns / row labels / cells unchanged.

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
      '要随机按钮或升级卡图库，用 CoaMaker。',
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
| 账号 | 无登录无付费。草稿重开后可恢复。 | 登录可选。上传、额外元件和保存有付费项。有广告。 | 未见登录或付费升级。有广告请支持。 | 访问未见登录、价格或付费墙。 |
| 姓氏与官方 | 不查姓氏。命名出奇幻名，不授官方纹章。 | 无姓氏栏。其文写纹章属人、不属姓。 | 未见姓氏查询或官方家族声明。 | 访问未见姓氏查询或官方声明。 |
| 何时留下 | 要画原创盾并导出，留在这个纹章制作器。 | 要随机按钮或升级卡图库，用 CoaMaker。 | 要盾加冠饰拼接，用 Roll for Fantasy。转图未核实。 | 勿按本表用 Crest and Arms。未见制作器。 |

Diff vs grok draft: CoaMaker Account `升级卡` → `付费项`; this-page Surname `Names` → `命名`. Competitor English UI (`Export`, `Shields`, `Crests`, `Color Styles`, `PNG`) stays Latin because that is what those visits showed.

---

## Cell evidence (not on-page)

Same ledger as `tmp/coat-maker-compare-draft-grok.md` §9, except:

| Cell | Locked wording | Source |
|---|---|---|
| CoaMaker Account | paid gates / 付费项, not “upgrade cards” for save | `tmp/coat-maker-comp-coamaker.md` §4 How-to `How to Save Designs (PRO)`; §6 Upgrade Now on upload / extra elements / custom shield; ads on the free editor |
| this-page Surname ZH | 命名 | `workbench-copy.ts` ZH `names: '命名'`; EN tab remains `Names` |

---

## Out of this vote

Markup, collector `th, td`, and section order are implementer work. This vote locks only heading, lead, columns, row labels, and cells.
