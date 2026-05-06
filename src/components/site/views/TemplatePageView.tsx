import Link from 'next/link';
import { ArrowRight, CheckCircle2, Settings2 } from 'lucide-react';

import { EditorLaunchButton } from '@/components/site/EditorLaunchButton';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { LiteYouTubeEmbed } from '@/components/site/LiteYouTubeEmbed';
import { PageBreadcrumbs } from '@/components/site/PageBreadcrumbs';
import { StructuredData } from '@/components/site/StructuredData';
import { absoluteUrl, getSiteConfig, getTemplatePage } from '@/lib/site-content';
import { buildBreadcrumbStructuredData } from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const copyByLocale = {
  en: {
    editor: 'Editor',
    templates: 'Templates',
    bestFor: 'Best for',
    settings: 'Recommended setup',
    tips: 'Practical tips',
    videoEyebrow: 'Workflow video',
    playVideo: 'Load video',
    relatedTitle: 'Use this page when',
    openBlog: 'Read more guides',
  },
  zh: {
    editor: '编辑器',
    templates: '模板页',
    bestFor: '适合场景',
    settings: '推荐设置',
    tips: '实用建议',
    videoEyebrow: '流程视频',
    playVideo: '加载视频',
    relatedTitle: '什么时候看这页',
    openBlog: '继续看指南',
  },
} as const;

function BulletCard({
  title,
  items,
  warm = false,
}: {
  title: string;
  items: string[];
  warm?: boolean;
}) {
  return (
    <article className={`site-surface-card ${warm ? 'site-surface-card--warm' : 'site-surface-card--plain'} rounded-[28px] p-5`}>
      <h2 className="font-display text-2xl leading-tight text-stone-50">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-300">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#d7b46a]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function TemplatePageView({
  locale,
  slug,
}: {
  locale: SiteLocale;
  slug: string;
}) {
  const copy = copyByLocale[locale];
  const page = getTemplatePage(locale, slug);
  const siteConfig = getSiteConfig(locale);

  if (!page) {
    return null;
  }

  const path = `/templates/${slug}`;
  const localizedPath = getLocalizedPath(locale, path);
  const editorHref = getLocalizedPath(locale, page.query);
  const breadcrumbs = [
    { label: copy.editor, href: getLocalizedPath(locale, '/') },
    { label: copy.templates },
    { label: page.title },
  ];
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: page.title,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        url: absoluteUrl(localizedPath),
        description: page.metadataDescription,
        featureList: [
          'Square token crop',
          'Token border selection',
          'Transparent PNG export',
          'Roll20 and Foundry VTT workflow support',
        ],
      },
      {
        '@type': 'HowTo',
        name: page.workflowTitle,
        description: page.workflowDescription,
        step: page.workflowSteps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.title,
          text: step.body,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
      {
        '@type': 'VideoObject',
        name: page.video.title,
        description: page.video.description,
        thumbnailUrl: `https://i.ytimg.com/vi/${page.video.videoId}/hqdefault.jpg`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${page.video.videoId}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: siteConfig.name, item: absoluteUrl(getLocalizedPath(locale, '/')) },
          { '@type': 'ListItem', position: 2, name: page.title, item: absoluteUrl(localizedPath) },
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData id={`template-${locale}-${slug}-jsonld`} data={structuredData} />
      <StructuredData
        id={`template-${locale}-${slug}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: copy.editor, path: '/' },
          { name: page.title, path },
        ])}
      />

      <InnerPageChrome locale={locale} currentPath={path} tone="template">
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-[92rem] px-4 py-12 sm:px-5 lg:px-6 lg:py-16 xl:px-8">
            <PageBreadcrumbs items={breadcrumbs} />

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.62fr)] lg:items-start xl:gap-10">
              <div className="space-y-6">
                <p className="text-xs uppercase tracking-[0.34em] text-[#d7b46a]">{page.eyebrow}</p>
                <h1 className="font-display max-w-5xl text-[2.65rem] leading-[1.02] text-stone-50 sm:text-[3.4rem] lg:text-[4.3rem]">
                  {page.title}
                </h1>
                <p className="max-w-3xl text-base leading-8 text-stone-300 sm:text-lg">{page.description}</p>
                <p className="max-w-3xl text-sm leading-8 text-stone-400">{page.summary}</p>
                <div className="flex flex-wrap gap-2.5">
                  {page.heroBadges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-stone-300"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <EditorLaunchButton href={editorHref} className="site-cta-primary">
                    {page.ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </EditorLaunchButton>
                  <Link href={getLocalizedPath(locale, '/blog')} prefetch={false} className="site-cta-secondary">
                    {copy.openBlog}
                  </Link>
                </div>
              </div>

              <aside className="grid gap-4">
                <article className="site-surface-card site-surface-card--warm rounded-[30px] p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#d7b46a]">{copy.relatedTitle}</p>
                  <p className="mt-4 text-sm leading-7 text-stone-300">{page.intent}</p>
                </article>
                <BulletCard title={copy.bestFor} items={page.bestFor} />
              </aside>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[92rem] space-y-12 px-4 py-12 sm:px-5 lg:px-6 lg:py-16 xl:px-8">
          <section className="grid gap-5 lg:grid-cols-3">
            <BulletCard title={copy.settings} items={page.settings} warm />
            <BulletCard title={copy.tips} items={page.tips} />
            <article className="site-surface-card site-surface-card--plain rounded-[28px] p-5">
              <Settings2 className="h-5 w-5 text-[#d7b46a]" />
              <h2 className="mt-4 font-display text-2xl leading-tight text-stone-50">{page.ctaTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-stone-300">{page.ctaBody}</p>
              <EditorLaunchButton href={editorHref} className="site-cta-primary mt-6">
                {page.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </EditorLaunchButton>
            </article>
          </section>

          <section className="grid gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#d7b46a]">{copy.videoEyebrow}</p>
              <h2 className="mt-3 font-display text-3xl leading-tight text-stone-50 sm:text-4xl">
                {page.workflowTitle}
              </h2>
              <p className="mt-4 text-sm leading-7 text-stone-300 sm:text-base">{page.workflowDescription}</p>
            </div>
            <LiteYouTubeEmbed
              videoId={page.video.videoId}
              title={page.video.title}
              description={page.video.description}
              thumbnailAlt={page.video.thumbnailAlt}
              playLabel={copy.playVideo}
            />
          </section>

          <section className="grid gap-5 lg:grid-cols-3">
            {page.workflowSteps.map((step, index) => (
              <article key={step.title} className="site-surface-card site-surface-card--plain rounded-[28px] p-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d7b46a]/35 bg-[#d7b46a]/12 text-sm font-bold text-[#f1d492]">
                  {index + 1}
                </span>
                <h2 className="mt-5 font-display text-2xl leading-tight text-stone-50">{step.title}</h2>
                <p className="mt-4 text-sm leading-7 text-stone-300">{step.body}</p>
              </article>
            ))}
          </section>

          <section>
            <div className="mb-6 max-w-3xl">
              <h2 className="font-display text-3xl leading-tight text-stone-50 sm:text-4xl">{page.platformTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-stone-300 sm:text-base">{page.platformDescription}</p>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {page.platforms.map((platform) => (
                <article key={platform.title} className="site-surface-card site-surface-card--plain rounded-[28px] p-6">
                  <h3 className="font-display text-2xl leading-tight text-stone-50">{platform.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-stone-300">{platform.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl leading-tight text-stone-50 sm:text-4xl">{page.faqTitle}</h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {page.faqItems.map((item) => (
                <details key={item.question} className="site-surface-card site-surface-card--plain group rounded-[28px] p-5">
                  <summary className="cursor-pointer list-none text-lg font-medium text-stone-50">
                    {item.question}
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-stone-300">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </InnerPageChrome>
    </>
  );
}
