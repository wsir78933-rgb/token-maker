# dnd warlock spells 内容交付入口

## 当前交付状态

英、中两套文章包均已交用户审阅；本次补充修订中文正文、标题、来源标签和公开署名，
并同步本地站点的中文内容。当前结论仍是 **USER_REVIEW_PENDING**，
不代表用户验收通过、CONTENT_FROZEN 或已部署。
用户原话为：**“确认，不用复审，我自己来审”**；因此两语言均为
independentReview=SKIPPED_BY_USER、userReview=PENDING。本入口只做交付索引和机械回读。

| 语言 | 文章入口 | 正文计数（Sources／来源表排除） | 当前 body SHA-256 |
| --- | --- | ---: | --- |
| English | [final/en/article.md](final/en/article.md) | 2705 | 1eae6c71bdfa52844ba4df0e111f8cdcc366276433a0c2e5dffb3b369beafbbe |
| 简体中文 | [final/zh-CN/article.md](final/zh-CN/article.md) | 3624 | 34a04c5635fec4a14d44d4492d721225c6e4ebb8bf52171581725ac3d82386fa |

## 双语交付包

| 语言 | 正文 | SEO | 公开引用 | PublicBlogHandoff | 公开署名 |
| --- | --- | --- | --- | --- | --- |
| English | [body.md](final/en/body.md) | [seo.json](final/en/seo.json) | [public-references.json](final/en/public-references.json) | [PublicBlogHandoff.json](final/en/PublicBlogHandoff.json) | [attribution.md](final/en/attribution.md) |
| 简体中文 | [body.md](final/zh-CN/body.md) | [seo.json](final/zh-CN/seo.json) | [public-references.json](final/zh-CN/public-references.json) | [PublicBlogHandoff.json](final/zh-CN/PublicBlogHandoff.json) | [attribution.md](final/zh-CN/attribution.md) |

当前中文包的 article、正文、SEO、公开引用、署名和 Handoff 已按各自哈希机械绑定；
本次验证见下方记录。[旧交付收尾记录](reviews/delivery-user-review.md)保留为历史快照，
其中旧计数、正文和“未进行站点绑定”的说明不代表本次结果。

## 当前引用图片

图片路径均从当前正文实际引用回读，旧规则／流程图文件保留但不属于当前引用：

| 语言 | 当前图片 | 技术回读 |
| --- | --- | --- |
| English | [eldritch-blast.webp](media/characters/eldritch-blast.webp)、[arcane-flight.webp](media/characters/arcane-flight.webp)、[focused-concentration.webp](media/characters/focused-concentration.webp) | 均为 1536×1024 WebP；正文无旧图引用 |
| 简体中文 | [eldritch-blast.webp](media/characters/eldritch-blast.webp) | 1536×1024 WebP；正文无旧图引用 |

图注和 alt 只描述实际可见主体，不把艺术想象当作精确法术数量、距离或机制证明。

## 修订预算与用户例外

- 原修订预算保留：English 2/3，简体中文 3/3；本次视觉换版是用户明确授权的额外制作例外，不偷偷重置预算，也不启动 Round 4。
- 中文本地化是用户随后授权的直接修订，维持原预算和待用户审阅状态；未新增调研或独立复审。
- 本次同步现有中文 seo.json、Handoff.seo 与 seoHash；英文 SEO 和旧 SEO 报告未改，不安排新 D/E/独立 review。
- 旧 assembly、image、SEO、final-validation 报告保留为历史记录；它们不改变当前用户审阅状态。

## 中文本地化与署名修订（2026-09-26）

中文标题现为“龙与地下城契术师法术：远程、控场、位移、反应怎么选”。普通规则说明、
表格和来源标签使用中文；契术魔法及七个法术仅在首次必要处各保留一次英文括注。
正文精确词组 `dnd warlock spells` 保留一次，中文标题和摘要不再重复。
公开署名默认显示中文说明，英文法律原文完整保留在默认关闭的 `<details>` 中，
展开标题为“查看许可原文”；原文及两个许可相关 URL 未改。

图片路径、alt、caption 原样保留，因此图注中的一次 `Eldritch Blast` 也保留。
规则数字、版本边界、来源 URL、分类、状态、English 内容包与 English bodyHtml 未变。

| 验证 | 命令或方法 | 退出码与结果 |
| --- | --- | --- |
| 中文正文计数 | `python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py editorial/dnd-warlock-spells/final/zh-CN/body.md --locale zh-CN --exclude-heading 来源表` | 0；3624，最低要求 2000 |
| 内容包一致性 | Python 内联校验 JSON、UTF-8/NFC/LF/无 BOM、article/body 组装、署名、引用定位、SEO、状态和 SHA-256 | 0；全部通过，仍为 USER_REVIEW_PENDING / SKIPPED_BY_USER / PENDING / NOT_FROZEN |
| 页面内容绑定 | 逐块比对中文 Markdown 与现有 HTML 的正文、标题、表格单元格；比对原始来源 URL 顺序、数字、图片属性和英文模板 | 0；全部通过 |
| 英文残留 | 排除来源表、图片及不变图注，允许精确查询词、首次术语括注、官方品牌、SRD 与骰子表达式 | 0；查询词 1 次，8 个术语各 1 次，允许项之外的英文字母 0 |
| 文章回归 | `pnpm exec vitest run src/lib/blog/dnd-warlock-spells.test.ts` | 0；6 通过、0 失败 |
| 叙述风格回归 | `pnpm exec vitest run src/lib/blog/index.test.ts -t "does not use author-facing search-intent or content-planning narration"` | 0；1 通过、126 跳过、0 失败 |
| 定向 Lint | `pnpm exec eslint src/lib/blog-posts/dnd-warlock-spells.ts src/lib/blog/dnd-warlock-spells.test.ts` | 0；无诊断 |
| 差异空白检查 | `git diff --check --` 后附本次九个允许文件 | 0；无诊断 |
| 本地页面回读 | ego-browser，`http://localhost:40001/zh/blog/dnd-warlock-spells` | 0；中文标题、摘要、署名可见，默认英文原文不可见；点击后显示，收起后再次隐藏 |

页面仍有 3 张表格，其中来源表 10 行及 10 个原链接；正文人物图片已加载，
回读宽度 1536，alt 和图注与内容包一致。署名的中文说明和英文原文均保留原文档与许可链接。
哈希算法沿用 Handoff：文件哈希针对原始 UTF-8 字节，publicFieldsHash 对排除根 integrity
后的对象递归排序键，以不带空白或末尾换行的 UTF-8 JSON 计算 SHA-256。

本次未运行仓库全量 typecheck、全量测试或 build，未部署、未验证外部服务或新增联网研究。
未改 draft、research、reviews、英文内容包或规则预算；旧 draft 不再作为本次 final 正文一致性的依据。
上述为本地机械检查与页面回读，用户最终验收仍待进行。
