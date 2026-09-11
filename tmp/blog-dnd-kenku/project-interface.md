# ProjectInterfaceSpec：把 dnd kenku 中英博客装进现有 Next.js 站点

当前 git 分支：`博客`。本文件只描述现有接口与接入点。不写正文，不拟定标题。仓库内全文检索 `kenku`：0 处匹配。`dnd-races` / `dnd-grung` / `dnd-dhampir` 均无 kenku 页。

分页常量：`BLOG_POSTS_PER_PAGE = 10`。`getBlogPosts` 丢掉 `placeholder` 或没有 `bodyHtml` 的条目。`getBlogPostsForPage` / `getBlogPageCount` 再丢掉 `featured`。当前 `featured` 只有 `dnd-classes-explained`。占位两条：`how-to-build-a-dnd-character-token`、`best-dnd-classes-for-small-parties`。常规已发表 55 篇 → 6 页 `[10,10,10,10,10,5]`。首页网格 lead（非 featured）是 `dnd-dragonborn`。`postsByLocale.en/zh` 数组最前面插入 1 篇且不设 `featured` 后：仍 6 页，末页 6 篇，首页网格 `[0].slug` 换成新 slug。`featured` 英雄卡仍是 `dnd-classes-explained`。

---

## 1. 要改的文件清单（精确路径）

### 新增

- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog-posts/dnd-kenku.ts`  
  导出 `dndKenkuArticleHtml`、`dndKenkuArticleHtmlZh`。样板：`dnd-dragonborn.ts` 的 `String.raw` + `${}` 插值。
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog/dnd-kenku.test.ts`  
  样板：`dnd-dragonborn.test.ts`（双语元数据、FAQ 可见性、sitemap、WebP `existsSync`、`llms.txt`）。
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/public/blog/covers/en/dnd-kenku-guide.webp`  
  命名对齐 `dnd-dragonborn-guide.webp`。中英共用这一张英文封面目录，不另建 `covers/zh/`。
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/public/blog/inline/dnd-kenku/`  
  目录名 = slug。龙裔现有：3 张英文内嵌 + 2 张中文内嵌 + 1 张视频海报。Kenku 按同样分语言内嵌、英文才挂 `liteVideoEmbed`。

### 修改（接线）

- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog-posts/shared.ts`  
  封面常量、内嵌图常量、外链常量、`liteVideoEmbed` 用的 `VIDEO_ID`/`VIDEO_URL`（若英文有视频）、`EN_DND_KENKU_PATH` / `ZH_DND_KENKU_PATH`。
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog/registry.ts`  
  import HTML；写 `dndKenkuArticle` / `dndKenkuArticleZh`；把两者插到 `postsByLocale.en` 与 `postsByLocale.zh` 数组最前（在 `dndDragonbornArticle` 之前）。数组末尾 `.map(addHeadingAnchors)` 已有，不要拆掉。
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/public/llms.txt`  
  英文块「## Blog And Guides」在 Blog index 之后、当前 dragonborn 行之前插一条；中文块「## Optional」同样插到 dragonborn 中文行之前。格式见第 5 节。

### 修改（分页断言会坏，必须一起改）

- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog/pagination.test.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog/dnd-campaigns.test.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog/index.test.ts`

### 按龙裔样板通常还要补断言（不补不会让旧测试红，但新文会缺发现面）

- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/app/sitemap.test.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/app/site-routes.test.tsx`

### 不必改（路由已按 slug 生成）

- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/app/(en)/blog/[slug]/page.tsx`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/app/(zh)/zh/blog/[slug]/page.tsx`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/app/(en)/blog/page.tsx`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/app/(zh)/zh/blog/page.tsx`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/app/(en)/blog/page/[page]/page.tsx`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/app/(zh)/zh/blog/page/[page]/page.tsx`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/app/sitemap.ts`（`getBlogPosts` 驱动）
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog/index.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog/types.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog/html-utils.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog-posts/dnd-races.ts`、`dnd-grung.ts`、`dnd-dhampir.ts`、`dnd-dragonborn.ts`

---

## 2. BlogPost 字段

定义：`src/lib/blog/types.ts`。

TypeScript 必填：

| 字段 | 类型 | 龙裔实测 |
| --- | --- | --- |
| `slug` | `string` | `'dnd-dragonborn'`；中英同一 slug |
| `title` | `string` | 页面 H1 |
| `excerpt` | `string` | 详情导语；`llms.txt` 龙裔条目用的是 excerpt，不是 metaDescription |
| `updatedAt` | `string` | ISO 日期 `'YYYY-MM-DD'` |
| `readTime` | `string` | 英 `'12 min read'` / 中 `'12 分钟阅读'` |
| `coverLabel` | `string` | 英 `'Race Guide'` / 中 `'种族百科'`（grung 中文同此；dhampir 英文是 `'Lineage Guide'`） |

已发表种族文实际还会写（龙裔）：

| 字段 | 说明 |
| --- | --- |
| `publishedAt` | 龙裔与 `updatedAt` 相同。缺省时 schema/`datePublished` 回退 `updatedAt` |
| `seoTitle` | `createBlogPostMetadata.title`；`llms.txt` 链接文字用 seoTitle |
| `metaDescription` | metadata `description` |
| `coverImage` | `'/blog/covers/en/dnd-dragonborn-guide.webp'`，中英同一路径 |
| `coverAlt` | 封面 alt |
| `bodyHtml` | 没有它则 `isPublishedBlogPost` 为假，不上线 |
| `faqItems` | 见第 7 节。龙裔英 5 条，中 `[]` |
| `relatedSlugs` | 龙裔 `['dnd-races', 'dnd-classes-explained', 'dnd-constitution-guide']`。`getRelatedBlogPosts` 先按此数组、再按 `updatedAt` 补齐，默认 3 条 |

可选且龙裔未设：`headings`（`addHeadingAnchors` 生成）、`featured`、`placeholder`。新文不要设 `featured` / `placeholder`。

公开读写入口：`src/lib/blog-content.ts` 再导出 `src/lib/blog/index.ts`。详情路由只调 `getBlogPost` / `createBlogPostMetadata`。不要新建页面文件。

---

## 3. 图片尺寸 / 格式 / 命名

格式：全部 `.webp`。

封面：

- 路径：`/blog/covers/en/<slug>-guide.webp`
- 磁盘：`public/blog/covers/en/`
- 详情页 `BlogDetailPageView` 用 Next `Image`：`width={2770}` `height={1504}` `preload` `sizes="(min-width: 1024px) 50vw, 100vw"`。封面不在 `bodyHtml` 里。测试只 `existsSync`，不断言像素。本探路未从 webp 二进制读出宽高。
- 列表页 `PostCover`：`fill`。英雄卡 `loading="eager"`；网格卡默认 `loading="lazy"`。没有 HTML `fetchpriority`。

正文图：

- 路径：`/blog/inline/<slug>/<descriptive-name>.webp`
- 龙裔目录：`public/blog/inline/dnd-dragonborn/`
- 宽图：`figure.inline-figure.inline-figure--wide-crop` + `img.inline-figure__image.inline-figure__image--wide`，`width="1536"` `height="1024"`
- 方图：`figure.inline-figure.inline-figure--square-crop` + `img.inline-figure__image.inline-figure__image--square`，`width="1024"` `height="1024"`
- 属性：`loading="lazy"` `decoding="async"`。龙裔正文 `<figure>` **没有** `fetchpriority`。
- 必须有 `alt` 和 `<figcaption>`。

`liteVideoEmbed(videoId, title, { src, alt })`（`shared.ts`）：

```
<div class="inline-embed inline-embed--video lite-video" data-video-id="..." data-video-title="...">
  <img class="lite-video__thumb" ... loading="lazy" decoding="async" fetchpriority="low" width="480" height="360" />
  ...
</div>
```

禁止 `<iframe>`。龙裔测试还禁止 `role="button" tabindex="0"`。龙裔英文用本地海报 `dragonborn-video-placeholder.webp`；中文正文不含 `data-video-id`、不含 `lite-video`。

封面 `fetchpriority`：详情封面走 Next `preload`，不是文章 HTML。正文里唯一出现的 `fetchpriority` 是视频海报的 `"low"`。

---

## 4. FAQ 惯例（项目实际，不发明）

`buildBlogPostFaqStructuredData`：`faqItems` 有长度才输出 FAQPage，否则 `null`。

最近一篇种族文 **dragonborn**：

- 英文：`faqItems` 长度 5。正文有 `<h2>FAQ about dnd dragonborn</h2>`，每条是 `<h3>问题</h3>` + `<p>答案</p>`，与 `faqItems` 逐字相同。测试用 `expectVisibleFaqItems`，并断言 `>question</h3>` / `<p>answer</p>`。`addHeadingAnchors` 见到标题含 `faq` 或 `常见问题` 会把后续 h3 包进 `.blog-faq-list` / `article.blog-faq-item`。
- 中文：`faqItems: []`。正文不含「常见问题」、不含「FAQ about dnd dragonborn」。FAQ schema 为 `null`。无视频。

更早种族文：

- `dnd-races`：中英都有 `faqItems` 长度 5，且正文可见 FAQ。
- `dnd-grung` / `dnd-dhampir`：registry **没有** `faqItems`。

Kenku 若跟最近种族样板：英文 faqItems + 正文 FAQ 模块；中文空数组且正文无 FAQ 模块。不要给中文龙裔式样板发明 FAQ。

---

## 5. `public/llms.txt` 博客 URL 格式

英文在 `## Blog And Guides`，中文在 `## Optional`。一行一条：

```
- [<seoTitle>](https://www.tokenmaker.one/blog/<slug>): <excerpt>
- [<seoTitle>](https://www.tokenmaker.one/zh/blog/<slug>): <excerpt>
```

龙裔英：链接文字 = `seoTitle`，冒号后 = `excerpt`。龙裔中同理。顺序与 `postsByLocale` 一致：新文插在各自语言块最前篇（dragonborn）之前。不要改旧 slug 行。

---

## 6. 路由与本地 URL 模板

`getLocalizedPath('en', '/blog/' + slug)` → `/blog/<slug>`  
`getLocalizedPath('zh', '/blog/' + slug)` → `/zh/blog/<slug>`

站点默认 `https://www.tokenmaker.one`（`getSiteUrl`）。

本地 `pnpm dev` 端口 **40001**：

- `http://localhost:40001/blog/dnd-kenku`
- `http://localhost:40001/zh/blog/dnd-kenku`
- `http://localhost:40001/blog`
- `http://localhost:40001/zh/blog`
- `http://localhost:40001/blog/page/6`
- `http://localhost:40001/zh/blog/page/6`

线上对应：`https://www.tokenmaker.one/blog/dnd-kenku` 与 `/zh/blog/dnd-kenku`。

sitemap：`changeFrequency: 'monthly'`，非 featured `priority: 0.6`，`lastModified` = `updatedAt`。语言 alternates：`x-default` / `en-US` 英路径，`zh-CN` 中路径。

龙裔测试还要求：新文不覆盖 sibling；`dnd-races` 的 `bodyHtml` 不含 `'dnd-dragonborn'`。Kenku 同理：不要改 `dnd-races` 正文去链过去。

---

## 7. 验证命令

`package.json`：`dev` = `next dev --port 40001`；`typecheck` = `tsc --noEmit`；`lint` = `eslint`；`test` = `vitest run`；`build` = `next build`。包管理器 `pnpm@10.22.0`。

接入后至少：

```
pnpm exec vitest run src/lib/blog/dnd-kenku.test.ts src/lib/blog/dnd-dragonborn.test.ts src/lib/blog/pagination.test.ts src/lib/blog/dnd-campaigns.test.ts src/lib/blog/index.test.ts src/lib/blog/dnd-ranger.test.ts src/app/sitemap.test.ts src/app/site-routes.test.tsx
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

`dnd-ranger.test.ts` 只断言第 6 页 **包含** `dnd-ranger`。插到数组最前后 ranger 仍在第 6 页，该文件不因末页 5→6 而红。

---

## 8. 插入 1 篇后会失败的测试文件

当前断言：`getBlogPageCount === 6`；页长 `[10,10,10,10,10,5]`；`getBlogPostsForPage(*, 1)[0].slug === 'dnd-dragonborn'`。

`index.test.ts` 的 `FIRST_BLOG_PAGE_SLUGS`：

`dnd-dragonborn`, `dnd-druid`, `dnd-backgrounds`, `dnd-classes-comparison`, `dnd-character-sheet`, `dnd-fighter`, `players-handbook-dnd-5e`, `dnd-paladin`, `dnd-artificer`, `dnd-stats`

`SECOND_BLOG_PAGE_START_SLUGS`：`dnd-languages`, `dnd-meaning`

插入后第 1 页变为「新 slug + 上表前 9」；`dnd-stats` 落到第 2 页开头。页数仍为 6，末页长度 6。

**会因此失败（首页 lead / 第 1 页 slug 列表 / 第 2 页起点 / 末页长度 5）：**

1. `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog/pagination.test.ts`  
   页长数组末项 5、lead `dnd-dragonborn`。
2. `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog/dnd-campaigns.test.ts`  
   `getBlogPostsForPage(*, 6)` 长度 5、lead `dnd-dragonborn`。`getBlogPageCount === 6` 仍过。
3. `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog/index.test.ts`  
   多处 `getBlogPostsForPage(*, 1)` 全等或 `slice(0,4|5)` 等于 `FIRST_BLOG_PAGE_SLUGS`；paladin 段第 2 页起点等于 `SECOND_BLOG_PAGE_START_SLUGS`。

**日期副作用（分页本身不改页数，但 hub lastModified 取全站最新 `updatedAt`）：**

4. `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/app/sitemap.test.ts`  
   `keeps the fifth/sixth blog hub page current after publishing dnd-campaigns` 把 `/blog/page/5` 与 `/blog/page/6` 的 `lastModified` 钉在 `2026-09-11`。新文 `updatedAt` 若晚于该日，这两条会红。

`BlogHubPaginationHero.test.tsx` 按运行时 `getBlogPostsForPage` 取值，不硬编码 lead slug，插入后仍应过。

---

## 9. 禁止事项

- 不覆盖已有 slug（`dnd-dragonborn`、`dnd-races`、`dnd-grung`、`dnd-dhampir` 等）。
- 不另建独立 HTML / 新 `app` 路由；只用现有 `/blog/[slug]` 与 `/zh/blog/[slug]`。
- 不改无关文件（编辑器、纹章、非博客页面）。
- 不改 `dnd-races` 正文去塞 kenku 内链（龙裔测试禁止 races 正文含 `dnd-dragonborn`）。
- 不把新文标 `featured` 或 `placeholder`。
- 不在英文 FAQ 正文与 `faqItems` 之间写两套不同答案。
- 不给中文龙裔样板发明 FAQ 模块。
- 不在正文用 iframe 嵌 YouTube。
- 不手改 `src/lib/blog/index.ts` 的分页公式来「消化」多出来的一篇。

---

## 10. 实际打开过的文件路径

- `/Users/wusir/Desktop/开发项目集合/token-maker-app/.git/HEAD`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/package.json`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog/types.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog/index.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog/registry.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog/html-utils.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog-content.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog-posts/shared.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog-posts/dnd-dragonborn.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog-posts/dnd-grung.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog-posts/dnd-dhampir.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog-posts/dnd-races.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog/dnd-dragonborn.test.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog/pagination.test.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog/index.test.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog/dnd-campaigns.test.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/blog/dnd-ranger.test.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/site-locale.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/lib/site-content.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/app/(en)/blog/[slug]/page.tsx`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/app/(zh)/zh/blog/[slug]/page.tsx`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/app/(en)/blog/page.tsx`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/app/(zh)/zh/blog/page.tsx`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/app/(en)/blog/page/[page]/page.tsx`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/app/(zh)/zh/blog/page/[page]/page.tsx`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/app/sitemap.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/app/sitemap.test.ts`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/app/site-routes.test.tsx`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/components/site/views/BlogDetailPageView.tsx`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/components/site/views/BlogHubPageView.tsx`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/src/components/site/views/BlogHubPaginationHero.test.tsx`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/public/llms.txt`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/public/blog/covers/en/`（目录列表 + `dnd-dragonborn-guide.webp` 预览）
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/public/blog/inline/`（目录列表）
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/public/blog/inline/dnd-dragonborn/dragonborn-ancestry-scales.webp`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/public/blog/inline/dnd-dragonborn/dragonborn-breath-shape.webp`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/public/blog/inline/dnd-dragonborn/dragonborn-video-placeholder.webp`
- `/Users/wusir/Desktop/开发项目集合/token-maker-app/tmp/blog-dnd-kenku/`（目录列表，写入前为空）
