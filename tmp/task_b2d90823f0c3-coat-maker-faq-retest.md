# Coat maker FAQ retest (no Base UI) — ego-browser

Task: `task_b2d90823f0c3`  
Dispatch: `ctx_b40f25cc187e`  
Space: `coat-maker-faq-no-baseui-retest` (id 235)

Read-only on product source. No commit. No extra Next server.

## Overall: **FAIL**

PASS requires the FAQ to actually open in the browser. It does not.

| Check | Result |
|---|---|
| EN desktop 1280: click FAQ 0 opens (`aria-expanded=true`, panel not hidden, answer visible, id `coat-maker-faq-trigger-en-0`) | **FAIL** |
| EN: click FAQ 1 closes 0 and opens 1 | **FAIL** (neither opens) |
| EN: click FAQ 1 again closes 1 | **FAIL** (never opened) |
| ZH desktop: click one FAQ opens | **FAIL** |
| Use-case card still full square artwork | **PASS** |

## Server

Live `token-maker-app` is `http://127.0.0.1:3000` (PID 50530). `:3001` is a different app.

Opened only:

- `http://127.0.0.1:3000/coat-of-arms-maker`
- `http://127.0.0.1:3000/zh/coat-of-arms-maker`

Viewport: `Emulation.setDeviceMetricsOverride` 1280×800, `deviceScaleFactor: 1`. Screenshots are CDP `Page.captureScreenshot` `fromSurface: true` with no clip.

## What changed vs the last fail

Trigger ids are no longer `base-ui-*`. Live ids match the rewrite:

- `coat-maker-faq-trigger-en-0` … `en-4`
- `coat-maker-faq-trigger-zh-0` … `zh-4`

The HTML is the new `<button type="button" onClick={onToggle}>` accordion. The compiled chunk still contains `onClick: onToggle` / `nextOpenFaqIndex`. Base UI is gone from this FAQ.

## EN desktop 1280 — FAQ does not open

In-viewport click on FAQ 0:

- `elementFromPoint` hit `coat-maker-faq-trigger-en-0`
- pointerdown + click capture/bubble all fired on that button (`defaultPrevented=false`)
- After click: `aria-expanded="false"`, panel `hidden`, `display:none`, height `0`

Same after ego `click('#id')`, coordinate click `[640, cy]`, native `HTMLElement.click()`, and CDP `Input.dispatchMouseEvent`. Clicking FAQ 1 in viewport also left every item collapsed.

Post-click screenshot (collapsed, Q0 hover gold): `tmp/ego-faq-open-en-desktop.png`  
State dump: `tmp/ego-faq-en-desktop-state.json`

Workbench `.coat-workbench-content` stayed `inert` for the whole session (SSR recovery-pending). FAQ is outside that subtree, so inert does not explain the FAQ miss. Click events reach the FAQ button; React does not toggle `openFaqIndex`.

## ZH desktop — FAQ does not open

Scrolled with ego `scrollToBottomUntil` until `#coat-maker-faq-trigger-zh-0` was in view (`top=396`, hitId matches). Clicked it.

After click: `aria-expanded="false"`, panel hidden, height 0.

Screenshot (collapsed, Q0 hover gold): `tmp/ego-faq-open-zh-desktop.png`  
State dump: `tmp/ego-faq-zh-desktop-state.json`

## Use-case square — PASS (spot-check)

First EN desktop card `Tabletop houses and factions`:

- file 1254×1254
- live `<img>` `aspect-ratio: 1 / 1`, `object-fit: cover`, displayed **492×492**, `complete`
- viewport shot shows full griffin + shield point + corner ornaments, not a 16:9 crop

Shot: `tmp/ego-usecase-square-en-desktop-spotcheck.png`

## Not done

FAQ still does not open in the live browser. Product source was not edited. A fix + re-verify is left for an implementation worker.
