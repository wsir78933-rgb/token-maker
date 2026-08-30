# Coat maker square use-case + FAQ — ego-browser verify

Task: `task_3f4b44aa063d`  
Dispatch: `ctx_c1fdcd4e0569`  
Space: `coat-maker-square-faq-verify` (id 233)

Read-only on product source. No commit. No duplicate Next server started.

## Overall: **FAIL**

| Check | Result |
|---|---|
| (a) All four use-case images complete square artwork, no vertical crop | **PASS** (EN+ZH, desktop 1280 and mobile 390) |
| (b) FAQ expands/collapses as specified | **FAIL** (EN desktop 1280; ZH desktop 1280 also no-ops) |

PASS requires both. FAQ fails, so the task result is FAIL.

## Server

- Requested `:3001`. `127.0.0.1:3001` does not serve this app (`[::1]:3001` is Vite for `AI image editor`, coat-maker 404).
- Live `token-maker-app` `next-server` is **http://127.0.0.1:3000** (PID 50530, cwd this repo). EN and ZH both HTTP 200.
- Opened only:
  - `http://127.0.0.1:3000/coat-of-arms-maker`
  - `http://127.0.0.1:3000/zh/coat-of-arms-maker`

Viewport: `Emulation.setDeviceMetricsOverride` desktop 1280×800, mobile 390×844, `deviceScaleFactor: 1`.

CDP `Page.captureScreenshot` **with `clip`** returned uniform black frames (ignore `tmp/ego-usecase-square-en-desktop-0.png` … `-3.png`, 2077 bytes). Canonical shots are **no-clip** `fromSurface: true` viewport captures.

## (a) Use-case images — PASS

All four WebPs are 1254×1254. Live `<img>` is `aspect-ratio: 1 / 1`, `object-fit: cover`. Displayed size: desktop **492×492**, mobile **308×308**. `complete` and `naturalWidth` 1254 on every card.

Visual (head / ring / banner point / antlers + shield feet not clipped):

| Locale | Width | Cards | Shot |
|---|---|---|---|
| EN | 1280 | griffin + fleur (complete square) | `tmp/ego-usecase-square-en-desktop-row1.png` |
| EN | 1280 | dragon + deer (complete square) | `tmp/ego-usecase-square-en-desktop-row2.png` |
| EN | 390 | 0 griffin | `tmp/ego-usecase-square-en-mobile-0.png` |
| EN | 390 | 1 fleur | `tmp/ego-usecase-square-en-mobile-1.png` |
| EN | 390 | 2 dragon | `tmp/ego-usecase-square-en-mobile-2.png` |
| EN | 390 | 3 deer | `tmp/ego-usecase-square-en-mobile-3.png` |
| ZH | 1280 | griffin + fleur | `tmp/ego-usecase-square-zh-desktop-row1.png` |
| ZH | 1280 | dragon + deer | `tmp/ego-usecase-square-zh-desktop-row2.png` |
| ZH | 390 | 0–3 | `tmp/ego-usecase-square-zh-mobile-0.png` … `-3.png` |

Compared with the previous 16:9 crop (`tmp/ego-layout-en-desktop-usecase.png`), these now show the griffin crest and shield point, full fleur ring, dragon banner point, and deer antlers/hooves.

## (b) FAQ accordion — FAIL

**FAIL locale+width:** `en` desktop **1280**. Also confirmed `zh` desktop **1280**.

Required sequence on EN desktop:

1. Click first trigger → `aria-expanded` must become `true` and the answer must be visible.
2. Click second → first closes, second opens.
3. Click second again → second closes.

Actual: after a real ego `click` on `[aria-controls="coat-maker-faq-panel-en-0"]`, `elementFromPoint` hit the first trigger (`Is this coat of arms maker free to use?`), then:

- `aria-expanded` stayed `"false"`
- `data-index` stayed `"-1"`
- panel `hidden`, `display:none`, height 0
- answer text is in the DOM (`keepMounted`) but never shown

Same after native `el.click()`, coordinate click `[640,400]`, focused Enter, and Space.

ZH: click first trigger (`纹章制作器可以免费使用吗？`) — same, still collapsed.

Accordion dump: Root `data-slot="accordion"` `role="region"`; each Item `data-index="-1"` `data-closed=""`. Assigned trigger ids `coat-maker-faq-trigger-en-*` are overwritten by Base UI ids (`base-ui-_R_…`).

Shots (all collapsed):

- `tmp/ego-faq-open-en-desktop-1.png` — after first click
- `tmp/ego-faq-open-en-desktop-2.png` — after second click (hover gold on Q2, still closed)
- `tmp/ego-faq-open-en-desktop-closed.png` — after second click again
- `tmp/ego-faq-open-zh-desktop-1.png` — after ZH first click

State JSON: `tmp/ego-faq-en-desktop-state.json`, `tmp/ego-faq-zh-desktop-state.json`.

This matches the earlier live-page composite-list miss (`data-index="-1"`). The client-island move is on the page (FAQ renders, Base UI ids present) but items still do not register, so the accordion does not open. Unit tests in jsdom are not this failure.

## Not done

No source edits. No commit. FAQ still broken on the live page; a follow-up fix is out of this verify task.
