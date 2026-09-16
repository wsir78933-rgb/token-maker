# E-PAGE-EN 页面续审 — `/blog/dnd-kobold`

Role: E-PAGE-EN（独立页面续审，非 A/B/C/D/F/G）。Date: 2026-09-16。  
未改正文、未改标题、未改装配代码。未 commit。未清用户 localStorage。  
用户终审：**未进行。**

Browser: 本地 ego-browser，task space `96`（`E-PAGE-EN dnd-kobold page review`）。  
Server: `next-server` PID 73191，cwd `token-maker-app`，`:40001`。  
截图: `tmp/blog-dnd-kobold/en/page-review/`。

## 结论

**FAIL**

HTTP **200**。Title / H1 / Description 与交接一致。封面 + 三张正文图可见且未裂图，caption 在。引用 href 正确，点开 Fan Content Policy 到达 Wizards 政策页。中文芯片 href 为 `/zh/blog/dnd-kobold`，localhost 点击后进入中文路由。canonical / hreflang 合理。无 tmp/SERP/hash/Agent 研究痕迹。桌面与 390×844 均无横向溢出。博客网格第一篇常规文是本篇（featured 仍是 Classes Explained）。

失败项：

1. 右侧 Article map 把正文 H3 的 `&mdash;` 原样显示成 `2014 &mdash; Small Humanoid, Lawful Evil` 等三行（截图可见）。
2. FAQPage JSON-LD 的 question `name` / answer `text` 与可见 FAQ 不是同一字符串：可见是 `D&D` 与渲染后的正文，JSON-LD 里仍是 `D&amp;D`、`&rsquo;` 和 HTML 标签。

## 交接对照

| 字段 | 交接 | 实读 |
|---|---|---|
| HTTP | — | **200** `text/html; charset=utf-8`（`page.fetch`，URL `http://127.0.0.1:40001/blog/dnd-kobold`） |
| Title | Matching CR 1/8 Does Not Make One DnD Kobold | `Matching CR 1/8 Does Not Make One DnD Kobold \| Token Maker`（站点模板后缀，符合 handoff） |
| H1 | Matching CR 1/8 Does Not Make One DnD Kobold | 一致 |
| Description | Tonight's dnd kobold is the 2014 Kobold (Small Humanoid, Lawful Evil) or the 2024 Kobold Warrior (Small Dragon, Neutral). Copy that page only. | 一致 |
| excerpt（首屏副题） | A dnd kobold is the 2014 Kobold … | 首屏可见，与 handoff excerpt 一致 |

## 逐项

### 1. HTTP / Title / H1 / Description — PASS

- `page.fetch` status 200。
- `document.title`、`<h1>`、`meta[name=description]`、`og:title`、`og:description` 与上表一致。

### 2. 三张正文图 + caption，不是只有封面 — PASS

封面：`/_next/image?url=%2Fblog%2Fcovers%2Fen%2Fdnd-kobold-guide.webp`，alt 与 handoff 一致，桌面可见。静态文件 `GET /blog/covers/en/dnd-kobold-guide.webp` → 200 `image/webp`。

正文 figure 三张，均 `complete`、natural 1536×1024，caption 与 handoff 锁定句一致：

| 文件 | HTTP | 桌面显示 | caption 开头 |
|---|---|---|---|
| `/blog/inline/dnd-kobold/kobold-lock-2014-2024.webp` | 200 | 960×600 | Left column is the 2014 Kobold. |
| `/blog/inline/dnd-kobold/kobold-pack-tactics-grid.webp` | 200 | 960×600 | Count the squares. Pack Tactics needs an ally |
| `/blog/inline/dnd-kobold/kobold-snout-crop.webp` | 200 | 960×600 | Crop diagram, not a Token Maker screenshot. |

手机 390×844：第一张 lock 图加载 1536×1024，caption 可见，无裂图。不是封面复用进 H2。

截图：`desktop-top.png`、`desktop-fig-01-lock.png`、`desktop-fig-02-grid.png`、`desktop-fig-03-crop.png`、`mobile-fig-01.png`。

### 3. 引用链接可点、href 正确 — PASS

正文 `a[href]` 与 `public-handoff.md` 的 22 条公开引用一致。抽查点击第一处 Fan Content Policy：同标签到达 `https://company.wizards.com/en/legal/fancontentpolicy`，title `Fan Content Policy | Wizards of the Coast`。

内链：`/blog/dnd-dragonborn`、`/blog/dnd-races`、`/blog/dnd-kenku`、`/#editor-workspace`、`/faq`。无 `tmp/`、无占位文 `how-to-build-a-dnd-character-token`。

### 4. 语言切换到中文路由 — PASS

- EN 顶栏芯片文案 `中文`，href `/zh/blog/dnd-kobold`。
- `http://127.0.0.1:40001/zh/blog/dnd-kobold` HTTP 200。
- 中文页 Title `DND 狗头人（Kobold）不能同时抄瓦罗和魔邓肯 | Token Maker`，H1 `DND 狗头人不能同时抄瓦罗和魔邓肯`，芯片 `English` → `/blog/dnd-kobold`。
- 在 `http://localhost:40001/blog/dnd-kobold` 点击芯片后 URL 变为 `http://localhost:40001/zh/blog/dnd-kobold`。

说明：同一空间里对 `127.0.0.1` 的 `.site-switch-chip` 曾报 `<html> intercepts pointer events`。href 本身正确；localhost 点击成功。不把该拦截算进产品 FAIL。

截图：`desktop-zh-after-switch.png`。

### 5. 无研究痕迹 — PASS

对 `document.documentElement.outerHTML` 检索：`tmp/blog`、`serp-research`、`candidate-intents`、`title-candidates`、`public-handoff`、`draft-body`、`lock-record`、`e-review`、`E-EN`、`F-EN`、`E-PAGE`、`worker_done`、正文 hash、`task-card`、`hl=en&gl=us`、`Agent 角色` — **无命中**。

### 6. 溢出与导航 — FAIL（TOC 标签）

- 桌面 1440×900：`scrollWidth === clientWidth === 1440`，overflowWidth 0。
- 手机 390×844：`scrollWidth === clientWidth === 390`，overflowWidth 0。未见横向撑出。
- 顶栏 Editor / Dice Roller / Coat Maker / Contact / Blog 可点，Blog 为当前项。

**FAIL：** Article map 三行把 HTML 实体当纯文本渲染：

- `2014 &mdash; Small Humanoid, Lawful Evil` → `#2014-and-mdash-small-humanoid-lawful-evil`
- `2024 &mdash; Small Dragon, Neutral, renamed Warrior` → `#2024-and-mdash-small-dragon-neutral-renamed-warrior`
- `Failure branches &mdash; recrop` → `#failure-branches-and-mdash-recrop`

正文 H3 渲染为 `2014 – Small Humanoid, Lawful Evil`（破折号正常）。问题在 `addHeadingAnchors` 的 `decodeHeadingText` 未解码 `&mdash;`，TOC 用了未解码的 `heading.text`。截图 `desktop-toc.png`、`desktop-fig-01-lock.png`、`desktop-faq.png` 右侧均可见。

### 7. canonical / hreflang — PASS

EN 实读：

- canonical `https://www.tokenmaker.one/blog/dnd-kobold`
- hreflang `x-default` / `en-US` → `https://www.tokenmaker.one/blog/dnd-kobold`
- hreflang `zh-CN` → `https://www.tokenmaker.one/zh/blog/dnd-kobold`

ZH 实读 canonical 为 `https://www.tokenmaker.one/zh/blog/dnd-kobold`，hreflang 三套与 EN 相同。本地 dev 指向生产绝对 URL，与站点既有组页一致。

### 8. FAQ JSON-LD 与可见 FAQ — FAIL

可见 FAQ（`.blog-faq-item`，H2 `FAQ about dnd kobold`）四条：

1. Are kobolds good or evil in D&D?
2. Can you play D&D as a kobold?
3. Is a 2024 kobold still a Humanoid?
4. Do Small kobolds share a square with a second Small creature by default?

JSON-LD `@type: FAQPage` 同样四条，主张相同，但字符串不一致：

- Q1/Q2 `name` 为 `D&amp;D`，可见 H3 为 `D&D`。
- 答案 `text` 含 `<a>` / `<em>` / `<strong>` / `Volo&rsquo;s`；可见答案是解码并去标签后的句子。

手机截图 `mobile-faq.png` 第一条展开后可见答案与 handoff 承诺一致（Lawful Evil / Neutral / errata / 不要平均）。不一致发生在 JSON-LD 未按可见文本规范化。

截图：`desktop-faq.png`、`mobile-faq.png`。对照文件：`page-review/faq-compare.json`。

## `/blog` 网格

- HTTP 200。
- Featured / Editor's Pick：**仍是** `DND Classes Explained: How to Choose the Right Class in Dungeons & Dragons`（`/blog/dnd-classes-explained`）。符合「featured 可能仍是别的」。
- All Articles 网格第一张常规卡：**本篇** `Matching CR 1/8 Does Not Make One DnD Kobold`，日期 Sep 16, 2026。

截图：`desktop-blog-hub.png`、`desktop-blog-hub-grid.png`。

## 未做

- 用户终审。
- 改正文 / 标题 / 装配。
- commit / deploy。

## 截图清单

- `page-review/desktop-top.png`
- `page-review/desktop-toc.png`
- `page-review/desktop-fig-01-lock.png`
- `page-review/desktop-fig-02-grid.png`
- `page-review/desktop-fig-03-crop.png`
- `page-review/desktop-faq.png`
- `page-review/desktop-zh-after-switch.png`
- `page-review/desktop-blog-hub.png`
- `page-review/desktop-blog-hub-grid.png`
- `page-review/mobile-top.png`
- `page-review/mobile-fig-01.png`
- `page-review/mobile-faq.png`
