# CoaMaker CDP acceptance checklist

Status: **in progress — not a substitute for the final browser acceptance run.**

## Evidence captured

| Check | Reference | Local editor | Result |
| --- | --- | --- | --- |
| Desktop DOM at 1440px | `Position, Shields, Custom, Charges, Top, Colors, Tools, How-to, Settings, Flags, Tokens` | Follow-up CDP recorded the identical 11 IDs and labels: `coat-tab-position` through `coat-tab-tokens`, in the same order. | Pass for the tool-order contract. |
| Desktop structure | 71px header and an editor main surface | Local has a single left tool rail, central canvas, and no right inspector | Structural intent confirmed; visual screenshot output was unavailable. |
| Mobile local overflow at 375×812 | Reference mobile navigation could not be captured reliably | `scrollWidth=375`, `clientWidth=375` | Pass for local no-horizontal-overflow; mobile ordering remains covered by its dedicated component contract. |
| Local network on reload | Not applicable | Initial run requested AdSense/DoubleClick; route was moved behind an analytics-free root layout. Re-run recorded no reference, AdSense, DoubleClick, Clarity, or Tag Manager URL. | Pass after route-boundary fix. |
| Reference interactions | Reading the reference DOM has succeeded in an earlier desktop run | A fresh reference read on 2026-07-29 again reset the Browser runtime before the post-load DOM could be read. | Unverified; exact runtime error was `js execution timed out; kernel reset, rerun your request`. |
| Local interactions | DOM testing is covered by focused component/integration suites, including mobile drawer open/close, tab order, panel mapping, and Escape focus restore. | At 375px the local `Tools` drawer trigger exists with `aria-expanded="false"`; the current CDP session did not reflect either native pointer dispatch or a DOM click in its subsequent DOM state. | Browser proof pending; do not infer an app interaction failure from this CDP-session limitation. |

## Raw browser observations

- Reference desktop DOM reported a 1440×900 viewport on the successful comparison run and the tool order shown above.
- Local mobile CDP after the route-boundary fix reported `{ viewport: [375, 812], scroll: [375, 812], overflow: true, adsenseScript: false }`.
- Local reload recorded 24 development requests; none contained `coamaker.com`, AdSense, DoubleClick, Clarity, or Tag Manager hosts.
- At 375px the local mobile drawer trigger reported `{ label: "Tools", expanded: "false", x: 187.5, y: 783, width: 375, height: 58 }`; its drawer tabs are intentionally absent before opening.
- The current browser session did not update the drawer after CDP pointer dispatch or `button.click()`. The component test exercises the same open, tab-switch, Escape-dismiss, and focus-restoration paths successfully, so this is retained as a browser-evidence limitation rather than an inferred UI defect.
- Browser screenshot calls returned an all-black image despite a populated DOM snapshot, so no screenshot is accepted as visual evidence.

## Static gate after final reference-order correction

- `pnpm lint`: pass.
- `pnpm test`: pass.
- focused Task 7 suite: 9 files / 170 tests pass.
- `pnpm build`: pass, generating 104 static pages including both maker routes.
- `git diff --check`: pass.
- `pnpm exec tsc --noEmit`: fails in the unchanged `src/components/site/home-showcase-shared.test.ts` at lines 57–59. The Coat Maker field test diagnostic was corrected; this remaining test-only issue is outside the editor scope.

## Required final pass

1. Re-run 1440px and 375px DOM/network checks after the current reference-order correction.
2. Exercise gallery selection, transform/group/undo/redo, local save/reload, import failure atomicity, PNG and PDF actions in a stable browser session.
3. Record all failures rather than inferring parity from unit tests.
