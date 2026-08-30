# Coat maker Ego verify — task_802c510bf209

Space: `coat-maker-verify-rebuild` (id 205)
Opened only:
- http://localhost:3001/coat-of-arms-maker
- http://localhost:3001/zh/coat-of-arms-maker

No product files edited. No other site tools opened.
Method: Ego DOM + a11y snapshot. Workbench-first confirmed by screenshot at scrollY=0 plus `snapshotText({scope:'only_within_viewport'})`.

Overall: **PASS** (12/12). Missing text: none.

## EN `/coat-of-arms-maker`

| Check | Result | Evidence |
|---|---|---|
| Workbench first, then SEO | PASS | `.coat-maker-page` children: `MAIN.coat-workbench` top=0, then `SECTION.coat-maker-seo-content` top=738. Viewport at top: workbench visible, H1 not in viewport (`EN_TOP_HAS_H1=false`, `EN_TOP_HAS_WORKBENCH=true`). Screenshot shows editor/shields/export. |
| SEO block present | PASS | `.coat-maker-seo-content` present. Fail Fast not triggered. |
| H1=1 | PASS | 1 H1: `Free Family Crest and Coat of Arms Maker` |
| 用例 section has 4 h3 cards | PASS | H2 `Jobs for this coat of arms maker`; 4 `article` + h3: `Tabletop houses and factions`; `Guild, club, and community badges`; `Fantasy characters and invented banners`; `Worldbuilding maps and title pages` |
| 对比 section has 3 cards | PASS | H2 `When to stay on this coat of arms maker`; 3 `article` + h3: `This browser coat of arms maker`; `General design software`; `Genealogy and surname lookup` |
| No long overview essay under H1 | PASS | Only one sibling after H1: `<p>` 117 chars: `Make your own family crest or coat of arms with editable shields and icons. Free to create and export in the browser.` Next block is H2 `Create a heraldic design in three steps`. |
| 3 FAQ | PASS | H2 `Frequently asked questions`; 3 article/h3: `Is this coat of arms maker free to use?`; `Can I return to a design later?`; `Which image formats can I export?` Viewport snapshot confirmed all three. |

## ZH `/zh/coat-of-arms-maker`

| Check | Result | Evidence |
|---|---|---|
| Workbench first, then SEO | PASS | `MAIN.coat-workbench` top=0, then `SECTION.coat-maker-seo-content` top=767. Viewport at top: workbench (`搜索盾形` / `导出` / `熨斗`), H1 not in viewport. Screenshot shows ZH editor. |
| SEO block present | PASS | `.coat-maker-seo-content` present. |
| H1=1 | PASS | 1 H1: `免费家族纹章与纹章制作器` |
| 用例 section has 4 h3 cards | PASS | H2 `这个纹章制作器适合完成的工作`; 4 `article` + h3: `桌面团的家族与阵营`; `公会、社团和社区徽章`; `奇幻角色与发明的旗帜`; `世界观地图与扉页` |
| 对比 section has 3 cards | PASS | H2 `这个浏览器编辑器和别的做法怎么选`; 3 `article` + h3: `这个浏览器里的纹章制作器`; `一般绘图软件`; `家谱与姓氏查询` |
| No long overview essay under H1 | PASS | Only one sibling after H1: `<p>` 32 chars: `用可编辑的盾和图形做自己的家徽或纹章。在浏览器里免费创建并导出。` Next block is H2 `三步完成纹章设计`. |
| 3 FAQ | PASS | H2 `常见问题`; 3 article/h3: `纹章制作器可以免费使用吗？`; `以后还能继续编辑吗？`; `可以导出哪些格式？` Viewport snapshot confirmed all three. |

## Missing text

None. Every required block was present with the exact headings above.

## Note (not a fail)

`captureScreenshot` after window scroll returned a black frame (likely compositor/canvas). Structure was verified with DOM + `snapshotText` instead. Sticky topbar remains while SEO is below the workbench in document order.
