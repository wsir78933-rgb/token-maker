import { BlogArticleCard } from '@/components/site/views/BlogHubPageView';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { PageBreadcrumbs } from '@/components/site/PageBreadcrumbs';
import { StructuredData } from '@/components/site/StructuredData';
import {
  buildBlogCategoryBreadcrumbStructuredData,
  buildBlogCategoryCollectionStructuredData,
  getBlogCategory,
  getBlogPostsByCategory,
  type BlogCategorySlug,
} from '@/lib/blog-content';
import { getNavLabels } from '@/lib/site-content';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const categoryPageCopy = {
  en: {
    eyebrow: 'Blog category',
    articlesHeading: 'Articles in this category',
    articleCount: (count: number) => `${count} ${count === 1 ? 'article' : 'articles'}`,
    emptyState: 'No published articles are available in this category yet.',
  },
  zh: {
    eyebrow: '博客分类',
    articlesHeading: '本分类文章',
    articleCount: (count: number) => `${count} 篇文章`,
    emptyState: '这个分类暂时还没有已发布文章。',
  },
} as const;

export function BlogCategoryPageView({
  locale,
  category,
}: {
  locale: SiteLocale;
  category: BlogCategorySlug;
}) {
  const categoryCopy = getBlogCategory(locale, category);
  const categoryPosts = getBlogPostsByCategory(locale, category);
  const pageCopy = categoryPageCopy[locale];
  const navLabels = getNavLabels(locale);
  const currentPath = `/blog/category/${category}`;
  const articleCount = pageCopy.articleCount(categoryPosts.length);
  const breadcrumbs = [
    { label: navLabels.editor, href: getLocalizedPath(locale, '/') },
    { label: navLabels.blog, href: getLocalizedPath(locale, '/blog') },
    { label: categoryCopy.label },
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

          <header className="max-w-5xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d7b46a]">
              {pageCopy.eyebrow}
            </p>
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
        </div>
      </InnerPageChrome>
    </>
  );
}
