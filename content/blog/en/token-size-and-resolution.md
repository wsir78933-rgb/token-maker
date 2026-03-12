---
slug: "token-size-and-resolution"
title: "Token Size and Resolution: When to Use 512, 1024, or 2048"
description: "Choosing token size is really about use case. This guide helps you decide when a small, practical export is enough and when a larger file is worth keeping."
excerpt: "Use 512 for active play, move to 1024 for long-term libraries, and reserve 2048 for premium assets or special cases."
author: "Token Maker Editorial Team"
publishedAt: "2026-03-06"
updatedAt: "2026-03-12"
category: "Export Strategy"
tags: ["export size", "resolution", "png", "asset library"]
featured: false
draft: false
cover: "/blog/covers/en/token-size-and-resolution.svg"
coverAlt: "Token Size and Resolution cover art"
seoTitle: "Best Token Size for VTT: When to Use 512, 1024, or 2048"
seoDescription: "Choose the best token size for VTT play, long-term libraries, and premium assets by comparing when 512, 1024, or 2048 actually makes sense."
relatedPostSlugs: ["how-to-make-vtt-tokens", "how-to-make-foundry-vtt-tokens", "how-to-make-roll20-tokens"]
relatedTemplateSlugs: ["transparent-token-maker", "circle-token-maker", "square-token-maker"]
ctaQuery: "/?mask=circle&preset=classic#editor-workspace"
---
## Bigger files are not automatically better

Many token workflows become heavier than they need to be because creators assume that the largest export is always the safest option. In practice, the right token size depends on how the asset will be used.

If the token is for active play on a normal VTT table, oversized files usually give you less benefit than cleaner crops and stronger contrast.

## Use 512 as the default for active play

`512` is the most practical default for many campaigns because it stays sharp enough for common battle-map use without making the library harder to manage.

Use `512` when:

- The token is for live encounters
- The asset will appear in batches
- You care more about speed and consistency than archive quality

For a large bestiary or recurring encounter packs, this is often the smartest baseline.

That default is especially strong when you are building through the [Circle Token Maker](/templates/circle-token-maker) or the [Square Token Maker](/templates/square-token-maker), where the goal is fast table-ready output rather than archival perfection.

If the main question is not size but crop discipline, the broader [how to make VTT tokens](/blog/how-to-make-vtt-tokens) workflow is the better first read.

## Move to 1024 when the asset deserves a longer life

`1024` is usually the right step up when you want more flexibility without going overboard. It helps preserve cleaner transparent edges and gives you a more future-proof file if the token will be reused across campaigns.

Use `1024` when:

- The token belongs to a long-term library
- You expect to reuse it often
- You want more edge quality for transparency or zoom

This is the “archive without excess” size.

If your workflow depends on cleaner cutouts, the [Transparent Token Maker](/templates/transparent-token-maker) is the easiest place to see whether the edge quality really improves enough to justify moving from `512` to `1024`.

Platform still changes the answer a bit: the [Roll20 guide](/blog/how-to-make-roll20-tokens) leans lighter, while the [Foundry VTT guide](/blog/how-to-make-foundry-vtt-tokens) justifies slightly larger long-term assets more often.

## Reserve 2048 for premium cases

`2048` should be a conscious decision, not the default export habit.

Use it when:

- You are preparing premium marketplace assets
- The token supports print-adjacent use
- The file has special commercial or presentation value

If every monster token becomes a 2048 export, the workflow stops being practical.

## Choose size by asset value

The simplest rule is to map size to asset value.

1. `512` for active play
2. `1024` for long-term reuse
3. `2048` for premium or special-purpose output

That keeps your library consistent and avoids collecting oversized files that never pay off.

## Resolution is only one part of clarity

A sloppy crop exported at `2048` is still a weak token. A clean, readable portrait exported at `512` usually performs better in real sessions.

When deciding export size, ask:

- Will this file be reused often?
- Does it need cleaner transparent edges?
- Is the token commercially valuable?
- Am I solving a real need, or only increasing file size?

Those questions usually lead to the right export choice faster than chasing the biggest number.

You can pressure-test the rule immediately by opening the [default export preset in the editor](/?mask=circle&preset=classic#editor-workspace) and exporting the same token at two sizes before committing the whole batch.
