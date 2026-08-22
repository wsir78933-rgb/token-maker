# T6 diagnosis evidence

Verdict: **c) automation origin / unhydrated SSR**, not T4 hover regression. Do not fix.

## What T5 saw
- ego-browser opened `http://127.0.0.1:3000/coat-of-arms-maker`
- Next.js 16 blocked `/_next/static/chunks/*` from origin `127.0.0.1` (`allowedDevOrigins`)
- Page stayed as SSR HTML: `.coat-workbench-content[inert]` true, React handlers missing
- Charges `aria-selected` stayed false; even `element.click()` did nothing

## Contrast on `http://localhost:3000/coat-of-arms-maker`
- `inert` false after load
- snapshot-ref click on Charges: `aria-selected=true`, `aria-expanded=true`, search placeholder `Search charges`
- Screenshot: `tmp/t6-charges-open.png`

## Supporters path (Top → Supporters, not Charges)
- 19 cards including Paired Dragons
- After click, canvas SVG contains `href="/coat-assets/materials/supporters/paired-dragons.webp"`

## T4
- T4 only touched gallery hover caption CSS/markup
- Did not touch tool rail, `inert`, or Next origin config
