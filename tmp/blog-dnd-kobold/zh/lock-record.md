# F-ZH lock record — `dnd kobold` ZH

Role: F-ZH（锁稿与标题，非 C，非 E）。Date: 2026-09-16.  
未改正文。未改 `src/` / `public/`。未 commit。不签发题文通过。

## 版本绑定

| 项 | 值 |
|---|---|
| 锁定文本 | `tmp/blog-dnd-kobold/zh/draft-body.html` |
| 声称 hash（任务） | `d78f0ba3312a9686b27566ce7c835913c1d6963eb555731f292b9d36c6e2c3bf` |
| 本层实测 SHA-256（原始字节） | `d78f0ba3312a9686b27566ce7c835913c1d6963eb555731f292b9d36c6e2c3bf` |
| NFC + LF 后 SHA-256 | `d78f0ba3312a9686b27566ce7c835913c1d6963eb555731f292b9d36c6e2c3bf` |
| 字节 | 22339 |
| 编码 | UTF-8 |
| 换行 | LF only（无 CR） |
| NFC | 已是 NFC；规范化不改字节 |
| D | `tmp/blog-dnd-kobold/zh/d-check-r2.md` PASS，同一 hash |
| E | `tmp/blog-dnd-kobold/zh/e-review-r2.md` PASS，同一 hash |

哈希对齐。锁稿绑定该 hash。未另存一份正文副本。未改 `draft-body.html`。

## 淬文（不改稿）

| 项 | 结论 |
|---|---|
| 事实与公开引用可用 | 通过。`public-references.json` 18 条、全部 `{quote, occurrence}` 均能在本 hash 正文定位（缺 0）。D/E 已核龙吼介绍文四项、日照敏感「未列入」、力量 -2 勘误、XOR |
| ReaderTask 一致 | 通过。主任务仍是正名狗头人（Kobold）+ 锁瓦罗 XOR 魔邓肯。无 Token Maker、无棋子教程、无职业/DPR。科博德 5 处均为排除。寇伯仅维基别称 |
| 信息增益存在 | 通过。五路认词表；玩家对照表 + 同卡失败示例；印本 vs 勘误一问；怪物轴短表 + 五条上桌核对。审一张混写卡能判定失败并指向该留哪一页 |
| 结构清楚 | 通过。开头答案与三行表 → 正名 → 五路分流 → 锁页对照与四则 H3 → 怪物轴 → 五条核对 → Sources。无 FAQ |
| NFC | 通过。见上 |
| 合格计数 ≥ 2000 | 通过。机械单位 **2887**（zh-CN 汉字） |

未发现须退 C/A/B 的缺口。`${…}` 装配槽仍在，本阶段保留；G 替换真实 URL 后若写入 body 须重算 hash。不得借标题阶段改正文。

## 计数

- 语言：zh-CN（汉字；拉丁字母与数字不计）
- 脚本：`/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py`
- 输入：`tmp/blog-dnd-kobold/zh/lock-body-plain.txt`（由已锁 HTML 转出的纯正文；剔除 figure/caption；Sources 用 `--exclude-heading` 整段剔除）
- 合格单位：**2887**
- 门槛：2000
- `meets_mechanical_floor`：**true**
- 语义资格：脚本不审质量；D/E 已对该 hash 做过语义门

### 脚本原始输出

```json
{
  "file": "/Users/wusir/Desktop/开发项目集合/token-maker-app/tmp/blog-dnd-kobold/zh/lock-body-plain.txt",
  "locale": "zh-CN",
  "mechanical_units": 2887,
  "required_floor": 2000,
  "meets_mechanical_floor": true,
  "semantic_qualification": "requires_independent_review",
  "excluded_heading_sections": [
    "Sources"
  ],
  "omitted_line_counts": {
    "headings": 9,
    "code": 0,
    "excluded_sections": 19,
    "non_body": 54,
    "frontmatter": 0
  },
  "sha256_raw": "3456bc1fd1c1f2599247c3211062e6a3a8905bb6359c153ab01042d9348001df",
  "sha256_nfc_lf": "3456bc1fd1c1f2599247c3211062e6a3a8905bb6359c153ab01042d9348001df"
}
```

`lock-body-plain.txt` 的 hash 只标识计数输入，**不是**正文锁 hash。正文锁 hash 仍是 `draft-body.html` 的 `d78f0ba3312a9686b27566ce7c835913c1d6963eb555731f292b9d36c6e2c3bf`。

## 标题状态

候选与筛选：`tmp/blog-dnd-kobold/zh/title-candidates.md`  
选定表面：`tmp/blog-dnd-kobold/zh/locked-seo.md`  
公开交接草稿：`tmp/blog-dnd-kobold/zh/public-handoff.md`

**待 E 题文复核（SEOTruth）。** F 不签署最终标题通过。E 通过前不得把本交接当作已冻结的 `freezePublicBlogHandoff`。
