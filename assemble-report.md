# DND Ranger EN/ZH 页面装配报告

日期：2026-09-09  
项目：`/Users/wusir/Desktop/开发项目集合/token-maker-app`  
输入：`/Users/wusir/Desktop/工作/dnd-ranger-orchestration/`  
流程依据：仅使用 `/Users/wusir/Desktop/博客-v6修订版/`；未使用旧博客 skill。

## 范围与冻结门

- `review-zh-r2.md`：结论为建议正式冻结，范围限定为 ZH content-only 内容交接。
- `review-en-r2.md`：结论为 `ACCEPT_FOR_CONTENT_ONLY_FREEZE`，不扩展为 page-ready、部署或线上验收。
- 正文未改写，直接按交接包装配为 HTML；英文与中文使用独立正文和同一 `dnd-ranger` slug。
- 仅修改博客正文模块、registry、页面相关测试和本报告；未 commit、deploy、加依赖、写外部服务或创建封面资源。

## 装配结果

- `src/lib/blog-posts/dnd-ranger.ts` 导出 `dndRangerArticleHtml` 与 `dndRangerArticleHtmlZh`，保留输入正文的 H2/H3、表格、列表、描述性链接和版本边界。
- `src/lib/blog/registry.ts` 注册 EN/ZH 两个 `BlogPost`，slug 均为 `dnd-ranger`，分别使用交接中的 SEO title、H1、description 和正文。
- `publishedAt`/`updatedAt` 使用装配日期 `2026-09-09`；交接没有 cover/FAQ，因此不虚构 `coverImage` 或 `faqItems`。
- 两个对象追加到现有数组末尾，避免改变已有首页与分页固定顺序；第 6 页现有 2 篇变为 3 篇。
- 新测试覆盖双语详情、canonical/hreflang、Article schema、无 FAQ/封面、sitemap 条目和第 6 页收录。

## 内容包复核输出

执行 V6 计数脚本：

```text
EN: mechanical_units=3294, required_floor=2000, meets_mechanical_floor=true
EN: sha256_raw=7f1ab269a80538b38e1569c93b0e96d9de847403354285addcbc4f26fbdd6469
EN: sha256_nfc_lf=7f1ab269a80538b38e1569c93b0e96d9de847403354285addcbc4f26fbdd6469
ZH: mechanical_units=4624, required_floor=2000, meets_mechanical_floor=true
ZH: sha256_raw=23b758e79e4f5f156d8ade1c54a3ee51e8b2fe50104a76bcfd774efe7d30534d
ZH: sha256_nfc_lf=23b758e79e4f5f156d8ade1c54a3ee51e8b2fe50104a76bcfd774efe7d30534d
```

独立的装配脚本读取生成 HTML、公开引用和输入正文，结果为：

```text
EN: headings=14, tables=5, lists=1, links=13, quote_total=21, quote_failures=[], url_set_match=true
ZH: headings=19, tables=2, lists=3, links=9, quote_total=24, quote_failures=[], url_set_match=true
```

## 项目验证输出

```text
pnpm exec vitest run src/lib/blog/dnd-ranger.test.ts src/lib/blog/pagination.test.ts src/app/sitemap.test.ts
Test Files  3 passed (3)
Tests       44 passed (44)
exit 0
```

```text
pnpm typecheck
exit 0

pnpm lint
exit 0
1 existing warning: src/components/coat-of-arms/CoatMakerSeoContent.tsx:25:9 (@next/next/no-img-element)

pnpm build
Compiled successfully; TypeScript finished; generated static pages 149/149
exit 0

git diff --check
exit 0
```

全量测试也曾通过 package script 尝试，但该调用实际运行了全仓测试，结果为 `143` 个测试文件通过、`BatchPanel.test.tsx` 1 个范围外测试失败（`retries one superseded target load once before selecting the loaded target`，`aria-pressed` 期望 `true`、实际 `false`）。本次未修改该组件或测试；本报告将它与本页的 3 文件/44 测试通过结果分开记录。

## 本地浏览器回读

使用本地 ego-browser task space，在 `pnpm dev --port 40001` 下读取两个最终路由；开发服务器真实日志为：

```text
GET /blog/dnd-ranger 200
GET /zh/blog/dnd-ranger 200
```

英文回读：

```text
title=DND Ranger Guide: Choose Your Edition and Party Role | Token Maker
h1=DND Ranger Guide for 2014 and 2024 Rules
canonical=https://www.tokenmaker.one/blog/dnd-ranger
hreflang=x-default/en-US -> /blog/dnd-ranger; zh-CN -> /zh/blog/dnd-ranger
bodyMarker=true; notFound=false; localeSwitch=/zh/blog/dnd-ranger
```

中文回读：

```text
title=DND 游侠指南：2024 与 2014 版本、建卡与首回合 | Token Maker
h1=DND 游侠指南：从版本选择到 1 级职责与首回合
canonical=https://www.tokenmaker.one/zh/blog/dnd-ranger
hreflang=x-default/en-US -> /blog/dnd-ranger; zh-CN -> /zh/blog/dnd-ranger
bodyMarker=true; notFound=false; localeSwitch=/blog/dnd-ranger
```

浏览器回读证明本地页面路由、标题、H1、canonical、hreflang、正文标记和 locale 切换；不证明部署、收录、排名或线上状态。

## 未执行与保留项

- 未创建 `public/blog/covers/en/dnd-ranger-guide.webp`：交接 media.cover 为 `null`，且输入明确不要求封面。
- 未修改 `public/llms.txt`：当前任务 allowlist 未包含它；sitemap 由 registry 自动投影并已测试。
- 未进行 commit、deploy 或任何外部写入。
