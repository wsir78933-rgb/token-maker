import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Dice5 } from 'lucide-react';

import { EditorLaunchButton } from '@/components/site/EditorLaunchButton';
import { BlogArticleCard } from '@/components/site/views/BlogHubPageView';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { PageBreadcrumbs } from '@/components/site/PageBreadcrumbs';
import { StructuredData } from '@/components/site/StructuredData';
import {
  buildBlogCategoryBreadcrumbStructuredData,
  buildBlogCategoryCollectionStructuredData,
  getBlogCategories,
  getBlogCategory,
  getBlogCategoryPageCount,
  getBlogCategoryPagePath,
  getBlogCategoryPath,
  getBlogPlaceholderCopy,
  getBlogPostsByCategory,
  getBlogPostsForCategoryPage,
  type BlogCategorySlug,
} from '@/lib/blog-content';
import { getNavLabels } from '@/lib/site-content';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const categoryPageCopy = {
  en: {
    eyebrow: 'Blog category',
    categoryNavLabel: 'Browse by category',
    articlesHeading: 'Articles in this category',
    articleCount: (count: number) => `${count} ${count === 1 ? 'article' : 'articles'}`,
    emptyState: 'No published articles are available in this category yet.',
    ctaEyebrow: 'Want to try one?',
    steps: ['Upload a portrait', 'Adjust the crop', 'Pick a frame or transparent style', 'Export the PNG'],
    stepPrefix: 'If you want to try it, start here:',
    editor: 'Open Editor',
    diceRoller: 'Dice Roller',
    pagination: 'Pages',
    previous: 'Previous',
    next: 'Next',
  },
  zh: {
    eyebrow: '博客分类',
    categoryNavLabel: '按分类浏览',
    articlesHeading: '本分类文章',
    articleCount: (count: number) => `${count} 篇文章`,
    emptyState: '这个分类暂时还没有已发布文章。',
    ctaEyebrow: '想顺手试一下？',
    steps: ['上传头像或角色图', '调整裁切，让主体更清楚', '选择边框或透明样式', '导出 PNG'],
    stepPrefix: '如果你也想试试，可以这样开始：',
    editor: '打开编辑器',
    diceRoller: '骰子工具',
    pagination: '分页',
    previous: '上一页',
    next: '下一页',
  },
} as const;

function BlogCategoryHeader({
  categoryCopy,
  articleCount,
  pageCopy,
}: {
  categoryCopy: ReturnType<typeof getBlogCategory>;
  articleCount: string;
  pageCopy: (typeof categoryPageCopy)[SiteLocale];
}) {
  return (
    <header className="max-w-5xl space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-[#d7b46a]/35 bg-[#d7b46a]/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#f1d492]">
          {pageCopy.eyebrow}
        </span>
      </div>
      <h1 className="font-display max-w-4xl text-[2.35rem] leading-[1.04] text-stone-50 sm:text-[3rem] lg:text-[3.35rem] xl:text-[3.7rem]">
        {categoryCopy.label}
      </h1>
      <p className="max-w-3xl text-base leading-8 text-stone-300 sm:text-lg">
        {categoryCopy.description}
      </p>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
        {articleCount}
      </p>
    </header>
  );
}

function BlogCategoryNavigation({
  locale,
  category,
  pageCopy,
}: {
  locale: SiteLocale;
  category: BlogCategorySlug;
  pageCopy: (typeof categoryPageCopy)[SiteLocale];
}) {
  return (
    <nav aria-label={pageCopy.categoryNavLabel} className="space-y-3 pt-1">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d7b46a]">
        {pageCopy.categoryNavLabel}
      </p>
      <div className="flex flex-wrap gap-2.5">
        {getBlogCategories(locale).map((categoryCopy) => {
          const isCurrentCategory = categoryCopy.slug === category;

          return (
            <Link
              key={categoryCopy.slug}
              href={getBlogCategoryPath(locale, categoryCopy.slug)}
              prefetch={false}
              aria-current={isCurrentCategory ? 'page' : undefined}
              className={
                isCurrentCategory
                  ? 'site-category-pill !border-[#d7b46a]/55 !bg-[#d7b46a]/15 !text-[#f1d492]'
                  : 'site-category-pill'
              }
            >
              {categoryCopy.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function BlogCategoryHero({
  locale,
  category,
  categoryCopy,
  articleCount,
  pageCopy,
}: {
  locale: SiteLocale;
  category: BlogCategorySlug;
  categoryCopy: ReturnType<typeof getBlogCategory>;
  articleCount: string;
  pageCopy: (typeof categoryPageCopy)[SiteLocale];
}) {
  return (
    <section>
      <div className="space-y-8">
        <BlogCategoryHeader
          categoryCopy={categoryCopy}
          articleCount={articleCount}
          pageCopy={pageCopy}
        />
        <BlogCategoryNavigation locale={locale} category={category} pageCopy={pageCopy} />
      </div>
    </section>
  );
}

function BlogCategoryArticleSection({
  locale,
  category,
  categoryPosts,
  articleCount,
  pageCopy,
}: {
  locale: SiteLocale;
  category: BlogCategorySlug;
  categoryPosts: ReturnType<typeof getBlogPostsByCategory>;
  articleCount: string;
  pageCopy: (typeof categoryPageCopy)[SiteLocale];
}) {
  return (
    <section aria-labelledby={`blog-category-articles-${locale}-${category}`}>
      <div className="mb-7 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="h-5 w-0.5 rounded-full bg-[#d7b46a]/55" />
          <h2
            id={`blog-category-articles-${locale}-${category}`}
            className="font-display text-2xl text-stone-100 sm:text-3xl"
          >
            {pageCopy.articlesHeading}
          </h2>
        </div>
        <span className="text-sm text-stone-600">{articleCount}</span>
      </div>

      {categoryPosts.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {categoryPosts.map((post) => (
            <BlogArticleCard key={post.slug} locale={locale} post={post} />
          ))}
        </div>
      ) : (
        <p className="rounded-[24px] border border-white/10 bg-white/[0.035] px-5 py-6 text-base leading-7 text-stone-300">
          {pageCopy.emptyState}
        </p>
      )}
    </section>
  );
}

function BlogCategoryBottomAction({
  locale,
  pageCopy,
}: {
  locale: SiteLocale;
  pageCopy: (typeof categoryPageCopy)[SiteLocale];
}) {
  const placeholderCopy = getBlogPlaceholderCopy(locale);

  return (
    <div className="border-t border-white/8 pt-10">
      <div className="site-surface-card site-surface-card--plain rounded-[30px] p-6 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center lg:gap-8 lg:p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#d7b46a]">{pageCopy.ctaEyebrow}</p>
          <h2 className="mt-3 font-display text-[1.8rem] leading-[1.04] text-stone-50">
            {placeholderCopy.ctaTitle}
          </h2>
          <p className="mt-3 text-base leading-7 text-stone-300">{placeholderCopy.ctaBody}</p>
          <ul className="mt-5 grid gap-2 text-sm leading-6 text-stone-400 sm:grid-cols-2">
            {pageCopy.steps.map((step, index) => (
              <li
                key={step}
                className="flex items-start gap-2.5 rounded-[16px] border border-white/8 bg-white/[0.03] px-4 py-3"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d7b46a]/15 text-[10px] font-bold text-[#f1d492]">
                  {index + 1}
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
            {pageCopy.editor}
            <ArrowRight className="h-4 w-4" />
          </EditorLaunchButton>

          <Link
            href={getLocalizedPath(locale, '/dice-roller-dnd')}
            prefetch={false}
            className="site-cta-secondary w-full justify-center"
          >
            <Dice5 className="h-4 w-4" />
            {pageCopy.diceRoller}
          </Link>

          <p className="rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-3.5 text-sm leading-6 text-stone-500">
            {pageCopy.stepPrefix}
          </p>
        </div>
      </div>
    </div>
  );
}

function BlogCategoryPagination({
  locale,
  category,
  page,
  totalPages,
}: {
  locale: SiteLocale;
  category: BlogCategorySlug;
  page: number;
  totalPages: number;
}) {
  const copy = categoryPageCopy[locale];
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const previousPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="border-t border-white/8 pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-2xl text-stone-50">{copy.pagination}</h2>
        <div className="flex flex-wrap items-center gap-2.5">
          {previousPage ? (
            <Link
              href={getBlogCategoryPagePath(locale, category, previousPage)}
              prefetch={false}
              className="site-cta-secondary"
            >
              <ChevronLeft className="h-4 w-4" />
              {copy.previous}
            </Link>
          ) : (
            <span className="site-cta-secondary cursor-not-allowed opacity-40">{copy.previous}</span>
          )}

          {pageNumbers.map((pageNumber) => (
            <Link
              key={pageNumber}
              href={getBlogCategoryPagePath(locale, category, pageNumber)}
              prefetch={false}
              className={
                pageNumber === page
                  ? 'site-cta-primary min-w-11 justify-center'
                  : 'site-cta-secondary min-w-11 justify-center'
              }
            >
              {pageNumber}
            </Link>
          ))}

          {nextPage ? (
            <Link
              href={getBlogCategoryPagePath(locale, category, nextPage)}
              prefetch={false}
              className="site-cta-secondary"
            >
              {copy.next}
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="site-cta-secondary cursor-not-allowed opacity-40">{copy.next}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function BlogCategoryPageView({
  locale,
  category,
  page = 1,
}: {
  locale: SiteLocale;
  category: BlogCategorySlug;
  page?: number;
}) {
  const categoryCopy = getBlogCategory(locale, category);
  const categoryPosts = getBlogPostsByCategory(locale, category);
  const totalPages = getBlogCategoryPageCount(locale, category);
  const pagePosts = getBlogPostsForCategoryPage(locale, category, page);
  const pageCopy = categoryPageCopy[locale];
  const navLabels = getNavLabels(locale);
  const currentPath = getBlogCategoryPagePath(locale, category, page);
  const articleCount = pageCopy.articleCount(categoryPosts.length);
  const pageLabel = locale === 'zh' ? `第 ${page} 页` : `Page ${page}`;
  const breadcrumbs = [
    { label: navLabels.editor, href: getLocalizedPath(locale, '/') },
    { label: navLabels.blog, href: getLocalizedPath(locale, '/blog') },
    { label: categoryCopy.label },
    ...(page > 1 ? [{ label: pageLabel }] : []),
  ];

  return (
    <>
      <StructuredData
        id={`blog-category-${locale}-${category}`}
        data={buildBlogCategoryCollectionStructuredData(locale, category)}
      />
      <StructuredData
        id={`blog-category-breadcrumb-${locale}-${category}`}
        data={buildBlogCategoryBreadcrumbStructuredData(locale, category)}
      />

      <InnerPageChrome locale={locale} currentPath={currentPath} tone="hub">
        <div className="mx-auto max-w-[92rem] space-y-10 px-4 py-10 sm:px-5 lg:px-6 lg:py-14 xl:px-8">
          <PageBreadcrumbs items={breadcrumbs} locale={locale} />

          <BlogCategoryHero
            locale={locale}
            category={category}
            categoryCopy={categoryCopy}
            articleCount={articleCount}
            pageCopy={pageCopy}
          />
          <BlogCategoryArticleSection
            locale={locale}
            category={category}
            categoryPosts={pagePosts}
            articleCount={articleCount}
            pageCopy={pageCopy}
          />
          <BlogCategoryPagination
            locale={locale}
            category={category}
            page={page}
            totalPages={totalPages}
          />
          <BlogCategoryBottomAction locale={locale} pageCopy={pageCopy} />
        </div>
      </InnerPageChrome>
    </>
  );
}
