# Coat Maker FAQ native details — ego-browser verify

Task: `task_41eaf743bf32`  
Dispatch: `ctx_17c71160b336`  
Space: `coat-maker-faq-native-verify` (id 239)

Read-only on product source. No commit. No extra Next server.

## Overall: **PASS**

PASS requires EN FAQ 0 to visibly open. It does.

| Check | Result |
|---|---|
| EN desktop 1280: click `#coat-maker-faq-trigger-en-0` opens native `<details>` and shows the answer | **PASS** |
| EN: click FAQ 1 closes FAQ 0 (exclusive `name="coat-maker-faq"`) | **PASS** |
| ZH desktop 1280: click `#coat-maker-faq-trigger-zh-0` opens | **PASS** |

## Server

Live app is `http://127.0.0.1:3000` (HTTP 200 EN and ZH). Opened only:

- `http://127.0.0.1:3000/coat-of-arms-maker`
- `http://127.0.0.1:3000/zh/coat-of-arms-maker`

SSR HTML already contains `<details name="coat-maker-faq"><summary id="coat-maker-faq-trigger-en-0">`.

Viewport: CDP `Emulation.setDeviceMetricsOverride` 1280×800, `deviceScaleFactor: 1`. Screenshots are `Page.captureScreenshot` `fromSurface: true`, no clip.

## EN desktop 1280

`scrollToBottomUntil` brought FAQ 0 into view (`triggerTop=287`, `scrollY=4221`). `elementFromPoint` hit the inner `H3` of that summary (`Is this coat of arms maker free to use?`). One ego `click('#coat-maker-faq-trigger-en-0')`:

- `details.open` `[true, false, false, false, false]`
- Answer text: `Yes. You can create and export a design in the browser without a paid plan.`
- Chevron in the shot is up on Q1; Q2–Q5 stay collapsed

Shot after that open: `tmp/ego-faq-open-en-desktop.png`

Second click on `#coat-maker-faq-trigger-en-1`:

- `details.open` `[false, true, false, false, false]`
- Answer text: `Yes. If the browser still has a recent draft, you can restore it when you reopen the maker. Export an image when you want a finished copy.`

Exclusive `name` group works.

## ZH desktop 1280

One click on `#coat-maker-faq-trigger-zh-0` after it was in view (`triggerTop=376`):

- `details.open` `[true, false, false, false, false]`
- Answer text: `可以。你可以直接在浏览器中创建和导出设计，不需要付费方案。`

Shot: `tmp/ego-faq-open-zh-desktop.png`

## Notes

- First script click happened while FAQ 0 was still at `top=4508` (not in the 800px viewport). That miss is harness scroll, not a product fail. After a real in-viewport click, native `<details>` opened without a click-method retry loop.
- `scrollIntoView` on this page did not move `window.scrollY`; `scrollToBottomUntil` did.
- Closed answers have empty `innerText`; open answers appear in the panel. Markup is native `<details>/<summary>`, not Base UI.

## Not done

No source edits. No commit. Product source was not changed.
