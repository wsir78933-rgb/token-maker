import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Dice5 } from 'lucide-react';

import { EditorLaunchButton } from '@/components/site/EditorLaunchButton';
import { StructuredData } from '@/components/site/StructuredData';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import {
  buildBlogHubStructuredData,
  formatBlogUpdatedAt,
  getBlogPageCount,
  getBlogPagePath,
  getBlogPlaceholderCopy,
  getBlogPostPath,
  getBlogPosts,
  getBlogPostsForPage,
  getFeaturedBlogPost,
} from '@/lib/blog-content';
import { buildBreadcrumbStructuredData } from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

type BlogPostItem = ReturnType<typeof getBlogPosts>[number];

const copyByLocale = {
  en: {
    featuredEyebrow: "Editor's Pick",
    allArticles: 'All Articles',
    readArticle: 'Read article',
    ctaEyebrow: 'Want to try one?',
    pagination: 'Pages',
    previous: 'Previous',
    next: 'Next',
    steps: [
      'Upload a portrait',
      'Adjust the crop',
      'Pick a frame or transparent style',
      'Export the PNG',
    ],
    stepPrefix: 'If you want to try it, start here:',
    diceRoller: 'Dice Roller',
    editor: 'Open Editor',
  },
  zh: {
    featuredEyebrow: '编辑精选',
    allArticles: '全部文章',
    readArticle: '阅读全文',
    ctaEyebrow: '想顺手试一下？',
    pagination: '分页',
    previous: '上一页',
    next: '下一页',
    steps: ['上传头像或角色图', '调整裁切，让主体更清楚', '选择边框或透明样式', '导出 PNG'],
    stepPrefix: '如果你也想试试，可以这样开始：',
    diceRoller: '骰子工具',
    editor: '打开编辑器',
  },
} as const;

// ─── Cover image helper ───────────────────────────────────────────────────────

function PostCover({
  post,
  className,
  fallbackClassName,
  imageClassName = 'object-top',
  loading = 'lazy',
  sizes,
}: {
  post: BlogPostItem;
  className: string;
  fallbackClassName: string;
  imageClassName?: string;
  loading?: 'eager' | 'lazy';
  sizes: string;
}) {
  if (post.coverImage) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={post.coverImage}
          alt={post.coverAlt ?? post.title}
          fill
          loading={loading}
          sizes={sizes}
          className={`object-cover ${imageClassName}`}
        />
      </div>
    );
  }
  return (
    <div className={className}>
      <div className={fallbackClassName}>{post.coverLabel}</div>
    </div>
  );
}

// ─── Hero card (full-width, image left / text right on desktop) ───────────────

function HeroCard({ locale, post }: { locale: SiteLocale; post: BlogPostItem }) {
  const copy = copyByLocale[locale];

  return (
    <Link
      href={getBlogPostPath(locale, post.slug)}
      prefetch={false}
      className="group block"
      aria-label={post.title}
    >
      <article className="site-surface-card site-surface-card--warm relative overflow-hidden rounded-[32px]">
        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(215,180,106,0.14),transparent_48%)]" />

        <div className="relative grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* Cover */}
          <PostCover
            post={post}
            className="h-[260px] lg:h-full lg:min-h-[440px] rounded-t-[32px] lg:rounded-l-[32px] lg:rounded-tr-none border-b border-white/8 lg:border-b-0 lg:border-r lg:border-white/8"
            fallbackClassName="flex h-full w-full items-end justify-start rounded-t-[32px] lg:rounded-l-[32px] lg:rounded-tr-none bg-[linear-gradient(135deg,rgba(42,35,23,0.95),rgba(76,58,22,0.9))] p-8 font-display text-5xl text-stone-100"
            imageClassName="object-top"
            loading="eager"
            sizes="(min-width: 1024px) 48vw, 100vw"
          />

          {/* Text */}
          <div className="relative z-10 flex flex-col justify-between gap-8 p-8 sm:p-10 lg:p-12">
            <div className="space-y-5">
              {/* badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full border border-[#d7b46a]/35 bg-[#d7b46a]/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#f1d492]">
                  {copy.featuredEyebrow}
                </span>
                <span className="text-[11px] uppercase tracking-[0.16em] text-stone-500">
                  {formatBlogUpdatedAt(locale, post.updatedAt)}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-stone-400">
                  {post.readTime}
                </span>
              </div>

              <h1 className="font-display text-[2rem] leading-[1.01] text-stone-50 transition-colors duration-300 group-hover:text-[#f3ddb0] sm:text-[2.6rem] lg:text-[3.1rem]">
                {post.title}
              </h1>

              <p className="text-base leading-8 text-stone-300 sm:text-lg">
                {post.excerpt}
              </p>
            </div>

            {/* CTA */}
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d7b46a]/28 bg-[#d7b46a]/10 px-6 py-3 text-sm font-medium text-[#f0d48d] transition duration-300 group-hover:border-[#d7b46a]/50 group-hover:bg-[#d7b46a]/18">
              {copy.readArticle}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Article grid card (image on top, text below) ────────────────────────────

function ArticleCard({ locale, post }: { locale: SiteLocale; post: BlogPostItem }) {
  const copy = copyByLocale[locale];

  return (
    <Link
      href={getBlogPostPath(locale, post.slug)}
      prefetch={false}
      className="site-surface-card site-surface-card--plain group relative flex flex-col overflow-hidden rounded-[24px] transition duration-300 hover:border-white/20"
    >
      {/* hover glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(215,180,106,0.07),transparent_55%)] opacity-0 transition duration-500 group-hover:opacity-100" />

      {/* Cover */}
      <PostCover
        post={post}
        className="relative h-[196px] w-full shrink-0 border-b border-white/8 bg-black/25"
        fallbackClassName="flex h-full w-full items-end justify-start bg-[linear-gradient(140deg,rgba(24,18,8,0.95),rgba(55,42,17,0.92))] px-5 py-5 font-display text-[1.6rem] leading-none text-stone-100"
        imageClassName="object-top"
        sizes="(min-width: 1280px) 28vw, (min-width: 768px) 45vw, 92vw"
      />

      {/* Text body */}
      <div className="relative flex flex-1 flex-col gap-3 p-5 pb-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
          {formatBlogUpdatedAt(locale, post.updatedAt)} · {post.readTime}
        </p>

        <h2 className="font-display text-[1.35rem] leading-[1.05] text-stone-50 transition-colors duration-300 group-hover:text-[#f3ddb0] sm:text-[1.5rem]">
          {post.title}
        </h2>

        <p className="line-clamp-3 flex-1 text-sm leading-7 text-stone-400">
          {post.excerpt}
        </p>

        {/* footer link */}
        <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#d7b46a]/65 transition-colors duration-300 group-hover:text-[#f0d48d]">
          {copy.readArticle}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function BlogHubPageView({
  locale,
  page = 1,
}: {
  locale: SiteLocale;
  page?: number;
}) {
  const copy = copyByLocale[locale];
  const placeholderCopy = getBlogPlaceholderCopy(locale);
  const allPosts = getBlogPosts(locale);
  const featuredPost = getFeaturedBlogPost(locale);
  const gridPosts =
    page === 1
      ? allPosts.filter((p) => p.slug !== featuredPost.slug)
      : getBlogPostsForPage(locale, page);
  const totalPages = getBlogPageCount(locale);
  const currentPath = page === 1 ? '/blog' : `/blog/page/${page}`;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const previousPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  return (
    <>
      <StructuredData
        id={`blog-hub-${locale}-${page}`}
        data={buildBlogHubStructuredData(locale, page)}
      />
      <StructuredData
        id={`blog-hub-breadcrumb-${locale}-${page}`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: locale === 'zh' ? '编辑器' : 'Editor', path: '/' },
          { name: 'Blog', path: '/blog' },
        ])}
      />

      <InnerPageChrome locale={locale} currentPath={currentPath} tone="hub" showSupportStrip={false}>
        <div className="mx-auto max-w-[92rem] space-y-12 px-4 py-10 sm:px-5 lg:px-6 lg:py-14 xl:px-8">

          {/* ── Hero ── */}
          {page === 1 && <HeroCard locale={locale} post={featuredPost} />}

          {/* ── Grid ── */}
          <section>
            <div className="mb-7 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="h-5 w-0.5 rounded-full bg-[#d7b46a]/55" />
                <h2 className="font-display text-2xl text-stone-100 sm:text-3xl">
                  {copy.allArticles}
                </h2>
              </div>
              <span className="text-sm text-stone-600">
                {allPosts.length}&nbsp;{locale === 'zh' ? '篇' : 'articles'}
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
              {gridPosts.map((post) => (
                <ArticleCard key={post.slug} locale={locale} post={post} />
              ))}
            </div>
          </section>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="border-t border-white/8 pt-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-display text-2xl text-stone-50">{copy.pagination}</h2>
                <div className="flex flex-wrap items-center gap-2.5">
                  {previousPage ? (
                    <Link
                      href={getBlogPagePath(locale, previousPage)}
                      prefetch={false}
                      className="site-cta-secondary"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {copy.previous}
                    </Link>
                  ) : (
                    <span className="site-cta-secondary cursor-not-allowed opacity-40">
                      {copy.previous}
                    </span>
                  )}

                  {pageNumbers.map((n) => (
                    <Link
                      key={n}
                      href={getBlogPagePath(locale, n)}
                      prefetch={false}
                      className={
                        n === page
                          ? 'site-cta-primary min-w-11 justify-center'
                          : 'site-cta-secondary min-w-11 justify-center'
                      }
                    >
                      {n}
                    </Link>
                  ))}

                  {nextPage ? (
                    <Link
                      href={getBlogPagePath(locale, nextPage)}
                      prefetch={false}
                      className="site-cta-secondary"
                    >
                      {copy.next}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <span className="site-cta-secondary cursor-not-allowed opacity-40">
                      {copy.next}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Bottom CTA ── */}
          <div className="border-t border-white/8 pt-10">
            <div className="site-surface-card site-surface-card--plain rounded-[30px] p-6 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center lg:gap-8 lg:p-8">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#d7b46a]">
                  {copy.ctaEyebrow}
                </p>
                <h2 className="mt-3 font-display text-[1.8rem] leading-[1.04] text-stone-50">
                  {placeholderCopy.ctaTitle}
                </h2>
                <p className="mt-3 text-base leading-7 text-stone-300">
                  {placeholderCopy.ctaBody}
                </p>
                <ul className="mt-5 grid gap-2 text-sm leading-6 text-stone-400 sm:grid-cols-2">
                  {copy.steps.map((step, i) => (
                    <li
                      key={step}
                      className="flex items-start gap-2.5 rounded-[16px] border border-white/8 bg-white/[0.03] px-4 py-3"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d7b46a]/15 text-[10px] font-bold text-[#f1d492]">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 space-y-3 lg:mt-0">
                <EditorLaunchButton
                  href={`${getLocalizedPath(locale, '/')}#editor-workspace`}
                  className="site-cta-primary w-full justify-center"
                >
                  {copy.editor}
                  <ArrowRight className="h-4 w-4" />
                </EditorLaunchButton>

                <Link
                  href={getLocalizedPath(locale, '/dice-roller-dnd')}
                  prefetch={false}
                  className="site-cta-secondary w-full justify-center"
                >
                  <Dice5 className="h-4 w-4" />
                  {copy.diceRoller}
                </Link>

                <p className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-3.5 text-sm leading-6 text-stone-500">
                  {copy.stepPrefix}
                </p>
              </div>
            </div>
          </div>

        </div>
      </InnerPageChrome>
    </>
  );
}
