# PublicBlogHandoff — ZH `dnd kobold`（已冻结，供 G 装配）

Role: F-ZH。Date: 2026-09-16.  
Mode: project-write。**已 freeze。** E 题文 PASS（`tmp/blog-dnd-kobold/zh/e-title-review.md`）。G 可按本文件装配现有网站。  
内部 10 候选只在 `title-candidates.md`，不进入本文件、不渲染到页面。

未改 `src/` / `public/`。未 commit。正文未改。

---

## locale / country

- locale: `zh-CN`
- country: `CN`（A 已标明不是精确中国大陆 SERP；地区证据为 Google `hl=zh-CN&gl=cn` 与百度中文样本）
- site: https://www.tokenmaker.one
- 建议路由: `/zh/blog/dnd-kobold`

## body

- 锁定文本: `tmp/blog-dnd-kobold/zh/draft-body.html`
- 格式: HTML fragment（无 Title/H1、无封面插入、无 import）
- bodyHash: `d78f0ba3312a9686b27566ce7c835913c1d6963eb555731f292b9d36c6e2c3bf`
- NFC / UTF-8 / LF: 已对齐；规范化不改字节
- 装配槽（G 替换为真实 public URL，替换后若写入 body 须重算 hash）:
  - `${DND_KOBOLD_IDENTIFY_ZH_IMAGE_PATH}`
  - `${DND_KOBOLD_LOCK_ZH_IMAGE_PATH}`
  - `${DND_KOBOLD_AXES_ZH_IMAGE_PATH}`
  - `${ZH_DND_RACES_PATH}` → `/zh/blog/dnd-races`
  - `${ZH_DND_DRAGONBORN_PATH}` → `/zh/blog/dnd-dragonborn`
  - `${ZH_DND_KENKU_PATH}` → `/zh/blog/dnd-kenku`
- 不得改写正文句子、图注、链接锚文本或图中事实。

## seo

E 题文已通过。G 可写入 registry，不得改 Title / H1 / Description / slug。H1 用 Title；document title 用 seoTitle；不要再加第二句工作题。FAQ：正文无 FAQ，`faqItems` 保持空数组。

| 字段 | 值 |
|---|---|
| slug | `dnd-kobold` |
| title / H1 | DND 狗头人不能同时抄瓦罗和魔邓肯 |
| seoTitle | DND 狗头人（Kobold）不能同时抄瓦罗和魔邓肯 |
| metaDescription | DND 狗头人（Kobold）是带鳞、小角的小龙类人。写卡只锁瓦罗或魔邓肯其中一页；摇尾乞怜不要叠龙吼。 |
| excerpt | DND 狗头人（Kobold）是带鳞、小角的小龙类人。玩家卡只抄瓦罗或魔邓肯其中一页；同卡出现摇尾乞怜和龙吼就算失败。 |
| coverLabel | 种族百科 |
| relatedSlugs | `dnd-kenku`, `dnd-dragonborn`, `dnd-races` |
| ogTitle | `{seoTitle} \| Token Maker`（现有 `createBlogPostMetadata` 模板；不要把后缀写进 seoTitle） |
| canonical | `/zh/blog/dnd-kobold` |

H2/H3（TOC 由正文生成，不要另写主张）：

- 为什么叫狗头人，现在长什么样
- 先划开五只会搜进来的名字
- 要写卡就先锁：瓦罗还是魔邓肯
  - 瓦罗这一页有什么、没有什么
  - 魔邓肯这一页换成了什么
  - 中文瓦罗页仍印力量 -2
  - 2024 核心十个 Species 没有狗头人
- 怪物页是另一条分叉，不要抄进玩家卡
- Sources

CTA：工具自然使用位置为无。正文无编辑器入口。不要在组页时把 Token Maker 步骤、棋子教程或编辑器 CTA 补进正文。页面底栏若沿用站点模板，不得新编「已导入某战役」或 Kobold 专用模板承诺。

## publicReferences

定位：HTML 正文，`{quote, occurrence}`。quote 是 `draft-body.html` NFC 原文精确片段；occurrence 从 1 计。引用 ID 不渲染到文章。本层已核 18 条 quote 均可定位。

| id | label | url | quote | occurrence | versionNote |
|---|---|---|---|---|---|
| R01 | 灰机wiki：狗头人 Kobold（魔邓肯） | https://dnd.huijiwiki.com/wiki/%E7%8B%97%E5%A4%B4%E4%BA%BA | 多元宇宙中最小的龙类生物，鳞片通常铁锈色 | 1 | 社区译文，不是威世智简体官方纸书 |
| R01 | 灰机wiki：狗头人 Kobold（魔邓肯） | https://dnd.huijiwiki.com/wiki/%E7%8B%97%E5%A4%B4%E4%BA%BA | 灰机魔邓肯页可见：类人、小型、速度 30 尺、黑暗视觉 60 尺。 | 1 | 灰机该页字段，以桌上的书为准 |
| R01 | 灰机wiki：狗头人 Kobold（魔邓肯） | https://dnd.huijiwiki.com/wiki/%E7%8B%97%E5%A4%B4%E4%BA%BA | 灰机写成狡猾 / 反抗 / 龙族术法 | 1 | 社区译文 |
| R02 | 灰机wiki：种族 / 瓦罗怪物指南 / 狗头人 | https://dnd.huijiwiki.com/wiki/%E7%A7%8D%E6%97%8F/%E7%93%A6%E7%BD%97%E6%80%AA%E7%89%A9%E6%8C%87%E5%8D%97/%E7%8B%97%E5%A4%B4%E4%BA%BA | 看见龙吼或狗头人遗产，说明你把魔邓肯叠进来了。 | 1 | 社区译文；特质名摇尾乞怜、集群战术、日照敏感 |
| R03 | D&D 5E 中文化：VGM 狗頭人 | https://trpgtdnd.weebly.com/vgm-293993895720154.html | 和灰机瓦罗页仍常见敏捷 +2、力量 -2。这是印本和中文转录还在用的写法。 | 1 | 繁体社区转录，仍印敏捷 +2 / 力量 -2 |
| R04 | 泉媽團：狗頭人 Kobold | https://sites.google.com/view/izumi-dnd-5e/%E5%89%B5%E5%BB%BA%E8%A7%92%E8%89%B2/%E7%A8%AE%E6%97%8F/%E6%80%AA%E7%89%A9%E7%A8%AE%E6%97%8F/%E7%8B%97%E9%A0%AD%E4%BA%BA | 和灰机瓦罗页仍常见敏捷 +2、力量 -2。这是印本和中文转录还在用的写法。 | 1 | 与 R03 同句；瓦罗怪物種族页 |
| R04 | 泉媽團：狗頭人 Kobold | https://sites.google.com/view/izumi-dnd-5e/%E5%89%B5%E5%BB%BA%E8%A7%92%E8%89%B2/%E7%A8%AE%E6%97%8F/%E6%80%AA%E7%89%A9%E7%A8%AE%E6%97%8F/%E7%8B%97%E9%A0%AD%E4%BA%BA | 都指向 Kurtulmak。不要并成第三个神 | 1 | 神名库尔图马克 |
| R05 | 百度百科：狗头人 | https://baike.baidu.com/item/%E7%8B%97%E5%A4%B4%E4%BA%BA/12810154 | 写鳞片、乳白色小角、地底 | 1 | 旧设定介绍，不是 5e 玩家页 |
| R05 | 百度百科：狗头人 | https://baike.baidu.com/item/%E7%8B%97%E5%A4%B4%E4%BA%BA/12810154 | 百科上的守序邪恶、克图玛、陷阱风味是旧设定介绍，不是 5e 玩家特质，也不是 2024 武者页。 | 1 | 旧设定介绍 |
| R06 | 维基百科：狗头人 (龙与地下城) | https://zh.wikipedia.org/zh-cn/%E7%8B%97%E9%A0%AD%E4%BA%BA_(%E9%BE%8D%E8%88%87%E5%9C%B0%E4%B8%8B%E5%9F%8E) | 维基第一句还写「又称寇伯」，那是维基别称，灰机、百科和泉媽團都不用，卡面也不要改。 | 1 | 别称寇伯仅维基一句 |
| R06 | 维基百科：狗头人 (龙与地下城) | https://zh.wikipedia.org/zh-cn/%E7%8B%97%E9%A0%AD%E4%BA%BA_(%E9%BE%8D%E8%88%87%E5%9C%B0%E4%B8%8B%E5%9F%8E) | 人头改为狗头，渐渐演变成鳄鱼头。条目自己标明缺来源。 | 1 | 形象变迁段自陈缺来源 |
| R07 | D&D Beyond：Exploring the New Goblin, Hobgoblin, and Kobold Races | https://www.dndbeyond.com/posts/1248-exploring-the-new-goblin-hobgoblin-and-kobold | 奖励动作；你与盟友获得攻击优势；次数等于熟练加值，长休恢复；不要求盟友站在目标 5 尺内 | 1 | 官方介绍文转述上限；未打开 MotM 付费种族页 |
| R07 | D&D Beyond：Exploring the New Goblin, Hobgoblin, and Kobold Races | https://www.dndbeyond.com/posts/1248-exploring-the-new-goblin-hobgoblin-and-kobold | 浮动 +2/+1 或三个 +1 | 1 | 介绍文 |
| R07 | D&D Beyond：Exploring the New Goblin, Hobgoblin, and Kobold Races | https://www.dndbeyond.com/posts/1248-exploring-the-new-goblin-hobgoblin-and-kobold | 介绍文新特质清单未列入 | 1 | 不是「已删除」逐字句 |
| R08 | D&D Beyond：Volo’s Guide to Monsters Sage Advice & Errata | https://www.dndbeyond.com/sources/dnd/sae/volos-guide-to-monsters | 把属性改为只有敏捷 +2，并删除 Alignment 特质 | 1 | 官方勘误 |
| R09 | D&D Beyond：The 10 Species in the 2024 Player’s Handbook | https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook | 2024《玩家手册》核心十个 Species 是：Aasimar、Dragonborn、Dwarf、Elf、Gnome、Goliath、Halfling、Human、Orc、Tiefling。 | 1 | 核心十 Species 无狗头人 |
| R09 | D&D Beyond：The 10 Species in the 2024 Player’s Handbook | https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook | 旧书物种仍可用；2024 属性加值改由背景提供 | 1 | 加值改由背景提供 |
| R09 | D&D Beyond：The 10 Species in the 2024 Player’s Handbook | https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook | 不要把旧种族的敏捷 +2 叠进背景加值 | 1 | 正文禁叠 |
| R10 | SRD 5.1（CC-BY）Kobold | https://media.dndbeyond.com/compendium-images/srd/5.1/SRD_CC_v5.1.pdf | Small Humanoid (kobold) | 1 | CC-BY；复述要点，未整块粘贴 |
| R10 | SRD 5.1（CC-BY）Kobold | https://media.dndbeyond.com/compendium-images/srd/5.1/SRD_CC_v5.1.pdf | 2014 有匕首和投石索 | 1 | CC-BY |
| R11 | SRD 5.2.1（CC-BY）Kobold Warrior | https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf | 能力检定 + 攻击都劣势，范围更宽 | 1 | 社区条目名狗头人武者，不是已核验威世智简体纸书译名 |
| R11 | SRD 5.2.1（CC-BY）Kobold Warrior | https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf | 2024 武者是三把匕首、无投石索。护甲等级和生命值从 12 与 5 变为 14 与 7。 | 1 | CC-BY |
| R12 | D&D Beyond：2014 Kobold | https://www.dndbeyond.com/monsters/16939-kobold | 2014 / SRD 5.1 Kobold | 1 | 与 SRD 5.1 对照的 2014 怪物页 |
| R13 | D&D Beyond：Kobold Warrior | https://www.dndbeyond.com/monsters/5195096-kobold-warrior | 完整骰子公式不必抄进玩家卡。第三方 wiki 给 2024 武者写 Frightened 免疫：官方怪物页没有这一行，不要采用。 | 1 | 官方怪物页无 Frightened 免疫 |
| R14 | Reddit 机翻：大家对5e的狗头人有什么看法？ | https://www.reddit.com/r/DnD/comments/n60scu/how_do_people_feel_about_the_5e_kobolds/?tl=zh-hans | 该机翻还把后来的遗产说成哥布林特质，禁止沿用。 | 1 | 机翻不当规则 |
| R15 | Wizards of the Coast Fan Content Policy | https://company.wizards.com/en/legal/fancontentpolicy | 本页是 unofficial 同人介绍，不是威世智官方页面 | 1 | unofficial；不用官方商标冒充官方 |
| R16 | 本站：DND 种族怎么选 | https://www.tokenmaker.one/zh/blog/dnd-races | 十个名字见 | 1 | 正文内链为 `${ZH_DND_RACES_PATH}` |
| R17 | 本站：DND 龙裔 | https://www.tokenmaker.one/zh/blog/dnd-dragonborn | 龙裔是玩家手册里的龙血两足，块头更大、角更龙。 | 1 | 正文内链为 `${ZH_DND_DRAGONBORN_PATH}` |
| R18 | 本站：DND 天狗 Kenku | https://www.tokenmaker.one/zh/blog/dnd-kenku | 天狗文</a>也是先问瓦罗还是魔邓肯。 | 1 | 正文内链为 `${ZH_DND_KENKU_PATH}` |

完整公开引用清单与 `public-references.json` 一致，18 条均保留。不要把 NGA、贴吧、百度知道、B 站、17173、Misty Mountain、第三方 wiki 的 Frightened 行写入 Sources。

## publicRequirements

### 封面（不插入正文）

| 项 | 值 |
|---|---|
| 源文件 | `tmp/blog-dnd-kobold/zh/figures/cover-kobold-zh.png` |
| 尺寸 | 1920×1080 |
| 建议 public | `/blog/covers/zh/dnd-kobold-guide.webp` |
| alt | 带鳞小角的小型龙类人站在地底石廊里，铁锈鳞片，乳白色短角，手里是短剑，不是矿镐 |
| 规则 | 身份装饰。不承担锁页特质名、力量 -2 或编辑器截图。壁灯不是头顶蜡烛 |

### 正文图

| ID | 源文件 | 尺寸 | 正文槽 | 建议 public | alt（已锁正文） | caption（已锁正文） |
|---|---|---|---|---|---|---|
| FIG-ZH-01 | `tmp/blog-dnd-kobold/zh/figures/fig-zh-01-identify.png` | 1536×1024 | H2 五路分流，表前 | `/blog/inline/dnd-kobold/identify-zh.webp` | 四格辨认：带鳞小角的 DND 狗头人 Kobold、顶蜡烛的矿工、龙裔、地精，后三格标明不是这只 | 留下鳞片和小角才是 DND 狗头人。图是辨认示意，不是官方书页，也不是某款游戏截图。 |
| FIG-ZH-02 | `tmp/blog-dnd-kobold/zh/figures/fig-zh-02-lock.png` | 1536×1024 | H2 锁页，H3 前 | `/blog/inline/dnd-kobold/lock-zh.webp` | 对照示意：左边瓦罗狗头人卡写着摇尾乞怜、集群战术、日照敏感，右边魔邓肯卡写着龙吼、狗头人遗产，中间写先问 DM 锁哪一页 | 瓦罗这一页是摇尾乞怜和日照敏感，魔邓肯这一页是龙吼和狗头人遗产。图是锁页示意，不是官方书页扫描。 |
| FIG-ZH-03 | `tmp/blog-dnd-kobold/zh/figures/fig-zh-03-axes.png` | 1536×1024 | H2 怪物轴，对照表前 | `/blog/inline/dnd-kobold/axes-zh.webp` | 示意图：上方玩家轴在瓦罗和魔邓肯里二选一，下方怪物轴在 2014 Kobold 和 2024 狗头人武者里二选一，两轴不相交 | 玩家抄瓦罗或魔邓肯其中一页；怪物另锁 2014 或 2024 狗头人武者。图是分叉示意，不是统计块。 |

FIG-ZH-02 右卡必须保持张口吼叫 + 环形声波。不要换成口喷能量或锥形吐息。封面不要复用进 H2。无 D&D logo。无科博德。力量 -2、AC、HP 不要从图里读。

### 内链（正文已有）

- `/zh/blog/dnd-races` — 2024 核心十 Species，无狗头人
- `/zh/blog/dnd-dragonborn` — 划开龙裔
- `/zh/blog/dnd-kenku` — 同类先问瓦罗还是魔邓肯
- 不要链占位文 `how-to-build-a-dnd-character-token`
- 正文未链编辑器：不要在组页时补进正文

### 其它装配

- 类名保持 `inline-figure inline-figure--wide-crop` / `inline-figure__image inline-figure__image--wide`
- width/height 保持 1536 / 1024
- Fan Content 与 SRD CC-BY 署名已在正文；不要另造作者名或发布日期占位
- 无 Kobold 专用模板；无正文 CTA

## integrity

| 项 | 状态 |
|---|---|
| bodyHash | `d78f0ba3312a9686b27566ce7c835913c1d6963eb555731f292b9d36c6e2c3bf` |
| 计数 | 2887 汉字 ≥ 2000（`lock-record.md`） |
| D 正文 | PASS，同 hash（`d-check-r2.md`） |
| E 正文 | PASS，同 hash（`e-review-r2.md`）；第 8 层用户终审未做 |
| E 题文 | PASS（`e-title-review.md`），Title 与 locked-seo 一致 |
| freezePublicBlogHandoff | **已冻结** 2026-09-16 |
| 用户终审 | 未进行 |
| 页面审核 | 未做；组页后交 E 看真实页面 |
| 部署 | 未授权 |

G 只装配已锁字段与已审媒体。正文或图中事实若变，作废本 hash，退回 D/E，不静默改文。本冻结不是用户终审，也不是页面图文审通过。
