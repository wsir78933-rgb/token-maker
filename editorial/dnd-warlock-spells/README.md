# dnd warlock spells 内容交付入口

## 当前交付状态

英、中两套 content-only 文章包均已完成制作并交用户审阅。当前结论是
**USER_REVIEW_PENDING**，不是内容通过、不是 CONTENT_FROZEN，也不是网站完成或已部署。
用户原话为：**“确认，不用复审，我自己来审”**；因此两语言均为
independentReview=SKIPPED_BY_USER、userReview=PENDING。本入口只做交付索引和机械回读。

| 语言 | 文章入口 | 正文计数（Sources 排除） | 当前 body SHA-256 |
| --- | --- | ---: | --- |
| English | [final/en/article.md](final/en/article.md) | 2715 | 8157eafe471a40936ed0fc0205eca51222126eacefd5d514c385c73b06710428 |
| 简体中文 | [final/zh-CN/article.md](final/zh-CN/article.md) | 3224 | 31df1846c4bc36a50535fc4f0d3e2d2c30468c42c585d60b540f7434cb610e3e |

## 双语交付包

| 语言 | 正文 | SEO | 公开引用 | PublicBlogHandoff | 公开署名 |
| --- | --- | --- | --- | --- | --- |
| English | [body.md](final/en/body.md) | [seo.json](final/en/seo.json) | [public-references.json](final/en/public-references.json) | [PublicBlogHandoff.json](final/en/PublicBlogHandoff.json) | [attribution.md](final/en/attribution.md) |
| 简体中文 | [body.md](final/zh-CN/body.md) | [seo.json](final/zh-CN/seo.json) | [public-references.json](final/zh-CN/public-references.json) | [PublicBlogHandoff.json](final/zh-CN/PublicBlogHandoff.json) | [attribution.md](final/zh-CN/attribution.md) |

当前包的 article、正文、SEO、公开引用、署名和 Handoff 已按各自
bodyHash / publicFieldsHash 机械绑定；详细命令、退出码与快照见
[交付收尾记录](reviews/delivery-user-review.md)。

## 当前引用图片

图片路径均从当前正文实际引用回读，旧规则／流程图文件保留但不属于当前引用：

| 语言 | 当前图片 | 技术回读 |
| --- | --- | --- |
| English | [eldritch-blast.webp](media/characters/eldritch-blast.webp)、[arcane-flight.webp](media/characters/arcane-flight.webp)、[focused-concentration.webp](media/characters/focused-concentration.webp) | 均为 1536×1024 WebP；正文无旧图引用 |
| 简体中文 | [eldritch-blast.webp](media/characters/eldritch-blast.webp) | 1536×1024 WebP；正文无旧图引用 |

图注和 alt 只描述实际可见主体，不把艺术想象当作精确法术数量、距离或机制证明。

## 修订预算与用户例外

- 原修订预算保留：English 2/3，简体中文 3/3；本次视觉换版是用户明确授权的额外制作例外，不偷偷重置预算，也不启动 Round 4。
- SEO 文件和 SEO 报告属于制作交付，不属于本次独立复审；本任务不安排新 D/E/独立 review。
- 旧 assembly、image、SEO、final-validation 报告保留为历史记录；它们不改变当前用户审阅状态。

## 机械边界

- 已回读 UTF-8/NFC/LF、draft/final 正文一致、正文计数、JSON parse、hash 绑定、公开引用定位、当前图片存在与尺寸。
- 未执行内容语义复审、D/E 门、独立复审、精确地区 SERP、浏览器页面验收、网站写入、HTML 生成、部署或联网研究；这些均为 UNVERIFIED。
- 原代码未改；收尾快照中的 git status --short --branch 为 ## 博客 与 ?? editorial/。生命周期最终关闭由协调者处理。
