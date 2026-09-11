# 独立鉴文报告 — EN dnd kenku 正文（修订后复验）

| 字段 | 值 |
|---|---|
| 角色 | 原独立英文鉴文者复验；未参与写作；未读取 `en-writer-notes.md`；**不以旧 PASS 自动覆盖新版本** |
| 任务/会话标识 | 本轮 `GROK_SESSION_ID=01a09158-f2c0-7992-9fdd-f6ab3ea25b7b`（初审会话 `01a09147-cee2-7ac3-bfee-2d027265a1fb` 只绑定旧 hash `2936eef0…`，对本稿无效） |
| 审阅日期 | 2026-09-12 |
| 被审文件 | `/Users/wusir/Desktop/开发项目集合/token-maker-app/tmp/blog-dnd-kenku/en-body.md` |
| 对照 | `citation-audit.md`（旧 hash 的 ISSUES）、`en-revision-log.md` |
| 要求 hash | `8b80188c2d964b6f35de9cd54b9fc3d5bc1400f842afafd3a44c738914a9e01b` |
| sha256_raw（本机） | `8b80188c2d964b6f35de9cd54b9fc3d5bc1400f842afafd3a44c738914a9e01b` |
| sha256_nfc_lf（本机） | `8b80188c2d964b6f35de9cd54b9fc3d5bc1400f842afafd3a44c738914a9e01b` |
| Hash 核对 | **一致**（NFC + LF；无 CRLF） |
| 主任务 | 锁 Kenku 书页 → 按该页抄语言/Mimicry/技能包 → 裁无翼鸦人 token |
| 体裁 | 教程/指南 + 版本对照 |
| 三态 | **PASS** |
| 是否允许进入淬文/锁正文 | **允许**，锁本 hash。用户终审尚未进行。 |
| 作者自检 | 本文件不是作者自检。 |

未改 `en-body.md`。无必须修订硬伤，不写 `en-revision-requests.md`。

---

## 0. 机械计数（本机重跑）

```bash
python3 "/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py" \
  "/Users/wusir/Desktop/开发项目集合/token-maker-app/tmp/blog-dnd-kenku/en-body.md" \
  --locale en --exclude-heading FAQ --exclude-heading Sources
```

```json
{
  "file": "/Users/wusir/Desktop/开发项目集合/token-maker-app/tmp/blog-dnd-kenku/en-body.md",
  "locale": "en",
  "mechanical_units": 4374,
  "required_floor": 2000,
  "meets_mechanical_floor": true,
  "semantic_qualification": "requires_independent_review",
  "excluded_heading_sections": ["FAQ", "Sources"],
  "omitted_line_counts": {
    "headings": 23,
    "code": 0,
    "excluded_sections": 34,
    "non_body": 95,
    "frontmatter": 0
  },
  "sha256_raw": "8b80188c2d964b6f35de9cd54b9fc3d5bc1400f842afafd3a44c738914a9e01b",
  "sha256_nfc_lf": "8b80188c2d964b6f35de9cd54b9fc3d5bc1400f842afafd3a44c738914a9e01b"
}
```

与 `en-revision-log.md` 声明的 4374 一致。Length 机械已过；语义见三门。

---

## 1. 受影响项复核（citation-audit EN-F1–F9）

本轮只验收审计要求的删/降级，以及修订是否引入新的来源不符。说话差异本身保留，这是修订原则，不是残留 FAIL。

本轮打开 https://dnd5e.wikidot.com/lineage:kenku，核对挂到该页的玩家句。该页**不是**官方规则；正文若当官方原文即 FAIL。正文现标 unofficial / Not official / printed book wins。

| 审计号 | 要求 | 新稿 | 判定 |
|---|---|---|---|
| EN-F4 EGtW | 删转载/失语继承，或降为「索引未列；对印刷书」；勿当已核验锁 | 全文无 `EGtW` / `Explorer’s Guide`。Wildemount 只出现为「桌上若用该页，对印刷书；本页只锁索引两条」。source line 从四条减为三条，无 Wildemount 行。图注「Left column is Volo’s。」 | **已降级，关闭** |
| EN-F1 / F2 语言句 | 不可把 Common+1 / Volo 失语写成 DDB 索引已印的玩家规则 | 开篇、总表、Lock A/B、Languages、FAQ：先写「free D&D Beyond index does not print a Kenku Languages line」，再挂 unofficial [Kenku lineage transcription](https://dnd5e.wikidot.com/lineage:kenku)，并 confirm printed Volo’s/MotM。wikidot 正文确有 Volo「read and write Common and Auran, but you can speak only by using your Mimicry trait」与 MotM「speak, read, and write Common and one other language…」。未把语言句安到索引 supports。 | **关闭** |
| EN-F3 玩家 Mimicry 公式 | 怪物 DC 14 可留；玩家对抗 / 8+PB+Cha 不可当已打开官方数字 | 索引「lists the trait name only」。玩家两套标 unofficial lineage transcription + confirm on print。怪物 DC 14 仍绑 Roll20/AideDD。wikidot 有对应两套玩家句。 | **关闭** |
| EN-F5 身高体重 | 删除 5 feet / 90–120 pounds 及「as transcribed with the public index」 | 全文无 `5 feet`、`pounds`、`90`、`120`、`as transcribed with the public index`。体型/速度 30 改挂 unofficial transcription + confirm on print。 | **已删除，关闭** |
| EN-F6 MotM 体型/类型/ASI/Recall | 索引只够三个特性名；其余对印刷 MotM 或标明免费页没有 | Lock B：索引只列 Expert Duplication, Kenku Recall, Mimicry，并写明不印 creature type/size/speed/ASI/Languages/DC。其余挂 wikidot + confirm printed MotM。wikidot MotM 有 Humanoid、Medium or Small、30 feet、+2/+1 或三个 +1、Recall PB 次、Languages Common+1。 | **关闭** |
| EN-F7 Training 名单 / Forgery 效果 | 名称可留；效果/四技能不可说 index 已给出 | 「The index names are Kenku Training / Kenku Recall. The index does not print a skill menu or a use count。」效果挂 transcription；示例加「If your printed … page matches」。wikidot 有四技能与 Forgery/Duplication 效果句。 | **关闭** |
| EN-F8 unused wings | 删除第三方 unused wings 主张 | 无 `unused wings`。失败分支改为 raven/crow familiar；无翼仍用索引风味「robbed of their wings」。 | **已删除，关闭** |
| EN-F9 学法术求飞行 | 删除 | 无 `flight spells` / `hope of mastering`。保留「Official Kenku traits do not ban spellcasting」与 2024 V 组件（允许源支持的否定句）。 | **已删除，关闭** |
| Sources 含 wikidot | 审计指出英文未列却使用转写句 | 增 `wikidot-kenku-lineage` → `https://dnd5e.wikidot.com/lineage:kenku`，标明 **Not official.** Printed Volo’s or MotM wins。`ddb-species-index` supports 写明 **不**印 Languages、Mimicry DCs、skill menus、size、speed、trait effect text。 | **关闭** |

未重新打开 DDB 付费专页。未把 wikidot 当官方原文主链。

---

## 2. 二十二条（复验；修订主要影响 9/10/18/20）

| # | 检查项 | 判定 | 依据 |
|---|---|---|---|
| 1 | 堵住所有反驳 | 未命中 | 例外仍是操作例外（问 DM、对印刷页、禁混书）。 |
| 2 | 知识全部输出 | 未命中 | wikidot 上的 Age 12–60、Volo Alignment 未写入；Alignment 仍只引用勘误删除。 |
| 3 | 匀速排比 | 未命中 | Lock / 失败分支仍是教程平行格式。 |
| 4 | 让步模板 | 未命中 | 无 although/however 链。 |
| 5 | 反复命名 | 未命中 | 「unofficial lineage transcription」是来源身份，不是空概念仪式。 |
| 6 | 情绪曲线 | 不适用 | 无亲历叙事。 |
| 7 | 虚构读者错误 | 未命中 | 混书失败仍是可观察错误。 |
| 8 | 不是X而是Y | 未命中 | 版本区别仍必要。 |
| 9 | 没有任何犹豫 | 未命中 | 修订后不确定处更清楚：索引无语言句；转写须对印刷页；2024+Volo’s 问 DM。 |
| 10 | 虚假精确 | 未命中 | 玩家 DC/名单/体型不再冒充已打开 DDB 全文；怪物 DC 14 仍有 Roll20/AideDD。身高体重已删。 |
| 11 | 脆弱经历 | 不适用 | 无个人失败故事。不要求补虚构亲历。 |
| 12 | 万能步骤 | 未命中 | 三锁 + 印刷页确认 + 裁切失败分支仍在。 |
| 13 | 金句收束 | 未命中 | 收在 session-zero 检查。 |
| 14 | 节奏过均 | 未命中 | 「confirm on print」重复是方法说明，不是等长换词。 |
| 15 | 感受替代论证 | 未命中 | token 仍是可观察裁切。 |
| 16 | 空钩子开头 | 未命中 | 首三句仍是来源、说话差异（已降级为转写）、token 构图。 |
| 17 | 连接词过密 | 未命中 | 无 in fact / worth noting。 |
| 18 | 刻意同义替换 | 未命中 | 索引 vs unofficial lineage transcription vs printed page 三分法稳定。 |
| 19 | 翻译腔 | 未命中实质问题 | 「errata titles that block at p. 111」仍别扭，不改规则含义，不升必须修订。 |
| 20 | 虚构故事/实测 | 未命中 | 示例仍标 Example；无 we tested。 |
| 21 | 祝福结尾 | 未命中 | 检查表结尾。 |
| 22 | 强行深刻 | 未命中 | 无诅咒哲学升华。 |

---

## 3. 六类形式指纹

| 指纹 | 判定 | 证据 |
|---|---|---|
| 破折号过密 | 未命中 | 正文 Lock 标题少量；其余在 Sources 书目分隔。 |
| 粗体过密 | 未命中 | 锁名、特性名、失败分支、FAQ、Sources id。 |
| 装饰符号 | 未命中 | 无 emoji。 |
| 助手残留 | 未命中 | 无内部路径/提示词。 |
| 填充短语 | 未命中 | 「unofficial lineage transcription / confirm on print」是来源限制，不是空填充。 |
| 泛泛结尾 | 未命中 | session-zero 检查。 |

---

## 4. 三门 + Length/SEOTruth

### ResearchTrace — 通过

无检索日志、SERP、`tmp/`、任务卡口吻。wikidot 以公开引用进入 Sources，并写 Not official。DDB 索引的「不承担」声明与正文用法一致。

### ReaderValue — 通过

完成标志仍能写出来：来源三行 + Wildemount 须对印刷书；说话与 Mimicry 以转写预览、印刷页锁定；技能包抄印刷名单且不混书；体型对印刷页；PC 无黑暗视觉；token 留喙与头羽、去飞翼。比旧稿多一步「对印刷页」，主任务仍可完成。

### Repetition — 通过

「index 无语言句 / unofficial transcription / confirm on print」多次出现，承担的是审计要求的来源分层，不是无信息复读。FAQ 与正文承诺一致。

### Length — 机械 4374 ≥ 2000；语义本审通过

增加的字来自来源降级，不是跑题填充。

### SEOTruth — 正文/FAQ 一致；题文锁后另验

---

## 5. 高风险规则（修订后仍须成立）

| 点 | 新稿 | 结果 |
|---|---|---|
| 说话分书 | 保留 Volo 失语 vs MotM 可说，但挂 wikidot + 对印刷页；怪物语言仍用 AideDD/Roll20 | 通过 |
| Mimicry DC | 玩家两套转写；怪物 DC 14 官方可链；禁止 DC 14 上 PC | 通过 |
| ASI | Volo +2 Dex/+1 Wis 仍绑 DDB 索引；MotM 弹性加值改 transcription；2024 忽略旧 ASI 仍绑博文 1787 | 通过 |
| 黑暗视觉 | 「Neither Volo’s nor MotM lists Darkvision」；2024 怪物 60 ft 不可抄 | 通过 |
| 2024 无 Kenku | 十物种名单 + Origins 章，无 Kenku；`/blog/dnd-races` 声明名单无 Kenku | 通过 |
| PC ≠ 怪物 | 仍禁贴 Darkvision / Monstrosity / Ambusher / Shadow Blade / CR | 通过 |

---

## 6. 工具句

未改、未越权。仍是 `/#editor-workspace`，无 `/editor`，无 Kenku 模板，无实测 VTT。

---

## 7. 图位

三张占位路径仍在。caption 1 已去掉 EGtW，改为「Left column is Volo’s。」caption 2/3 仍可执行。不因缺真实 webp 失败。

---

## 8. 保护的限制（淬文不得删）

1. DDB 免费索引无 Kenku Languages / DC / 技能名单 / 体型 / 速度 / 效果全文。
2. 玩家开口与 Mimicry 公式来自 unofficial wikidot 转写，印刷 Volo’s/MotM 为准。
3. Wildemount 不是本页已核验第三锁。
4. 2024 侧栏只忽略旧 ASI，不自动删失语。
5. PC 无黑暗视觉；怪物数字不可抄上 PC。
6. 无 Kenku 模板；导出非商用许可。
7. 示例不是实测。不要为「像人」补虚构亲历。

---

## 9. 必须修订的原句

**无。**

---

## 10. 八层

| 层 | 结果 |
|---|---|
| 1–2 | 22 条与指纹无必须修订命中 |
| 3 | 说明语气，无虚构人格 |
| 4 | 引用分层已按审计修复；wikidot 不当官方 |
| 5–6 | 限制与锁书判断保留 |
| 7 | 本轮不要求再改 |
| 8 | 用户终审尚未进行 |

---

## 11. 剩余风险（非阻塞）

1. 「errata titles that block at p. 111」语序仍别扭。
2. 对照表 2024 列 Languages 格仍带「does not print a ruling that deletes a mute line」；后文已把 Lock C MotM 与 2024+Volo’s 分开。
3. 图 1 alt 仍写 mute vs speaking 两栏，是示意图内容；正文已把说话句降为转写。
4. `en-public-references.json` 是否已同步增 wikidot 不在本次正文鉴文范围；正文 Sources 已含该 URL。
5. 标题/描述未生成；占位 webp 组页后再看。

---

## 12. 结论

| 项 | 值 |
|---|---|
| 三态 | **PASS** |
| 被审 hash | `8b80188c2d964b6f35de9cd54b9fc3d5bc1400f842afafd3a44c738914a9e01b` |
| 必须修订硬伤 | 无 |
| 进入淬文/锁正文 | **允许**，锁此 hash |
| 用户终审 | 尚未进行 |
