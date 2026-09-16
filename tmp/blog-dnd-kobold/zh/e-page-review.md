# E-PAGE-ZH 页面续审：DND 狗头人

- 角色：E-PAGE-ZH（独立页面续审。不改正文、不改标题、不改装配代码、不 commit）
- 真实本地路由：`http://127.0.0.1:40001/zh/blog/dnd-kobold`、`http://127.0.0.1:40001/zh/blog`
- 浏览器：ego-browser v2，单一任务空间 **95**（`zh dnd kobold page review`），结束后 `finish({ keep: [] })`
- 视口：桌面 **1280×800**；手机 **390×844**（`window.innerWidth/innerHeight` 实测）
- 不把 D/E 正文审、题文审或 G 装配自报当作本页 PASS
- 用户终审：**尚未进行。** 本机页面审核通过不等于用户已批
- 未清理用户 localStorage

## 总评

**PASS。** 给 G 的必须改项：**0**。

| 检查 | 结果 |
|---|---|
| HTTP 200 | **通过**。文章 `200`；博客索引 `200`；切到英文路由 `200` |
| Title / H1 | **通过**。分别记录，不完全相同（seoTitle 带 Kobold 对照 + 站点后缀） |
| Description | **通过**。与锁稿逐字一致 |
| 三张正文图可见；无 FAQ 模块 | **通过** |
| 引用链接 | **通过**。Sources 18 条 href 与公开引用包一致 |
| 切回英文路由 | **通过**。顶栏 English 点到 `/blog/dnd-kobold` |
| 无研究痕迹、无科博德当主名 | **通过**。科博德只出现在排除句 |
| 桌面 + 手机 390×844 | **通过**。两视口均无横向溢出 |

---

## 浏览器与证据

开发服务器：`node` PID 73191 监听 `*:40001`。`x-nextjs-prerender: 1`。

截图目录：`tmp/blog-dnd-kobold/zh/page-review/`

| 文件 | 内容 |
|---|---|
| `desktop-1280x800-top.png` | 中文文首屏：H1、摘要、封面、English 切换 |
| `desktop-1280x800-fig-01.png` | FIG-ZH-01 认脸四格 |
| `desktop-1280x800-fig-02.png` | FIG-ZH-02 瓦罗 XOR 魔邓肯 |
| `desktop-1280x800-fig-03.png` | FIG-ZH-03 两轴断开 |
| `desktop-1280x800-sources.png` | Sources 列表 |
| `desktop-1280x800-en-after-switch.png` | 点 English 后的英文页 |
| `desktop-1280x800-zh-blog-index.png` | `/zh/blog` 首屏 |
| `desktop-1280x800-full.png` | 中文文整页（1280×10553） |
| `mobile-390x844-top.png` | 手机文首屏 |
| `mobile-390x844-fig-01.png` | 手机认脸图 |
| `mobile-390x844-fig-02.png` | 手机锁页图 |
| `mobile-390x844-fig-03.png` | 手机两轴图 |
| `mobile-390x844-sources.png` | 手机 Sources |
| `mobile-390x844-zh-blog-index.png` | 手机「全部文章」第一张为本篇 |
| `mobile-390x844-full.png` | 手机整页（390×16272） |

ego-browser `page.screenshot()` 在 `window.scrollTo` 之后多次拍出纯色黑帧。图文是否可见以 DOM（`complete` / `naturalWidth`）+ 整页截图 + `Page.captureScreenshot({ fromSurface: true })` 为准，不把黑帧写成页面失败。

---

## 1. HTTP

| URL | 状态 | 类型 |
|---|---|---|
| `http://127.0.0.1:40001/zh/blog/dnd-kobold` | **200** | `text/html; charset=utf-8`；导航 `responseStatus=200` |
| `http://127.0.0.1:40001/zh/blog` | **200** | `text/html; charset=utf-8` |
| `http://127.0.0.1:40001/blog/dnd-kobold`（语言切换后） | **200** | `text/html; charset=utf-8` |
| `/blog/covers/en/dnd-kobold-zh-guide.webp` | **200** | `image/webp` 136440 B |
| `/blog/inline/dnd-kobold/kobold-identify-zh.webp` | **200** | `image/webp` 96456 B |
| `/blog/inline/dnd-kobold/kobold-lock-zh.webp` | **200** | `image/webp` 140772 B |
| `/blog/inline/dnd-kobold/kobold-axes-zh.webp` | **200** | `image/webp` 48194 B |

`html lang=zh-CN`。canonical `https://www.tokenmaker.one/zh/blog/dnd-kobold`。hreflang：`x-default`/`en-US` → `/blog/dnd-kobold`；`zh-CN` → `/zh/blog/dnd-kobold`。

---

## 2. Title / H1 / Description

页面实测，不是 registry 自报。

| 字段 | 实测 |
|---|---|
| `document.title` | `DND 狗头人（Kobold）不能同时抄瓦罗和魔邓肯 \| Token Maker` |
| 可见 H1 | `DND 狗头人不能同时抄瓦罗和魔邓肯` |
| `meta[name=description]` | `DND 狗头人（Kobold）是带鳞、小角的小龙类人。写卡只锁瓦罗或魔邓肯其中一页；摇尾乞怜不要叠龙吼。` |
| `og:title` | `DND 狗头人（Kobold）不能同时抄瓦罗和魔邓肯 \| Token Maker` |
| `og:description` | 与 meta description 相同 |
| 首屏摘要（excerpt，H1 下） | `DND 狗头人（Kobold）是带鳞、小角的小龙类人。玩家卡只抄瓦罗或魔邓肯其中一页；同卡出现摇尾乞怜和龙吼就算失败。` |
| Article JSON-LD `headline` | `DND 狗头人（Kobold）不能同时抄瓦罗和魔邓肯` |
| Article JSON-LD `description` | 与 meta description 相同 |

说明：H1 用 `title`（无 Kobold 括注）。document title / OG 用 `seoTitle` + 站点模板 ` | Token Maker`。这是锁稿约定，不是第二承诺。Description 与锁稿逐字一致。

手机 390×844：同一 Title / H1 / Description；H1 折成两行，未溢出（`scrollWidth === 390`）。

---

## 3. 三张正文图；无 FAQ

封面另计。正文 `<article>` 内三张图，滚入后均 `complete=true`，`naturalWidth×Height=1536×1024`。

| 图 | src | 桌面 client | 手机 client | 画面 |
|---|---|---|---|---|
| FIG-ZH-01 | `/blog/inline/dnd-kobold/kobold-identify-zh.webp` | 832×519 | 324×202 | 左上带鳞小角「DND 狗头人 / Kobold」打勾；蜡烛矿工、龙裔、地精打叉「不是这只」。无科博德主名 |
| FIG-ZH-02 | `/blog/inline/dnd-kobold/kobold-lock-zh.webp` | 832×519 | 324×202 | 左瓦罗：摇尾乞怜 / 集群战术 / 日照敏感。右魔邓肯：张口吼叫 + 同心声波，标签龙吼 / 狗头人遗产。中间 XOR 二选一。不是口喷吐息 |
| FIG-ZH-03 | `/blog/inline/dnd-kobold/kobold-axes-zh.webp` | 832×519 | 324×202 | 上轴瓦罗 XOR 魔邓肯；下轴 2014 Kobold（类人/守序邪恶）XOR 2024 狗头人武者（龙类/中立）；标两轴断开 |

懒加载：首屏只解码封面（`_next/image`）。滚到图位后三张正文图解码。封面不代替正文图。

FAQ：

- 可见 H2 无 `FAQ` / `常见问题`
- `details` 数量 0
- JSON-LD 仅 `Article` + `BreadcrumbList`，无 `FAQPage`
- 正文文本无 `FAQ`、无「常见问题」
- 英文路由有 `FAQ about dnd kobold` 和 FAQPage，属英文页，不记中文失败

---

## 4. 引用链接

文末 H2 `Sources` 可见。18 条列表链接与 `public-references.json` R01–R18 的 url 一致：

| 锚 | href |
|---|---|
| 灰机wiki：狗头人 Kobold | `https://dnd.huijiwiki.com/wiki/狗头人` |
| 灰机wiki：种族 / 瓦罗怪物指南 / 狗头人 | 灰机瓦罗路径 |
| D&D 5E 中文化：VGM 狗頭人 | `https://trpgtdnd.weebly.com/vgm-293993895720154.html` |
| 泉媽團：狗頭人 Kobold | Google Sites 瓦罗种族页 |
| 百度百科：狗头人 | `https://baike.baidu.com/item/狗头人/12810154` |
| 维基百科：狗头人 (龙与地下城) | `https://zh.wikipedia.org/zh-cn/狗頭人_(龍與地下城)` |
| D&D Beyond 介绍文 / 勘误 / 十 Species | posts/1248、sae/volos、posts/1783 |
| SRD 5.1 / 5.2.1 PDF | DDB media |
| D&D Beyond 2014 Kobold / Kobold Warrior | monsters/16939、5195096 |
| Reddit 机翻 | `r/DnD/comments/n60scu/.../?tl=zh-hans` |
| Fan Content Policy | `company.wizards.com/en/legal/fancontentpolicy` |
| 本站种族 / 龙裔 / 天狗 | `/zh/blog/dnd-races`、`/zh/blog/dnd-dragonborn`、`/zh/blog/dnd-kenku` |

正文内链同样指向上述来源。无 `${DND_KOBOLD_*}` / `${ZH_DND_*}` 槽位残留。

---

## 5. 切回英文路由

中文页顶栏芯片 `English` → `http://127.0.0.1:40001/blog/dnd-kobold`。实测点击后：

- URL：`/blog/dnd-kobold`
- `document.title`：`Matching CR 1/8 Does Not Make One DnD Kobold | Token Maker`
- H1：`Matching CR 1/8 Does Not Make One DnD Kobold`
- `lang=en`
- 顶栏改回 `中文` → `/zh/blog/dnd-kobold`

不是只改了按钮文案。

---

## 6. 博客索引 `/zh/blog`

HTTP **200**。`lang=zh-CN`。

桌面首屏「编辑精选」仍是职业详解，不是本篇。本篇在「全部文章」列表：**Title** `DND 狗头人不能同时抄瓦罗和魔邓肯`（不是 seoTitle），excerpt 为锁稿 excerpt，href `/zh/blog/dnd-kobold`，封面为中文封面。手机 390×844 滚到该卡后可见。索引缺卡不成立。精选槽位不是本检查失败项。

---

## 7. 研究痕迹与主名

全页 HTML 抽查计数为 0：`tmp/`、`bodyHash`、`Agent E/F`、`PublicReference`、`draft-body`、`candidate-intents`、`google.com/search`、`不是个性化搜索`、`${DND_KOBOLD`、`${ZH_DND`、`已打开`、`未打开`、`作为 AI`、`serp-research`、`task-card`、`lock-record`。

「科博德」正文 5 处，均是排除：

- 对照表「魔兽蜡烛、炉石卡面、科博德、龙裔、地精」
- 「科博德这个音译」
- 「德语矿坑精灵 / 科博德」
- 「中文桌不要用科博德当 DND 主名」
- 上桌核对「卡面或口头是狗头人（Kobold），不是科博德」

Title / H1 / 开篇主名都是狗头人；首次对照 Kobold。科博德不当主名。

---

## 8. 视口

| | 桌面 1280×800 | 手机 390×844 |
|---|---|---|
| `innerWidth × innerHeight` | 1280×800 | 390×844 |
| `documentElement.scrollWidth` | 1280 | 390 |
| 横向溢出 | 无 | 无 |
| H1 | 完整可见，末二字换行 | 两行，未出屏 |
| 三张正文图 | 可见 | 可见，约 324×202，图职责仍可读 |

侧栏「如果你也想做自己的桌面头像 / 打开编辑器」是站点模板，不在正文 HTML 里，不记研究痕迹，也不构成本页必须改。

JSON-LD Article：`inLanguage=zh-CN`，`datePublished=dateModified=2026-09-16`。无 FAQPage。

---

## 剩余风险（非必须改）

1. 用户终审尚未进行。
2. `/zh/blog` 编辑精选卡仍是职业文；本篇在全部文章列表第一张。
3. 英文页有 FAQ，中文页没有。这是锁稿，不要给中文补 FAQ。
4. 本结论只证明 `127.0.0.1:40001` 当前进程上的本地页，不证明部署或线上。

---

## 结论

桌面 1280×800 与手机 390×844 均打开真实本地路由。HTTP 200。Title（seoTitle + ` | Token Maker`）与 H1（无 Kobold 括注）分别符合锁稿。Description 逐字命中。三张正文图可见，无 FAQ 模块。Sources 18 条可点。English 切到 `/blog/dnd-kobold`。无研究痕迹，科博德不是主名。

**PASS**

给 G 的必须改项：**0**。不要把本 PASS 当成用户终审。
