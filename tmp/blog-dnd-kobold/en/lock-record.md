# F-EN lock record — `dnd kobold` EN

Role: F-EN（锁稿与标题，非 C，非 E）。Date: 2026-09-16.  
未改正文。未改 `src/` / `public/`。未 commit。不签发题文通过。

## 版本绑定

| 项 | 值 |
|---|---|
| 锁定文本 | `tmp/blog-dnd-kobold/en/draft-body.html` |
| 声称 hash（任务） | `31e9d41d39b9d1e7fd8d6be8b4b9695b2ba852288f69fac248534988839477ac` |
| 本层实测 SHA-256（原始字节） | `31e9d41d39b9d1e7fd8d6be8b4b9695b2ba852288f69fac248534988839477ac` |
| NFC + LF 后 SHA-256 | `31e9d41d39b9d1e7fd8d6be8b4b9695b2ba852288f69fac248534988839477ac` |
| 字节 | 39568 |
| 编码 | UTF-8 |
| 换行 | LF only（无 CR） |
| NFC | 已是 NFC；规范化不改字节 |
| D | `tmp/blog-dnd-kobold/en/d-check-r1.md` PASS，同一 hash |
| E | `tmp/blog-dnd-kobold/en/e-review.md` PASS，同一 hash |

哈希对齐。锁稿绑定该 hash。未另存一份正文副本。

## 淬文（不改稿）

| 项 | 结论 |
|---|---|
| 事实与公开引用可用 | 通过。22 条公开引用均在正文使用；D/E 已对该 hash 核过锁年数字与引用措辞 |
| ReaderTask 一致 | 通过。主任务仍是锁今晚 2014 Kobold 或 2024 Kobold Warrior，不平均两块，不把可玩页抄进怪物 |
| 信息增益存在 | 通过。2014 Humanoid/LE 与 2024 Warrior/Dragon/Neutral 并列表述；日光范围差；Pack Tactics 按 5 英尺格；MotM Draconic Cry 不上怪物卡；Small = 1 格 |
| 结构清楚 | 通过。开头答案 → 身份 → 锁年表 → Pack Tactics → 可玩栅栏 → 可选裁切 → mix-ups → session check → FAQ → Sources |
| NFC | 通过。见上 |
| 合格计数 ≥ 2000 | 通过。机械单位 **3750**（en 单词） |

未发现须退 C/A/B 的缺口。E 可选口气项（MotM Alignment 合成判断、`0.8` 未挂源码链、FAQ +2 Dex 位置）不是本层退稿条件，且不得借标题阶段改正文。

## 计数

- 语言：en（单词；连字符/撇号相连算一个单位）
- 脚本：`/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py`
- 输入：`tmp/blog-dnd-kobold/en/lock-body-plain.txt`（由已锁 HTML 转出的纯正文；剔除 figure/caption；`<code>` 进围栏以便脚本不计代码；FAQ / Sources 用 `--exclude-heading` 整段剔除）
- 合格单位：**3750**
- 门槛：2000
- `meets_mechanical_floor`：**true**
- 语义资格：脚本不审质量；D/E 已对该 hash 做过语义门

### 脚本原始输出

```json
{
  "file": "/Users/wusir/Desktop/开发项目集合/token-maker-app/tmp/blog-dnd-kobold/en/lock-body-plain.txt",
  "locale": "en",
  "mechanical_units": 3750,
  "required_floor": 2000,
  "meets_mechanical_floor": true,
  "semantic_qualification": "requires_independent_review",
  "excluded_heading_sections": [
    "FAQ about dnd kobold",
    "Sources"
  ],
  "omitted_line_counts": {
    "headings": 21,
    "code": 12,
    "excluded_sections": 36,
    "non_body": 65,
    "frontmatter": 0
  },
  "sha256_raw": "7600374ef0a283c7879cc17f18874295f0e55919db31b1d92d3c82080338e89d",
  "sha256_nfc_lf": "7600374ef0a283c7879cc17f18874295f0e55919db31b1d92d3c82080338e89d"
}
```

`lock-body-plain.txt` 的 hash 只标识计数输入，**不是**正文锁 hash。正文锁 hash 仍是 `draft-body.html` 的 `31e9d41d39b9d1e7fd8d6be8b4b9695b2ba852288f69fac248534988839477ac`。

## 标题状态

候选与筛选：`tmp/blog-dnd-kobold/en/title-candidates.md`  
选定表面：`tmp/blog-dnd-kobold/en/locked-seo.md`  
公开交接草稿：`tmp/blog-dnd-kobold/en/public-handoff.md`

**待 E 题文复核（SEOTruth）。** F 不签署最终标题通过。E 通过前不得把本交接当作已冻结的 `freezePublicBlogHandoff`。
