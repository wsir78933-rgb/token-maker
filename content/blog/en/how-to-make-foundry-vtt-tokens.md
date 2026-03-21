---
slug: "how-to-make-foundry-vtt-tokens"
title: "How to Make Foundry VTT Tokens: Size, Transparency, Import, and Batch Workflow"
description: "Build practical Foundry VTT tokens with better cropping, cleaner transparency, smarter PNG and WebP exports, Prototype Token setup, Dynamic Token Ring decisions, and scalable monster organization."
excerpt: "From Token Maker export to Foundry import, this guide gives you a practical workflow for player, NPC, and monster tokens instead of abstract design advice."
author: "Token Maker Editorial Team"
publishedAt: "2026-03-10"
updatedAt: "2026-03-21"
category: "Platform Guides"
tags: ["foundry vtt", "token workflow", "prototype token", "dynamic token ring", "webp"]
featured: false
draft: false
cover: "/blog/covers/en/how-to-make-foundry-vtt-tokens.svg"
coverAlt: "How to Make Foundry VTT Tokens cover art"
seoTitle: "How to Make Foundry VTT Tokens: Size, Transparency, Import, and Batch Workflow"
seoDescription: "Learn how to make Foundry VTT tokens with practical guidance on size, transparency, PNG vs WebP, Prototype Token setup, Dynamic Token Rings, and batch monster management."
relatedPostSlugs: ["how-to-make-vtt-tokens", "token-size-and-resolution", "how-to-make-roll20-tokens"]
relatedTemplateSlugs: ["circle-token-maker", "transparent-token-maker", "monster-token-maker"]
ctaQuery: "/?mask=circle&preset=warrior#editor-workspace"
---
If you are searching for "**how to make Foundry VTT tokens**", you probably do not want abstract design theory. You usually want answers to five practical questions:

1. What size should the token be: `512` or `1024`
2. Should you export PNG, or convert the final file to WebP before upload
3. Should the border live inside the image, or should Foundry handle it
4. How do you actually put the file into an Actor's `Prototype Token`
5. Once you have a real campaign library, how do you keep monster and NPC tokens organized

This guide is written around those five questions, and it focuses on **portrait-style tokens**. If you are building overhead battle-map tokens, the crop and rotation logic changes. But if you are using Token Maker for player portraits, NPC portraits, and monster portrait tokens, this is the practical Foundry workflow.

![Foundry token workflow overview](/blog/inline/en/foundry-token-workflow-overview.svg)

## First decide what kind of Foundry token you are making

Many guides start with effects and style, but Foundry users usually need to decide the **job** of the token first.

### Most users are really choosing between two routes

- **Static border token**: the border, role cues, and final look are baked directly into the image, so it stays consistent across platforms.
- **Clean subject + Foundry Dynamic Token Ring**: the image mostly preserves the portrait and transparent edges, while Foundry VTT v13 handles the outer ring, status feel, and unified presentation.

### The practical decision rule

Choose a **static border token** if these sound like you:

- You want the same asset set to work in Roll20, Owlbear, or other tabletops later
- You want the visual language locked into the image itself
- Your campaign already has a stable hero, ally, and enemy frame system

Choose **clean subject + Dynamic Token Ring** if these sound like you:

- You mainly use the assets inside Foundry VTT v13
- You want Foundry to handle status language and unified outer-ring behavior
- You do not want to permanently bake a heavy frame into the token image

The least practical option is doing both too heavily at once: a thick baked-in metal frame inside the PNG, then another strong Dynamic Token Ring on top of it. That is how tokens start to look muddy in actual scenes.

![Static border vs Dynamic Token Ring comparison](/blog/inline/en/foundry-token-static-vs-dynamic-ring.svg)

## A Foundry VTT token workflow that actually holds up in use

## Step 1: only start with art that still reads after it gets smaller

Foundry scenes often combine map texture, lighting, shadows, markers, nameplates, and overlays. If the source image looks nice at full size but collapses into the background when reduced, it was never a strong token source to begin with.

Prefer art with these qualities:

- A clear face or silhouette
- Readable separation between subject and background
- Stable lighting instead of muddy backlight
- A recognizable subject even when reduced

Avoid art with these problems:

- Background detail that competes with the character
- A subject that is simply too far from the camera
- Horns, helmets, hats, or weapons sitting right on the crop edge
- Subject and background values that are too close together

If you want the safest starting point, most player and NPC portrait tokens should begin in the [Circle Token Maker](/templates/circle-token-maker). If your priority is cleaner cutouts and lighter framing rather than ornamental rings, the [Transparent Token Maker](/templates/transparent-token-maker) is usually the stronger Foundry-first entry point.

## Step 2: crop for recognition, not for completeness

A lot of Foundry tokens look weak not because their size is wrong, but because the crop is too generous. You keep the shoulder armor, cloak, spell circle, and narrative background, and the face or silhouette that actually matters ends up too small.

A better Foundry portrait crop usually does these things:

- Places the face or focal point slightly above center
- Removes background areas that do not improve recognition
- Protects the most identifying features such as horns, hats, helmets, ears, or jaw shape

A simple test is this: imagine the token already reduced to a single map square. If your first reaction is not "I know who that is" but instead "the full image composition looks nice," the crop is probably still too loose.

## Step 3: decide whether the border belongs to the image or to Foundry

This is one of the most important Foundry-specific decisions, and many articles skip it.

### If you are building static border tokens

The useful approach is: **let the border classify, not dominate**.

- Player characters: brighter metals or cleaner ring styles
- Friendly NPCs: lighter neutrals or softer accent rules
- Standard enemies: darker metals, bone families, or restrained dark frames
- Elites and bosses: stronger contrast, but only on a small number of key units

The more the border is doing role-recognition work, the less you need glow, thick outer shadow, or busy texture tricks.

### If you are planning around Dynamic Token Ring

The practical approach is: **keep the image clean and keep baked framing light**.

- The subject outline needs to stay strong
- Transparent edges need to stay clean
- Avoid adding a thick permanent ring to the image
- Let Foundry carry the outer-ring logic and system-level consistency

That is why many Foundry-only token sets should start from a lighter or no-border approach rather than treating the PNG like a poster that needs every effect baked in forever.

## Step 4: export size should serve the map, not your anxiety

When people search for "Foundry VTT token size", they often mix up **image pixel size** with **grid footprint**. Those are not the same thing.

- `512 x 512` and `1024 x 1024` describe the number of pixels in the image file
- `1 x 1`, `2 x 2`, and `3 x 3` describe how many grid spaces the token occupies on the map

That means a `512 x 512` image can still be used as a `2 x 2` Large creature inside Foundry. Creature footprint is configured in token width and height, not determined by whether you exported the image at an extreme size.

Use this as the default rule:

- **`512 x 512`**: enough for most player tokens, NPCs, and encounter-specific monsters
- **`1024 x 1024`**: better for recurring protagonists, bosses, core NPCs, and assets you expect to zoom or reuse often
- **Above `1024`**: reserve it for marketplace assets, archive-grade files, or cases where you explicitly need that extra headroom

![Foundry token size decision chart](/blog/inline/en/foundry-token-size-decision.svg)

If you are still weighing `512`, `1024`, and larger outputs, the [token size and resolution guide](/blog/token-size-and-resolution) gives the shorter decision framework.

## Step 5: do not think only in PNG

For Token Maker, **transparent PNG** is still an excellent master format because it is clean, flexible, and easy to keep editing. But if the file is being prepared for long-term Foundry use, the final upload version does not always need to remain PNG.

The practical format rule is:

- **PNG**: best for the working master, continued editing, and cross-tool portability
- **WebP**: often better for the final Foundry upload because it usually balances quality and file weight more efficiently
- **JPG**: wrong for transparent tokens, because it does not preserve transparency

So the stable workflow is: **export a transparent PNG from Token Maker, confirm the crop and edges are correct, then convert the final delivery version to WebP before uploading to Foundry**. That gives you both editing flexibility and a lighter campaign asset library.

## How to put the token into Foundry VTT correctly

A lot of guides stop after the image-making part, but for Foundry users the real friction often appears during import and configuration.

### The smallest useful workflow

1. Put the finished token files into your Foundry user data folders and organize them by campaign or entity type
2. Create or open the Actor that should use the token
3. Open that Actor's **Prototype Token**
4. Choose the token image, or configure subject art if you are using a v13 Dynamic Token Ring workflow
5. Set width and height based on creature size, for example `1 x 1` for many Medium creatures and `2 x 2` for many Large creatures
6. If you are using portrait-style tokens, lock rotation so the portrait does not spin with facing
7. Drop the token onto both a dark and a bright scene before you commit to a larger export batch

### One easy mistake: Prototype Token and a placed scene token are not the same layer

- **Prototype Token**: controls the Actor's default token setup going forward
- **Placed Token**: only affects the specific token instance already sitting in a scene

If you edit only the placed token and expect every future goblin, NPC, or boss based on that Actor to update automatically, you are going to create a maintenance mess. In most cases, the right place to start is the Actor's `Prototype Token`.

### Portrait tokens and overhead tokens also want different rotation logic

- Portrait-style tokens: usually want rotation locked
- Overhead tokens: usually want a south-facing orientation and directional behavior

That is why the scope matters. This article is primarily about **portrait-style Foundry tokens**, not top-down combat pieces.

## When you batch monsters, naming rules are worth more than effects

Once a Foundry campaign grows from 20 tokens to 200, the biggest efficiency gain usually does not come from extra polish. It comes from **stable folders and stable file names**.

A practical directory setup can look like this:

```text
tokens/
  pcs/
    elara-warlock.webp
    brom-paladin.webp
  npcs/
    innkeeper-mara.webp
    captain-ren.webp
  monsters/
    goblin/
      goblin-scout-01.webp
      goblin-scout-02.webp
      goblin-boss.webp
    undead/
      skeleton-warrior-01.webp
      skeleton-archer-01.webp
```

This helps for three reasons:

- You stop relying on memory to find files
- Monster variants scale cleanly over time
- The structure fits Foundry wildcard image workflows naturally

If you want a creature family to randomize between multiple art variants, keep the files on a stable pattern and use a wildcard path in Foundry, for example:

```text
tokens/monsters/goblin/goblin-scout-*.webp
```

That is much more practical than hand-editing every individual goblin token.

## Three common Foundry scenarios and how to handle each one

## Scenario 1: player character tokens

Recommended:

- Leave a little breathing room in the crop
- Let the border communicate "player character" rather than acting as decoration
- Export at `1024` if this is a long-term recurring character
- If you use Dynamic Token Ring, reduce fixed framing and keep the subject cleaner

Avoid:

- Complex character art plus heavy glow on top of it
- Giving every player a totally unrelated border language so the scene stops feeling coherent

## Scenario 2: monster encounter packs

Recommended:

- Crop slightly closer than you would for player characters
- Keep composition and border family stable within a monster type
- Default most encounter assets to `512`
- Organize names and folders first so wildcard variation remains easy later

Avoid:

- Giving every monster its own unrelated color and frame logic
- Exporting disposable encounter monsters at oversized resolutions by default

If you batch encounters often, the [Monster Token Maker](/templates/monster-token-maker) is a more efficient starting point than rebuilding the setup every time.

## Scenario 3: bosses or recurring NPCs

Recommended:

- Allow slightly stronger border contrast than you use on ordinary units
- Protect the face or silhouette so it still dominates once reduced
- Start from `1024`
- Test on both a dark dungeon map and a brighter interior map

Avoid:

- Assuming "boss" means every effect should be pushed to maximum
- Keeping too much narrative background just because the character is important

## Final review: run these 7 checks before you commit

Before you batch export, batch upload, or attach a whole set to Actors, run through these seven questions:

1. Is the token still identifiable at map scale
2. Do the transparent edges stay clean on dark scenes
3. Does the subject still read on brighter scenes
4. Are player, ally, enemy, and boss rules stable across the set
5. Have you mixed up pixel size and grid size
6. Should this asset really be a static border token, or would Dynamic Token Ring be cleaner
7. Are file names and folders stable enough for future reuse and wildcard variation

If you can answer those cleanly, the Foundry token workflow is usually in good shape.

## Foundry VTT token FAQ

### Should Foundry VTT tokens be PNG or WebP?

Use transparent PNG during the creation stage and prefer WebP for the final Foundry-ready delivery file. PNG is the better editable master. WebP is usually the better long-term upload format.

### Should Foundry VTT tokens be `512` or `1024`?

Start most practical assets at `512`. Move to `1024` for recurring protagonists, bosses, or anything you expect to reuse heavily or zoom more often.

### Does a Large Foundry monster need a much bigger image file?

Not automatically. Large is a `2 x 2` grid concept, not a command to export enormous pixel dimensions. Many Large creatures work perfectly well with `512` or `1024` files.

### Do I have to bake the border directly into the token image?

No. If you want cross-platform portability or a fully fixed art style, static borders are the stable choice. If you mainly live inside Foundry VTT v13 and plan to use Dynamic Token Rings, cleaner subject art is often the better route.

### Why does my token look fine alone but muddy inside a real map?

Usually it comes from three problems:

- The crop is too loose
- The transparent edge is dirty
- The fixed border, glow, and map lighting are competing with each other

The simplest fix is to crop slightly closer, reduce heavy effects, and test on both dark and bright map styles.

## Turn the article into a real workflow now

If you are ready to build Foundry tokens now, the fastest next step is not bookmarking this article. Open the [matching editor preset](/?mask=circle&preset=warrior#editor-workspace), make one player token and one monster token, then compare both inside a dark scene and a bright scene in Foundry.

After that first pass, the broader [how to make VTT tokens guide](/blog/how-to-make-vtt-tokens) and the [token size and resolution guide](/blog/token-size-and-resolution) will make more sense, because you will be evaluating them against a real workflow instead of just reading theory.
