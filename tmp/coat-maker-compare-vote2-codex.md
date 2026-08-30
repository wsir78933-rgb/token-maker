winner: revision
locked_identical: no
leftover_disagreements:

# Round 2 vote — Codex

None of the three candidate locks is shippable with zero cell edits.

- `grok` invents the placement of paid content in `the galleries behind upgrade cards`; the evidence says the cards were on uploads and extra elements, while save was a separate PRO How-to label. Its ZH `本地图免费` also does not say “local images are free.”
- `codex` and `cursor` both say `save showed upgrade cards`, which invents the card treatment for save. `codex` also uses the EN tab label `Names` in the ZH cell, while `cursor` retains `本地图免费`.

The full replacement lock below makes the evidence distinction explicit and leaves no unresolved cell choice.

## EN lock

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
      'Login is optional. Uploads and extra elements showed upgrade cards; save was marked PRO. The free editor had ads.',
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
      'No use case could be verified; no live maker was visible.',
    ],
  },
],
```

## ZH lock

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
      '盾形、底纹、图形、文字、图层、绘图。本地图片免费。',
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
      '不用登录或付费。草稿重开可恢复。',
      '登录可选。上传、额外元件有升级卡；保存标为 PRO。有广告。',
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
      '适用场景未核实；未见制作器。',
    ],
  },
],
```

## Lock verification

- Exact shape: 4 columns, 6 rows, 24 cells per locale; the corner header remains empty.
- Existing tokenizers with the locked rest-of-page baseline: EN comparison 388, projected page 1096, projected density 2.92%; ZH comparison 409, projected page 1150, projected density 3.04%.
- Crest remains visit-unseen in every row; no fifth competitor or extra row was added.

