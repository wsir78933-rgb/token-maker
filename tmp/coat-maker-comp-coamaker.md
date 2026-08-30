# Coat Maker competitor note: CoaMaker

**Task space:** `coat-maker-comp-coamaker` (Ego id 213)  
**Date:** 2026-08-30  
**Method:** local ego-browser, logged-out session, public helpers only  
**Order opened:** (1) `http://localhost:3001/coat-of-arms-maker` then (2) `https://coamaker.com` and CoaMaker-owned pages linked from that site  
**Not opened:** Token Maker, Dice Roller, Flag Creator, Heroic Token, or any other first-party/sister product  
**Traffic / DR:** not collected and must not be used in on-page copy

This note records visible facts. It does not redesign our comparison block.

---

## 1. Our comparison block headings (localhost:3001)

**URL:** `http://localhost:3001/coat-of-arms-maker`  
**Document title:** `Free Family Crest and Coat of Arms Maker`  
**Viewport:** `1512 × 738` CSS px, page height ~4824

H2:

- When to stay on this coat of arms maker

Lead (visible):

- This page draws an original shield in the browser. General drawing apps start from a blank canvas, and a family-history search finds a record instead of a file from this editor, so pick the row that matches the job you came to finish.

H3 rows, in this order:

1. This browser coat of arms maker
2. General design software
3. Genealogy and surname lookup

Do not redesign these headings. Named brand CoaMaker is allowed in this research note only; it is not in the live comparison headings.

---

## 2. CoaMaker start flow

**URL that loads the editor:** `https://coamaker.com/` (canonical `https://coamaker.com/`)  
**Document title:** `CoaMaker - Free Coat of Arms Generator and Family Crest Maker`  
**Meta description:** `Be a heraldry designer and family crest maker. Create and draw heraldic shields, coats of arms, sigils, and banners. Use our free random coat of arms generator.`  
**Viewport while on the editor:** `1496 × 767` CSS px

Start:

- There is no separate marketing landing before the tool. Opening the root URL puts you in the editor.
- Header chrome (logged out): CoaMaker logo, User Artwork, Help Center, Changelog, Login, Go Pro.
- A default shield is already on the canvas. Zoom control showed `51 %`.
- No signup wall to start drawing. Login is optional (header + modal in the DOM).
- How-to rail title for first-time use: `Getting Started in less than 4 minutes` (EN / DE, “Use YouTube subtitles for other languages.”).
- Tools → Random copy: `Click on the button to generate random coats of arms. Edit the designs until they fit your needs.` Button label: `Create Random Coat of Arms`.

Ads were present on the editor (Google ad iframes plus a “Discover more” slot: “Stream History Documentaries”, “Commission Custom Prints”). Recaptcha iframe existed at `0×0` and did not block the page.

---

## 3. Editor type (what we could see)

Not an AI generator. No visible prompt / AI / magic-generate control.

Observed interaction:

| Mode | Evidence on the live editor |
|---|---|
| Click-pick | Charge thumbnails have `onclick`. Clicking Animal → Ape produced canvas selection chrome (`Duplicate`, `Align`, `Order`, `Delete`, `Lock`, `Hide`). Tools → Text: `Click to add or drag onto the canvas.` |
| Drag-drop | Charge gallery images are `draggable=true`. Text tools repeat “click or drag”. |
| Random generate | Tools → Random → `Create Random Coat of Arms`. This is a random coat generator, not an LLM prompt. |
| Name generate | Tools → Names is a **fantasy name generator** (City, Cult, Demon, Dragon, Dwarf, Elven, Fantasy Kingdom, Gods, Knight, Orc, Pirate Ship, Realm, Roman Province, Tavern). EN/DE. Not a surname-to-arms lookup. |

Canvas is a fabric-style pair (`canvas.lower-canvas` + `canvas.upper-canvas` inside `.coa-canvas-scroll` / `.canvas-container`). Multi-Select is on the canvas toolbar.

---

## 4. Shield and charge controls

Left rail, top to bottom:

1. **Position** — sub: Arrange, Layers. Panel: Order (Forward / Backward / To front / To back), Align (Left / Center / Right / Top / Middle / Bottom), Position X/Y, Size Width/Height, Rotation, Opacity.
2. **Shields** — nested: Shield, Heater, French, Banner, Round, Lozenge. Search: `Search Shields`. Thumbnail grid of shield cuts.
3. **Custom** — “Click on an escutcheon to edit it.” `Add Escutcheon`. Division of the Field, Overall (on top), Charges / Add Charge, Chevron Geometry, Chief / Base, Variation of the Field, Rows / Columns / Symbol Size / Rotation, Colors (Background / Charge), Line Width, Show Border. **Paywall card:** heading `Custom Shield Uploads`, body `Upload your own shield outline with PRO.`, button `Upgrade Now`.
4. **Charges** — nested: Animal, Object, Plant, Human, Symbol, Upload. Search: `Search Charges` (present on Animal; absent on Upload). Animal gallery loaded named beasts (Ape, Bat, Bear, …). **Upload paywall (logged out):** heading `Upload Your Own Elements`, body `With a PRO account, you can add every image file you want to your design.`, button `Upgrade Now`. Earlier Shields rail also showed `624 Extra Elements` / `Many more to come` / `Upgrade Now`.
5. **Top** — Mantle, Crown, Supporter, Other. Search: `Search Elements`.
6. **Colors** — Used, Palettes, Custom, Background. Copy: `Click any swatch to change every instance of that color on the canvas.`
7. **Tools** — Text, Draw, Random, Names. Text items: Text, Curved Text, Ring Text. Draw: `Enable Drawing Mode`, brush size / color / opacity.
8. **How-to** — tutorial list including `How to Save Designs (PRO)` and `How to Use Thousands of Templates (PRO)`, plus `Rule of tincture and how to break it in fantasy settings`.
9. **Settings** — Appearance Dark/Light, Color picker Simple/Advanced, Canvas Size presets (Square 1080×1080, social sizes, US Letter, A4), Clear Canvas.
10. **Flags** / **Tokens** — sister-product exits. Not followed.

Canvas quick actions when an object is selected: Duplicate, Align, Order, Delete, Lock, Hide. Also `Styles` and `Align elements`.

Hidden file input on the editor: `accept=".json,.txt"` (project save/load, not a free image upload).

---

## 5. Export formats (live editor vs their docs)

### Live editor, logged out (`https://coamaker.com/`)

Header control: `Export ▾` opens a dialog:

- File type select: **PNG**, **JPG**, **PDF**
- Quality: Low / Medium / High / Ultra
- Checkbox: Transparent background
- Size shown: `3330 × 1998 px`
- Actions: `Download PNG`, `Share`, `Print`

No SVG option in that dialog. No STL option in that dialog.

### Their docs (may be stale vs the live UI)

`https://coamaker.com/docs/export-as-image/`

- PRO: export `.png` with/without background; HD formats; Save is separate from export (“If you export an image, it is not saved on the server”).
- Free (docs text): `Download` on the right of the canvas; “You won’t see the Export button in the free version.”

**Conflict:** the logged-out live editor **did** show `Export ▾` with PNG/JPG/PDF. Treat the live dialog as current product behavior; do not copy the older “free users have no Export” sentence as our claim.

`https://coamaker.com/docs/3d-printing-stl/`: `Exporting in STL format for 3D printing is not possible at the moment.` PRO high-res + transparent PNG is suggested as an intermediate for other software.

Save/load: How-to labels save as PRO. Docs page `https://coamaker.com/docs/save-and-load-designs/` is thin (points at a troubleshooting article). Hidden `.json,.txt` input is consistent with a file-based project format.

---

## 6. Account / paywall

Visible without login:

- Header `Login` (username / password / Remember Me / Lost password / Register → `https://coamaker.com/registerpro/`)
- Header `Go Pro` → `https://coamaker.com/subscriptionplan/`
- In-editor `Upgrade Now` on extra elements, charge Upload, custom shield upload
- Ads on the free editor

Checkout page title: `CoaMaker PRO - Take your designs to the next level`  
URL: `https://coamaker.com/subscriptionplan/`  
Checkout: Paddle. Register fields: Username, Email, Password.

Plans visible on that page:

| Plan | Price shown | Note shown |
|---|---|---|
| Monthly Pro | $5.99 | Billed monthly • Personal use |
| Advanced Pro | $18.99 | Billed monthly • Commercial license included |
| Lifetime Pro | $99.00 | One-time payment • Lifetime Pro • Commercial license included |

Subscription meta (PRO pitch, not all of it is gated in the live free editor): `Access premium elements – Save designs to continue later – Use pre-made templates – Upload your own elements – Add text to designs – New elements each month`

**Do not take that meta list as a clean free/paid split.** Text tools were usable logged out. Upload, extra elements, custom shield outline, save/templates were the gated surfaces we actually saw.

About page (`https://coamaker.com/about/`): PRO users “can access at least eight new items each month”.

---

## 7. Surname lookup

**No in-editor surname → arms lookup.** No surname field on the maker. Search Shields / Search Charges search the symbol library, not a family database.

Related CoaMaker surfaces (not a genealogy lookup):

- Tools → Names: fantasy name generator.
- Footer: Name Generators, Motto Generator (`https://coamaker.com/family-motto-generator/`).
- Site search for `surname` (`https://coamaker.com/?s=surname`) returned:
  - Blog: `https://coamaker.com/inspiration/does-my-surname-have-a-coat-of-arms/`
  - Fantasy last-name generator pages
  - A user-gallery folder titled “Surname” (user artwork, not a lookup tool)

The surname article **does not** return arms from a name. It tells readers to use genealogy websites, heraldry databases, or heraldic societies, and warns that the job is slow and often unprovable.

---

## 8. Official / inherited arms claims

CoaMaker does **not** claim to grant, register, or retrieve official inherited arms.

From `https://coamaker.com/inspiration/does-my-surname-have-a-coat-of-arms/`:

- Arms were originally tied to **individuals, not surnames**.
- Same surname can have different arms; one family can have several.
- Records are incomplete; many arms were never officially registered.
- Warns about **bucket shops** that sell fake/unauthenticated arms.
- Closing line: tracing a family’s heraldic history “may not always yield definitive results.”

From `https://coamaker.com/docs/commission-of-coats-of-arms/`:

- “Our coat of arms generator is software that helps you to create your coat of arms **by yourself**.”
- If you want an artist, they affiliate-link Fiverr heraldry artists. That is a commission marketplace, not an official grant.

About page still markets “personalized family crest” and “heraldic achievement” as **design** language. That is marketing for drawing, not a College-of-Arms claim.

---

## 9. Free vs paid (what we actually saw)

**Free, logged out, on the editor:**

- Open the maker, pick shields, custom field, charges from the free galleries, top ornaments, colors, text, draw, random generate, fantasy names, export PNG/JPG/PDF / print / share, settings / canvas size.

**Paid / account (visible gates and plan page):**

- Upload own charge images
- Upload own shield outline
- Extra element packs (`624 Extra Elements`)
- Save designs / template library (How-to labels both as PRO)
- Commercial license (Advanced $18.99/mo and Lifetime $99; Monthly $5.99 is personal use)
- HD export language in docs
- Ad-supported free chrome vs Go Pro

License page `https://coamaker.com/docs/license-and-non-commercial-use/`:

- Default: designs are **non-commercial** unless you have Advanced Pro or Lifetime Pro.
- Copyright of elements stays with CoaMaker. You may not publish designs as public domain.
- Non-commercial allows social posts, fan wikis, non-commercial sites, private prints, unpaid school orgs.
- Non-commercial forbids selling, ads-funded sites, company logos, fundraising sales, **uploading elements/designs to AI applications**.
- Advanced license allows commissions, books, tabletop, tattoos, NFTs, physical products, company logos, ads-funded sites.
- Advanced still forbids reselling CoaMaker elements as a bundle, selling source files, selling account access, public-domain publishing, and AI uploads.

---

## 10. Do not copy as our claim

Do not put these on our coat-of-arms-maker page (including the comparison block):

1. CoaMaker’s brand, titles, or sister products (CoaMaker, Flag Creator, Heroic Token, “Be a heraldry designer”).
2. Any DR / traffic / “millions of people” / “thousands of users” / “thousands of people every day” line. About and testimonials use those; they are stale for us and were not verified.
3. Surname lookup, “does my family have a crest”, or returning a historical file from a last name. CoaMaker itself does not ship that in the editor, and its own article says surnames do not map 1:1 to arms.
4. Official, granted, inherited, registered, or authenticated arms. Do not imply College of Arms / heraldic authority. CoaMaker also does not claim this; we must not invent it either.
5. “Free random coat of arms generator” / AI generator wording as if it were our editor type. CoaMaker’s random button is not AI; our editor is a click-and-place shield maker.
6. Their paywall math: $5.99 / $18.99 / $99, Paddle, personal vs commercial license, “624 extra elements”, “eight new items each month”, “thousands of templates”.
7. Their license rules (non-commercial default, no public domain, no AI uploads). Those are CoaMaker’s terms, not ours.
8. “You won’t see the Export button in the free version” (their docs, contradicted by the live editor).
9. STL / 3D print export.
10. Bucket-shop scare copy, Fiverr commission referrals, or “heraldic achievement” as a legal status.
11. Ad-network chrome (“Discover more”, documentaries, custom prints) as if it were product UI.

---

## 11. Recommended on-page copy

Keep the existing comparison headings and three rows. Do not add CoaMaker’s name, prices, or traffic numbers to the page.

If comparison body text is touched later, stay inside the job split already on the page:

- This page: original shield graphic in the browser, export a file from this editor.
- General design software: blank canvas / other layouts.
- Genealogy and surname lookup: a record or found image, not this editor.

Do not write a CoaMaker vs us table on the live page from this note.

---

## 12. Pages used for this note

| URL | Role |
|---|---|
| `http://localhost:3001/coat-of-arms-maker` | Our comparison headings |
| `https://coamaker.com/` | Live editor, start flow, controls, export dialog, paywall cards |
| `https://coamaker.com/subscriptionplan/` | Plan names and prices |
| `https://coamaker.com/about/` | Marketing claims |
| `https://coamaker.com/docs/` | Docs index |
| `https://coamaker.com/docs/export-as-image/` | Export docs (stale vs live) |
| `https://coamaker.com/docs/3d-printing-stl/` | STL not available |
| `https://coamaker.com/docs/save-and-load-designs/` | Save/load labeled PRO in How-to |
| `https://coamaker.com/docs/license-and-non-commercial-use/` | Free vs commercial license |
| `https://coamaker.com/docs/commission-of-coats-of-arms/` | Self-serve generator, not an artist grant |
| `https://coamaker.com/?s=surname` | Confirmed no lookup product |
| `https://coamaker.com/inspiration/does-my-surname-have-a-coat-of-arms/` | Surname / official-arms stance |

End of note.
