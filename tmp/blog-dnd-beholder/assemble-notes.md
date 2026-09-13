# dnd-beholder 接入笔记

未 commit。未把 `tmp/` 加进 git。未改 `spectator-dnd` / `mind-flayer-dnd` 正文。

## 改动文件

- `src/lib/blog-posts/shared.ts`：新增 `export const DND_SRD_URL = DND_SRD_52_URL;`
- `src/lib/blog-posts/dnd-beholder.ts`：新建；EN/ZH 正文从 `tmp/blog-dnd-beholder` 原样包进 `String.raw`；中文两处灰机目录 URL 改为 `${BEHOLDER_HUIJI_2025_CATALOG_URL}`
- `src/lib/blog/dnd-beholder.test.ts`：新建，结构对照 `mind-flayer-dnd.test.ts`
- `src/lib/blog/registry.ts`：封面/HTML import；`mindFlayerDndArticleZh` 之后插入 EN/ZH `BlogPost`（日期 2026-09-13，FAQ 5 条原样进英文 `faqItems`，中文 `faqItems: []`）；`postsByLocale` en/zh 插到第一位
- `src/lib/blog/pagination.test.ts`：lead `dnd-beholder`；页长 `[10,10,10,10,10,9]`；仍 6 页
- `src/lib/blog/dnd-campaigns.test.ts`：第 6 页 length 9；lead `dnd-beholder`
- `src/lib/blog/index.test.ts`：`FIRST_BLOG_PAGE_SLUGS` / `SECOND_BLOG_PAGE_START_SLUGS` 按锁稿更新
- `src/app/sitemap.test.ts`：mind-flayer 测试前加双语 `dnd-beholder` 路由；`page/5` 与 `page/6` 的 `lastModified` 改为 2026-09-13
- `public/llms.txt`：英文 Blog And Guides 在 mind-flayer 前插入 EN 标题+excerpt+url；Optional 在夺心魔前插入中文标题+excerpt+url

未改：`site-routes.test.tsx`、`types.ts`、`index.ts`、`sitemap.ts`。

## 验证输出

```
pnpm exec vitest run src/lib/blog/dnd-beholder.test.ts src/lib/blog/pagination.test.ts src/lib/blog/dnd-campaigns.test.ts src/lib/blog/index.test.ts src/app/sitemap.test.ts

 RUN  v4.1.5 /Users/wusir/Desktop/开发项目集合/token-maker-app

 ✓ src/lib/blog/dnd-campaigns.test.ts (2 tests) 4ms
 ✓ src/lib/blog/pagination.test.ts (6 tests) 5ms
 ✓ src/app/sitemap.test.ts (41 tests) 25ms
 ✓ src/lib/blog/index.test.ts (127 tests) 65ms
 ✓ src/lib/blog/dnd-beholder.test.ts (2 tests) 37ms

 Test Files  5 passed (5)
      Tests  178 passed (178)
   Duration  1.39s
```

```
pnpm typecheck

> token-maker-app@0.1.0 typecheck /Users/wusir/Desktop/开发项目集合/token-maker-app
> tsc --noEmit
```

typecheck 退出码 0。未跑全量 test，未跑 `pnpm build`。
