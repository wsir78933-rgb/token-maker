import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpenText, Clock3, Layers3, Sparkles } from 'lucide-react';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { PageBreadcrumbs } from '@/components/site/PageBreadcrumbs';
import { StructuredData } from '@/components/site/StructuredData';
import {
  BLOG_PAGE_SIZE,
  getBlogCategories,
  getFeaturedBlogPost,
  getLatestBlogUpdate,
  getPaginatedBlogPosts,
  type BlogPost,
} from '@/lib/blog-content';
import {
  buildBlogCollectionStructuredData,
  buildBlogIndexPath,
  getBlogIndexCopy,
} from '@/lib/blog-seo';
import { formatPageDate } from '@/lib/site-formatting';
import { buildBreadcrumbStructuredData } from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const copyByLocale = {
  en: {
    editor: 'Editor',
    blog: 'Blog',
    eyebrow: 'Editorial field notes',
    intro:
      'These posts turn product decisions into readable guidance. The goal is not to repeat the editor, but to explain the judgment behind crops, shapes, export sizes, and platform tradeoffs.',
    featured: 'Featured post',
    latest: 'Latest update',
    published: 'Published',
    readArticle: 'Read article',
    trySetup: 'Open editor setup',
    posts: 'Posts',
    categories: 'Categories',
    pageSummary: `${BLOG_PAGE_SIZE} posts per page`,
    newerPage: 'Newer page',
    olderPage: 'Older page',
    page: 'Page',
  },
  zh: {
    editor: '编辑器',
    blog: '博客',
    eyebrow: '编辑部实战笔记',
    intro:
      '这些文章把产品里的判断逻辑写清楚。目标不是重复编辑器，而是解释裁切、遮罩、导出尺寸和平台差异背后的取舍。',
    featured: '重点文章',
    latest: '最近更新',
    published: '发布于',
    readArticle: '阅读全文',
    trySetup: '打开对应配置',
    posts: '文章数',
    categories: '分类数',
    pageSummary: `每页 ${BLOG_PAGE_SIZE} 篇`,
    newerPage: '上一页',
    olderPage: '下一页',
    page: '第',
  },
} as const;

function BlogCard({
  locale,
  post,
  readLabel,
  setupLabel,
}: {
  locale: SiteLocale;
  post: BlogPost;
  readLabel: string;
  setupLabel: string;
}) {
  return (
    <article className="group overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] shadow-[0_24px_90px_-50px_rgba(0,0,0,0.82)] transition hover:border-white/20 hover:bg-white/[0.045]">
      <Link href={post.path} className="block">
        <div className="relative h-52 overflow-hidden border-b border-white/8 bg-black/20">
          <Image
            src={post.cover}
            alt={post.coverAlt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            unoptimized
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.58))]" />
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 px-5 pb-5">
            <span className="rounded-full border border-white/12 bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-stone-200">
              {post.category}
            </span>
            <span className="rounded-full border border-[#8fb7ff]/25 bg-[#8fb7ff]/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#d7e7ff]">
              {post.readingTime}
            </span>
          </div>
        </div>
      </Link>

      <div className="space-y-5 p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-stone-500">
          <span>{formatPageDate(locale, post.publishedAt)}</span>
          <span>{post.author}</span>
        </div>

        <div className="space-y-3">
          <Link href={post.path} className="block">
            <h2 className="text-2xl font-medium text-stone-50 transition group-hover:text-[#e9d39f]">
              {post.title}
            </h2>
          </Link>
          <p className="text-sm leading-7 text-stone-300">{post.excerpt}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-stone-400"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href={post.path} className="inline-flex items-center gap-2 text-sm text-[#f1d492]">
            {readLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href={post.ctaQuery} className="inline-flex items-center gap-2 text-sm text-stone-400 transition hover:text-stone-100">
            {setupLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function BlogHubPageView({
  locale,
  currentPage,
}: {
  locale: SiteLocale;
  currentPage: number;
}) {
  const copy = copyByLocale[locale];
  const seoCopy = getBlogIndexCopy(locale);
  const pagination = getPaginatedBlogPosts(locale, currentPage);
  const featuredPost =
    pagination.currentPage === 1 ? getFeaturedBlogPost(locale) : undefined;
  const posts = featuredPost
    ? pagination.items.filter((post) => post.slug !== featuredPost.slug)
    : pagination.items;
  const latestUpdate = getLatestBlogUpdate(locale);
  const categoryCount = getBlogCategories(locale).length;
  const currentPath = buildBlogIndexPath(locale, pagination.currentPage);
  const breadcrumbs = [
    { label: copy.editor, href: getLocalizedPath(locale, '/') },
    { label: copy.blog },
  ];

  return (
    <>
      <StructuredData
        id={`blog-hub-${locale}-jsonld`}
        data={buildBlogCollectionStructuredData(locale, pagination.currentPage)}
      />
      <StructuredData
        id={`blog-hub-${locale}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: copy.editor, path: '/' },
          { name: copy.blog, path: '/blog' },
        ])}
      />

      <InnerPageChrome locale={locale} currentPath={currentPath} tone="hub">
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <PageBreadcrumbs items={breadcrumbs} />

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(280px,0.88fr)]">
              <div className="space-y-6">
                <p className="text-xs uppercase tracking-[0.34em] text-[#8fb7ff]">
                  {copy.eyebrow}
                </p>
                <h1 className="font-display max-w-5xl text-4xl leading-none text-stone-50 sm:text-5xl lg:text-6xl">
                  {seoCopy.title}
                </h1>
                <p className="max-w-3xl text-base leading-8 text-stone-300 sm:text-lg">
                  {seoCopy.description}
                </p>
                <p className="max-w-4xl text-sm leading-8 text-stone-400">{copy.intro}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <article className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(143,183,255,0.14),rgba(255,255,255,0.02))] p-6">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[#8fb7ff]">
                    <BookOpenText className="h-4 w-4" />
                    {copy.posts}
                  </div>
                  <p className="mt-4 font-display text-3xl text-stone-50">
                    {pagination.totalItems}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-stone-300">{copy.pageSummary}</p>
                </article>

                <article className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-stone-500">
                    <Layers3 className="h-4 w-4" />
                    {copy.categories}
                  </div>
                  <p className="mt-4 font-display text-3xl text-stone-50">{categoryCount}</p>
                  <p className="mt-3 text-sm leading-7 text-stone-300">{seoCopy.eyebrow}</p>
                </article>

                <article className="rounded-[30px] border border-white/10 bg-black/20 p-6">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[#d7b46a]">
                    <Clock3 className="h-4 w-4" />
                    {copy.latest}
                  </div>
                  <p className="mt-4 font-display text-2xl text-stone-50">
                    {latestUpdate ? formatPageDate(locale, latestUpdate) : '—'}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-stone-300">
                    {copy.published}
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-12 px-6 py-14 lg:px-8 lg:py-18">
          {featuredPost ? (
            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <article className="overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[0_36px_120px_-60px_rgba(0,0,0,0.9)]">
                <div className="relative h-72 border-b border-white/10 bg-black/20">
                  <Image
                    src={featuredPost.cover}
                    alt={featuredPost.coverAlt}
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(4,6,10,0.72))]" />
                  <div className="absolute left-6 top-6 rounded-full border border-[#d7b46a]/30 bg-[#d7b46a]/12 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#f1d492]">
                    {copy.featured}
                  </div>
                </div>
                <div className="space-y-5 p-8">
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-stone-500">
                    <span>{featuredPost.category}</span>
                    <span>{formatPageDate(locale, featuredPost.publishedAt)}</span>
                    <span>{featuredPost.readingTime}</span>
                  </div>
                  <div className="space-y-4">
                    <Link href={featuredPost.path} className="block">
                      <h2 className="font-display text-4xl leading-none text-stone-50 sm:text-5xl">
                        {featuredPost.title}
                      </h2>
                    </Link>
                    <p className="max-w-3xl text-base leading-8 text-stone-300">
                      {featuredPost.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href={featuredPost.path}
                      className="inline-flex items-center gap-2 rounded-full border border-[#d7b46a]/40 bg-[#d7b46a]/12 px-5 py-2.5 text-sm font-medium text-[#f5ddb0] transition hover:border-[#f2cb7a] hover:bg-[#d7b46a]/20"
                    >
                      {copy.readArticle}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href={featuredPost.ctaQuery}
                      className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-sm text-stone-300 transition hover:border-white/25 hover:text-stone-100"
                    >
                      {copy.trySetup}
                    </Link>
                  </div>
                </div>
              </article>

              <aside className="rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(127,167,214,0.14),rgba(255,255,255,0.02))] p-7">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[#8fb7ff]">
                  <Sparkles className="h-4 w-4" />
                  {copy.featured}
                </div>
                <p className="mt-5 text-sm leading-8 text-stone-300">{featuredPost.excerpt}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {featuredPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-stone-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </aside>
            </section>
          ) : null}

          <section className="grid gap-5 lg:grid-cols-2">
            {posts.map((post) => (
              <BlogCard
                key={post.slug}
                locale={locale}
                post={post}
                readLabel={copy.readArticle}
                setupLabel={copy.trySetup}
              />
            ))}
          </section>

          <section className="flex flex-wrap items-center justify-between gap-4 rounded-[30px] border border-white/10 bg-white/[0.03] px-6 py-5">
            <div className="text-sm text-stone-400">
              {locale === 'zh'
                ? `${copy.page} ${pagination.currentPage} / ${pagination.totalPages} 页`
                : `${copy.page} ${pagination.currentPage} of ${pagination.totalPages}`}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={pagination.hasPreviousPage ? buildBlogIndexPath(locale, pagination.currentPage - 1) : '#'}
                aria-disabled={!pagination.hasPreviousPage}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                  pagination.hasPreviousPage
                    ? 'border-white/12 text-stone-300 hover:border-white/25 hover:text-stone-100'
                    : 'pointer-events-none border-white/8 text-stone-600'
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                {copy.newerPage}
              </Link>

              {Array.from({ length: pagination.totalPages }, (_, offset) => offset + 1).map((page) => (
                <Link
                  key={page}
                  href={buildBlogIndexPath(locale, page)}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm transition ${
                    page === pagination.currentPage
                      ? 'border-[#d7b46a]/40 bg-[#d7b46a]/12 text-[#f1d492]'
                      : 'border-white/12 text-stone-300 hover:border-white/25 hover:text-stone-100'
                  }`}
                >
                  {page}
                </Link>
              ))}

              <Link
                href={pagination.hasNextPage ? buildBlogIndexPath(locale, pagination.currentPage + 1) : '#'}
                aria-disabled={!pagination.hasNextPage}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                  pagination.hasNextPage
                    ? 'border-white/12 text-stone-300 hover:border-white/25 hover:text-stone-100'
                    : 'pointer-events-none border-white/8 text-stone-600'
                }`}
              >
                {copy.olderPage}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </InnerPageChrome>
    </>
  );
}
