import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

import { EditorLaunchButton } from '@/components/site/EditorLaunchButton';
import { StructuredData } from '@/components/site/StructuredData';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import {
  BLOG_POSTS_PER_PAGE,
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
    featured: 'Featured Article',
    featuredLabel: 'Start Here',
    single: '',
    singleLabel: '',
    few: 'Editorial Picks',
    fewLabel: 'A compact set deserves a more curated reading flow',
    articles: 'Latest Articles',
    pagination: 'Pages',
    previous: 'Previous',
    next: 'Next',
    readArticle: 'Read the article',
    startMaking: 'Try the editor',
    ctaEyebrow: 'Want to try one?',
    stepPrefix: 'If you want to try it, start here:',
    steps: [
      'Upload a portrait',
      'Adjust the crop',
      'Pick a frame or transparent style',
      'Export the PNG',
    ],
    templates: 'Browse Templates',
    editor: 'Open Editor',
    openPreset: 'Try It Now',
  },
  zh: {
    featured: '重点文章',
    featuredLabel: '建议先看',
    single: '',
    singleLabel: '',
    few: '精选文章',
    fewLabel: '文章数量还不多，适合用更有主次的编排方式',
    articles: '最新文章',
    pagination: '分页',
    previous: '上一页',
    next: '下一页',
    readArticle: '阅读全文',
    startMaking: '试试编辑器',
    ctaEyebrow: '想顺手试一下？',
    stepPrefix: '如果你也想试试，可以这样开始：',
    steps: ['上传头像或角色图', '调整裁切，让主体更清楚', '选择边框或透明样式', '导出 PNG'],
    templates: '浏览模板',
    editor: '打开编辑器',
    openPreset: '直接试试',
  },
} as const;

function PostCover({
  post,
  className,
  fallbackInnerClassName,
  sizes,
}: {
  post: BlogPostItem;
  className: string;
  fallbackInnerClassName: string;
  sizes: string;
}) {
  if (post.coverImage) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={post.coverImage}
          alt={post.coverAlt ?? post.title}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={fallbackInnerClassName}>{post.coverLabel}</div>
    </div>
  );
}

function BlogCard({ locale, post }: { locale: SiteLocale; post: BlogPostItem }) {
  return (
    <Link
      href={getBlogPostPath(locale, post.slug)}
      prefetch={false}
      className="site-surface-card site-surface-card--plain block rounded-[24px] p-4 transition hover:border-white/18 sm:p-5"
    >
      <div className="flex items-start gap-4">
        <PostCover
          post={post}
          className="h-[92px] w-[104px] shrink-0 rounded-[18px] border border-white/10 bg-black/20"
          fallbackInnerClassName="flex h-full w-full items-end justify-start rounded-[18px] bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02))] px-3 py-3 text-left font-display text-lg leading-none text-stone-100"
          sizes="104px"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">
            {formatBlogUpdatedAt(locale, post.updatedAt)} · {post.readTime}
          </p>
          <h2 className="mt-2 font-display text-[1.5rem] leading-[1.02] text-stone-50 sm:text-[1.65rem]">{post.title}</h2>
          <p className="mt-2 text-sm leading-6 text-stone-300">{post.excerpt}</p>
        </div>
      </div>
    </Link>
  );
}

function SinglePostSpotlight({
  locale,
  post,
}: {
  locale: SiteLocale;
  post: BlogPostItem;
}) {
  const copy = copyByLocale[locale];

  return (
    <Link
      href={getBlogPostPath(locale, post.slug)}
      prefetch={false}
      className="group mt-7 block cursor-pointer"
      aria-label={post.title}
    >
      <article className="site-surface-card site-surface-card--warm relative overflow-hidden rounded-[32px] p-5 sm:p-6 lg:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(215,180,106,0.2),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center">
          <PostCover
            post={post}
            className="h-[220px] rounded-[26px] border border-[#d7b46a]/20 bg-[linear-gradient(135deg,rgba(250,239,215,0.92),rgba(232,207,149,0.8))] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] sm:h-[280px] lg:h-full lg:min-h-[380px] dark:bg-[linear-gradient(135deg,rgba(42,35,23,0.92),rgba(76,58,22,0.92))] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
            fallbackInnerClassName="flex h-full w-full items-center justify-center rounded-[26px] border border-[#d7b46a]/16 bg-white/30 px-8 text-center font-display text-5xl text-stone-900 dark:border-white/8 dark:bg-white/[0.04] dark:text-stone-100"
            sizes="(min-width: 1024px) 42vw, 100vw"
          />

          <div className="min-w-0">
            {copy.singleLabel ? (
              <p className="text-xs uppercase tracking-[0.24em] text-[#d7b46a]">{copy.singleLabel}</p>
            ) : null}
            <h1 className="max-w-4xl font-display text-[2.3rem] leading-[0.94] text-stone-50 transition-colors duration-300 group-hover:text-[#f3ddb0] sm:text-[3rem] lg:text-[3.65rem]">
              {post.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-stone-200 sm:text-lg">{post.excerpt}</p>

            <div className="mt-5 flex flex-wrap gap-2.5 text-sm text-stone-300">
              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2">
                {formatBlogUpdatedAt(locale, post.updatedAt)}
              </span>
              <span className="rounded-full border border-[#d7b46a]/20 bg-[#1a1407]/70 px-4 py-2 text-[#ead9ab]">
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

function FeaturedPostSpotlight({
  locale,
  post,
}: {
  locale: SiteLocale;
  post: BlogPostItem;
}) {
  const copy = copyByLocale[locale];

  return (
    <Link
      href={getBlogPostPath(locale, post.slug)}
      prefetch={false}
      className="group mt-7 block cursor-pointer"
      aria-label={post.title}
    >
      <article className="site-surface-card site-surface-card--warm relative overflow-hidden rounded-[34px] p-5 sm:p-6 lg:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(215,180,106,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.02fr)] lg:items-end">
          <PostCover
            post={post}
            className="h-[228px] rounded-[26px] border border-[#d7b46a]/20 bg-[linear-gradient(135deg,rgba(250,239,215,0.92),rgba(232,207,149,0.8))] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] sm:h-[300px] lg:h-full lg:min-h-[380px] dark:bg-[linear-gradient(135deg,rgba(42,35,23,0.92),rgba(76,58,22,0.92))] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
            fallbackInnerClassName="flex h-full w-full items-end justify-start rounded-[26px] border border-[#d7b46a]/16 bg-white/30 p-6 font-display text-4xl text-stone-900 dark:border-white/8 dark:bg-white/[0.04] dark:text-stone-100 sm:p-8 sm:text-5xl"
            sizes="(min-width: 1024px) 42vw, 100vw"
          />

          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.24em] text-[#d7b46a]">{copy.featuredLabel}</p>
            <h2 className="mt-4 max-w-4xl font-display text-[2.2rem] leading-[0.94] text-stone-50 transition-colors duration-300 group-hover:text-[#f3ddb0] sm:text-[2.85rem] lg:text-[3.75rem]">
              {post.title}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-stone-200 sm:text-lg">{post.excerpt}</p>

            <div className="mt-5 flex flex-wrap gap-2.5 text-sm text-stone-300">
              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2">
                {formatBlogUpdatedAt(locale, post.updatedAt)}
              </span>
              <span className="rounded-full border border-[#d7b46a]/20 bg-[#1a1407]/70 px-4 py-2 text-[#ead9ab]">
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

function FewPostsEditorial({
  locale,
  posts,
}: {
  locale: SiteLocale;
  posts: BlogPostItem[];
}) {
  const copy = copyByLocale[locale];
  const [leadPost, ...supportingPosts] = posts;

  if (!leadPost) {
    return null;
  }

  return (
    <div className="mt-7 grid gap-4 lg:grid-cols-[minmax(0,1.18fr)_320px]">
      <Link
        href={getBlogPostPath(locale, leadPost.slug)}
        prefetch={false}
        className="site-surface-card site-surface-card--warm group relative overflow-hidden rounded-[32px] p-5 sm:p-6 lg:min-h-[360px] lg:p-7"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,180,106,0.18),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%)] transition duration-500 group-hover:scale-[1.02]" />

        <div className="relative flex h-full flex-col justify-between gap-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[#d7b46a]">{copy.fewLabel}</p>
              <div className="hidden sm:block">
                <PostCover
                  post={leadPost}
                  className="h-24 w-24 shrink-0 rounded-[24px] border border-[#d7b46a]/18 bg-white/10"
                  fallbackInnerClassName="flex h-full w-full items-center justify-center text-center font-display text-xl text-stone-100"
                  sizes="96px"
                />
              </div>
            </div>

            <h2 className="mt-4 max-w-4xl font-display text-[2.15rem] leading-[0.96] text-stone-50 sm:text-[2.6rem] lg:text-[3rem]">
              {leadPost.title}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-stone-200 sm:text-lg">{leadPost.excerpt}</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-wrap gap-2.5 text-sm text-stone-300">
              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2">
                {formatBlogUpdatedAt(locale, leadPost.updatedAt)}
              </span>
              <span className="rounded-full border border-[#d7b46a]/20 bg-[#1a1407]/70 px-4 py-2 text-[#ead9ab]">
                {leadPost.readTime}
              </span>
            </div>

            <span className="inline-flex items-center gap-2 text-sm font-medium text-[#f0d48d] transition group-hover:translate-x-1">
              {copy.readArticle}
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>

      <div className="grid gap-3.5">
        {supportingPosts.map((post) => (
          <Link
            key={post.slug}
            href={getBlogPostPath(locale, post.slug)}
            prefetch={false}
            className="site-surface-card site-surface-card--plain block rounded-[22px] p-4 transition hover:border-white/18"
          >
            <div className="flex items-start gap-3.5">
              <PostCover
                post={post}
                className="h-[72px] w-[72px] shrink-0 rounded-[16px] border border-white/10 bg-black/20"
                fallbackInnerClassName="flex h-full w-full items-end justify-start rounded-[16px] bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02))] px-2.5 py-2.5 text-left font-display text-base leading-none text-stone-100"
                sizes="80px"
              />
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">
                  {formatBlogUpdatedAt(locale, post.updatedAt)} · {post.readTime}
                </p>
                <h3 className="mt-2 font-display text-[1.35rem] leading-[1.02] text-stone-50">{post.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-300">{post.excerpt}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

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
  const orderedPosts = [featuredPost, ...allPosts.filter((post) => post.slug !== featuredPost.slug)];
  const posts = getBlogPostsForPage(locale, page);
  const layoutMode =
    page !== 1 ? 'many' : allPosts.length === 1 ? 'single' : allPosts.length <= 2 ? 'many' : allPosts.length <= 4 ? 'few' : 'many';
  const singlePost = layoutMode === 'single' ? allPosts[0] : null;
  const fewPosts = layoutMode === 'few' ? orderedPosts.slice(0, 4) : [];
  const totalPages = getBlogPageCount(locale);
  const currentPath = page === 1 ? '/blog' : `/blog/page/${page}`;
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const previousPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  return (
    <>
      <StructuredData id={`blog-hub-${locale}-${page}`} data={buildBlogHubStructuredData(locale, page)} />
      <StructuredData
        id={`blog-hub-breadcrumb-${locale}-${page}`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: locale === 'zh' ? '编辑器' : 'Editor', path: '/' },
          { name: 'Blog', path: '/blog' },
        ])}
      />

      <InnerPageChrome locale={locale} currentPath={currentPath} tone="hub" showSupportStrip={false}>
        <section className="mx-auto max-w-[92rem] px-4 py-8 sm:px-5 lg:px-6 lg:py-10 xl:px-8">
          {layoutMode === 'single' && singlePost ? (
            <>
              {copy.single ? (
                <div>
                  <div className="flex items-end justify-between gap-4">
                    <h1 className="font-display text-3xl text-stone-50 sm:text-4xl">{copy.single}</h1>
                  </div>
                  <div className="mt-3 h-px bg-white/10" />
                </div>
              ) : null}

              <SinglePostSpotlight locale={locale} post={singlePost} />
            </>
          ) : layoutMode === 'few' ? (
            <>
              <div>
                <div className="flex items-end justify-between gap-4">
                    <h1 className="font-display text-3xl text-stone-50 sm:text-4xl">{copy.few}</h1>
                  </div>
                  <div className="mt-3 h-px bg-white/10" />
              </div>

              <FewPostsEditorial locale={locale} posts={fewPosts} />
            </>
          ) : page === 1 ? (
            <>
              <div>
                <div className="flex items-end justify-between gap-4">
                    <h1 className="font-display text-3xl text-stone-50 sm:text-4xl">{copy.featured}</h1>
                  </div>
                  <div className="mt-3 h-px bg-white/10" />
              </div>

              <FeaturedPostSpotlight locale={locale} post={featuredPost} />
            </>
          ) : null}

          {layoutMode === 'many' ? (
            <div className={page === 1 ? 'mt-10' : ''}>
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-display text-3xl text-stone-50 sm:text-4xl">{copy.articles}</h2>
                <p className="text-sm text-stone-400">
                  {posts.length}/{BLOG_POSTS_PER_PAGE}
                </p>
              </div>
              <div className="mt-3 h-px bg-white/10" />

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {posts.map((post) => (
                  <BlogCard key={post.slug} locale={locale} post={post} />
                ))}
              </div>
            </div>
          ) : null}

          {totalPages > 1 && layoutMode === 'many' ? (
            <div className="mt-10">
              <div className="h-px bg-white/10" />
              <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <h2 className="font-display text-[1.85rem] text-stone-50">{copy.pagination}</h2>
                <div className="flex flex-wrap items-center gap-3">
                  {previousPage ? (
                    <Link href={getBlogPagePath(locale, previousPage)} prefetch={false} className="site-cta-secondary">
                      <ChevronLeft className="h-4 w-4" />
                      {copy.previous}
                    </Link>
                  ) : (
                    <span className="site-cta-secondary cursor-not-allowed opacity-50">{copy.previous}</span>
                  )}

                  {pageNumbers.map((pageNumber) => {
                    const isActive = pageNumber === page;

                    return (
                      <Link
                        key={pageNumber}
                        href={getBlogPagePath(locale, pageNumber)}
                        prefetch={false}
                        className={isActive ? 'site-cta-primary min-w-11 justify-center' : 'site-cta-secondary min-w-11 justify-center'}
                      >
                        {pageNumber}
                      </Link>
                    );
                  })}

                  {nextPage ? (
                    <Link href={getBlogPagePath(locale, nextPage)} prefetch={false} className="site-cta-secondary">
                      {copy.next}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <span className="site-cta-secondary cursor-not-allowed opacity-50">{copy.next}</span>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-8">
            <div className="h-px bg-white/10" />
            <div className="site-surface-card site-surface-card--plain mt-6 rounded-[28px] p-5 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center lg:gap-6 lg:p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#d7b46a]">{copy.ctaEyebrow}</p>
                <h2 className="mt-3 font-display text-[1.9rem] leading-[1.02] text-stone-50">
                  {placeholderCopy.ctaTitle}
                </h2>
                <p className="mt-3 text-base leading-7 text-stone-200">{placeholderCopy.ctaBody}</p>
                <ul className="mt-5 grid gap-2.5 text-sm leading-6 text-stone-300 lg:grid-cols-2">
                  {copy.steps.map((step, index) => (
                    <li key={step} className="rounded-[18px] border border-white/8 bg-black/20 px-4 py-3">
                      {index + 1}. {step}
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
                  href={getLocalizedPath(locale, '/templates')}
                  prefetch={false}
                  className="site-cta-secondary w-full justify-center"
                >
                  {copy.templates}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-stone-300">
                  {copy.stepPrefix} {copy.steps.join(' · ')}
                </div>
              </div>
            </div>
          </div>
        </section>
      </InnerPageChrome>
    </>
  );
}
