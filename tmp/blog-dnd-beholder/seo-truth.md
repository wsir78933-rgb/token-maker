# 题文兑现：dnd beholder

- 核对角色：未参与写作、未参与起标题；不采信 `en-titles.md` / `zh-titles.md` 自评
- 只读：`en-seo.json`、`en-body.html`、`zh-seo.json`、`zh-body.html`；近 3 篇实题来自 `src/lib/blog/registry.ts`（kenku / cleric-spells / mind-flayer-dnd）
- 未改 `src/`，未改正文，未改 SEO 字段

## 总评

**PASS**

英文、中文选定标题与描述都能被已锁正文接住。不替换 Title / Description。

---

## EN

| 字段 | 内容 |
|---|---|
| Title / H1 / seoTitle | DnD Beholder: 2014 Cone Is a Trait, 2024 a Bonus Action |
| Description | A dnd beholder's cone is a start-of-turn trait in 2014 and a Bonus Action in 2024. Copy that year's Eye Rays: three-ray action, or Multiattack three times. |

| # | 检查 | 判定 | 证据 |
|---|---|---|---|
| 1 | 标题数字/结果是否在正文 | **PASS** | 数字是规则年 2014 / 2024，不是百分比。结果「2014 cone = trait、2024 cone = Bonus Action」开篇原句就有：*The 2014 cone is a trait you set at the start of each turn; the 2024 cone is a Bonus Action wave that lasts until the start of the beholder's next turn.* 对照表 Antimagic Cone 行、H2「Antimagic Cone is not the same job in both books」、H3「Trait versus Bonus Action」同一结论。描述 *start-of-turn trait* 对应正文 *At the start of each of the beholder's turns, decide which way the cone faces and whether the cone is active.* |
| 2 | 点名对象是否是正文读者 | **PASS** | 标题点名的是今晚这只 dnd beholder 的锥，不是 BG3 流程、不是 spectator 专页、不是图鉴读者。正文第二段：*This page is for a DM or player who is putting that creature on a 5e table or VTT tonight.* 对象对得上。标题没有另点一个正文不服务的人。 |
| 3 | 承诺方法是否完整给出 | **PASS** | 标题承诺的跑法：2014 当特质、2024 当附赠动作。正文给出完整工：2014 回合开始设朝向/开关、不花动作也不花附赠动作；2024 花 Bonus Action 放一波、持续到自己下回合开始、不花就没有锥；两版都克自己的射线；各给一间石厅例程。描述另承诺同一年的 Eye Rays：*three-ray action, or Multiattack three times*。正文有：2014 一个动作三条随机（重复重骰、1–3 个 120 尺目标）；2024 Multiattack 使用 Eye Rays 三次（每次一条、一个可见目标、本回合已用则重骰）。指派规则写全，不是只报「三条」。 |
| 4 | 情绪是否比正文夸张 | **PASS** | 标题是动作槽事实，没有团灭、没有 best/fastest、没有「CR 13 骗人」。正文比标题更狠（*you stole an action economy the 2024 book did not print*），标题没有加码。 |
| 5 | 与最近 3 篇套路是否仍区分 | **PASS** | 见下节。本篇公式是「2014 X Is a Y, 2024 a Z」，没用 Matches/Doesn't、Has No、Depends on，也没用作废工作题 Lock then Copy。 |

描述没有新增正文没有的第二篇级承诺：射线程序与锥同属锁年抄卡，spectator / SRD / 一键导入未进描述。

---

## ZH

| 字段 | 内容 |
|---|---|
| Title / H1 | 眼魔：挑战等级 13 锁不住年，看反魔锥是特质还是附赠动作 |
| seoTitle | 眼魔（dnd beholder）：挑战等级 13 锁不住年，看反魔锥是特质还是附赠动作 |
| Description | 中文桌把 dnd beholder 叫眼魔，不是观察者眼魔。两版都是挑战等级 13；2014 反魔锥是特质，2024 才花附赠动作。射线和传奇跟锥抄同一本，Token 留下十根眼柄。 |

| # | 检查 | 判定 | 证据 |
|---|---|---|---|
| 1 | 标题数字/结果是否在正文 | **PASS** | 挑战等级 13 开篇就有。结果「13 锁不住年」对应：*两版都是大型异怪、守序邪恶、挑战等级 13，这三项分不出你锁的是哪一年*；后文 *挑战等级都是 13，护甲等级都是 18……这几行当不了锁年证据*。「看反魔锥是特质还是附赠动作」对应开篇 *分得开的是反魔锥算特质还是附赠动作*，对照表反魔锥行（特质 / 附赠动作），以及 H2「反魔锥不是两版同一份工」：*2014 反魔锥写在特质里* / *2024 反魔锥写在附赠动作里*。seoTitle 括号 `dnd beholder` 是检索别名，开篇 `<strong>dnd beholder</strong>` 与「眼魔」并列，不是解释性括注。 |
| 2 | 点名对象是否是正文读者 | **PASS** | 标题点的是真眼魔桌，要靠锥的工种分年。正文读者就是今晚上挑战等级 13 真眼魔的中文桌，不是观察者眼魔专页。描述 *中文桌把 dnd beholder 叫眼魔，不是观察者眼魔* 与第二段 *今晚上桌的是真眼魔，不是观察者眼魔、亡眼暴君、眼魔丧尸* 同一对象。「看」指向这个读者要核对的那一行，没有点到灰机数字读者或珊娜萨流程读者。 |
| 3 | 承诺方法是否完整给出 | **PASS** | 标题两句是同一判断，不是两个主任务：13 当不了锁年证据，分得开的那一行是反魔锥工种。正文把两边的工写完：2014 特质、回合开始决定朝向和开关、不要改成花附赠动作；2024 附赠动作、持续到自己下回合开始、*没花附赠动作，就没有这条锥*。描述另承诺射线/传奇跟锥抄同一本、Token 留十柄：正文有射线对照表、2014 一条动作三条 / 2024 多重攻击三次、传奇 Eye Ray vs Chomp/Glare、开团核对，以及「Token 留下十根眼柄」整节。 |
| 4 | 情绪是否比正文夸张 | **PASS** | 「锁不住年」= 锁年证据不够，不是团灭恐吓。正文已用同等力度：*分不出你锁的是哪一年*、*当不了锁年证据*。标题没有写成「挑战等级 13 是骗局」或「2024 一定更狠」。 |
| 5 | 与最近 3 篇套路是否仍区分 | **PASS** | 见下节。本篇公式是「X 锁不住年，看 Z 是 A 还是 B」。无「别把…拼上」、无「不能叠」、无「不等于」。被淘汰的工作题 *别把观察者眼魔当挑战等级 13，也别把两版反魔锥拼一张卡* 才是夺心魔同构，选定句没有沿用。 |

---

## 近 3 篇套路（registry 实题，不是 titles 备忘）

**EN**

1. Mind Flayer DnD: CR 7 Matches, The Stun Clock Doesn't — `CR X Matches, The Y Doesn't`
2. DnD Cleric Spells: The 2024 Official Four Has No Healing Word — `The 2024 Official Four Has No X`
3. DnD Kenku: Speech Depends on Volo's or MotM — `Y Depends on A or B`

本篇：`2014 Cone Is a Trait, 2024 a Bonus Action`。年份对比是题材重叠（都要锁书），句法不是 Matches/Doesn't，也没把 cone 写成 clock / timing / doesn't。切入点是动作槽（trait vs Bonus Action），与夺心魔的震慑时钟对仗分开。

**ZH**

1. 夺心魔：别把 1 分钟震慑拼上不要求失能的采脑 — `别把 A 拼上 B`
2. dnd 牧师法术：2024 灵体武器要专注，不能叠祝福术 — `X 要 Y，不能叠 Z`
3. dnd kenku：瓦罗只能拟声，灰机缺页不等于魔邓肯不能开口 — `事实 A，Z 不等于 W`

本篇：`挑战等级 13 锁不住年，看反魔锥是特质还是附赠动作`。「锁不住」不是「不等于」句式；「看 A 还是 B」不是「别把 A 拼上 B」，也不是「不能叠」。

---

## 标题去留

正文接得住。**不改标题，不给替换 Title/Description。**
