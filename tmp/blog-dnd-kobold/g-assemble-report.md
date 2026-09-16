# G 装配报告 — `dnd-kobold`

Role: G。Date: 2026-09-16。  
未 commit / push / deploy。未把 `tmp/blog-dnd-kobold/` 研究稿写入 `src/`。  
正文句子、图注、链接锚文本、图中事实、Title/H1/Description/slug 未改。

## 装配结果

- EN 路由：`/blog/dnd-kobold`
- ZH 路由：`/zh/blog/dnd-kobold`
- publishedAt / updatedAt：`2026-09-16`
- EN FAQ 4 条与正文 FAQ `h3`/`p` 逐字一致（含实体与内链 HTML）
- ZH `faqItems: []`，正文无 FAQ
- `postsByLocale` en/zh 数组最前插入本篇；首页 lead 现为 `dnd-kobold`

## 改了哪些文件

### 新增

- `src/lib/blog-posts/dnd-kobold.ts` — 冻结 `draft-body.html` 装进 `String.raw`，槽位换成 shared 常量
- `src/lib/blog/dnd-kobold.test.ts` — 仿 kenku
- `public/blog/covers/en/dnd-kobold-guide.webp` — EN 封面（1280×720，源 `tmp/.../en/figures/cover-kobold.png`）
- `public/blog/covers/en/dnd-kobold-zh-guide.webp` — ZH 封面（1920×1080，源 `tmp/.../zh/figures/cover-kobold-zh.png`；放在 `covers/en`，与现有目录一致）
- `public/blog/inline/dnd-kobold/kobold-lock-2014-2024.webp`
- `public/blog/inline/dnd-kobold/kobold-pack-tactics-grid.webp`
- `public/blog/inline/dnd-kobold/kobold-snout-crop.webp`
- `public/blog/inline/dnd-kobold/kobold-identify-zh.webp`
- `public/blog/inline/dnd-kobold/kobold-lock-zh.webp`
- `public/blog/inline/dnd-kobold/kobold-axes-zh.webp`

### 修改

- `src/lib/blog-posts/shared.ts` — 封面/正文图路径常量，以及 `EN_DND_KOBOLD_PATH` / `ZH_DND_KOBOLD_PATH`
- `src/lib/blog/registry.ts` — import、en/zh `BlogPost`、插入 `postsByLocale` 最前
- `src/lib/blog/pagination.test.ts` — 7 页仍成立；末页 1→2；首页 lead `dnd-kobold`
- `src/lib/blog/index.test.ts` — 首页 10 篇 slug、第 2 页起点
- `src/app/sitemap.test.ts` — 本篇 bilingual 条目；hub page 5/6 `lastModified` → `2026-09-16`
- `public/llms.txt` — 中英各一条

未改无关文章、未覆盖已有 slug。

## 冻结字段（原样写入）

| 项 | EN | ZH |
|---|---|---|
| slug | `dnd-kobold` | `dnd-kobold` |
| title / H1 | Matching CR 1/8 Does Not Make One DnD Kobold | DND 狗头人不能同时抄瓦罗和魔邓肯 |
| seoTitle | 同 title | DND 狗头人（Kobold）不能同时抄瓦罗和魔邓肯 |
| Description | Tonight's dnd kobold is the 2014 Kobold (Small Humanoid, Lawful Evil) or the 2024 Kobold Warrior (Small Dragon, Neutral). Copy that page only. | DND 狗头人（Kobold）是带鳞、小角的小龙类人。写卡只锁瓦罗或魔邓肯其中一页；摇尾乞怜不要叠龙吼。 |
| excerpt | 交接 excerpt | 交接 excerpt |
| coverLabel | Monster Guide | 种族百科 |
| relatedSlugs | dnd-kenku, dnd-dragonborn, dnd-races | 同 |

EN draft hash 核验：`31e9d41d39b9d1e7fd8d6be8b4b9695b2ba852288f69fac248534988839477ac`  
ZH draft hash 核验：`d78f0ba3312a9686b27566ce7c835913c1d6963eb555731f292b9d36c6e2c3bf`

装配后 body 因替换 `${…}` 槽位而与 draft hash 不同，属预期。

## 验证（真实输出）

```
pnpm exec vitest run src/lib/blog/dnd-kobold.test.ts src/lib/blog/pagination.test.ts src/lib/blog/index.test.ts src/app/sitemap.test.ts
```

```
 RUN  v4.1.5 /Users/wusir/Desktop/开发项目集合/token-maker-app

 ✓ src/lib/blog/pagination.test.ts (6 tests) 4ms
 ✓ src/app/sitemap.test.ts (44 tests) 28ms
 ✓ src/lib/blog/index.test.ts (127 tests) 62ms
 ✓ src/lib/blog/dnd-kobold.test.ts (2 tests) 27ms

 Test Files  4 passed (4)
      Tests  179 passed (179)
   Start at  10:24:18
   Duration  1.07s
```

```
pnpm typecheck
```

```
> token-maker-app@0.1.0 typecheck /Users/wusir/Desktop/开发项目集合/token-maker-app
> tsc --noEmit
```

typecheck 退出码 0。

## 本地路由

- EN：`/blog/dnd-kobold`
- ZH：`/zh/blog/dnd-kobold`

未启动 `pnpm dev`（本轮测试与 typecheck 已过；页面图文审不在 G 范围）。

## 未做（交给 E）

- 浏览器审真实页面图文
- 用户终审
- commit / push / deploy

## 续办：`dnd-campaigns.test.ts`

同文件最小修复：首页 lead `dnd-skills` → `dnd-kobold`（en/zh）。末页篇数 1→2（加一篇后第 7 页是 2 篇，不改该断言会失败）。未 commit。

```
pnpm exec vitest run src/lib/blog/dnd-campaigns.test.ts src/lib/blog/pagination.test.ts
```

```
 RUN  v4.1.5 /Users/wusir/Desktop/开发项目集合/token-maker-app

 ✓ src/lib/blog/dnd-campaigns.test.ts (2 tests) 4ms
 ✓ src/lib/blog/pagination.test.ts (6 tests) 4ms

 Test Files  2 passed (2)
      Tests  8 passed (8)
   Start at  10:29:55
   Duration  581ms
```

## 续办：E-PAGE-EN FAIL 两条

未改正文主张、Title/H1/Description/slug。未 commit。未改 `buildBlogPostFaqStructuredData`。

### 条 1 — Article map `&mdash;`

`src/lib/blog/html-utils.ts` `decodeHeadingText` 在现有实体之后补：`&mdash;`→—、`&ndash;`→–、`&minus;`→−、`&rsquo;`→’、`&ldquo;`→“、`&rdquo;`→”。目录仍走 `post.headings`，未改 TOC 组件。

### 条 2 — FAQ JSON-LD 带标签

`registry.ts` `dndKoboldArticle.faqItems` 四条 answer 去掉 `<a>` `<em>` `<strong>`，保留 `&amp;` / `&rsquo;`。可见 FAQ 正文未改。`dnd-kobold.test.ts` 改为：h3 仍逐字匹配；answer 禁止标签；可见文本仍用 `expectVisibleFaqItems`；并断言 TOC 标题含 `2014 —` 且不含 `&mdash;`。

### 验证

```
pnpm exec vitest run src/lib/blog/dnd-kobold.test.ts src/lib/blog/html-utils.ts src/lib/blog/index.test.ts
```

`html-utils.ts` 无测试文件，vitest 只跑到有测试的两个文件：

```
 RUN  v4.1.5 /Users/wusir/Desktop/开发项目集合/token-maker-app

 ✓ src/lib/blog/index.test.ts (127 tests) 60ms
 ✓ src/lib/blog/dnd-kobold.test.ts (2 tests) 30ms

 Test Files  2 passed (2)
      Tests  129 passed (129)
   Start at  10:50:11
   Duration  1.09s
```

```
pnpm typecheck
```

```
> token-maker-app@0.1.0 typecheck /Users/wusir/Desktop/开发项目集合/token-maker-app
> tsc --noEmit
```

typecheck 退出码 0。

