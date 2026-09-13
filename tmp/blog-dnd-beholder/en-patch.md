# en-body.html 局部替换（对照 en-review.md §9 A–G）

只改 `tmp/blog-dnd-beholder/en-body.html`。未改 `src/`、FAQ 五条、`en-faq.json`、Sources、图、数字。8 处 old_string 均命中，无跳过。

## 7 处原文已不存在

| 条 | 已消失的原文 |
| --- | --- |
| A | `and not a Baldur&rsquo;s Gate 3 boss recap` |
| B | `It is not a Realms history, not a catalog of beholder-kin, and not a video-game walkthrough.` |
| C | 速查表 What it is 行内的 `Matching challenge rating is the trap.`（锁年段同句保留） |
| D | `2024 rerolls a ray already used this turn on the Eye Rays action.` |
| E | `Do not rewrite a spectator vault scene here` |
| F | flumph 三段句（gentle floating-eye / calm eye-stalk silhouette / flumph telepathy） |
| G | `This page does not name unobserved editor buttons`；`2014 levitation-only body` |

## 实际替换

### A. 开篇 p1 末

**old**

> Crop the token so ten eyestalks and the central eye stay inside the frame. This is not a spectator, not a Death Tyrant pasted onto a CR 13 card, and not a Baldur&rsquo;s Gate 3 boss recap.

**new**

> Crop the token so ten eyestalks and the central eye stay inside the frame. This is not a spectator, and it is not a Death Tyrant pasted onto a CR 13 card.

### B. 开篇 p2

**old**

> This page is for a DM or player who is putting that creature on a 5e table or VTT tonight. It is not a Realms history, not a catalog of beholder-kin, and not a video-game walkthrough. Lock the book, copy cone, rays, and legendary actions from that book, and crop a ten-stalk tyrant that still reads at map size. Confirm numbers on the printed *Monster Manual*. Public transcriptions are linked in Sources.

**new**

> This page is for a DM or player who is putting that creature on a 5e table or VTT tonight. Lock the book, copy cone, rays, and legendary actions from that book, and crop a ten-stalk tyrant that still reads at map size. Confirm numbers on the printed *Monster Manual*. Public transcriptions are linked in Sources.

### C. 速查表 What it is

**old**

> Large aberration (2014) / Large Aberration (2024), lawful evil, CR 13 (10,000 XP; 2024 also lists 11,500 in a lair), AC 18, Darkvision 120 feet, Deep Speech, Undercommon, immune to being knocked prone, passive Perception 22. Matching challenge rating is the trap. Cone timing, ray procedure, and legendary options sit in the comparison table below.

**new**

> Large aberration (2014) / Large Aberration (2024), lawful evil, CR 13 (10,000 XP; 2024 also lists 11,500 in a lair), AC 18, Darkvision 120 feet, Deep Speech, Undercommon, immune to being knocked prone, passive Perception 22. Cone timing, ray procedure, and legendary options sit in the comparison table below.

锁年段仍保留：`Matching challenge rating is the trap. It does not make the cone…`

### D. 2024 reroll

**old**

> Both years tell you to roll. 2014 rerolls duplicates among the three rays in that action. 2024 rerolls a ray already used this turn on the Eye Rays action. Confirm on the printed page whether a later legendary ray in the same round uses that same reroll sentence. Do not import the other year&rsquo;s duplicate rule onto that line.

**new**

> Both years tell you to roll. 2014 rerolls duplicates among the three rays in that action. 2024 rerolls a ray already used this turn. Confirm on the printed page whether a later legendary ray in the same round uses that same reroll sentence. Do not import the other year&rsquo;s duplicate rule onto that line.

### E. spectator 段

**old**

> A spectator is not a CR 13 tyrant with fewer hit points. It is a CR 3 guardian with four eyestalks, a central eye, and no antimagic cone. Keep that job on the spectator dnd page. Do not rewrite a spectator vault scene here, and do not borrow spectator Spell Reflection, 90-foot rays, or a four-ray list to “tone down” tonight’s beholder. If the map needs a weaker floating eye, use the spectator page and a four-stalk token. If the map needs this CR 13 card, use ten stalks, the cone, and the year you wrote on the tracker.

**new**

> A spectator is not a CR 13 tyrant with fewer hit points. It is a CR 3 guardian with four eyestalks, a central eye, and no antimagic cone. Use the spectator dnd page for that creature. Do not borrow spectator Spell Reflection, 90-foot rays, or a four-ray list to “tone down” tonight’s beholder. If the map needs the weaker four-stalk guardian, use that page and a four-stalk token. If the map needs this CR 13 card, use ten stalks, the cone, and the year you wrote on the tracker.

（HTML 锚点与实体未改：`${EN_SPECTATOR_DND_PATH}`、`&ldquo;` / `&rsquo;`。）

### F. flumph 段

**old**

> If you need a gentle floating-eye creature instead of a tyrant, that job belongs to a flumph, not to a beholder with the cone switched off. One calm eye-stalk silhouette on a flumph token does not make this CR 13 card friendly. Do not run flumph telepathy as a replacement for Antimagic Cone.

**new**

> A flumph is a different floating-eye creature; it is not this CR 13 card with the cone switched off.

（HTML 锚点未改：`${EN_DND_FLUMPH_PATH}`。）

### G. token 段 + 锁年段用词

**old（token）**

> Cropping can stay local-first. Use the circle first. If the stalk tips hit the ring, switch to a square mask so the corners keep the ten-stalk crown, or a polygon mask that follows the stalks. This page does not name unobserved editor buttons, and it does not claim a tested import into a named Roll20, Foundry, or Owlbear world. Those VTTs accept image tokens. A transparent PNG is not a promise that a world file will need zero extra setup after you drop it in.

**new（token）**

> Cropping can stay local-first. Use the circle first. If the stalk tips hit the ring, switch to a square mask so the corners keep the ten-stalk crown, or a polygon mask that follows the stalks. A transparent PNG is not a promise that a named Roll20, Foundry, or Owlbear world will import with zero extra setup.

**old（锁年）**

> Do not give the 2024 creature Speed 0 feet because you remember the 2014 levitation-only body.

**new（锁年）**

> Do not give the 2024 creature Speed 0 feet because you remember the 2014 fly-20 hover body.

## 未改

- FAQ 五个 `h3`/`p` 与 `en-faq.json`
- Sources 五条
- 三张 `figure` / `img` / `figcaption`
- 对照表与射线数字
- `src/`
