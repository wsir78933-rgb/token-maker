# C-EN handoff — `dnd kobold` English body

Role: C-EN. Date: 2026-09-16.  
I am the writer. I do **not** issue a check pass. I did **not** run D’s three gates (ResearchTrace / ReaderValue / Repetition). D and E still owe independent review of this draft.

## Outputs

- `tmp/blog-dnd-kobold/en/draft-body.html` — HTML fragment for later `String.raw` (no Title/H1, no import, no cover image)
- `tmp/blog-dnd-kobold/en/public-references.json` — 22 public refs actually used
- this file

Did not edit `src/` or `public/`. Did not commit.

## Figure slots vs outline

Cover: **not** inserted in the body.

| ID | Outline slot | Inserted? |
|---|---|---|
| FIG-01 | H2 Lock, after the source-line setup, before the two H3s | Yes. `${DND_KOBOLD_LOCK_IMAGE_PATH}`, class `inline-figure inline-figure--wide-crop` |
| FIG-02 | H2 Pack Tactics, before the worked-example H3 | Yes. `${DND_KOBOLD_PACK_GRID_IMAGE_PATH}`, same class |
| FIG-03 | H2 Crop, immediately after the “no Kobold-specific template” sentence | Yes. `${DND_KOBOLD_TOKEN_CROP_IMAGE_PATH}`, same class |

Alt/caption follow the figure-plan drafts. G still owns final assets.

## Product section

**Retained** as the optional H2 after the lock. Deleting the Token Maker sentences still leaves snout/horn-frill crop identity, failure branches, and FIG-03. No Kobold-specific template. No claimed VTT import. UI names from `tool-facts.json`.

## Count (C mechanical, not a quality pass)

Python count of English words in `p` / `li` / `td` of the body **before** FAQ and Sources, excluding `h2` / `h3` / `figcaption` / `code` text: **4839**.  
F still owns the official length script. FAQ, Sources, captions, URLs, and headings were not counted.

## Left closed (not invented)

- Volo / MotM player size, speed, darkvision, height; player creature type
- 2014 official Winged Kobold stat block
- 2024 MM urd / Tiamat ecology as SRD
- MotM trait full text (replacement names only, from the official MotM post)
- Named VTT-world import; editor button coordinates
