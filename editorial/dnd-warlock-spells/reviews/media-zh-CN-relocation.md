# media-zh-CN 报告归档凭据

## 当前归档任务身份

- Run：`run_39994fa3f53e`
- 当前 Task：`task_247457125235`
- 当前 Dispatch：`ctx_457e8eed3f8c`
- Worker 会话/终端：`term_99937249-9bbf-45c7-9ad3-ffd126042df5`
- 协调者终端：`term_2b5c6082-1ffd-43b2-9816-0e0baf5eea10`

## 归档目标

- 原路径：`reviews/media-zh-CN.md`
- 新路径：`editorial/dnd-warlock-spells/reviews/media-zh-CN.md`
- 凭据路径：`editorial/dnd-warlock-spells/reviews/media-zh-CN-relocation.md`

本轮只机械归档上次 V-zh Worker 在同一 Run 产生的媒体报告，不改 SVG、WebP、正文、布局或报告内容，不重画、不重审、不计入内容修订轮数。

## 归档前确认

实际只读预检结果：

- `TARGET_EXISTS=0`：新路径归档前不存在。
- `CREDENTIAL_EXISTS=0`：本凭据文件归档前不存在。
- `OLD_FILE=1`：旧路径存在且为普通文件。
- 旧文件中实际回读并匹配：Run `run_39994fa3f53e`、上次 Task `task_796f0e17d7d7`、上次 Dispatch `ctx_239c53e1e3e1`、Worker 终端 `term_99937249-9bbf-45c7-9ad3-ffd126042df5`。
- 旧文件原始字节数：`6359` bytes。
- 旧文件原始 SHA-256：`ff7908c27ffdd7d9a61f9ace12ec0617d698d1de1d0c7626fb904d4d1461e003`。

## 执行与回读

1. 以 `apply_patch Add` 将旧路径完整内容写入新路径，工具返回 `{}`。
2. 独立回读两路径：`shasum -a 256` 输出完全相同：

   - `old_hash=ff7908c27ffdd7d9a61f9ace12ec0617d698d1de1d0c7626fb904d4d1461e003`
   - `target_hash=ff7908c27ffdd7d9a61f9ace12ec0617d698d1de1d0c7626fb904d4d1461e003`

3. `cmp reviews/media-zh-CN.md editorial/dnd-warlock-spells/reviews/media-zh-CN.md` 返回 `cmp_exit=0`；两文件回读均为 `6359` bytes。
4. SHA 与字节一致确认后，以 `apply_patch Delete` 删除旧路径，工具返回 `{}`。

## 结论

- **PASS**：旧报告身份属于本 Run 的上次 V-zh 媒体任务；新路径归档前为空；Add 后 SHA-256 与原文件相等、`cmp_exit=0`、字节数一致；确认后 Delete 旧文件。
- **FAIL**：无本任务范围内的机械归档失败。
- **UNVERIFIED**：未重新执行网站、浏览器、图片或内容验收；这些均明确不属于本轮机械归档范围。

