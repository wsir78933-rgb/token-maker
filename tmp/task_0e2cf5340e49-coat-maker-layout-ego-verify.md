# Coat-maker SEO layout — ego-browser visual verify

Task: `task_0e2cf5340e49`  
Dispatch: `ctx_ebbd77caf2cd`  
Space: `coat-maker-seo-layout-verify` (id 228)

No product source edited. No commit.

## Server

- Requested `localhost:3000`. Port 3000 is a **stopped** `next-server` from `stardew planner` (PID 2187, state T) and does not respond.
- Reused this repo’s live `pnpm dev` / `next-server` on **http://127.0.0.1:3001** (PID 31473, cwd `token-maker-app`).
- Opened only:
  - `http://127.0.0.1:3001/coat-of-arms-maker`
  - `http://127.0.0.1:3001/zh/coat-of-arms-maker`

Viewport: desktop `Emulation.setDeviceMetricsOverride` 1280×800; mobile 390×844. Full-page PNGs are CDP `Page.captureScreenshot` + `captureBeyondViewport` (ego helper screenshots after scroll were previously black). Content width is 1265px at desktop because of the scrollbar gutter.

## Required full-page shots

| Locale | Width | Path | Pixels |
|---|---|---|---|
| EN | desktop ~1280 | `tmp/ego-layout-en-desktop.png` | 1265×4933 |
| EN | mobile ~390 | `tmp/ego-layout-en-mobile.png` | 390×7886 |
| ZH | desktop ~1280 | `tmp/ego-layout-zh-desktop.png` | 1265×4364 |
| ZH | mobile ~390 | `tmp/ego-layout-zh-mobile.png` | 390×6604 |

## Overall: **PASS** (layout/visual)

No overflow, no clipped SEO text, no broken use-case images, no misaligned gold hero on desktop. One extra functional issue (FAQ does not expand) is listed below; it is not a layout/spacing defect.

## Per-section visual verdict

### Rhythm / hierarchy (H1 down) — **OK** (EN+ZH, both widths)

Workbench is first (100vh editor). SEO starts below. H1 is the largest display line (EN 48px / ZH one-line 48px), then a short lead, then H2s at 30px with even section gaps. Mobile H1 wraps cleanly (`Free Family Crest and / Coat of Arms Maker`; `免费家族纹章 / 与纹章制作器`). No horizontal overflow (`doc.scrollWidth` equals viewport).

### Use-case cards — **OK**

Four cards, all four WebPs loaded (`complete`, `naturalWidth` 1254, displayed ~16:9). Desktop 2×2; mobile single column. Image radius + gap look even; body text not cut off.

Hover (EN desktop, CDP `mouseMoved` on the first `article`): gold border applied (`border-color` → `#d7b46a` at 40%). CSS also has `hover:-translate-y-0.5`; computed `transform` stayed `none` in this session (lift not visible). A small “X” chip on the first card image is an **ego-browser hover overlay**, not page UI — other cards do not have it when not hovered.

### Steps + capabilities — **OK**

Numbered gold badges (`::before` counter, gold ring + gold numeral). Body copy readable. Capability chips have a gold left bar, padded, not overflowing. Same on ZH (`三步完成纹章设计` / `完成设计所需的工具`).

### Comparison table desktop — **OK**

Single `<table>`, 4 columns: row label + **Our maker** + CoaMaker + Roll for Fantasy.

- Gold hero is the **first product column** (“Our coat of arms maker” / “我们的纹章制作器”), not the row-label column. Header `background rgba(215,180,106,0.14)`, text `rgb(241,212,146)`, 1px gold left/right border, ~32% width (348px vs 282px competitors).
- Competitor headers/cells muted (`rgb(168,162,158)`, no gold wash).
- Cells `padding: 16px 18.4px`, `vertical-align: top`. No table overflow.

### Comparison table mobile — **OK** (with one nuance)

At 390px: `table { display:block }`, `thead { display:none }`, rows stack. Every product `td` shows its column name via `td::before { content: attr(data-label) }`. No overflow (`table.overflow=false`, `overflowX=false`). Winner cells keep the gold wash; competitor **body** text stays muted.

Nuance (not a fail): stacked `::before` labels for **all three** products use the same gold `rgb(215,180,106)`. Winner vs competitor is the cell wash + body color, not the label color. Still readable; nothing clipped.

### CTA / FAQ / related spacing — **OK** (visual)

Desktop CTA is a gold-tinted panel: copy left, gold outline button right (`Start creating` / `开始制作纹章`). Mobile stacks the button full-width under the copy. FAQ list has even 14px/48px rows and chevrons; related chips wrap on mobile with no overflow. Footer below is site chrome, not the SEO block.

## Extra finding (functional, not a layout fail)

**FAQ accordion does not expand** on the live page (EN desktop probed; markup is the same component on ZH/mobile).

Evidence:

- All 5 triggers have `data-index="-1"` and items have `data-closed=""`.
- Native `.click()`, CDP `mousePressed`/`mouseReleased` on the button center (`elementFromPoint` hit the trigger), and focused Enter/Space all left `aria-expanded="false"` and the panel `display:none`.
- Answer text exists in the DOM (`coat-maker-faq-panel-en-0`) but never becomes visible.

Collapsed FAQ **spacing/chevrons look correct**. This is an interaction bug, not an overflow/clip issue. Out of the original “visual only” bar, but confirmed while exercising the block.

## Supporting clips (not required)

`tmp/ego-layout-en-desktop-{h1,usecase,compare,steps,tools,cta-full,hover3,faq,related}.png`  
`tmp/ego-layout-en-mobile-{usecase,compare,cta-full,faq,related}.png`  
`tmp/ego-layout-zh-desktop-{usecase,compare,steps,tools,cta-full,faq,related}.png`  
`tmp/ego-layout-zh-mobile-{usecase,compare,cta-full,faq,related}.png`
