---
slug: "how-to-make-foundry-vtt-tokens"
title: "How to Make Foundry VTT Tokens That Feel Cohesive Across a Campaign"
description: "Foundry VTT rewards consistency. This guide focuses on transparency, style rules, and export decisions that keep a campaign library looking intentional instead of improvised."
excerpt: "Use consistent masks, border families, and export rules so your Foundry VTT tokens feel like one campaign asset set instead of a pile of mismatched portraits."
author: "Token Maker Editorial Team"
publishedAt: "2026-03-10"
updatedAt: "2026-03-12"
category: "Platform Guides"
tags: ["foundry vtt", "token design", "transparent png", "campaign assets"]
featured: false
draft: false
cover: "/blog/covers/en/how-to-make-foundry-vtt-tokens.svg"
coverAlt: "How to Make Foundry VTT Tokens cover art"
seoTitle: "How to Make Foundry VTT Tokens for Cleaner Campaign Asset Sets"
seoDescription: "Learn how to make Foundry VTT tokens with cleaner transparency, consistent border rules, and export choices that keep a campaign library cohesive."
relatedPostSlugs: ["how-to-make-vtt-tokens", "token-size-and-resolution", "how-to-make-roll20-tokens"]
relatedTemplateSlugs: ["circle-token-maker", "hex-token-maker", "transparent-token-maker"]
ctaQuery: "/?mask=circle&preset=warrior#editor-workspace"
---
## Foundry makes inconsistency obvious

Foundry VTT gives you enough visual control that mismatched token sets stand out fast. When one actor uses a heavy gold frame, another has no border, and a third has a noisy background glow, the campaign starts to feel stitched together instead of designed.

That is why a Foundry workflow should begin with rules, not decoration.

## Define a small visual system before you batch anything

Choose a short set of stable decisions and keep them consistent:

- One or two mask styles
- One border family for heroes and one for enemies
- A default export size
- A predictable contrast rule for transparent edges

This does more for campaign cohesion than adding more effects. Foundry scenes often mix darkness, lighting, terrain overlays, and weather. Your token system has to stay legible inside all of that.

If you are still deciding where to start, the [Circle Token Maker](/templates/circle-token-maker) is the cleanest baseline for actor portraits, while the [Hex Token Maker](/templates/hex-token-maker) is useful when your campaign also leans on counters and tactical overlays. If you want the broader workflow first, start with [how to make VTT tokens](/blog/how-to-make-vtt-tokens) and then tighten the rules for Foundry.

## Transparent edges matter more than flashy effects

Foundry often places tokens inside scenes with strong environmental treatment. A heavy shadow or overprocessed glow that looked nice in isolation can become messy once dynamic lighting and terrain are active.

Prioritize:

- Clean transparency
- Clear subject edges
- Controlled contrast

Deprioritize:

- Decorative glows
- Thick outer shadows
- Border textures that compete with the portrait

If you want visual hierarchy, use restrained color signals or border families instead of effect stacking.

For libraries that rely on clean cutouts more than ornamental rings, the [Transparent Token Maker](/templates/transparent-token-maker) is often the better practical starting point.

## Separate role language from portrait style

Foundry campaigns benefit from role cues that remain stable across sessions. Try to make your border language do one job at a time.

### A practical role split

- Players: brighter metals or cleaner ring styles
- Allies: softer tones or lighter accent color
- Standard enemies: restrained dark metals or bone families
- Elites and bosses: a more assertive border with stronger contrast

This kind of system helps the table scan scenes quickly without relying only on nameplates.

## Choose export size for reuse, not vanity

Foundry can reward slightly larger assets when you reuse them over a long campaign, especially if you zoom often or want cleaner transparency around edges. That said, bigger is still not automatically better.

Use this as the default rule:

- `512` when the token is disposable or encounter-specific
- `1024` when the token belongs to your long-term campaign library

Only push beyond that when the asset has special commercial or archival value.

If you are still weighing `512` against `1024`, the [token size and resolution guide](/blog/token-size-and-resolution) gives the simpler decision rule.

## A quick Foundry review checklist

Before you lock a batch of tokens, check them on both a dark scene and a bright interior scene.

- Does the edge stay clean against darkness?
- Does the face still read on lighter map textures?
- Do hero, ally, and enemy borders feel internally consistent?
- Does the set look like it belongs to one campaign?

If the answer is yes, the asset pack is ready. Foundry rewards consistency more than novelty, and that is exactly what a disciplined token workflow gives you.

When you are ready to build the set instead of only planning it, open the [Foundry-oriented editor preset](/?mask=circle&preset=warrior#editor-workspace) and check the first batch against a dark scene before exporting the rest.
