# E-PAGE-EN 页面续审 R2 — `/blog/dnd-kobold`

Role: E-PAGE-EN。Date: 2026-09-16。对照 R1 `e-page-review.md`。  
未改正文、未改标题、未改装配代码。未 commit。未清用户 localStorage。  
用户终审：**未进行。**

Browser: 本地 ego-browser，task space `97`。硬刷新：`goto` + `reload`（cache disabled）后再读。  
Server: `next-server` PID 73191，`:40001`。  
截图: `tmp/blog-dnd-kobold/en/page-review-r2/`。

## 结论

**PASS**

R1 两项失败均已在实读页上消失：

1. Article map 三行 H3 显示为 `2014 — Small Humanoid, Lawful Evil` / `2024 — Small Dragon, Neutral, renamed Warrior` / `Failure branches — recrop`。无 `&mdash;` 原文。锚点改为 `#2014-small-humanoid-lawful-evil` 等（不再含 `and-mdash`）。
2. FAQ JSON-LD 答案已无 `<a>` / `<em>` / `<strong>`。剩余 `D&amp;D`、`&rsquo;` 与 `/blog/dnd-kenku` 同一套 faqItems 编码约定。可见 FAQ 问句是 `D&D`。按本轮口径不单独 FAIL。

其余交接项仍成立。HTTP 200。无横向溢出。无研究痕迹。

## 重点复核

### Article map H3

桌面 DOM / 截图：

| TOC 文案 | href |
|---|---|
| 2014 — Small Humanoid, Lawful Evil | `#2014-small-humanoid-lawful-evil` |
| 2024 — Small Dragon, Neutral, renamed Warrior | `#2024-small-dragon-neutral-renamed-warrior` |
| Failure branches — recrop | `#failure-branches-recrop` |

手机 390×844 同一三行、同一 href。无 `&mdash;` 字面量。

截图：`desktop-toc.png`（可见 2014/2024 两行破折号）、`desktop-toc-tail.png`。

### FAQ JSON-LD

可见四问（`D&D` 已解码）：

1. Are kobolds good or evil in D&D?
2. Can you play D&D as a kobold?
3. Is a 2024 kobold still a Humanoid?
4. Do Small kobolds share a square with a second Small creature by default?

FAQPage `mainEntity` 四条。原始 JSON-LD 字符串：

- `<a>` / `<em>` / `<strong>`：**无**
- `name` 仍含 `D&amp;D`（Q1/Q2）
- `acceptedAnswer.text` 仍含 `Volo&rsquo;s`，无 HTML 标签

Kenku 对照（同机 `GET /blog/dnd-kenku` 200）：FAQPage 同样无 `<a>/<em>/<strong>`，问句有 `Player&rsquo;s`，答案有 `&amp;` / `&rsquo;`。本篇与该约定一致。

截图：`desktop-faq.png`、`mobile-faq.png`。

## 其余（R1 已过、本轮抽查）

| 项 | 结果 |
|---|---|
| HTTP | 200 |
| Title | `Matching CR 1/8 Does Not Make One DnD Kobold \| Token Maker` |
| H1 | Matching CR 1/8 Does Not Make One DnD Kobold |
| Description | Tonight's dnd kobold is the 2014 Kobold (Small Humanoid, Lawful Evil) or the 2024 Kobold Warrior (Small Dragon, Neutral). Copy that page only. |
| 中文芯片 | `中文` → `/zh/blog/dnd-kobold` |
| canonical / hreflang | 生产绝对 URL：en-US / x-default → `/blog/dnd-kobold`，zh-CN → `/zh/blog/dnd-kobold` |
| 溢出 | 桌面 1440、手机 390 均为 overflowWidth 0 |
| 研究痕迹 | 无 tmp/SERP/hash/Agent |
| 正文图 | 手机第一张 lock 图 natural 1536，caption 在 |

## 未做

- 用户终审。
- commit / deploy。
- 未改共享 schema 去实体（按指示不因此 FAIL）。

## 截图

- `page-review-r2/desktop-top.png`
- `page-review-r2/desktop-toc.png`
- `page-review-r2/desktop-toc-tail.png`
- `page-review-r2/desktop-faq.png`
- `page-review-r2/mobile-top.png`
- `page-review-r2/mobile-fig.png`
- `page-review-r2/mobile-faq.png`
