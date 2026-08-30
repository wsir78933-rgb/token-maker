# Roll for Fantasy coat-of-arms creator research

Date checked: 2026-08-30  
Method: read-only Ego Browser inspection in task space `coat-maker-comp-rollforfantasy`. No product files, accounts, payments, or external records were changed.

## Local comparison block headings

Only these headings were recorded from `http://localhost:3001/coat-of-arms-maker`:

- `When to stay on this coat of arms maker`
  - `This browser coat of arms maker`
  - `General design software`
  - `Genealogy and surname lookup`

## URL status

- Requested URL: `https://rollforfantasy.com/tools/coat-of-arms-creator`
- Observed result: redirected to `https://rollforfantasy.com/404.php`.
- Visible failure text: `Eek! Page not found!` and a notice that the requested page could not be found.
- Current same-tool URL found in that page's own navigation and then inspected: `https://rollforfantasy.com/tools/coat-of-arms-creator.php`
- Current page title: `Coat of arms generator.`

## Roll for Fantasy record

### Start flow and editor type

- There is no separate `Start`, `Begin`, or `Get started` control. The page loads the editor inline beneath its instructions.
- The editor is a browser-based raster/canvas compositor. Its visible top-level tabs are `Shields`, `Crests`, and `Color Styles`.
- The rendered canvas is 248 x 275 pixels in the inspected desktop session.
- The page also exposes controls for adding more crest pieces, dragging, resizing, clearing the main or selected item, and entering a custom-image value.
- Selecting a shield, crest, and color style changed the previously blank canvas into a rendered composition after the image assets loaded. No account was required to reach or operate these controls.

### Shield picker

- Page claim: 60 shields.
- Current selectable tile count: 60, matching the claim.
- Categories: `Bullet-bottom`, `Pointy-bottom`, and `Round-bottom`, with 20 tiles in each category.

### Crest picker

- Page claim: 130 crests.
- Current selectable tile count: 135, not 130.
- Categories and current tile counts:
  - `Animals`: 30
  - `Weapons`: 27
  - `Icons`: 40
  - `Icons 2`: 38
- Copy should not present 130 as a verified current inventory count without resolving this visible 130-versus-135 discrepancy.

### Color pickers

- Page claim: 38 color schemes.
- Current selectable tile count: 38, matching the claim.
- Categories and counts: `Diagonal` 12, `Vertical` 13, `Horizontal` 13.
- Two native color inputs provide background color 1 and background color 2. Their initial inspected values were black (`#000000`) and white (`#ffffff`).

### Export and local persistence

- The documented image path is `Turn to image`, followed by right-clicking the generated image and using the browser's save action.
- The page recommends a partial-screen screenshot when image conversion does not work in a browser.
- `Save local` is described as downloading the coat-of-arms state as a text file; `Load file` and a file input restore that state later.
- Live verification limit: after activating `Turn to image` on the rendered composition and waiting, no visible generated image or download link appeared in the inspected page. Treat the export flow as page-documented, not as successfully verified in this run.

### Account, paywall, and free-versus-paid position

- No login, account, registration, subscription, pricing, upgrade, checkout, payment, or paywall control was visible in the inspected tool content.
- The editor loaded and accepted selections without sign-in or payment.
- No paid tier or price was shown on the page. The page contains advertising and asks visitors to support the site, but it does not sell an upgrade in the inspected flow.
- Access without payment is not the same as unrestricted usage rights. The page permits non-commercial project use subject to exclusions and requires the owner's permission for commercial use. It specifically protects use in another coat-of-arms creator or similar work built from its individual images.

### Surname lookup and official-arms claims

- No surname, family-name, genealogy, or ancestry lookup was visible or described in the tool content.
- No claim of official, registered, authentic, historical, or real-family arms was visible in the tool content.
- The page describes the tool as a source of inspiration. It should not be represented as an authority that retrieves or validates inherited family arms.

## Claims and language not to copy into our on-page comparison

- Do not reuse Roll for Fantasy's exact inventory or scale claims: 60 shields, 130 crests, 38 schemes, thousands of combinations, or millions of colors. The crest count is internally inconsistent, and our inventory must be described from our own verified product state.
- Do not copy its `Turn to image` and right-click export wording as though it describes our export flow.
- Do not copy its local text-file save/load claim unless our own implementation and formats are named from verified behavior.
- Do not copy its commercial/non-commercial permission language. Our usage rights must come from our own terms and asset licenses.
- Do not imply that either product performs surname lookup or supplies official family arms; Roll for Fantasy's inspected page does neither.
- Do not reuse its phrasing, imagery, picker category presentation, or unlimited-crest claim as our own.
- Do not include DR, traffic estimates, or other off-page metrics in recommended on-page copy.

## Evidence boundaries

- Only the local comparison headings and the Roll for Fantasy target were researched.
- No other first-party creator was opened intentionally.
- The original extensionless URL is a confirmed 404; the `.php` URL is the current official page found through Roll for Fantasy's own navigation.
- Export output itself remains unverified because the documented action produced no visible result in this session.
