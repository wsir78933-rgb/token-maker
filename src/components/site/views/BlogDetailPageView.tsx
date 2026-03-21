import Link from 'next/link';
import { ArrowRight, Layers3, Share2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { PageBreadcrumbs } from '@/components/site/PageBreadcrumbs';
import { StructuredData } from '@/components/site/StructuredData';
import {
  getAdjacentBlogPosts,
  getBlogPost,
  getRelatedBlogPosts,
} from '@/lib/blog-content';
import { buildBlogPostStructuredData } from '@/lib/blog-seo';
import { formatPageDate } from '@/lib/site-formatting';
import {
  buildBreadcrumbStructuredData,
} from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';
import { getTemplatePages } from '@/lib/site-content';

const copyByLocale = {
  en: {
    editor: 'Editor',
    blog: 'Blog',
    published: 'Published',
    updated: 'Updated',
    author: 'Author',
    relatedPosts: 'Related posts',
    relatedTemplates: 'Templates to open next',
    previous: 'Previous post',
    next: 'Next post',
    backToBlog: 'Back to blog',
    openEditor: 'Open the editor with this post in mind',
    openTemplate: 'Open template page',
    share: 'Share-ready URL',
    workflowShortcuts: 'Workflow shortcuts',
    workflowTitle: 'Turn this guide into a usable token setup',
    workflowDescription:
      'Use the matching editor preset first, then move into a template page if you want a more specific mask, border, or export direction.',
    launchPreset: 'Launch matching editor preset',
    launchPresetHint: 'Open the workspace with article-aligned defaults.',
    browseTemplates: 'Browse all template pages',
    browseTemplatesHint: 'Explore shape- and use-case-specific token setups.',
    readingNote: 'Read at a glance',
  },
  zh: {
    editor: '编辑器',
    blog: '博客',
    published: '发布于',
    updated: '更新于',
    author: '作者',
    relatedPosts: '相关文章',
    relatedTemplates: '下一步可打开的模板页',
    previous: '上一篇',
    next: '下一篇',
    backToBlog: '返回博客',
    openEditor: '带着这篇文章进入编辑器',
    openTemplate: '打开模板页',
    share: '可分享链接',
    workflowShortcuts: '流程快捷入口',
    workflowTitle: '把这篇文章直接变成可用的 Token 流程',
    workflowDescription:
      '先用和文章匹配的编辑器预设进入工作区，如果你还想进一步细化遮罩、边框或导出方式，再继续打开对应模板页。',
    launchPreset: '打开匹配的编辑器预设',
    launchPresetHint: '直接带着这篇文章的默认思路进入工作区。',
    browseTemplates: '浏览全部模板页',
    browseTemplatesHint: '查看不同遮罩、用途和导出方向的模板入口。',
    readingNote: '阅读速览',
  },
} as const;

export function BlogDetailPageView({
  locale,
  slug,
}: {
  locale: SiteLocale;
  slug: string;
}) {
  const post = getBlogPost(locale, slug);

  if (!post) {
    notFound();
  }

  const copy = copyByLocale[locale];
  const relatedPosts = getRelatedBlogPosts(locale, post.slug);
  const { previousPost, nextPost } = getAdjacentBlogPosts(locale, post.slug);
  const relatedTemplates = getTemplatePages(locale).filter((template) =>
    post.relatedTemplateSlugs.includes(template.slug),
  );
  const primaryTemplates = relatedTemplates.slice(0, 3);
  const breadcrumbs = [
    { label: copy.editor, href: getLocalizedPath(locale, '/') },
    { label: copy.blog, href: getLocalizedPath(locale, '/blog') },
    { label: post.title },
  ];

  return (
    <>
      <StructuredData
        id={`blog-post-${locale}-${post.slug}-jsonld`}
        data={buildBlogPostStructuredData(locale, post)}
      />
      <StructuredData
        id={`blog-post-${locale}-${post.slug}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: copy.editor, path: '/' },
          { name: copy.blog, path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />

      <InnerPageChrome locale={locale} currentPath={`/blog/${post.slug}`} tone="guide">
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-[1360px] px-6 py-14 lg:px-8 lg:py-18">
            <PageBreadcrumbs items={breadcrumbs} />

            <div className="mt-8 grid items-start gap-8 xl:grid-cols-[minmax(0,880px)_320px] xl:justify-center">
              <div className="rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-8 shadow-[0_28px_90px_-56px_rgba(0,0,0,0.72)] sm:p-10">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-stone-400">
                  <span className="rounded-full border border-[#8fb7ff]/25 bg-[#8fb7ff]/10 px-3 py-1 text-[#d7e7ff]">
                    {post.category}
                  </span>
                  <span>{post.readingTime}</span>
                </div>

                <h1 className="mt-6 font-display max-w-4xl text-4xl leading-none text-stone-50 sm:text-5xl lg:text-6xl">
                  {post.title}
                </h1>
                <p className="mt-6 max-w-3xl text-base leading-8 text-stone-300 sm:text-lg">
                  {post.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-stone-400">
                  <span className="rounded-full border border-white/12 px-3 py-1.5">
                    {copy.published} {formatPageDate(locale, post.publishedAt)}
                  </span>
                  <span className="rounded-full border border-white/12 px-3 py-1.5">
                    {copy.updated} {formatPageDate(locale, post.updatedAt)}
                  </span>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={post.ctaQuery}
                    prefetch={false}
                    className="inline-flex items-center gap-2 rounded-full border border-[#d7b46a]/40 bg-[#d7b46a]/12 px-5 py-2.5 text-sm font-medium text-[#f5ddb0] transition hover:border-[#f2cb7a] hover:bg-[#d7b46a]/20"
                  >
                    {copy.openEditor}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href={getLocalizedPath(locale, '/blog')}
                    prefetch={false}
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-sm text-stone-300 transition hover:border-white/25 hover:text-stone-100"
                  >
                    {copy.backToBlog}
                  </Link>
                </div>
              </div>

              <aside className="space-y-5 xl:sticky xl:top-28">
                <article className="rounded-[32px] border border-white/10 bg-white/[0.03] p-7">
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.26em] text-stone-500">{copy.author}</p>
                      <p className="mt-3 text-lg text-stone-50">{post.author}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.26em] text-stone-500">{copy.share}</p>
                      <p className="mt-3 break-all text-sm leading-7 text-stone-300">{post.url}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-stone-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>

                <article className="rounded-[32px] border border-[#d7b46a]/20 bg-[linear-gradient(180deg,rgba(215,180,106,0.14),rgba(255,255,255,0.03))] p-7">
                  <p className="text-xs uppercase tracking-[0.26em] text-[#f1d492]">{copy.workflowShortcuts}</p>
                  <h2 className="mt-4 font-display text-2xl leading-tight text-stone-50">{copy.workflowTitle}</h2>
                  <p className="mt-4 text-sm leading-7 text-stone-300">{copy.workflowDescription}</p>
                  <div className="mt-6 space-y-3">
                    <Link
                      href={post.ctaQuery}
                      prefetch={false}
                      className="group block rounded-[24px] border border-[#d7b46a]/35 bg-[#140f05]/45 p-4 transition hover:border-[#f2cb7a] hover:bg-[#140f05]/65"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-[#f7ddb0]">{copy.launchPreset}</p>
                          <p className="mt-1 text-xs leading-6 text-stone-300">{copy.launchPresetHint}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[#f1d492] transition group-hover:translate-x-0.5" />
                      </div>
                    </Link>
                    <Link
                      href={getLocalizedPath(locale, '/templates')}
                      prefetch={false}
                      className="group block rounded-[24px] border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20 hover:bg-white/[0.05]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-stone-100">{copy.browseTemplates}</p>
                          <p className="mt-1 text-xs leading-6 text-stone-400">{copy.browseTemplatesHint}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-stone-100" />
                      </div>
                    </Link>
                  </div>
                </article>
              </aside>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1360px] px-6 py-14 lg:px-8 lg:py-18">
          <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,880px)_320px] xl:justify-center">
            <div className="space-y-10">
              <article
                className="site-rich-text site-rich-text--detail relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-6 py-8 sm:px-10 lg:px-12 lg:py-12"
                dangerouslySetInnerHTML={{ __html: post.html }}
              />

              {(previousPost || nextPost) ? (
                <section className="grid gap-4 lg:grid-cols-2">
                  {previousPost ? (
                    <Link
                      href={previousPost.path}
                      prefetch={false}
                      className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20 hover:bg-white/[0.045]"
                    >
                      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{copy.previous}</p>
                      <h2 className="mt-4 text-2xl font-medium text-stone-50">{previousPost.title}</h2>
                      <p className="mt-3 text-sm leading-7 text-stone-300">{previousPost.excerpt}</p>
                    </Link>
                  ) : null}
                  {nextPost ? (
                    <Link
                      href={nextPost.path}
                      prefetch={false}
                      className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20 hover:bg-white/[0.045]"
                    >
                      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{copy.next}</p>
                      <h2 className="mt-4 text-2xl font-medium text-stone-50">{nextPost.title}</h2>
                      <p className="mt-3 text-sm leading-7 text-stone-300">{nextPost.excerpt}</p>
                    </Link>
                  ) : null}
                </section>
              ) : null}

              {relatedPosts.length ? (
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Share2 className="h-5 w-5 text-[#d7b46a]" />
                    <h2 className="font-display text-3xl text-stone-50 sm:text-4xl">{copy.relatedPosts}</h2>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-3">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.slug}
                        href={relatedPost.path}
                        prefetch={false}
                        className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(127,167,214,0.12),rgba(255,255,255,0.02))] p-6 transition hover:border-white/20 hover:bg-[linear-gradient(180deg,rgba(127,167,214,0.18),rgba(255,255,255,0.03))]"
                      >
                        <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{relatedPost.category}</p>
                        <h3 className="mt-3 text-2xl font-medium text-stone-50">{relatedPost.title}</h3>
                        <p className="mt-4 text-sm leading-7 text-stone-300">{relatedPost.excerpt}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>

            <aside className="space-y-5 xl:sticky xl:top-28">
              <article className="rounded-[30px] border border-white/10 bg-black/25 p-6">
                <p className="text-xs uppercase tracking-[0.26em] text-stone-500">{copy.readingNote}</p>
                <p className="mt-4 text-sm leading-7 text-stone-300">{post.excerpt}</p>
              </article>

              {primaryTemplates.length ? (
                <article className="rounded-[30px] border border-[#d7b46a]/20 bg-[linear-gradient(180deg,rgba(215,180,106,0.14),rgba(255,255,255,0.03))] p-6">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.26em] text-[#f1d492]">
                    <Layers3 className="h-4 w-4" />
                    {copy.relatedTemplates}
                  </div>
                  <div className="mt-5 space-y-3">
                    {primaryTemplates.map((template) => (
                      <Link
                        key={template.slug}
                        href={getLocalizedPath(locale, `/templates/${template.slug}`)}
                        prefetch={false}
                        className="group block rounded-[24px] border border-white/10 bg-black/25 p-4 transition hover:border-white/20 hover:bg-black/35"
                      >
                        <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">{template.intent}</p>
                        <h3 className="mt-3 text-lg font-medium text-stone-50">{template.title}</h3>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm text-[#f1d492]">
                          {copy.openTemplate}
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </article>
              ) : null}
            </aside>
          </div>
        </div>
      </InnerPageChrome>
    </>
  );
}
