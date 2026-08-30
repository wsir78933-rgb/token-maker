# Coat Maker comparison table draft (Grok)

Read-only draft. No product files edited. No commit.

Replace the current 3-card category compare with **one HTML table**: this page vs CoaMaker vs Roll for Fantasy vs Crest and Arms. EN and ZH are the same article; ZH is a translation.

---

## 1. Decision

Use a **real HTML `<table>`**, not a CSS-grid fake and not stacked duplicate cards.

| Choice | Why |
|---|---|
| Real `<table>` | One set of cells. Screen readers get `scope="col"` / `scope="row"`. KISS. |
| 4 columns × 6 rows | Columns named in the task. Rows are jobs a searcher actually needs. |
| No mobile card clone | Duplicating the table as `article`/`h3`/`p` cards would double-count tokens and blow 1150. |
| Small screens | Wrap the table in `overflow-x-auto`. Do not copy text into a second DOM tree. |
| Gold wash | Highlight the **this-page column** (`td`/`th` index 1 after the row header), not row 0. |

Do **not** keep `comparisonItems`. Do **not** add Token Maker, Dice, DR, or traffic rows.

---

## 2. Layout (already approved; keep)

SEO block stays below the workbench. Inside `data-testid="coat-maker-seo-content"`:

```
H1 + one intro
use-case cards          (images unchanged)
steps | tools           (BELOW use-case cards)
comparison TABLE        (this draft)
privacy
FAQ                     (unchanged)
related chips
```

The working tree still renders steps+tools **above** use cases. The implementer must move that 2-col block **below** the use-case cards. Do not move it beside the canvas. Do not change metadata, FAQ, or use-case images.

---

## 3. Public copy fields

Talk only through these fields. Drop `CoatMakerSeoComparisonItem` / `comparisonItems`.

```ts
comparisonHeading: string;
comparisonLead: string;
comparisonColumns: readonly [string, string, string, string];
comparisonRows: readonly {
  rowLabel: string;
  cellText: readonly [string, string, string, string];
}[];
```

- `comparisonColumns` order is fixed: This coat of arms maker, CoaMaker, Roll for Fantasy, Crest and Arms.
- `comparisonRows.length === 6`.
- `cellText[i]` matches `comparisonColumns[i]`.
- Corner header is an empty `<th>`. Do not add a counted `Job` / `工作` label unless the density probe still has slack (ZH is tight).

Getter asserts: 4 columns, 6 rows, each `cellText.length === 4`, every string non-empty.

---

## 4. How unique table text still counts

Today `collectVisibleSemanticText` only reads `h1, h2, h3, p, li, a`. A `<table>` of `th`/`td` would be **invisible**, so unique compare copy would not count, the page would drop below 1050, and density would jump.

**Required collector change** in `CoatMakerSeoContent.test.tsx`:

```ts
function collectVisibleSemanticText(contentRoot: HTMLElement) {
  const semanticTextElements = Array.from(
    contentRoot.querySelectorAll<HTMLElement>('h1, h2, h3, p, li, a, th, td'),
  );

  return semanticTextElements
    .filter((semanticTextElement) => !semanticTextElement.querySelector('h1, h2, h3, p, li, a, th, td'))
    .map((semanticTextElement) => semanticTextElement.textContent?.trim() ?? '')
    .filter((semanticText) => semanticText.length > 0)
    .join(' ');
}
```

Rules that go with it:

1. Put **row labels in `<th scope="row">`** and column names in `<th scope="col">`. Those `th` nodes are how labels count.
2. Put **cell copy in `<td>` as plain text**. Do not wrap cells in `<p>` or `<li>` after `th, td` are in the selector, or you will skip the cell and risk double-counting if the nested filter is wrong.
3. Update the unit test that currently says the collector reads `h1, h2, h3, p, li, and a elements only`. Add a fixture `<table>` with `th`/`td` and assert those strings appear.
4. Replace the test that expects 3 comparison `article` + 3 `h3`. Assert one `table`, 4 column headers, 6 row headers.
5. Do **not** also put row labels in a counted `h3` outside the table. That is a second copy of the same words.

Putting row labels in `th` only works **after** `th` is in the collector. The collector change is not optional.

---

## 5. Token band (probe math, not a live render)

Same tokenizers as the unit test. Rest-of-page tokens are today’s page minus today’s comparison `h2`/`p`/`h3`/`li` (EN 708, ZH 741). Comparison `h3`+`li` go away; `th`+`td` come in.

| | Compare tokens | Page tokens | Keyphrase hits | Density |
|---|---:|---:|---:|---:|
| EN now | 382 | 1090 | 8 | 2.936% |
| EN this draft | 395 | **1103** | 8 (heading + column 0) | **2.90%** |
| ZH now | 377 | 1118 | 7 | 3.131% |
| ZH this draft | 406 | **1147** | 7 (heading + column 0 + stay cell) | **3.05%** |

Band: 1050–1150 tokens, density 2.7–3.3%. Do not add keyphrase in other cells. Do not add a counted corner label on ZH. After wiring, re-run `CoatMakerSeoContent.test.tsx` and believe that number, not this probe.

ZH is compact on purpose: Han counts as one token per character. The article is the same; the wording is shorter, not a different claim set.

---

## 6. Markup shape (implementer)

```tsx
<section>
  <h2>{copy.comparisonHeading}</h2>
  <p>{copy.comparisonLead}</p>
  <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-black/20">
    <table className="w-full text-left text-sm leading-6 text-stone-300">
      <thead>
        <tr>
          <th />
          {copy.comparisonColumns.map((columnName) => (
            <th key={columnName} scope="col" className="px-4 py-3 font-semibold text-stone-100">
              {columnName}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {copy.comparisonRows.map((comparisonRow) => (
          <tr key={comparisonRow.rowLabel} className="border-t border-white/10">
            <th scope="row" className="px-4 py-3 font-semibold text-stone-100">
              {comparisonRow.rowLabel}
            </th>
            {comparisonRow.cellText.map((cellText, columnIndex) => (
              <td
                key={copy.comparisonColumns[columnIndex]}
                className={
                  columnIndex === 0
                    ? 'bg-[#d7b46a]/[0.06] px-4 py-3'
                    : 'px-4 py-3'
                }
              >
                {cellText}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
```

`aria-labelledby` on the table can point at the `h2`. Do not duplicate the heading as visible caption text.

---

## 7. Full EN copy

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
      'Login is optional. Uploads, extra elements, and save showed upgrade cards. The free editor had ads.',
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

Readable grid:

| | This coat of arms maker | CoaMaker | Roll for Fantasy | Crest and Arms |
|---|---|---|---|---|
| Start | Open this page. The editor is already on the canvas. No login to start. | Opening the site puts you in the editor. A default shield is on the canvas, and login is optional. | The page loads the editor under the instructions. There is no separate start button. | This visit did not show a start control. The named URL did not load. |
| Edit | Shields, field patterns, charges, text, layers, and drawing tools. Local images need no paid plan. | Click or drag charges onto the canvas. Shields, text, draw, and a random coat button were free. Not an AI prompt. | Pick Shields, Crests, and Color Styles, then drag or resize. No account required. | This visit did not show an editor. |
| Export | Export PNG, JPEG, or PDF. Print and batch ZIP are in the same menu. | Logged-out Export showed PNG, JPG, and PDF, plus print and share. No SVG in that dialog. | The page says turn the canvas to an image and save from the browser. This visit did not show a download. | This visit did not show export or share controls. |
| Account | No login and no paid plan. A browser draft can be restored after a reload. | Login is optional. Uploads, extra elements, and save showed upgrade cards. The free editor had ads. | No login or paid upgrade was visible. The page had ads and asked for support. | This visit did not show a sign-in, price, or paywall. |
| Surname and official arms | This editor does not look up a surname. The Names tool invents fantasy names, not official arms. | No surname field on the maker. Their article says arms belong to people, not last names. | No surname lookup or official-family claim was visible. | This visit did not show a surname lookup or official-arms claim. |
| When to stay | Stay here to draw an original shield and export from the editor above. | Use CoaMaker for their random coat button or the galleries behind upgrade cards. | Use Roll for Fantasy for a simple shield-plus-crest compositor. Image conversion was not verified. | Do not plan a Crest and Arms job from this table. The visit did not show a live maker. |

---

## 8. Full ZH copy (same article)

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
      '不查姓氏。Names 出奇幻名，不授官方纹章。',
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

Readable grid:

| | 这个纹章制作器 | CoaMaker | Roll for Fantasy | Crest and Arms |
|---|---|---|---|---|
| 开始 | 打开本页。编辑器已在画布上，不用登录。 | 打开即进编辑器。已有默认盾，登录可选。 | 说明下直接载入编辑器，无开始按钮。 | 访问未见开始控件。指定网址打不开。 |
| 编辑 | 盾形、底纹、图形、文字、图层、绘图。本地图免费。 | 点选或拖图形。盾、文字、画笔和随机按钮免费。非 AI。 | 选 Shields、Crests、Color Styles，可拖可缩放。不用账号。 | 访问未见编辑器。 |
| 导出 | 导出 PNG、JPEG 或 PDF。可打印和批量 ZIP。 | 未登录 Export 有 PNG、JPG、PDF，可打印和分享。无 SVG。 | 页面写转成图再保存。未见下载。 | 访问未见导出或分享。 |
| 账号 | 无登录无付费。草稿重开后可恢复。 | 登录可选。上传、额外元件和保存有升级卡。有广告。 | 未见登录或付费升级。有广告请支持。 | 访问未见登录、价格或付费墙。 |
| 姓氏与官方 | 不查姓氏。Names 出奇幻名，不授官方纹章。 | 无姓氏栏。其文写纹章属人、不属姓。 | 未见姓氏查询或官方家族声明。 | 访问未见姓氏查询或官方声明。 |
| 何时留下 | 要画原创盾并导出，留在这个纹章制作器。 | 要随机按钮或升级卡图库，用 CoaMaker。 | 要盾加冠饰拼接，用 Roll for Fantasy。转图未核实。 | 勿按本表用 Crest and Arms。未见制作器。 |

Brand names, tab labels (`Shields`, `Crests`, `Color Styles`), and UI words seen in English (`Export`, `Names`, `PNG`) stay Latin in ZH because that is what the visit showed.

---

## 9. Cell evidence (not on-page)

### This page (shipped editor, not Ego-competitor)

| Row | Claim | Source |
|---|---|---|
| Start | Editor already on the page; no login | `CoatOfArmsMaker.test.tsx` “contains no account or paid-tier action”; ego verify workbench-first |
| Edit | Shields, field patterns, charges, text, layers, drawing tools | `verifiedCapabilities` |
| Edit | Local image, no paid plan | `UploadPanel` + no PRO gate in the same test |
| Export | PNG, JPEG, PDF, print, batch ZIP | `verifiedCapabilities`, FAQ, `ExportMenu` / `exportBatch` |
| Account | No login, no paid plan, restore draft | FAQ + `project-storage` draft recovery |
| Surname | No surname lookup; Names is fantasy; no official arms | `NamePanel` + `nameGeneratorTypes` (city, knight, …) |
| Stay | Draw original shield, export from editor above | Same page job as current compare row 1 |

Not claimed on-page even though true in code: silent R2 upload on Download. Privacy/FAQ stay unchanged.

### CoaMaker (`tmp/coat-maker-comp-coamaker.md`)

| Row | Claim | Note |
|---|---|---|
| Start | Root URL is the editor; default shield; login optional | §2 |
| Edit | Click and drag charges; text; draw; random coat button; not AI | §3 |
| Export | Logged-out dialog PNG/JPG/PDF, print, share; no SVG in that dialog | §5 live editor (not the stale docs line) |
| Account | Login optional; upgrade cards on upload / extra elements / save; ads | §6, §9 |
| Surname | No surname field; article says arms belong to people, not last names | §7, §8 |
| Stay | Random button / galleries behind upgrade | §3, §4 paywall cards |

### Roll for Fantasy (`tmp/coat-maker-comp-rollforfantasy.md`)

| Row | Claim | Note |
|---|---|---|
| Start | Editor loads under instructions; no start button | Start flow |
| Edit | Tabs Shields / Crests / Color Styles; drag or resize; no account | Editor type |
| Export | Page-documented turn-to-image + browser save; download not seen | Export section; Fail Fast on unverified output |
| Account | No login/paywall; ads + support ask | Account section |
| Surname | No lookup; no official-family claim; inspiration language | Surname section |
| Stay | Simple compositor; conversion unverified | Same |

Do not put the `.php` URL or the extensionless 404 on the page. Do not copy 60/130/38 inventory counts.

### Crest and Arms (`tmp/coat-maker-comp-crestandarms.md`)

Every cell is visit-unseen. Specified maker host: `ERR_CONNECTION_CLOSED` / NXDOMAIN. Parent `crestandarms.com` → GoDaddy parking lander. No editor, export, account, or surname UI.

Do not copy parking copy (`parked free`, `Get This Domain`, related-topic chips).

---

## 10. Do not copy onto the page

From the three notes, plus this draft:

- Prices (`$5.99` / `$18.99` / `$99`), Paddle, “624 extra elements”, “thousands of templates”
- CoaMaker sister products, ads chrome, STL, stale “free users have no Export”
- Roll for Fantasy inventory counts, `Turn to image` as **our** export, their license text
- GoDaddy parking lines; SERP guesses about Crest and Arms
- DR / traffic / “millions of users”
- Official grant, College of Arms, or “this page finds your family crest”
- Extra competitors
- Cloud / R2 upload (not a user-facing account)

---

## 11. Tests the implementer must change

- `coat-maker-seo-copy.ts`: replace `comparisonItems` asserts with columns/rows/cellText.
- `CoatMakerSeoContent.tsx`: table markup; delete `renderComparisonItems`.
- `CoatMakerSeoContent.test.tsx`: collector `th, td`; drop 3-card assertions; keep 4 use-case images and 3 FAQ.
- Do not touch metadata title/description, FAQ strings, or use-case `imageSrc` / `imageAlt`.

---

## 12. Out of scope

- Product file edits (this task is draft only)
- Metadata / H1 / intro
- FAQ
- Use-case images
- Schema
- Commit
