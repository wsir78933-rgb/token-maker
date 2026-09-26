# A-site · 站内上下文与本次初始化

核验时间：2026-09-26T03:08:09.823Z（2026-09-26，Asia/Shanghai 当日）。结论：**PASS，本 Task 范围完成**；底层权限隔离 **UNVERIFIED**，只记录逻辑隔离。此报告不是文章正文、规则核验、独立内容鉴文、页面装配或网站成品验收。

## 身份、授权与边界

- Run: run_39994fa3f53e
- Task: task_e72b1c6074bb
- Dispatch: ctx_73d6551ad3c6
- Codex session: 01a0dbac-a80a-7ee2-85c7-59a84a7f0831（本进程 CODEX_THREAD_ID 实读）
- Worker terminal: term_edce0f10-eb8c-4b6a-a9a2-73304669a7e3
- Coordinator terminal: term_2b5c6082-1ffd-43b2-9816-0e0baf5eea10
- Scope: content-only；keyword: dnd warlock spells；locales: en、zh-CN；country: 均未指定，本任务不推定地区 SERP。
- 写入仅限 editorial/dnd-warlock-spells/research/site/ 和 editorial/dnd-warlock-spells/internal/；全部通过 apply_patch。
- 未写网站源码、未启动项目服务、未新增依赖、未提交/push/deploy、未操作数据库/密钥/Hermes、未改原工作区。未派发子 Agent；只承担 A-site。

已完整读取执行入口.md、01-统一工作流.md、参考规则/事实核验与公开引用.md、03-博客页面生成整合.md（按 A 研究条款执行），以及 ego-browser SKILL.md、Orca 版本匹配 orchestration 指南。未打开工作流验收样稿、旧验收包或历史草稿作为当前素材；注册源/线上已发布文章按任务要求仅用于冲突、近期元数据和读者定位。

## 工作树证据

实际 cwd: /Users/wusir/orca/workspaces/token-maker-app/博客。

```text
$ git status --short
[无输出：初始干净]
$ git worktree list
/Users/wusir/Desktop/开发项目集合/token-maker-app        eb65956 [main]
/Users/wusir/orca/workspaces/token-maker-app/博客        eb65956 [博客]
$ git rev-parse HEAD --git-dir --git-common-dir
eb65956921988db3e6a16164e747d2e517429ad0
/Users/wusir/Desktop/开发项目集合/token-maker-app/.git/worktrees/博客
/Users/wusir/Desktop/开发项目集合/token-maker-app/.git
```

独立检出目录和独立 Git worktree 元数据已验证；共用 Git 对象目录是实际观察，不代表 Agent 文件读取权限隔离。初始 editorial/ 目录不存在，rg --files editorial 返回 ENOENT；这仅证明本工作树当时没有该目录，不证明机器上没有任何旧包。

## 来源与方法

原始站点回读保存在同目录 browser-evidence.json，包含 182 条 sitemap URL 与 lastmod、19 页 HTTP 状态及 DOM 解析的 Title/H1/Description/canonical/JSON-LD 日期/H2。全部 19 页 HTTP 200。

- 浏览器：本地 ego-browser；本 Worker 专用 TaskSpace 22，p1。首页实际 goto + full_page snapshot；后续只读同源 fetch，DOMParser 读取 HTML；另实际 goto 中文 Hex 页并读 article 开头。
- 首页：https://www.tokenmaker.one/ 。Title: DnD Token Maker | Free VTT Token Maker for Roll20 & Foundry VTT；H1: Free DnD Token Maker for Roll20 and Foundry VTT。
- 博客入口：https://www.tokenmaker.one/blog 与 https://www.tokenmaker.one/zh/blog 。双语 H1 明确 DnD Token Maker 指南、VTT 工具、桌面跑团资源，Description 包含职业说明。
- Sitemap：https://www.tokenmaker.one/sitemap.xml ，HTTP 200，共 182 URL；文章路由 134 条（67 个 slug × 2 语言），Warlock slug 命中 0。
- 本地注册源：src/lib/blog/registry.ts；公开读取接口与筛选：src/lib/blog/index.ts；sitemap：src/app/sitemap.ts；文章路由：src/app/(en)/blog/[slug]/page.tsx 与对应 zh 路由；学派元数据常量在 src/lib/blog-posts/dnd-schools-of-magic.ts。
- 本地扫描 136 个 BlogPost 对象（68 × 2）；其中 best-dnd-classes-for-small-parties 两个对象 placeholder:true（registry.ts:842、856），getBlogPosts 过滤 placeholder，解释本地对象数比线上文章 URL 数多 2。literal slug 扫描不包含常量定义的 schools-of-magic，不能把 literal 数当总注册数。

## 主题与站点目标读者

**工具事实 SITE-01（公开可用，仅官方页面宣称范围）：** 首页介绍从角色美术制作 VTT Token，并提及 Roll20、Foundry VTT、Owlbear；本次只观察界面/文字，没有上传、导出或兼容性实测。证据：上列首页及 browser-evidence.json 的首页记录。

**观察 SITE-02：** 博客注册与线上入口覆盖职业解释、职业法术、单法术、冒险模组和规则知识；这说明本站读者内容范围已超出纯图片编辑教程。证据：双语博客入口及相关页 H1/H2。

**分析 SITE-03：** Warlock 法术选取/使用属于现有 DnD 玩家受众的实际主题关系；这支持研究选题，但不替 B 决定最终唯一主意图。没有证据证明 Token Maker 能选法术、校验角色卡或解释规则；本文章可无产品介绍、无 CTA。只有当最终主任务实际需要地图标记时再由 B 判断关联，不因本站有编辑器而强行增加 Token 制作分支。

中文站现有职业 FAQ 使用“契术师（Warlock）”，并与“术士（Sorcerer）”区分；Hex 页也使用“契术师”“巫术印记”。这是**本站术语观察**，不是中文地区搜索量或官方统一译名结论；中文本地表达和搜索意图仍由 A 其他研究任务独立核验。

## 同任务冲突核查

结论：在**完整本地注册对象及当前线上 sitemap** 范围内未发现专门覆盖 Warlock 法术整体选取/列表的同任务文章；不能宣称全网/全部未索引 URL 都不存在。

| 已存在页面（双语均 HTTP 200） | 实际页面主任务 | 与本主题关系 |
|---|---|---|
| /blog/dnd-hex；/zh/blog/dnd-hex | 单法术 Hex：规则、伤害、Eldritch Blast 配合、属性检定、专注、VTT 标记 | 最接近的子问题页面；若正文涉及 Hex，可考虑自然内链，避免把新文变成 Hex 专文重写 |
| /blog/dnd-wizard-spells；/zh/blog/dnd-wizard-spells | Wizard 法术书、准备数、法术位与低级清单 | 职业不同；不能套用其规则到 Warlock，也不复用其正文/任务口吻 |
| /blog/dnd-schools-of-magic；/zh/blog/dnd-schools-of-magic | 八大学派、分类与职业列表/子职的区别 | 法术分类任务，不是 Warlock 选择任务 |
| /blog/dnd-classes-explained；/zh/blog/dnd-classes-explained | 职业概览与选职业 | 可能上游内链；不应在新文重新做全职业选择 |

这些本站页只证明已占用的编辑主题，不作为 D&D 规则的一手事实来源。规则主张仍须 A 规则研究核验官方具体版本。

## 最近三篇：日期合同

F 去套路的主样本取**最近更新**，按线上 dateModified 与 sitemap lastmod 降序：Campaigns（09-24）、Halfling（09-20）、Greenhouse（09-19），每种语言三篇。

首次发布口径不同：Halfling（09-20）、Greenhouse（09-19）之后，Kobold、Wizard Spells、Schools of Magic 都是 09-16；只有日级日期，没有证据给三篇排序。不能伪造唯一“第三篇”，下方保留全部并列者。博客入口首屏不是时间排序：getBlogPosts 保留注册顺序，getBlogPostsForPage 仅 slice；不可把首屏前三卡片当最近发布三篇。

### 最近更新排序

| 顺序 | slug | datePublished | dateModified | 语言 |
|---|---|---|---|---|
| 1 | dnd-campaigns | 2026-09-11 | 2026-09-24 | en、zh-CN |
| 2 | dnd-halfling | 2026-09-20 | 2026-09-20 | en、zh-CN |
| 3 | greenhouse-stardew | 2026-09-19 | 2026-09-19 | en、zh-CN |

### en · dnd-campaigns

- URL / canonical: https://www.tokenmaker.one/blog/dnd-campaigns
- HTTP: 200
- Title（完整 document.title）: New DM? Compare DnD Campaigns by Player Count, Level, and Rules | Token Maker
- H1: New DM? Compare DnD Campaigns by Player Count, Level, and Rules
- Description: Choose a first published adventure by checking official beginner wording, player counts, starting levels, and rules labels, with missing facts left to confirm.
- JSON-LD datePublished: 2026-09-11
- JSON-LD dateModified: 2026-09-24

### en · dnd-halfling

- URL / canonical: https://www.tokenmaker.one/blog/dnd-halfling
- HTTP: 200
- Title（完整 document.title）: D&D Halfling: The Source Label Comes Before the Character Card | Token Maker
- H1: D&D Halfling: The Source Label Comes Before the Character Card
- Description: Learn how the 2014/legacy race and 2024 Basic Rules species differ, then copy the matching traits and creation fields and preserve one readable character cue.
- JSON-LD datePublished: 2026-09-20
- JSON-LD dateModified: 2026-09-20

### en · greenhouse-stardew

- URL / canonical: https://www.tokenmaker.one/blog/greenhouse-stardew
- HTTP: 200
- Title（完整 document.title）: How to Get the Greenhouse in Stardew Valley | Token Maker
- H1: How to Get the Greenhouse in Stardew Valley
- Description: Get the Stardew Valley Greenhouse: finish all Pantry bundles, or buy Joja membership for 5,000g, return next in-game day for the form, buy the 35,000g project, sleep, and check the farm.
- JSON-LD datePublished: 2026-09-19
- JSON-LD dateModified: 2026-09-19

### zh-CN · dnd-campaigns

- URL / canonical: https://www.tokenmaker.one/zh/blog/dnd-campaigns
- HTTP: 200
- Title（完整 document.title）: DND入门模组：第一次带朋友，从哪部开始？ | Token Maker
- H1: DND入门模组：第一次带朋友，从哪部开始？
- Description: 比较《冰塔峰之龙》《失落矿坑》和《破碎方尖碑》，按新 DM 适用说明、可用资料和目标等级选定第一部冒险；人数或资料条件尚未确认时，明确下一步该核对什么。
- JSON-LD datePublished: 2026-09-11
- JSON-LD dateModified: 2026-09-24

### zh-CN · dnd-halfling

- URL / canonical: https://www.tokenmaker.one/zh/blog/dnd-halfling
- HTTP: 200
- Title（完整 document.title）: DND 半身人：25 英尺还是 30 英尺？先锁 2014/2024 规则再填卡 | Token Maker
- H1: DND 半身人：25 英尺还是 30 英尺？先锁 2014/2024 规则再填卡
- Description: 按 DM 允许的来源分开填写 2014 种族或 2024 物种的体型、速度、属性值来源与特性，再核对身份标签和角色棋子在地图缩放下的可读性；年份或旧书许可未确认时，先问 DM。
- JSON-LD datePublished: 2026-09-20
- JSON-LD dateModified: 2026-09-20

### zh-CN · greenhouse-stardew

- URL / canonical: https://www.tokenmaker.one/zh/blog/greenhouse-stardew
- HTTP: 200
- Title（完整 document.title）: 星露谷物语温室怎么解锁：社区中心与 Joja 路线 | Token Maker
- H1: 星露谷物语温室怎么解锁：社区中心与 Joja 路线
- Description: 说明星露谷物语温室的两条解锁路线，分别讲清茶水间普通收集包、Joja 会员与温室项目的条件，以及完成后如何检查温室是否已经可用。
- JSON-LD datePublished: 2026-09-19
- JSON-LD dateModified: 2026-09-19

## 首次发布日期第三名并列：完整元数据补充

以下三篇均 2026-09-16；同日先后未核验。保留线上完整 Title，包括真实存在或不存在的站名后缀，不自动补齐。

### en · dnd-kobold

- URL / canonical: https://www.tokenmaker.one/blog/dnd-kobold
- HTTP: 200
- Title（完整 document.title）: Matching CR 1/8 Does Not Make One DnD Kobold | Token Maker
- H1: Matching CR 1/8 Does Not Make One DnD Kobold
- Description: Tonight's dnd kobold is the 2014 Kobold (Small Humanoid, Lawful Evil) or the 2024 Kobold Warrior (Small Dragon, Neutral). Copy that page only.
- JSON-LD datePublished: 2026-09-16
- JSON-LD dateModified: 2026-09-16

### en · dnd-wizard-spells

- URL / canonical: https://www.tokenmaker.one/blog/dnd-wizard-spells
- HTTP: 200
- Title（完整 document.title）: DnD Wizard Spells: Prepare From the Spellbook, Not the Catalog | Token Maker
- H1: DnD Wizard Spells: Prepare From the Spellbook, Not the Catalog
- Description: dnd wizard spells on a legal sheet are prepared names from your spellbook, not a mixed catalog. Write 2014 or 2024 first, count spellbook / prepared / slots, skip rituals when the year allows, and keep one concentration job. 2014 uses Intelligence plus Wizard level; 2024 uses the Prepared Spells column (four at level 1, six at level 3).
- JSON-LD datePublished: 2026-09-16
- JSON-LD dateModified: 2026-09-16

### en · dnd-schools-of-magic

- URL / canonical: https://www.tokenmaker.one/blog/dnd-schools-of-magic
- HTTP: 200
- Title（完整 document.title）: D&D Schools of Magic: Eight Categories, Not a Class Ability | Token Maker
- H1: D&D Schools of Magic Explained: The Eight Spell Schools and How to Read Them
- Description: dnd schools of magic names eight 2024 spell categories, not class features. Pair each school with a checked example, then check the spell, class list, and rules year.
- JSON-LD datePublished: 2026-09-16
- JSON-LD dateModified: 2026-09-16

### zh-CN · dnd-kobold

- URL / canonical: https://www.tokenmaker.one/zh/blog/dnd-kobold
- HTTP: 200
- Title（完整 document.title）: DND 狗头人（Kobold）不能同时抄瓦罗和魔邓肯 | Token Maker
- H1: DND 狗头人不能同时抄瓦罗和魔邓肯
- Description: DND 狗头人（Kobold）是带鳞、小角的小龙类人。写卡只锁瓦罗或魔邓肯其中一页；摇尾乞怜不要叠龙吼。
- JSON-LD datePublished: 2026-09-16
- JSON-LD dateModified: 2026-09-16

### zh-CN · dnd-wizard-spells

- URL / canonical: https://www.tokenmaker.one/zh/blog/dnd-wizard-spells
- HTTP: 200
- Title（完整 document.title）: DND 法师法术（Wizard）：书里有 6 个，不等于今天准备 6 个 | Token Maker
- H1: DND 法师法术：书里有 6 个，不等于今天准备 6 个
- Description: 开团前先写 2014 或 2024，再把法术书、准备法术和法术位分成三栏；按场景写出可回算的 1–3 级低环清单。
- JSON-LD datePublished: 2026-09-16
- JSON-LD dateModified: 2026-09-16

### zh-CN · dnd-schools-of-magic

- URL / canonical: https://www.tokenmaker.one/zh/blog/dnd-schools-of-magic
- HTTP: 200
- Title（完整 document.title）: 龙与地下城八大法术学派：分类、示例与版次区别
- H1: 龙与地下城法术学派详解：八大学派与查阅方法
- Description: 了解龙与地下城八大法术学派及其代表法术，分清法术分类、职业法术列表与法师子职，并通过疗伤术和侦测魔法核对 2014 年与 2024 年规则的区别。
- JSON-LD datePublished: 2026-09-16
- JSON-LD dateModified: 2026-09-16

## 给 F 的去套路证据提示（分析，不是标题草案）

最近更新三篇的实际形式分别是：新 DM 提问与比较、来源/规则年份先于建卡、how-to 与双路线。日期并列补充篇里，“X 不等于 Y / not”以及“先锁年份再抄卡”的标题/段落形式重复出现。F 应根据最终正文承诺生成自己的 10 个候选并检验是否复用这些套路；A-site 不提供最终标题、不调整正文，也不要求文章为避套路改变事实。H1 与 Title 不总相同，中文学派 Title 还没有站名后缀，均已逐页保留。

## 内部初始化与隔离记录

- internal/operation-store.json 已写入真实 Run/Task/Dispatch/session、scope=content-only、双语范围及唯一污染标记和 SHA-256；值只在内部文件，未放入本报告、网页证据或交付给 C。
- internal/revision-budget.json：en used=0,max=3；zh-CN used=0,max=3；后续由协调者指定最终验证 owner 更新，跨阶段共用，不得重置。
- 写后实读：JSON 解析、Run/scope、污染标记 SHA-256 重算均 PASS；预算精确值 PASS。A-site 文件可读，实际权限 0644。
- 只观察到共享目录和提示约束，没有来自 C 真实上下文的拒读回执，没有逐角色底层权限策略；**逻辑隔离，未验证底层权限**。不把 Hash 扫描当成权限隔离。
- 已扫描本 Task 的 research/site 文件，精确标记及其 hash 命中 0。此扫描不覆盖尚不存在的 C 正文/SEO/媒体文字/公开引用，也不证明语义改写污染不存在；后续验证 owner 仍需对最终产物扫描及语义审核。
- C 可获得站内事实与必要 URL；不应读取 internal/operation-store.json，也不应把本编辑报告整段灌入正文。

## 验证命令、退出码与限制

| 验证 | 实际命令/方法 | 退出码/关键输出 | 判定 |
|---|---|---|---|
| Runtime/provenance | orca status --json；orca orchestration check --terminal term_edce0f10-eb8c-4b6a-a9a2-73304669a7e3 --json | 0；runtime ready；run_39994fa3f53e / ctx_73d6551ad3c6 | PASS |
| 工作树 | pwd；git status --short；git worktree list；git rev-parse HEAD --git-dir --git-common-dir | 0；独立博客工作树，初始 clean，HEAD 如上 | PASS |
| 线上页面 | ego-browser nodejs heredoc，同源 fetch + DOMParser | 0；19/19 HTTP 200；sitemap 182；134 文章 URL；warlock 路由 0 | PASS |
| 元数据排序 | Python 标准库读取 registry.ts 与学派常量，提取 publishedAt/updatedAt；与线上 JSON-LD 比较 | 0；双语最近更新三篇一致，首次发布第三名三篇同日 | PASS，日内顺序 UNVERIFIED |
| 本地与 sitemap 数量 | ego-browser Node fs 读取绝对路径并对比；rg 定位 placeholder | 0；唯一 literal 缺席 slug 为 best-dnd-classes-for-small-parties；双语 placeholder:true | PASS |
| 初始化 | Python JSON 实读、hashlib SHA-256 重算、精确预算 assert | 0；PASS operation-store JSON/readback, run/scope, canary SHA-256；en=0/3 zh-CN=0/3 | PASS |
| 隔离 | os.access/stat，仅本 Worker 上下文 | 0；A-site readable=True,file_mode=0o644；C-context probe=NOT_RUN | UNVERIFIED，逻辑隔离 |

实际失败也保留：首次在 ego-browser Node 脚本中以相对路径读取 src/lib/blog/registry.ts 返回 ENOENT，进程 exit 1（浏览器脚本 cwd 并非工作树）。后续用准确绝对路径重试 exit 0，完成同一只读比对；没有改运行环境。最初 rg 查 editorial 不存在返回 2，是初始化前真实状态；未隐藏该输出。

未运行 typecheck/lint/test/build：此 Task 没有源码或 UI 变更，只有研究证据与内部 JSON；已读 package.json scripts，未用构建替代研究验证。未执行地区 SERP、规则事实核验、文章写作、图片生成、页面装配、浏览器桌面/手机成品验收、部署或用户终审；这些不属于 A-site 完成声明。

## 本 Task 写入文件

1. research/site/site-context.md（本报告）
2. research/site/browser-evidence.json（本次站点原始回读）
3. internal/operation-store.json（仅内部）
4. internal/revision-budget.json（仅内部）

最终机械验证（Python 标准库，exit 0）：`PASS 8/8 groups: provenance, scope, canary hash, budgets, HTTP 19/19, sitemap 182, report metadata 12/12, marker absence in A-site research`。`git diff --check` exit 0，`git diff --name-only` 无输出（网站 tracked 文件未改），`git status --short` 为 `?? editorial/`。ego-browser `taskSpace(22).finish({keep:[]})` exit 0，输出 `PASS TaskSpace 22 finished; no pages retained`。没有网站成品或搜索排名效果声明。
