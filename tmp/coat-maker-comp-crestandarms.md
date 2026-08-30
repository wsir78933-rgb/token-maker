# Coat maker competitor note — Crest and Arms

Read-only Ego research. Task space: `coat-maker-comp-crestandarms` (id 214).
No product files edited. No commit. No other first-party tools opened. No extra competitor brands opened.

Method: public ego-browser helpers only (`useOrCreateTaskSpace`, `openOrReuseTab`, `waitForLoad`, `wait`, `pageInfo`, `js`, `snapshotText`, `captureScreenshot`). Open order below. Brand name Crest and Arms is used only in this research note.

## Open order

1. `http://localhost:3001/coat-of-arms-maker` — loaded.
2. `https://coat-of-arms-maker.crestandarms.com` — Fail Fast, did not load.
3. After coordinator option B: `https://crestandarms.com` only — redirected to a GoDaddy parking lander. No same-brand coat of arms / family crest maker page found.

## 1. Our page — comparison block headings only

Visited: `http://localhost:3001/coat-of-arms-maker`  
Document title: `Free Family Crest and Coat of Arms Maker`  
`pageInfo` after load: `url=http://localhost:3001/coat-of-arms-maker`, viewport `1512x738`, page height `4824`. Body text was present (not empty, no captcha).

Comparison block H2:

- `When to stay on this coat of arms maker`

Comparison block H3s, in page order:

- `This browser coat of arms maker`
- `General design software`
- `Genealogy and surname lookup`

No other comparison headings. Card body copy is not restated here.

## 2. Specified Crest and Arms URL — Fail Fast

Opened: `https://coat-of-arms-maker.crestandarms.com`

| Check | Result |
|---|---|
| Final browser URL | `chrome-error://chromewebdata/` |
| Document title | `coat-of-arms-maker.crestandarms.com` |
| Visible text (exact) | `无法访问此网站` / `coat-of-arms-maker.crestandarms.com 意外终止了连接。` / `请试试以下办法：` / `检查网络连接` / `检查代理服务器和防火墙` / `ERR_CONNECTION_CLOSED` / `重新加载` / `详情` |
| Local DNS | `NXDOMAIN` from `192.168.18.1` (`nslookup coat-of-arms-maker.crestandarms.com`) |
| HTTPS curl | Proxy `CONNECT` 200, then `LibreSSL SSL_connect: SSL_ERROR_SYSCALL`, exit 35 |
| HTTP curl via proxy | `502 Bad Gateway` |
| Screenshot | `tmp/ego-crestandarms-error.png` |

Reload produced the same error page. The host does not exist in local DNS. No maker UI was visible.

## 3. Same-brand fallback — `https://crestandarms.com`

Coordinator: open this host only; locate a coat of arms / family crest maker page; if none, Fail Fast and mark cells `visit-unseen`.

| Check | Result |
|---|---|
| Requested URL | `https://crestandarms.com` |
| Final URL | `https://crestandarms.com/lander` |
| First paint (~3s) | Empty `document.title` and empty `body.innerText` (Fail Fast fired on that pass) |
| After 8s wait | GoDaddy parking page rendered. `readyState=complete`. Title still empty. |
| Visible text (exact, after wait) | `crestandarms.com` / `is parked free, courtesy of GoDaddy.com.` / `Get This Domain` / `Related Search Topics` / `Family Crest And Arms` / `Del Real Crest And Arms` / `Photo Of The Avery British Crest And Arms` / `Sainato Crest And Arms` / `Real Estate` / `Apartment For Rent` / `Copyright © 1999-2026 GoDaddy, LLC. All rights reserved.` / `Privacy Policy` / GoDaddy disclaimer about third-party advertisers |
| Same-host maker link | None. No editor, no start CTA, no export, no account wall. |
| First-party nav | None. |
| Screenshot | `tmp/ego-crestandarms-lander.png` |

Not opened (off-brand / parking ads):

- `Get This Domain` → `godaddy.com` domain search
- Related Search Topics → `search-domainparking.com` landers
- Trustpilot iframe for GoDaddy

Parent DNS (lookup only, not a page visit): `crestandarms.com` has A records `3.33.130.190` and `15.197.148.33`; `www.crestandarms.com` is a CNAME to `crestandarms.com`.

## 4. Crest and Arms product fields

No live Crest and Arms maker was visible. Cells below are `visit-unseen`. Do not treat SERP hints, parking-topic labels, or memory as product facts.

| Field | Value | Evidence |
|---|---|---|
| Start flow | `visit-unseen` | Specified subdomain never loaded. Parent lander has no start control. |
| Editor type (including drag-drop) | `visit-unseen` | No editor on either loaded page. SERP was not opened. |
| Export / share | `visit-unseen` | No export or share control visible. |
| Account or paywall | `visit-unseen` | No sign-in, price, or paywall UI visible. |
| Surname lookup | `visit-unseen` | No surname search on the lander. Related-topic chips are parking ads, not a first-party lookup. |
| Official arms claims | `visit-unseen` | No official-arms, grant, or registry claim on the pages that loaded. |
| Free vs paid | `visit-unseen` | No price or “free” product claim from Crest and Arms. “parked free, courtesy of GoDaddy.com” is a parking line, not a maker plan. |
| Claims we must not copy | See below | Only parking copy was visible. |

## 5. Claims we must not copy

- Do not invent Crest and Arms start flow, drag-and-drop editor, export formats, account, paywall, surname lookup, or official-arms language. Those were not seen.
- Do not copy GoDaddy parking copy (`is parked free, courtesy of GoDaddy.com`, `Get This Domain`, Related Search Topics, Trustpilot score) into on-page copy.
- Do not treat Related Search Topics (`Family Crest And Arms`, surname-like chips) as proof that Crest and Arms still runs a surname lookup or maker.
- Do not put DR, traffic, or other off-page metrics in recommended on-page copy. None were collected.
- Do not name Crest and Arms on our comparison headings. Our live headings already split this browser maker / general design software / genealogy and surname lookup without a competitor brand.

## 6. Recommended on-page copy from this visit

None. This visit did not produce a live competitor product page to borrow or contrast against. Keep using the existing comparison headings listed in section 1. Do not add Crest and Arms, drag-drop, or official-arms claims from this note.

## 7. Not opened

- Token Maker, Dice Roller, blog, contact, or other first-party tools
- Other competitor sites
- Google SERP
- `godaddy.com` and `search-domainparking.com` links on the lander
- `www.crestandarms.com` as a separate browse (same parking host via CNAME; lander already seen)

## 8. Ego close

Space `coat-maker-comp-crestandarms` (id 214) is closed after this note (`completeTaskSpace`, `keep: false`).
