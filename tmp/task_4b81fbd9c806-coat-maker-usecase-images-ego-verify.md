# Coat Maker use-case image EGO verify

Task: `task_4b81fbd9c806`  
Dispatch: `ctx_f2a6d741b4d3`  
Space: `coat-maker-usecase-images` (id 211)  
Opened only:

1. `http://localhost:3001/coat-of-arms-maker`
2. `http://localhost:3001/zh/coat-of-arms-maker`

No product files edited. No commit.

## Result: PASS

| Check | EN | ZH |
|---|---|---|
| 4 use-case cards | PASS | PASS |
| Each use-case card has a visible, loaded image | PASS | PASS |
| 3 comparison cards, text-only | PASS | PASS |
| One H1 | PASS | PASS |
| Workbench first | PASS | PASS |

No broken use-case `src`. Fail Fast did not trigger.

## EN `http://localhost:3001/coat-of-arms-maker`

- Title: `Free Family Crest and Coat of Arms Maker`
- H1 count: 1 — `Free Family Crest and Coat of Arms Maker`
- Workbench: `.coat-workbench-content` document Y=99; SEO `.coat-maker-seo-content` Y=738. First viewport is the editor, not SEO.
- Use-case heading: `Jobs for this coat of arms maker`
- 4 articles, each with a loaded `img` (complete, naturalWidth 1254, displayed 494×494, in viewport, `elementFromPoint` hits `IMG`):

| Card | src | result |
|---|---|---|
| Tabletop houses and factions | `/coat-of-arms-maker/use-cases/tabletop-houses.webp` | visible, not broken |
| Guild, club, and community badges | `/coat-of-arms-maker/use-cases/guild-badges.webp` | visible, not broken |
| Fantasy characters and invented banners | `/coat-of-arms-maker/use-cases/fantasy-banners.webp` | visible, not broken |
| Worldbuilding maps and title pages | `/coat-of-arms-maker/use-cases/worldbuilding-maps.webp` | visible, not broken |

- Comparison heading: `When to stay on this coat of arms maker`
- 3 articles, each `imgCount=0`, `svgCount=0`, `picture/canvas/video=0`. Visual screenshot is text-only.

## ZH `http://localhost:3001/zh/coat-of-arms-maker`

- Title: `免费家族纹章与纹章制作器`
- H1 count: 1 — `免费家族纹章与纹章制作器`
- Workbench first: workbench Y=99, SEO Y=767. First viewport is the editor.
- Use-case heading: `这个纹章制作器适合完成的工作`
- 4 articles, same four `src` values, all loaded (naturalWidth 1254, 494×494, `elementFromPoint` hits `IMG`):

| Card | src | result |
|---|---|---|
| 桌面团的家族与阵营 | `/coat-of-arms-maker/use-cases/tabletop-houses.webp` | visible, not broken |
| 公会、社团和社区徽章 | `/coat-of-arms-maker/use-cases/guild-badges.webp` | visible, not broken |
| 奇幻角色与发明的旗帜 | `/coat-of-arms-maker/use-cases/fantasy-banners.webp` | visible, not broken |
| 世界观地图与扉页 | `/coat-of-arms-maker/use-cases/worldbuilding-maps.webp` | visible, not broken |

- Comparison heading: `这个浏览器编辑器和别的做法怎么选`
- 3 articles, text-only (no img/svg/picture/canvas/video).

## HTTP HEAD on the four srcs

All four returned `200 image/webp`.

## Screenshots (CDP)

Ego helper `captureScreenshot` after scroll returned a uniform dark frame. Verification used `Page.captureScreenshot` instead.

- `tmp/ego-en-top.png` — EN workbench first
- `tmp/ego-en-usecase-0-cdp.png` — EN cards 1–2 with images
- `tmp/ego-en-usecase-2-cdp.png` — EN cards 3–4 with images
- `tmp/ego-en-compare-1-cdp.png` — EN 3 comparison cards, text-only
- `tmp/ego-zh-top-cdp.png` — ZH workbench first
- `tmp/ego-zh-usecase-0-cdp.png` — ZH cards 1–2 with images
- `tmp/ego-zh-usecase-2-cdp.png` — ZH cards 3–4 with images
- `tmp/ego-zh-compare-cdp.png` — ZH 3 comparison cards, text-only

## Out of scope

Site chrome logo `/icon.svg?v=20260312b` is not a use-case card image and was not used as a fail signal.
