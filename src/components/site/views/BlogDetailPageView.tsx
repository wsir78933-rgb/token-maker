import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Dice5, FileText } from 'lucide-react';

import { EditorLaunchButton } from '@/components/site/EditorLaunchButton';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { PageBreadcrumbs } from '@/components/site/PageBreadcrumbs';
import { RichTextHtml } from '@/components/site/RichTextHtml';
import { StructuredData } from '@/components/site/StructuredData';
import {
  buildBlogPostFaqStructuredData,
  buildBlogPostStructuredData,
  formatBlogUpdatedAt,
  getBlogPlaceholderCopy,
  getBlogPost,
  getBlogPostPath,
  getRelatedBlogPosts,
  type BlogPost,
} from '@/lib/blog-content';
import { buildBreadcrumbStructuredData } from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const copyByLocale = {
  en: {
    eyebrow: 'Feature Guide',
    placeholderEyebrow: 'Coming Soon',
    blog: 'Blog',
    liveLabel: 'Published Article',
    placeholderLabel: 'Draft Article',
    detailHeading: 'Full article',
    placeholderDetailHeading: 'Article coming soon',
    placeholderDetailBody:
      'This guide is not ready yet. Check back later for the full article.',
    sourceHint: 'Source file',
    sourcePath: 'src/lib/blog-content.ts',
    tocEyebrow: 'On this page',
    tocTitle: 'Article map',
    tocBody: 'Jump straight to the section you want without losing your place.',
    actionCard: 'What to do next',
    editor: 'Open Editor',
    diceRoller: 'Dice Roller',
    bottomCtaEyebrow: 'Ready to play?',
    bottomCtaHeading: 'Start building your adventure',
    bottomCtaBody: 'After reading the guide, create your character token or roll some dice for your next session.',
    relatedEyebrow: 'Keep Reading',
    relatedHeading: 'Related articles',
    readArticle: 'Read article',
  },
  zh: {
    eyebrow: '专题文章',
    placeholderEyebrow: '文章准备中',
    blog: '博客',
    liveLabel: '正式文章',
    placeholderLabel: '草稿文章',
    detailHeading: '正文',
    placeholderDetailHeading: '文章准备中',
    placeholderDetailBody:
      '这篇指南还没准备好，后续会补上完整正文。',
    sourceHint: '内容来源文件',
    sourcePath: 'src/lib/blog-content.ts',
    tocEyebrow: '文章目录',
    tocTitle: '快速定位',
    tocBody: '直接跳到你要看的段落，不用反复滚动找位置。',
    actionCard: '现在可以做什么',
    editor: '打开编辑器',
    diceRoller: '骰子工具',
    bottomCtaEyebrow: '准备好开始冒险了吗？',
    bottomCtaHeading: '开启你的下一次冒险',
    bottomCtaBody: '看完这篇指南后，现在去制作你的角色 Token，或者扔几颗骰子开始下一场战役吧。',
    relatedEyebrow: '继续读',
    relatedHeading: '相关文章',
    readArticle: '阅读全文',
  },
} as const;

function RelatedPostCard({ locale, post }: { locale: SiteLocale; post: BlogPost }) {
  const copy = copyByLocale[locale];

  return (
    <Link
      href={getBlogPostPath(locale, post.slug)}
      prefetch={false}
      className="site-surface-card site-surface-card--plain group relative block h-full overflow-hidden rounded-[28px] p-5 transition duration-500 hover:border-white/20 sm:p-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(215,180,106,0.08),transparent_60%)] opacity-0 transition duration-500 group-hover:opacity-100" />
      
      <div className="relative flex h-full flex-col">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d7b46a]/80">
            {formatBlogUpdatedAt(locale, post.updatedAt)} · {post.readTime}
          </p>
          <h3 className="mt-4 font-display text-[1.4rem] leading-[1.15] text-stone-100 sm:text-[1.5rem]">
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-stone-400">
            {post.excerpt}
          </p>
        </div>

        <div className="mt-6 flex flex-1 items-end pt-2">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-[#f0d48d] transition duration-300 group-hover:translate-x-1 group-hover:text-[#f8e5b4]">
            {copy.readArticle}
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function BlogDetailPageView({
  locale,
  slug,
}: {
  locale: SiteLocale;
  slug: string;
}) {
  const post = getBlogPost(locale, slug);

  if (!post) {
    return null;
  }

  const copy = copyByLocale[locale];
  const placeholderCopy = getBlogPlaceholderCopy(locale);
  const currentPath = `/blog/${slug}`;
  const isPlaceholder = !post.bodyHtml;
  const articleHeadings = post.headings ?? [];
  const hasArticleHeadings = articleHeadings.length > 0;
  const relatedPosts = getRelatedBlogPosts(locale, slug, 4);
  const switchLocale = locale === 'en' ? 'zh' : 'en';
  const localeSwitchPath = getBlogPost(switchLocale, slug)
    ? getBlogPostPath(switchLocale, slug)
    : getLocalizedPath(switchLocale, '/blog');
  const faqStructuredData = buildBlogPostFaqStructuredData(locale, slug);

  return (
    <>
      <StructuredData id={`blog-post-${locale}-${slug}`} data={buildBlogPostStructuredData(locale, slug) ?? {}} />
      {faqStructuredData ? (
        <StructuredData id={`blog-post-faq-${locale}-${slug}`} data={faqStructuredData} />
      ) : null}
      <StructuredData
        id={`blog-post-breadcrumb-${locale}-${slug}`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: locale === 'zh' ? '编辑器' : 'Editor', path: '/' },
          { name: copy.blog, path: '/blog' },
          { name: post.title, path: `/blog/${slug}` },
        ])}
      />

      <InnerPageChrome
        locale={locale}
        currentPath={currentPath}
        tone="doc"
        showSupportStrip={false}
        localeSwitchPath={localeSwitchPath}
      >
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-[92rem] px-4 py-16 sm:px-5 lg:px-6 lg:py-18 xl:px-8">
            <PageBreadcrumbs
              items={[
                { label: locale === 'zh' ? '编辑器' : 'Editor', href: getLocalizedPath(locale, '/') },
                { label: copy.blog, href: getLocalizedPath(locale, '/blog') },
                { label: post.title },
              ]}
            />

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_280px] xl:grid-cols-[minmax(0,1.24fr)_300px]">
              <div className="space-y-6">
                <p className="text-xs uppercase tracking-[0.34em] text-[#d7b46a]">
                  {isPlaceholder ? copy.placeholderEyebrow : copy.eyebrow}
                </p>
                <h1 className="font-display max-w-5xl text-4xl leading-none text-stone-50 sm:text-5xl lg:text-6xl">
                  {post.title}
                </h1>
                <p className="max-w-3xl text-base leading-8 text-stone-300">{post.excerpt}</p>
                <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-stone-300">
                  <span className="rounded-full border border-[#d7b46a]/30 bg-[#d7b46a]/12 px-3 py-1.5 text-[#f1d492]">
                    {isPlaceholder ? copy.placeholderLabel : copy.liveLabel}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                    {formatBlogUpdatedAt(locale, post.updatedAt)}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                    {post.readTime}
                  </span>
                </div>

                {post.coverImage ? (
                  <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-black/25">
                    <Image
                      src={post.coverImage}
                      alt={post.coverAlt ?? post.title}
                      width={2770}
                      height={1504}
                      priority
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="h-auto w-full object-cover"
                    />
                  </div>
                ) : null}
              </div>

              <aside className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-[#d7b46a]">{copy.actionCard}</p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-[24px] border border-white/8 bg-black/20 px-4 py-3.5">
                    <h2 className="text-base font-medium text-stone-50">{placeholderCopy.ctaTitle}</h2>
                    <p className="mt-2 text-sm leading-7 text-stone-300">{placeholderCopy.ctaBody}</p>
                  </div>
                  {isPlaceholder ? (
                    <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-3.5">
                      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{copy.sourceHint}</p>
                      <p className="mt-3 font-mono text-sm text-stone-200">{copy.sourcePath}</p>
                    </div>
                  ) : null}
                  <div className="space-y-2.5 pt-0.5">
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
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <div
          className={`mx-auto grid max-w-[92rem] gap-8 px-4 pt-14 sm:px-5 lg:px-6 lg:pt-16 xl:px-8 ${
            relatedPosts.length > 0 ? 'pb-8 lg:pb-10' : 'pb-14 lg:pb-16'
          } ${
            hasArticleHeadings ? 'lg:grid-cols-[minmax(0,1.22fr)_280px] xl:grid-cols-[minmax(0,1.26fr)_300px]' : ''
          }`}
        >
          <div className={hasArticleHeadings ? 'space-y-8' : 'max-w-[980px] space-y-8'}>
            <article className="site-surface-card site-surface-card--warm rounded-[34px] px-4 py-5 sm:px-5 sm:py-6 lg:px-5 lg:py-6 xl:px-6 xl:py-7">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[#d7b46a]">
                <FileText className="h-4 w-4" />
                {isPlaceholder ? copy.placeholderDetailHeading : copy.detailHeading}
              </div>

              {post.bodyHtml ? (
                <RichTextHtml
                  as="section"
                  className="site-rich-text site-rich-text--detail mt-4 text-stone-200"
                  html={post.bodyHtml}
                />
              ) : (
                <>
                  <p className="mt-5 max-w-3xl text-base leading-8 text-stone-200">{copy.placeholderDetailBody}</p>
                  <div className="mt-6 rounded-[26px] border border-white/8 bg-black/20 px-3.5 py-4 sm:px-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-stone-500">{copy.sourceHint}</div>
                    <p className="mt-4 font-mono text-sm text-stone-200">{copy.sourcePath}</p>
                  </div>
                </>
              )}
            </article>

            {!isPlaceholder ? (
              <section className="site-surface-card site-surface-card--warm rounded-[34px] px-5 py-6 sm:px-6 sm:py-7">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="max-w-xl space-y-2.5">
                    <p className="text-xs uppercase tracking-[0.28em] text-[#d7b46a]">{copy.bottomCtaEyebrow}</p>
                    <h2 className="font-display text-[1.75rem] leading-[1.08] text-stone-50 sm:text-[2rem]">
                      {copy.bottomCtaHeading}
                    </h2>
                    <p className="text-sm leading-7 text-stone-300">{copy.bottomCtaBody}</p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2.5 md:min-w-[200px]">
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
                  </div>
                </div>
              </section>
            ) : null}

          </div>

          {hasArticleHeadings ? (
            <aside className="space-y-5 lg:sticky lg:top-30 lg:self-start">
              <article className="rounded-[30px] border border-[#d7b46a]/18 bg-[linear-gradient(180deg,rgba(215,180,106,0.12),rgba(255,255,255,0.03))] p-4 sm:p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-[#d7b46a]">{copy.tocEyebrow}</p>
                <h2 className="mt-3 font-display text-2xl text-stone-50">{copy.tocTitle}</h2>
                <p className="mt-3 text-sm leading-7 text-stone-300">{copy.tocBody}</p>

                <nav aria-label={copy.tocEyebrow} className="mt-4 max-h-[min(60vh,32rem)] overflow-y-auto pr-1">
                  <ol className="space-y-2">
                    {articleHeadings.map((heading) => (
                      <li key={heading.id}>
                        <a
                          href={`#${heading.id}`}
                          className={`group flex rounded-[22px] border border-white/8 bg-black/20 px-3.5 py-2.5 text-sm leading-6 transition hover:border-[#d7b46a]/28 hover:bg-black/28 hover:text-stone-50 ${
                            heading.level === 3 ? 'ml-4 text-stone-400' : 'text-stone-200'
                          }`}
                        >
                          <span className="line-clamp-2">{heading.text}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </article>
            </aside>
          ) : null}
        </div>

        {relatedPosts.length > 0 ? (
          <div className="mx-auto max-w-[92rem] px-4 pb-14 sm:px-5 lg:px-6 lg:pb-16 xl:px-8">
            <section className="site-surface-card site-surface-card--plain relative overflow-hidden rounded-[34px] px-4 py-5 lg:px-5 lg:py-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(127,167,214,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(215,180,106,0.14),transparent_28%)]" />

              <div className="relative">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#d7b46a]">{copy.relatedEyebrow}</p>
                    <h2 className="mt-4 font-display text-[2rem] leading-[1.02] text-stone-50 sm:text-[2.35rem]">
                      {copy.relatedHeading}
                    </h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {relatedPosts.map((relatedPost) => (
                    <RelatedPostCard key={relatedPost.slug} locale={locale} post={relatedPost} />
                  ))}
                </div>
              </div>
            </section>
          </div>
        ) : null}
      </InnerPageChrome>
    </>
  );
}
