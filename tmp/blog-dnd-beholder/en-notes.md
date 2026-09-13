# en-body notes (dnd beholder)

## Word count

Method: strip `figcaption`, `img` (so `alt` is out), the whole FAQ `h2` through end (FAQ + Sources), then remaining `h2`/`h3` text; decode `&rsquo;` etc.; strip tags; count `[A-Za-z0-9][A-Za-z0-9'-]*`. Table cells stay in.

- Qualifying English words: **5462** (floor was 2000)
- All words in the fragment, including excluded blocks: 6146

## Citations used in the body

Public URL placeholders (not resolved in this HTML):

| Placeholder | Role |
| --- | --- |
| `${BEHOLDER_2014_AIDEDD_URL}` | 2014 full transcription (stats, trait cone, 3-ray action, legendary Eye Ray only, DC 16 ray list). This transcription does **not** list Legendary Resistance. |
| `${BEHOLDER_2024_AIDEDD_URL}` | 2024 header only (HP, speed, Init, LR, Multiattack, Bonus Action cone, Chomp/Glare). Ray body not expanded. |
| `${BEHOLDER_2024_ROLL20_URL}` | 2024 expanded cone, Eye Rays 1d10, legendary Chomp/Glare, lair XP / extra uses. |
| `${DND_BEHOLDER_WIKIPEDIA_URL}` | Name / Product Identity only. Not a rules source. |
| `${DND_SRD_URL}` | Exclusion check: Beholder not in SRD 5.2. Not a stat block. |
| `${EN_SPECTATOR_DND_PATH}` | Internal: CR 3, four stalks, no cone. No spectator encounter rewrite. |
| `${EN_MIND_FLAYER_DND_PATH}` | Internal: another year-locked aberration. |
| `${EN_DND_FLUMPH_PATH}` | One gentle floating-eye contrast. |
| `${EN_EDITOR_PATH}` | Token crop (circle / square / polygon, transparent PNG 256/512/1024/2048). |
| `${EN_SQUARE_TOKEN_MAKER_PATH}` | Large 2×2 square mask. |
| `${EN_DICE_ROLLER_PATH}` | 1d10 ray picks and DC 16 saves. |

Print *Monster Manual* wins if a transcription disagrees.

Numbers follow the 2026-09-13 lock list. 2024 ray **DC 16** and the three 2024 rays that the lock list only named (Paralyzing / Telekinetic / Sleep) are taken from the designated Roll20 2024 transcription, not from memory. 2014 object-weight / disintegrate-object clauses are from the designated AideDD 2014 transcription.

## Figures

Three `figure.inline-figure.inline-figure--wide-crop` + `img.inline-figure__image.inline-figure__image--wide` (`width="1536"` `height="1024"` `loading="lazy"` `decoding="async"`). No `fetchpriority`, iframe, or lite-video.

1. `${BEHOLDER_BOOK_LOCK_IMAGE_PATH}` — under **Lock the Monster Manual year first**. Two books, year on the tracker.
2. `${BEHOLDER_CONE_RAYS_IMAGE_PATH}` — under **Antimagic Cone is not the same job in both books**. Cone from the central eye; stalks fire outside the cone.
3. `${BEHOLDER_TOKEN_CROP_IMAGE_PATH}` — under **Crop ten stalks and the central eye**. Ten stalks + central eye inside the mask.

## Other files

- `en-faq.json`: 5 items; `question`/`answer` are literal copies of the FAQ `h3` / `p` inner HTML (including `&rsquo;`, `&times;`, `<em>`, `<code>`).
- `en-meta.json`: working titles only, not a final seven-sins title. `relatedSlugs` includes `spectator-dnd` and `mind-flayer-dnd` (plus `dnd-flumph`).

## Out of scope (on purpose)

No lore encyclopedia, no kin catalog, no BG3 walkthrough (one exclusion line only). Death Tyrant is a do-not-paste line, not a third stat block. `src/` was not edited.
