# 简体中文 SERP 研究：DND 狗头人

- 角色：A-ZH（中文当地搜索 + 当地表达）
- locale：`zh-CN`
- 核验日期：2026-09-16（Asia/Shanghai）
- 目标读者：简体中文 DND 玩家
- 英文种子词：`dnd kobold tokenmaker.one`（只作任务入口，不是中文主词）
- 本报告不是英文稿翻译。

## 搜索方式与地区回执

使用本地 ego-browser（ego-lite 0.5.0.32 / Chromium 152）单一任务空间 `88`，任务名 `zh-cn dnd kobold serp research`。结束后已 `finish({ keep: [] })`。

| 提供方 | 实际入口 | 语言/地区参数 | 页上回执 | 是否精确中国大陆 SERP |
|---|---|---|---|---|
| Google Search | `https://www.google.com/search?...&hl=zh-CN&gl=cn&pws=0` | 请求了 `hl=zh-CN`、`gl=cn`、`pws=0`；结果页 `html lang=zh-CN` | 页脚：「不是个性化搜索结果」「未知 - 无法确定位置 - 更新位置信息」 | **否。** `gl=cn` 是请求参数，不是已确认的中国地区投放 |
| 百度搜索 | `https://www.baidu.com/s?wd=...&ie=utf-8` | 中文界面；Title 形如 `DND 狗头人_百度搜索` | 无「当前地区=中国」一类设置回执；本机 IP 是否被当作大陆用户 **未核验** | **否。** 只能作中文辅助样本 |
| DataForSEO 或其他 location_code=China 的 API | 未连接 | — | — | 未取得 |

因此：下面任何一组排名都不得写成「中国前五」或「CN top 5」。Google 与百度只作 **中文辅助样本**。

干扰项（真实看见，不是自然结果）：Google 结果页叠加 AITDK 域名统计模块。该模块不是 Google 自然结果。

验证码：本次全部查询未见 reCAPTCHA / 百度验证码。未绕过任何验证码。

采集时间：2026-09-16，约 08:23–08:31 CST。

## 本站中文页（只读，写作当地用词来源）

只读仓库中文页，未改 `src/` / `public/`。

| 来源 | 实际用词 |
|---|---|
| `src/lib/i18n/zh.ts` | Token Maker；TRPG Token 制作工具；VTT Token；本地优先；边框；遮罩；战士 / 法师 / 盗贼 / 牧师 / 游侠 / 亡灵 / 怪物 |
| 中文首页 `src/app/(zh)/zh/page.tsx` + `site-content.ts` | DnD Token Maker；VTT Token 制作器；圆形、方形、多边形 VTT Token；Token 边框、遮罩和文字；透明 PNG；Roll20、Foundry VTT、Owlbear；角色立绘 |
| 中文种族文 `dnd-kenku` | 中文桌把 Kenku 叫 **天狗 Kenku**；标题双语 |
| 中文种族文 `dnd-dragonborn` | 中文桌口头多叫 **龙裔**；正文保留 Dragonborn；Token / 棋子 |
| 中文种族文 `dnd-grung` | 标题保留英文 Grung；正文用 **毒蛙人** |
| 中文种族指南 `dnd-races` | 口头说 **种族**；2024 卡面用 Species / 物种 |

本站中文页 **没有** kobold / 狗头人 / 科博德 条目。`site:tokenmaker.one 狗头人` 的 Google 回执是 0 条。

## 必做查询

### 1. `DND 狗头人`（锁定主查询）

**Google**（辅助样本，非精确 CN）

- URL：`https://www.google.com/search?q=DND%20%E7%8B%97%E5%A4%B4%E4%BA%BA&hl=zh-CN&gl=cn&pws=0`
- Title：`DND 狗头人 - Google 搜索`
- 统计条：找到约 42,100 条结果
- PAA /「其他用户还问了」：**未取得**。页面没有该模块标题。
- 相关搜索（结果页底部「用户还搜索了」，真实看见）：
  - Dnd 龟 人
  - Dnd 种族
  - Dnd 蛇 人
  - Dnd 蜥蜴 人
  - Dnd 精灵
  - Dnd 精灵 名字
  - Dnd 天狗
  - 兽人dnd

主查询前五（均已打开页面核对，见下一节）：

| 序 | SERP 标题 | 最终 URL | 类型 |
|---:|---|---|---|
| 1 | 狗头人 Kobold - 灰机wiki | https://dnd.huijiwiki.com/wiki/狗头人 | 中文玩家维基，魔邓肯玩家种族页 |
| 2 | VGM 狗頭人 - D&D 5E 中文化 | https://trpgtdnd.weebly.com/vgm-293993895720154.html | 繁体中文瓦罗玩家特质转录 |
| 3 | 狗头人（角色扮演游戏《龙与地下城》中的生物） | https://baike.baidu.com/item/狗头人/12810154 | 百度百科，偏怪物设定 |
| 4 | 大家对5e的狗头人有什么看法？ : r/DnD | https://www.reddit.com/r/DnD/comments/n60scu/how_do_people_feel_about_the_5e_kobolds/?tl=zh-hans | Reddit 英文帖 + 简体机翻 |
| 5 | 泉媽團 Dnd 5e 資料站 - 狗頭人 | https://sites.google.com/view/izumi-dnd-5e/創建角色/種族/怪物種族/狗頭人 | 繁体中文瓦罗怪物种族资料 |

第 6 条以后未当作前五：Reddit「为什么狗头人是龙？」、灰机瓦罗种族页、Misty Mountain「驾驭怪物：狗头人」（URL 路径写地精）、知乎炉石托瓦格尔。

**百度**（辅助样本，无地区回执）

- URL：`https://www.baidu.com/s?wd=DND%20%E7%8B%97%E5%A4%B4%E4%BA%BA&ie=utf-8`
- Title：`DND 狗头人_百度搜索`
- 验证码：无
- 可见自然结果形态：百度百科「狗头人」、库尔图马克百科、百度 AI「总结全网」卡片、17173 旧文摘要、B 站神祇文、灰机wiki、贴吧「狗头人形象变迁」
- 相关搜索（真实看见）：DND六种真巨人、dota狗头人、魔兽世界狗头人在哪、狗头人存在吗、狗头人法师、狗头人boss、狗头人图片；另有明显噪音「金星生理器官是男的还是女的」「小姐说的沙漠风暴是什么」
- 百度 AI 卡片可见问句（不是 Google PAA）：长什么样，有什么本事；跟龙是什么关系；为什么叫狗头人
- 该 AI 卡片未当作规则来源；未打开其引用链

### 2. `龙与地下城 狗头人`

**Google**

- URL：`https://www.google.com/search?q=%E9%BE%99%E4%B8%8E%E5%9C%B0%E4%B8%8B%E5%9F%8E%20%E7%8B%97%E5%A4%B4%E4%BA%BA&hl=zh-CN&gl=cn&pws=0`
- 统计条：约 370,000 条
- PAA：**未取得**
- 相关搜索：龙与地下城种族、豺狼人、日精灵、Dnd 精灵、狗头人dnd、狗头人wiki、Dnd 精灵 名字
- 自然结果形态：百度百科、维基百科「狗头人 (龙与地下城)」、灰机总页、灰机瓦罗种族页、新浪游戏 2006 旧文、知乎炉石、Misty Mountain、Reddit 机翻、Fandom 狗头人神系
- 维基百科已另开核对（见下），因其出现在本查询前列，且是「寇伯」唯一已打开出处

**百度**

- 相关搜索：dota狗头人、dnd全种族全图鉴、狗头人法师、dnd达库尔、龙与地下城牛头人、龙与地下城和魔兽世界、魔兽世界狗头人在哪、dnd深渊生物图鉴、DND大地精数据、大地精和熊地精
- 可见结果含百科、灰机、NGA 标题「[DeepSeek氵] 跑团归猴」、贴吧、7k7k 小游戏噪音。NGA / 贴吧 **未打开**，不当论坛事实。

### 3. `kobold 5e`

**Google**（hl=zh-CN 仍几乎全是英文页）

- 统计条：约 1,470,000 条
- 相关搜索（英文）：Kobold 5e stats / race / species / wikidot / boss / Urd kobold 5e
- 标题可见：dnd5e.wikidot lineage:kobold、Roll20 Compendium、D&D Beyond monsters、AideDD、Foe Foundry、Reddit r/DnD5e、Bell of Lost Souls 玩家种族指南、Forgotten Realms Wiki、Dungeon Mister、英文维基
- 本查询 **没有** 召回灰机或百度百科。不能当中文主词。

**百度**

- 主召回是 **Kobold Press / 狗头人出版社**，不是玩家种族。
- 可见：Kobold Press 官网、百度百科「Kobold Press」、贴吧「5E怪物图鉴:狗头人」、博客「5E怪物图鉴:狗头人(Kobolds)介绍」、D&D Wiki 英文生物块
- 「大家还在搜」是娱乐新闻，与查询无关

### 4. `DND 狗头人 种族`

**Google**

- 相关搜索：Dnd 种族、龙与地下城种族、Dnd 精灵 名字、Dnd 龟 人、Dnd 蜥蜴 人、Dnd 天狗、斑猫人、Dnd 斑猫 人
- 自然结果：灰机总页、ㄐㄍ的 DND5E 中文資料網（繁体，怪物冒險者/狗頭人-kobold）、VGM 狗頭人、百度百科、Reddit 机翻、灰机瓦罗页、GameMale 福瑞向讨论（未打开）、dndlogs 3R（未打开）、泉媽團、灰机魔邓肯种族页
- 形态：中文桌把狗头人当 **可玩怪物种族**，并同时保留百科式怪物介绍。

**百度**

- 相关搜索被魔兽/DOTA 分流：魔兽世界狗头人在哪、dota狗头人、狗头人身、狗头人是什么意思、狗头人boss
- AI 卡片可见问句：长什么样能活多久；有什么特殊本事；信什么神怎么生活
- 该卡片把 3R 数值、5E 龙吼、乌尔德变种写在一起，**未打开核验，不当事实**

### 5. `DND 狗头人 token`

**Google**（约 828 条）

- 相关搜索模块：**未取得**（botstuff 只有分页）
- 可见结果：Reddit 机翻的 Roll20 token 合集（狗头人/狗頭人代币、代幣）、灰机 TftYP「狗头人平民/精英」且正文出现 `Bestiary-tokens-TftYP-Kobold`、MakerWorld 繁体 3D「敵人標記」说明可代表哥布林和狗头人、Threads 魔兽蜡烛梗、dndlogs 3R、知乎、Pinterest 炉石
- 中文 SERP **几乎没有**「做一张 VTT 头像 Token」的独立教程。token 一词会被代币、3D 标记、灰机文件名、加密钱包分流。

**百度**

- 相关搜索第一条是「一个人可以创建几个imtoken」（加密钱包噪音）
- 可见：百科、NGA「为啥矿洞里面顶着蜡烛的叫狗头人」（未打开）、贴吧、知乎炉石、炉石卡牌「狗头人隐士」、百度知道「dnd网团token制作」（未打开）、旅法师营地炉石设计文
- 结论：百度上 `token` 不能当作中文桌「棋子/头像」的可靠主词。

### 6. `科博德 DND`

**Google**

- 前几条几乎全是 Reddit `?tl=zh-hans` 机翻：把英文 kobold 译成 **科博尔特 / 科博尔德 / 科博德**
- 其余：百度百科「龙与地下城」、灰机「元首科维克」（魔鬼，不是狗头人）、维基「被遗忘的国度」
- **没有** 灰机、百科或中文资料站把 DND 种族主名写成科博德

**百度**

- 足球球员克里斯托弗·科博德、博德之门 3 贴吧（「博德」不是「科博德」）、百度文库把德语民间 **科博德（Kobold）** 写成哥布林同类、无锡科博德硬质合金、科博德净水、科博尔德金属公司
- **无有效 DND 种族结果。** 科博德不是中文桌对 5e Kobold 的通用叫法。

### 7. tokenmaker.one 关联（单独记录，不进主意图）

| 查询 | 回执 |
|---|---|
| `tokenmaker.one 狗头人` | 约 38 条。前排是币安、灰机狗头人发明家、Reddit 迷你模型机翻、狗狗币、X 账号、ONE Token 加密货币。**未见 tokenmaker.one 域名。** |
| `site:tokenmaker.one 狗头人` | 「找到约 0 条结果」；页面写「找不到和您查询的“site:tokenmaker.one 狗头人”相符的内容或信息。」 |

主查询 `DND 狗头人` 前五也没有本站。产品关联在中文 SERP 上 **未建立**。

## 主查询前五：打开核对

打开工具：同一 ego-browser 空间 `88`。五页均打开成功，无验证码。

### 1. 灰机wiki：狗头人 Kobold

- 最终 URL：https://dnd.huijiwiki.com/wiki/%E7%8B%97%E5%A4%B4%E4%BA%BA
- Title / H1：`狗头人 Kobold`
- 分类写来源：《魔邓肯巨献：多元宇宙的怪物》
- 页面自称玩家种族特质：类人、小型、速度 30 尺、黑暗视觉 60 尺、龙吼（附赠动作，10 尺内敌人，熟练加值次数/长休）、狗头人遗产三选一（狡猾 / 反抗 / 龙族术法）
- 风味段：多元宇宙中最小的龙类生物；鳞片通常铁锈色；叫声与龙的力量共鸣
- 用词：狗头人 + Kobold。未见科博德、寇伯。侧栏种族列表可见天狗 Kenku、地精 Goblin、龙裔等，与本站中文种族文译法一致
- 页面正文有英文拼写错误（Dracoinc Cry / Draconic Corcery），只记页面现象，不把错字当官方术语

### 2. VGM 狗頭人（繁体）

- 最终 URL：https://trpgtdnd.weebly.com/vgm-293993895720154.html
- H2：`VGM 狗頭人 [Kobold]`
- 繁体。Google 对该条显示「转为简体网页」
- 瓦罗玩家特质：敏捷 +2、力量 -2（页面标注「改動」）、6 岁成年/可活 120 岁、守序偏邪恶、2–3 英尺/25–35 磅、小型、速度 30 英尺、黑暗视觉、摇尾乞憐、群體戰術、陽光敏感性、通用语和龙语
- 下文是「怪物冒險者」DM 问答：罕见还是平凡、被抛弃者还是特使、朋友还是敌人
- 用词：狗頭人，不是科博德

### 3. 百度百科

- 最终 URL：https://baike.baidu.com/item/%E7%8B%97%E5%A4%B4%E4%BA%BA/12810154
- Title：狗头人（角色扮演游戏《龙与地下城》中的生物）
- H1：狗头人
- 中文名狗头人，外文名 Kobold，阵营通常守序邪恶
- 偏 **怪物图鉴/旧版社会设定**：3 英尺、深褐至黑色鳞片、乳白色小角、红眼、地底矿坑或密林、畏光、兽人语和地精语、陷阱/毒虫/火油、守护神 **克图玛**、飞行远亲 **鹗德（Urd）**
- 参考资料栏写「狗头人．维基百科」和 2002 年站点。词条最近更新显示 2026-03-15
- 相关搜索被英雄联盟/宠物狗分流。页面不是 5e 玩家建卡页

### 4. Reddit 机翻帖

- 最终 URL：https://www.reddit.com/r/DnD/comments/n60scu/how_do_people_feel_about_the_5e_kobolds/?tl=zh-hans
- H1：大家对5e的狗头人有什么看法？
- 英文原帖 + 简体机器翻译。讨论瓦罗玩家狗头人：力量惩罚、Grovel Cower and Beg、群体战术、阳光敏感、勘误去掉 -2 力量、有人提到后续 UA
- 机翻把后来的 UA 狗头人遗产误写成「哥布林特质」。**机翻不能当规则。**
- 用词：狗头人。这是 Google 把 kobolds 译成狗头人，不是中文论坛原帖

### 5. 泉媽團资料站（繁体）

- 最终 URL：https://sites.google.com/view/izumi-dnd-5e/創建角色/種族/怪物種族/狗頭人
- Title / H1：狗頭人 Kobold
- 导航把狗頭人放在「怪物種族」，与獸人、哥布林、蜥蜴人并列
- 标明《瓦羅的怪物指南》
- 风味：穴居爬行类类人、崇拜邪恶龙、库尔图马克、提亚马特龙血、陷阱地道、术士与龙族联系
- 玩家特质段可见：敏捷 +2、力量 -2、年龄、阵营、体型 2 至 3 尺
- 名字表示例：亞力士 Arix、米波 Meepo 等（页面同时给通用语意译如红脚、白爪）
- 用词：狗頭人 Kobold、庫爾圖馬克 / 庫爾圖瑪克 Kurtulmak（同一页两种译写都出现）

## 额外已打开（非主查询前五，只核译名）

### 维基百科：狗头人 (龙与地下城)

- URL：https://zh.wikipedia.org/zh-cn/狗頭人_(龍與地下城)
- 简体皮肤 H1：狗头人 (龙与地下城)
- 正文第一句：**「狗头人（Kobold）又称寇伯」**
- 条目自陈缺少来源，且主要从虚构世界视角描述。把「寇伯」记为维基上的别称，**不是** 灰机或百科主名
- 守护神写成 **克图玛**（与百度百科相同，与灰机/泉媽團的库尔图马克不同）
- 分类把狗头人放在类人生物，与地精、豺狼人并列，不在主要玩家种族表

### 灰机：瓦罗怪物指南 / 狗头人

- URL：https://dnd.huijiwiki.com/wiki/种族/瓦罗怪物指南/狗头人
- H1 仍是「狗头人 Kobold」
- 翻译来源写「不全书」；来源：瓦罗怪物指南 119 页
- 特质名：摇尾乞怜 Grovel, Cower, and Beg；集群战术 Pack Tactics；日照敏感 Sunlight Sensitivity
- 与魔邓肯总页不是同一套特质。中文桌若写玩家狗头人，必须先锁书

## 形态结论（只基于已打开页 + 真实 SERP 模块）

1. 简体中文当地主名是 **狗头人**，资料站标题普遍写成 **狗头人 Kobold**。繁体页写 **狗頭人**。
2. 中文 SERP 同时供应三件事：百科式「这是什么怪物」、瓦罗玩家种族、魔邓肯玩家种族。这和本站天狗文「先锁书」的结构同类，不是英文「how to play a kobold」指南的直译。
3. 混淆源在中文检索里很具体：魔兽蜡烛狗头人、DOTA、炉石、加密 token、德语民间科博德、龙裔。
4. Token / 棋子需求在中文 SERP 上弱，且被加密钱包和炉石卡牌污染。不能把产品制作写成主意图。
5. `kobold 5e` 和 `科博德 DND` 都不能当中文主查询。

## 未取得项

- 精确中国大陆 SERP（无可靠 gl=CN 投放回执，百度无地区设置回执）
- Google PAA
- Google `DND 狗头人 token` 的相关搜索模块
- tokenmaker.one 在中文「狗头人」查询中的自然排名
- 本站中文页对 Kobold 的既有译名（页面不存在）
- 未打开故不当事实：NGA 帖、百度贴吧楼、百度知道、GameMale、dndlogs、17173 正文、B 站视频、Misty Mountain 正文
- 未取得官方简体纸书扫描；灰机/不全书是社区译文，不是威世智简体官方出版物本身
