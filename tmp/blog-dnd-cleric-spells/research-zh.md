# 中文博客研究稿：dnd cleric spells

日期：2026-09-12  
站点：https://www.tokenmaker.one  
locale=zh-CN  
country=CN  
英文主词：dnd cleric spells  
本文件只做研究，不写正文。不改 src/、public/ 或任何 git 跟踪文件。

---

## 任务卡

| 项 | 内容 |
| --- | --- |
| 目标 | 为 tokenmaker.one 中文博客准备「牧师选法」研究材料，不是翻译英文主词。 |
| 中文主意图 ReaderTask | 中文桌团玩家在开团前准备牧师法术：确认自己是准备施法者、领域始终准备、2014/2024 哪些改动会改选法，再按职责填 1–5 级短名单。 |
| 不做 | 全职业攻略、0–9 环法术图鉴、领域百科、BG3 构筑、3.5e/Pathfinder、魔兽牧师。不重写已有祝福术专文。 |
| 验收 | 有任务卡、事实表、SERP 表、中文候选词、H2 计划、CTA 位置；规则事实回到 Wizards/D&D Beyond；打不开的来源标未取得；当地前五不把通用搜索冒充成百度/Google CN。 |
| 关键假设 | 读者主要跑 5e 桌团，可能混用 2014 与 2024；中文检索会被 BG3、3.5e、基督教「牧师」、魔兽世界抢走。 |
| 本站缺口 | `src/lib/blog-posts/` 无 `dnd-cleric-spells`。registry 无该 slug。WORKLOG 记牧师法术未完成稿在 stash，未上线。 |

---

## 中文候选词

中文不是英文主词的直译。候选来自本站中文页用语 + 当地检索实际标题。

| 候选 | 来源 | 当地检索接近度 | 备注 |
| --- | --- | --- | --- |
| **dnd 牧师法术**（推荐主词） | 本站中文用「牧师」；搜狗该查询返回 Bilibili/BG3/5e 资料 | **最接近已取得的中国搜索引擎结果** | 必须带 `dnd`，否则会撞上基督教牧师。 |
| **5e 牧师法术** / **牧师法术 5e** | 搜狗该查询出现 Bilibili、知乎坟墓牧、5e 职业章 | 接近，但 Bing 中国站该查询被基督教内容劫持 | 正文标题可写成「DND 5e 牧师法术」。 |
| **牧师准备法术** | 本站游侠/圣武士文用「准备」；官方 Cleric 是 prepared caster | 检索量看起来低于前两者，但最贴 ReaderTask | 适合 H1 副标题或 H2。 |
| **牧师法术列表** | 灰机、dndlogs、知乎第 11 章、Wargamer 全表 | 当地结果已经大量是抄表 | **不要当主意图**，会做成图鉴。 |
| **2024 牧师法术** | 本站已有「圣武士 2024 法术」；官方 2024 免费规则有 Cleric | 当地 SERP 几乎没有 2024 选法文 | 作为版本差异卖点，不宜单独做主词。 |
| 牧师神术 | 搜狗/BG3 攻略常用 | 当地强，但是电子游戏神术表 | 发现用，不当本站主词。 |

**当地检索结论（已验证）：** 在真正拿到结果的搜狗上，「dnd 牧师法术」比「牧师法术 5e」更稳；后者在 Bing 中国站会变成神父/牧师宗教问答。不要用无修饰的「牧师法术」。

本站已有中文表达（写作时沿用，不要另造一套）：

- 职业名：牧师（Cleric）
- 风格预设：`cleric` → 中文「牧师」
- 1 环推荐四法（职业对照文）：祝福、治愈伤口、光导箭、虔诚护盾
- 急救：医疗真言 / 治愈真言（本站两处用词不统一；推荐正文第一次写「治愈真言（Healing Word，本站职业文也作医疗真言）」）
- 2024 1 级特性：神圣职阶（Divine Order），不是领域
- 施法方式：准备法术；领域法术始终准备

---

## 本站已有中文相关文（避重复）

已打开或读取源码/线上中文页。确认 **没有** `/zh/blog/dnd-cleric-spells`。

| 路径 | 中文角度 | 本文必须让开的部分 |
| --- | --- | --- |
| https://www.tokenmaker.one/zh | Token 制作器；预设标签「牧师」；案例「圣辉骑士」用 `preset=cleric` | 不要把选法文写成 Token 广告。 |
| https://www.tokenmaker.one/zh/blog/dnd-bless | 祝福术规则、d4 加什么、2014/2024 组件、目标优先级 | 只把祝福术当「专注位工作」，细节链过去。 |
| https://www.tokenmaker.one/zh/blog/paladin-2024-spells-dnd | 圣武士准备、Divine Smite、Bless 开场 | 不写惩击；牧师准备数量与圣武士「长休换 1 个」不同。 |
| https://www.tokenmaker.one/zh/blog/dnd-paladin | 圣武士回合：治疗 / 惩击 / 保护 | 不写圣武士决策树。 |
| https://www.tokenmaker.one/zh/blog/dnd-classes-comparison | 13 职业、牧师 1 级第 1 回合、2024 子职业 3 级才选、推荐四法 | 可引用，不重写职业总览。 |
| https://www.tokenmaker.one/zh/blog/dnd-classes-explained | 牧师不是只能后排加血 | 一句带过，不写职业幻想长文。 |
| https://www.tokenmaker.one/zh/blog/dnd-classes-ranked | 牧师 S 级、不是纯奶妈 | 不写强度榜。 |
| https://www.tokenmaker.one/zh/blog/dnd-character-sheet | 1 级人类侍僧牧师填卡例子 | 不写填卡教程。 |
| https://www.tokenmaker.one/zh/blog/dnd-bard-spells | 按职责选法、专注取舍 | 结构可借鉴，内容不抄。 |
| https://www.tokenmaker.one/zh/blog/dnd-druid-spells | 准备列表、专注陷阱；开头明确「不要把德鲁伊玩成弱化牧师」 | 不写德鲁伊。 |
| https://www.tokenmaker.one/zh/blog/dnd-ranger-spells | 2014 已知 vs 2024 准备 | 牧师两版都是准备施法者，不要套游侠那套。 |
| https://www.tokenmaker.one/zh/blog/dnd-necromancer-spells | 墓地牧师边框一句 | 不写死灵构筑。 |

工具关联（只记一次）：`src/lib/templates/presets.ts` 有 `id: 'cleric'`，`borderId: 'cleric-border-01'`。中文 i18n 标签是「牧师」。线上示例链接形态：`/zh?preset=cleric&mask=circle&border=revgold#editor-workspace`。

---

## SERP 表

**当地结果声明：** 未取得中国大陆 Google 当地结果（`google.com` + `gl=cn&hl=zh-CN` 返回 captcha，未绕过）。未取得百度网页检索结果（`baidu.com/s` 返回「百度安全验证 / 网络不给力」，未绕过）。下面「搜狗」是真正拿到的中国搜索引擎自然结果；「Bing 中国站」是 `cn.bing.com` + `mkt=zh-CN`，**不得标成精确当地 Google/百度前五**。web_search 为通用索引，同样不得标成精确当地前五。

| 提供方 | 查询 | 国家/语言 | 日期 | 当地精度 | 前五自然结果（能打开的已打开） | 观察 |
| --- | --- | --- | --- | --- | --- | --- |
| Google | dnd 牧师法术 | 尝试 gl=cn, hl=zh-CN | 2026-09-12 | **未取得** | captcha | 不记前五。 |
| 百度 | dnd 牧师法术；牧师法术 5e | 尝试 CN | 2026-09-12 | **未取得** | 安全验证 | 不记前五。 |
| 搜狗 | dnd 牧师法术 | CN / zh | 2026-09-12 | 中国搜索引擎，非百度/Google | 1. BG3 牧师神术表（游戏） 2. [Bilibili：如何玩好 DND5E 牧师系列——2. 牧师的 1-9 环法术选择](https://www.bilibili.com/video/BV1Yv411874Y/)（已打开，2021-03-29，2014 向长视频） 3. DND 3R 法术速查 PDF 4. DND 法术全列表文档 5. BG3 全职业法术 | 当地意图被 BG3、3.5e 全表、2014 视频占住。缺少 2024 准备流程。 |
| 搜狗 | 牧师法术 5e | CN / zh | 2026-09-12 | 同上 | 1. 索拉斯塔牧师法术 2. BG3 EA 牧师 3. 同上 Bilibili 1-9 环 4. 知乎：5e 坟墓牧带什么法术 5. 头条牧师控制/AOE | 电子游戏 + 领域特化问答；仍无「每天怎么准备」。 |
| 搜狗 | dnd cleric spells | CN / zh | 2026-09-12 | 同上 | 3.5e 文档、知乎「什么是 dnd」、2024 PHB 畅销新闻 | 英文主词在中文引擎上几乎不指向 5e 选法。 |
| Bing 中国站 | dnd 牧师法术 | mkt=zh-CN | 2026-09-12 | **非精确当地前五** | 百度百科龙与地下城、灰机 wiki 首页、dndnd.cn、5e.kiwee.top、Dark and Darker wiki | `dnd` 在中文里还撞 Dark and Darker。 |
| Bing 中国站 | 牧师法术 5e | mkt=zh-CN | 2026-09-12 | **非精确当地前五** | 百度百科「牧师（宗教）」、知乎神父/牧师区别、搜狗百科、Minecraft wiki 牧师 | **查询失败**：无 D&D。 |
| Bing 中国站 | dnd5e 牧师法术 | mkt=zh-CN | 2026-09-12 | **非精确当地前五** | 5e.kiwee.top、5echm 不全书、灰机、dndlogs 不全书、5e.tools | 指向中文规则站/全表，不是选法指南。 |
| 通用 web_search | dnd 牧师法术 | 未声明 CN 当地 | 2026-09-12 | 通用，非当地前五 | [灰机 牧师](https://dnd.huijiwiki.com/wiki/牧师)（完整页本次返回「请稍候」，**未取得**）;[steamxo BG3 牧师神术](https://www.steamxo.com/2023/08/18/2962585)（已打开摘要）；dndlogs 牧师法术表（本次 `web_fetch` **失败**，仅有搜索摘要）；[萌娘百科 3.5 领域](https://zh.moegirl.org.cn/zh-hant/龙与地下城:牧师领域法术)；[泉妈团领域表](https://sites.google.com/view/izumi-dnd-5e/創建角色/職業/牧師)；[TRPGLine 2024 牧师法术表](https://trpgline.com/zh-TW/rules/dnd2024/classes)（繁中发现用） | 中文页大量是 2014 全表或 3.5e。 |
| 通用 web_search | dnd cleric spells | 通用英文 | 2026-09-12 | 通用，非 CN 当地 | [wikidot 牧师法术表](https://dnd5e.wikidot.com/spells:cleric)（已打开，含 Tasha 可选）；[Wargamer 全表](https://www.wargamer.com/dnd/cleric-spells-5e)（已打开，2023-01，2014+补充书）；[D&D Beyond 职业法术筛选](https://www.dndbeyond.com/spells/class/2-cleric)；[DnD Lounge 按环推荐](https://www.dndlounge.com/cleric-spells-5e/)（本次正文几乎未抽出，**部分取得**）；CBR 最佳法术榜 | 英文侧已有全表和按环评级；很少讲 2024 准备数量从职业表读。 |
| NGA | 牧师法术 5e | 尝试 | 2026-09-12 | **未取得 D&D 帖** | 命中魔兽世界技能库 | 不引用。 |

论坛/视频：Bilibili BV1Yv411874Y 算自然结果，已打开页面（标题、UP KrankheitRan、时长系列说明「讲了讲牧师的法术」）。视频口播全文未转录，**不能当规则来源**。

---

## 事实表

只收「影响选法」的规则。中文维基/NGA/不全书只作发现。下列事实已回 D&D Beyond 官方页。

| 主张 | 2014 | 2024 | 官方出处 | 选法含义 |
| --- | --- | --- | --- | --- |
| 牧师是准备施法者 | 从牧师法术表准备；数量 = 感知调整值 + 牧师等级（最少 1）；须有对应环位 | 从牧师法术表准备；1 级先选 **四个** 1 环；之后按职业表「Prepared Spells」列增加；3 级例子为 6 个 1/2 环任意组合 | [2014 Basic Rules Cleric](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#ClericSpellcasting)；[2024 Free Rules Cleric](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Level1ClericSpellcasting) | 不要抄「已知法术」流程。灰机本次摘要出现「已知法术」字样，与官方 2014 牧师条文不符，**禁止当规则**。 |
| 长休换法术 | 长休后可换整份准备名单；准备新名单按每环至少 1 分钟 | 长休后可把名单上的 **任意** 法术换成其他已有环位的牧师法术 | 同上 2014 Preparing and Casting Spells；2024 Changing Your Prepared Spells | 牧师比 2024 圣武士灵活：圣武士长休只换 1 个。 |
| 戏法 | 1 级知 3 个；4/10 级再加 | 1 级知 3 个；每升一级可替换 1 个戏法；4/10 级再加。官方推荐 Guidance、Sacred Flame、Thaumaturgy | 2024 Cantrips 段 | 2024 免费规则牧师戏法表 **没有** Toll the Dead / Word of Radiance。 |
| 施法属性 / 法器 | 感知；圣徽可作法器；仪式须已准备 | 同：感知；圣徽；职业表列出带 R 的仪式 | 2014/2024 Spellcasting Ability & Focus | 仪式要占准备名额，除非另有始终准备。 |
| 子职业/领域时机 | 1 级选 Divine Domain，立刻拿领域法术 | 1 级是 **Divine Order**（Protector：军用武器+重甲；Thaumaturge：额外 1 个牧师戏法 + 感知加值到奥秘/宗教）；**3 级**才选 Cleric Subclass | 2014 Divine Domain；2024 Level 1 Divine Order、Level 3 Cleric Subclass | 2024 1–2 级没有领域白给法术。本站职业对照已写这一点。 |
| 领域法术始终准备 | 到达表列等级后始终准备，**不计入**每日准备上限；不在牧师表上也视为牧师法术 | 同：始终准备，不计入准备上限 | 2014 Domain Spells；2024 Life Domain Spells 段 | 先看领域白给，再花名额。 |
| 生命领域白给（影响选法的例子） | 1：Bless、Cure Wounds；3：Lesser Restoration、**Spiritual Weapon**；5：Beacon of Hope、Revivify；7：Death Ward、Guardian of Faith；9：Mass Cure Wounds、Raise Dead | 3：Aid、Bless、Cure Wounds、Lesser Restoration；5：Mass Healing Word、Revivify；7：Aura of Life、Death Ward；9：Greater Restoration、Mass Cure Wounds。**没有灵体武器** | 2014 Life Domain Spells 表；2024 Life Domain Spells 表 | 2014 生命牧不必准备灵体武器；2024 生命牧要自己决定要不要花名额，且它现在要专注。 |
| 官方 1 级推荐准备 | Quick Build 只强调感知 | 推荐 Bless、Cure Wounds、Guiding Bolt、Shield of Faith | 2024 Prepared Spells of Level 1+ | 本站职业对照已用这四个。本文可当 1 级模板，但应补治愈真言作为急救职责。 |
| 灵体武器 | 2 环塑能；附赠动作；60 尺；**持续 1 分钟，无专注**；升环每高 **两** 环 +1d8 | 2 环塑能；附赠动作；60 尺；**专注，最多 1 分钟**；升环每高 **一** 环 +1d8 | [2014 Spiritual Weapon](https://www.dndbeyond.com/spells/2263-spiritual-weapon)；[2024 Spiritual Weapon](https://www.dndbeyond.com/spells/2619081-spiritual-weapon) | **2014 可与灵体卫士同开；2024 不能。** 这是中文旧攻略最容易教错的一点。 |
| 灵体卫士 | 3 环；专注最多 10 分钟；15 尺；进区域或在区域内开始回合做感知豁免 | 3 环；专注最多 10 分钟；15 尺 Emanation；进入或回合结束在区域内（每回合最多一次豁免） | [2014 Spirit Guardians](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#SpiritGuardians)；[2024 Spirit Guardians](https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#SpiritGuardians) | 两版都占专注。2024 与灵体武器抢专注。触发时机条文不同，本文只在「选专注」层面提，不做法术裁定长文。 |
| 祝福术 | 1 环；专注 1 分钟；最多 3 目标；攻击与豁免 +1d4；材料 holy water | 同效果；材料 5+ GP Holy Symbol（法术未写消耗） | 本站祝福术文已核对；官方 [2014 Bless](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#Bless)、[2024 Bless](https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#Bless) | 占专注。细节不重复。 |
| 治愈真言 | 1 环塑能；附赠动作；60 尺；1d4+施法属性；对不死/构装无效 | 1 环防护；附赠动作；60 尺；**2d4+施法属性**；该页未写不死限制 | [2014 Healing Word](https://www.dndbeyond.com/spells/2140-healing-word)；[2024 Healing Word](https://www.dndbeyond.com/spells/2619143-healing-word) | 职责不变：远程附赠动作拉起。不要用动作位的疗伤术替代这个急救位。 |
| 2024 免费规则牧师法术表相对 2014 基础规则（只记选法） | 戏法 7 个；8 环无 Sunburst；4 环无 Aura of Life；6 环无 Sunbeam | 戏法仍 7 个（无 Toll the Dead）；4 环有 Aura of Life；6 环有 Sunbeam；8 环有 Sunburst | [2014 Cleric Spells 列表](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#ClericSpells)；[2024 Cleric Spell List](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#ClericSpellList) | 抄 Tasha/Xanathar 全表到 2024 只用 PHB 的桌子会多出非法术。 |

**明确不写进事实表（未在本次官方页核实）：** 2024 Spare the Dying 距离、2024 Guidance 是否「一次检定即结束」。不猜测。

**中文资料发现、不得当规则：** 灰机牧师页摘要把准备写成「已知法术」；3.5e 萌娘百科领域栏位；BG3 神术「等级到了自动解锁全部」。电子游戏与旧版机制会教错桌团准备。

---

## 信息增益

当地结果缺什么：

1. 把牧师说成准备施法者，并给出每天怎么换名单（不是 0–9 环抄表）。
2. 标明 2014 准备数量公式 vs 2024 职业表列；3 级前没有领域白给。
3. 标明 2024 灵体武器要专注，不能再和灵体卫士/祝福术叠开。
4. 用职责（急救、专注、输出、解状态）压缩名单，对抗「牧师=奶妈」和 BG3 神术表。
5. 中文译名与本站已有文对齐，并同时给英文，避免「医疗真言 / 治愈真言」互斥。

本文能补什么：一篇短的 **ReaderTask 选法文**，链到已有祝福术、职业对照、圣武士 2024 法术；规则回官方免费规则。

英文 SERP 已有 wikidot/Wargamer 全表和 Lounge 按环评级。中文角度允许不同：当地更缺「准备流程 + 2014/2024 选法差异」，不要做成另一篇全表。

---

## 中文主意图 ReaderTask（独立于英文）

**读者：** 刚决定玩牧师、或从 BG3/旧攻略转桌团的中文玩家。  
**任务：** 今晚长休后写出明天能用的准备名单。  
**成功标准：** 知道自己能准备几个、领域白给占不占名额、哪个法术占专注、急救位为什么是治愈真言。  
**失败形态：** 抄 9 环列表；1 级就写领域；2024 桌同时准备祝福术+灵体武器+灵体卫士。

---

## H2 计划（不要写正文）

建议 H1：**DND 牧师法术：按职责准备，而不是当奶妈抄全表**  
SEO 副标可含：5e、准备法术、2014/2024。

| 顺序 | H2 | 作用 | 避让 |
| --- | --- | --- | --- |
| 1 | 速查：牧师每天准备法术，不是把法术表背完 | 定义 ReaderTask；表：急救 / 专注 / 输出 / 解状态 | 不写职业史 |
| 2 | 2014 和 2024：只改选法的差异 | 准备数量、换名单、1 级神圣职阶 vs 3 级领域、生命领域白给对照 | 不写引导神力/神圣干预长文 |
| 3 | 按职责填准备名单 | 治愈真言、祝福术、光导箭、次级复原、解除魔法、回生术、灵体卫士 | 祝福术机制链到 `/zh/blog/dnd-bless` |
| 4 | 1 级、3 级、5 级短模板 | 2024 官方四法 + 急救位；注明领域始终准备另算 | 不是 1–20 级 BD |
| 5 | 领域始终准备：先看白给再花名额 | 用生命领域官方表当例子；其他领域只说明「查你那本子职业表」 | 不做 7+ 领域百科 |
| 6 | 专注冲突：祝福术、灵体卫士、2024 灵体武器 | 2014 灵体武器无专注；2024 有专注且升环变了 | 不做法术逐条裁定 |
| 7 | 常见坑 | 纯奶妈、把 BG3 神术当桌团、把灰机「已知」抄进牧师卡、Toll the Dead 当 2024 PHB 默认戏法 | — |
| 8 | 常见问题 | 见下 | — |

建议 FAQ（短答，规则回官方）：

1. 牧师是准备法术还是已知法术？  
2. 能准备多少？2014 和 2024 怎么算？  
3. 领域法术占准备名额吗？  
4. 2024 几级选领域？  
5. 战斗里该准备治愈真言还是疗伤术？  
6. 2024 还能同时开灵体武器和灵体卫士吗？  
7. 1 级官方推荐哪四个 1 环？

内链：`/zh/blog/dnd-bless`、`/zh/blog/dnd-classes-comparison`、`/zh/blog/paladin-2024-spells-dnd`、`/zh/blog/dnd-bard-spells`、`/zh/blog/dnd-druid-spells`、`/zh/blog/dnd-character-sheet`、`/zh/blog/dnd-constitution-guide`。

---

## CTA 位置

正文里 **只出现一次**，放在 **H2「专注冲突」末尾**：当读者需要把牧师、灵体武器或灵体卫士范围做成地图标记时，用牧师预设做一枚清楚头像。

- 文案约束：先完成选法，再做 Token。禁止开篇、禁止每节、禁止把选法表写成边框广告。
- 链接：`/zh?preset=cleric#editor-workspace`（或带 `mask=circle`）。预设名用中文「牧师」，不要只写英文 cleric。
- 页顶/页尾模板里的通用「打开编辑器」不算这唯一一次正文 CTA。

---

## 公开引用候选

| id | label | url | 能支撑的主张 | versionNote |
| --- | --- | --- | --- | --- |
| dndb-2014-cleric | D&D Beyond 2014 Basic Rules：牧师施法与生命领域 | https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#Cleric | 准备数量公式、长休换名单、1 级领域、领域始终准备、生命领域 2014 法术表 | 2014 Basic Rules；Beyond 标 Legacy |
| dndb-2024-cleric | D&D Beyond 2024 Free Rules：牧师 | https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Cleric | 1 级准备 4 个、长休可换任意、神圣职阶、3 级子职业、2024 牧师法术表、生命领域 2024 法术表 | 2024 Free Rules |
| dndb-2014-cleric-list | D&D Beyond 2014 牧师法术列表 | https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#ClericSpells | 2014 基础规则表内有哪些法术 | 不含 Tasha 可选 |
| dndb-2014-sw | 2014 Spiritual Weapon | https://www.dndbeyond.com/spells/2263-spiritual-weapon | 无专注、每两环升伤 | 2014 |
| dndb-2024-sw | 2024 Spiritual Weapon | https://www.dndbeyond.com/spells/2619081-spiritual-weapon | 要专注、每一环升伤 | 2024 |
| dndb-2014-sg | 2014 Spirit Guardians | https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#SpiritGuardians | 3 环专注控场 | 2014 |
| dndb-2024-sg | 2024 Spirit Guardians | https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#SpiritGuardians | 3 环专注；与灵体武器冲突 | 2024 |
| dndb-2014-bless | 2014 Bless | https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#Bless | 1 环专注增益 | 细节以本站祝福术文为准 |
| dndb-2024-bless | 2024 Bless | https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#Bless | 同上；材料圣徽 | 2024 |
| dndb-2014-hw | 2014 Healing Word | https://www.dndbeyond.com/spells/2140-healing-word | 附赠动作 60 尺 1d4+mod | 2014；对不死/构装无效 |
| dndb-2024-hw | 2024 Healing Word | https://www.dndbeyond.com/spells/2619143-healing-word | 附赠动作 60 尺 2d4+mod | 2024 |
| site-bless-zh | 本站祝福术中文文 | https://www.tokenmaker.one/zh/blog/dnd-bless | 祝福术不重复展开 | 已发布 |
| site-class-zh | 本站职业对照中文文 | https://www.tokenmaker.one/zh/blog/dnd-classes-comparison | 1 级四法、3 级才选领域 | 已发布 |
| bili-2014-picks | Bilibili 牧师 1-9 环选择 | https://www.bilibili.com/video/BV1Yv411874Y/ | 仅证明当地有「选法」需求 | 2021，2014 向；非规则源 |

发现用、不列进正文引用：灰机（完整页未取得）、TRPGLine 繁中转写、5e 不全书、wikidot Tasha 扩表、Wargamer 2014 全表、BG3 攻略。

---

## 未取得 / 部分取得（Fail Fast）

| 来源 | 状态 |
| --- | --- |
| 中国大陆 Google 当地 SERP | 未取得（captcha，未绕过） |
| 百度网页 SERP | 未取得（安全验证，未绕过） |
| https://dnd.huijiwiki.com/wiki/牧师 | 未取得完整页（「请稍候」） |
| https://dndlogs.com/5E/topics/玩家手册/魔法/法术列表/牧师.html | 本次直接打开失败；仅有通用搜索摘要 |
| NGA 5e 牧师法术帖 | 未取得（检索落到魔兽数据库） |
| https://www.dndlounge.com/cleric-spells-5e/ | 部分取得（页面打开，正文几乎未抽出） |
| Bilibili BV1Yv411874Y 口播全文 | 未转录 |
| 2024 Spare the Dying / Guidance 细则 | 本次未打开对应法术正文，不写 |

---

## 写作时禁止

- 把 BG3「神术全解锁」写成 5e 桌团。
- 把 3.5e 领域法术栏写成 5e。
- 把 2014 灵体武器无专注抄进 2024 准备建议。
- 把 Toll the Dead 写成 2024 免费规则默认牧师戏法。
- 开篇推销 Token；正文 CTA 超过一次。
- 声称已取得百度或 Google CN 精确前五。
