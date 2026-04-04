import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { PageBreadcrumbs } from '@/components/site/PageBreadcrumbs';
import { StructuredData } from '@/components/site/StructuredData';
import {
  buildBreadcrumbStructuredData,
  buildCollectionStructuredData,
  getFaqDocModel,
} from '@/lib/site-page-models';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

const copyByLocale = {
  en: {
    editor: 'Editor',
    faq: 'FAQ',
    quickActionsEyebrow: 'Quick access',
    quickActionsTitle: 'Go straight to the right place',
    quickActions: [
      {
        href: '/',
        label: 'Open the editor',
        description: 'Drop in a portrait and test the workflow on something real.',
      },
      {
        href: '/',
        label: 'Browse templates',
        description: 'Start from the right mask and border family instead of improvising later.',
      },
      {
        href: '/',
        label: 'Compare token formats',
        description: 'Use the template hub when the real question is circle, square, hex, or transparent.',
      },
      {
        href: '/privacy',
        label: 'Read the privacy note',
        description: 'Open the short policy page if your main concern is image handling.',
      },
    ],
    questionActions: [
      {
        href: '/',
        label: 'Test it in the editor',
        description: 'The fastest way to understand fit is to try one real portrait.',
      },
      {
        href: '/privacy',
        label: 'Open the privacy note',
        description: 'See the short policy version of the local-first promise.',
      },
      {
        href: '/',
        label: 'Compare template directions',
        description: 'Pick a starting format before you spend time tuning borders and export choices.',
      },
      {
        href: '/',
        label: 'Browse shape-first templates',
        description: 'Choose the right format before spending time on border styling.',
      },
      {
        href: '/',
        label: 'Start with one real export',
        description: 'Export one token in the editor first, then decide whether the file actually needs to be larger.',
      },
    ],
    supportCardEyebrow: 'What you will find here',
    answerCardEyebrow: 'Direct answer',
    nextMove: 'Next move',
    heroBadges: ['5 common questions', 'Workflow and exports', 'Local image handling'],
  },
  zh: {
    editor: '编辑器',
    faq: '常见问题',
    quickActionsEyebrow: '快速入口',
    quickActionsTitle: '直接去你需要的位置',
    quickActions: [
      {
        href: '/',
        label: '回到编辑器',
        description: '拿一张真实角色图试一遍，判断工具适不适合最快。',
      },
      {
        href: '/',
        label: '浏览模板页',
        description: '先选对形状和边框方向，再决定细节，不要反过来。',
      },
      {
        href: '/',
        label: '比较不同 Token 格式',
        description: '如果你真正卡的是圆形、方形、六边形还是透明背景，就直接去模板页。',
      },
      {
        href: '/privacy',
        label: '查看隐私说明',
        description: '如果你最关心原图如何处理，就直接读隐私说明。',
      },
    ],
    questionActions: [
      {
        href: '/',
        label: '直接进编辑器试一张',
        description: '判断适不适合，最快的方法不是继续看文案，而是试一张真实头像。',
      },
      {
        href: '/privacy',
        label: '打开隐私页',
        description: '需要确认本地优先边界时，隐私页会更直接。',
      },
      {
        href: '/',
        label: '先去模板页定路线',
        description: '在继续调边框和导出之前，先把格式方向选对。',
      },
      {
        href: '/',
        label: '去模板页选格式',
        description: '先把形状和边框路线确定下来，再去做细节调整。',
      },
      {
        href: '/',
        label: '先导出一张真实样例',
        description: '先试一张真实 token，再判断 512 是否已经够用。',
      },
    ],
    supportCardEyebrow: '这页包含什么',
    answerCardEyebrow: '直接回答',
    nextMove: '下一步',
    heroBadges: ['5 个常见问题', '工作流与导出', '本地图片处理'],
  },
} as const;

export function FaqDocPageView({ locale }: { locale: SiteLocale }) {
  const copy = copyByLocale[locale];
  const model = getFaqDocModel(locale);
  const breadcrumbs = [
    { label: copy.editor, href: getLocalizedPath(locale, '/') },
    { label: copy.faq },
  ];
  const quickActions = copy.quickActions.map((link, index) => ({
    ...link,
    id: `quick-action-${locale}-${index}`,
    href: getLocalizedPath(locale, link.href),
  }));
  const questionActions = copy.questionActions.map((link, index) => ({
    ...link,
    id: `question-action-${locale}-${index}`,
    href: getLocalizedPath(locale, link.href),
  }));
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: model.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <StructuredData
        id={`faq-doc-${locale}-collection-jsonld`}
        data={buildCollectionStructuredData(locale, '/faq', model.title, model.description)}
      />
      <StructuredData id={`faq-doc-${locale}-faq-jsonld`} data={faqStructuredData} />
      <StructuredData
        id={`faq-doc-${locale}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: copy.editor, path: '/' },
          { name: copy.faq, path: '/faq' },
        ])}
      />

      <InnerPageChrome locale={locale} currentPath="/faq" tone="doc">
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-18">
            <PageBreadcrumbs items={breadcrumbs} />
            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_320px]">
              <div className="space-y-6">
                <p className="text-xs uppercase tracking-[0.34em] text-stone-500">{model.eyebrow}</p>
                <h1 className="font-display max-w-4xl text-4xl leading-none text-stone-50 sm:text-5xl">
                  {model.title}
                </h1>
                <p className="max-w-3xl text-base leading-8 text-stone-300">{model.description}</p>
                <p className="max-w-3xl text-sm leading-8 text-stone-400">{model.intro}</p>
                <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-stone-300">
                  {copy.heroBadges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              <aside className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-[#d7b46a]">{copy.supportCardEyebrow}</p>
                <div className="mt-5 space-y-4">
                  {model.signals.map((signal) => (
                    <div
                      key={signal.title}
                      className="rounded-[24px] border border-white/8 bg-black/20 px-4 py-4"
                    >
                      <h2 className="text-base font-medium text-stone-50">{signal.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-stone-300">{signal.description}</p>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8 lg:py-16">
          <aside className="space-y-5 lg:sticky lg:top-30 lg:self-start">
            <article className="rounded-[30px] border border-white/10 bg-black/25 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">{copy.quickActionsEyebrow}</p>
              <h2 className="mt-3 font-display text-2xl text-stone-50">{copy.quickActionsTitle}</h2>
              <div className="mt-5 space-y-3">
                {quickActions.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    prefetch={false}
                    className="block rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 transition hover:border-white/15 hover:bg-white/[0.05]"
                  >
                    <p className="text-sm font-medium text-stone-50">{link.label}</p>
                    <p className="mt-2 text-sm leading-6 text-stone-400">{link.description}</p>
                  </Link>
                ))}
              </div>
            </article>

            <article className="rounded-[30px] border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-wrap gap-2">
                {model.groups.map((group) => (
                  <a
                    key={group.id}
                    href={`#${group.id}`}
                    className="inline-flex rounded-full border border-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-stone-400 transition hover:border-white/20 hover:text-stone-100"
                  >
                    {group.title}
                  </a>
                ))}
              </div>
            </article>
          </aside>

          <div className="space-y-10">
            {model.groups.map((group) => (
              <section
                key={group.id}
                id={group.id}
                className="rounded-[34px] border border-white/10 bg-white/[0.03] p-7"
              >
                <h2 className="font-display text-3xl text-stone-50">{group.title}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-8 text-stone-400">{group.description}</p>

                <div className="mt-6 space-y-4">
                  {group.itemIndexes.map((index) => {
                    const item = model.items[index];
                    const action = questionActions[index];

                    if (!item || !action) {
                      return null;
                    }

                    return (
                      <article
                        key={item.question}
                        className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6"
                      >
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-full border border-[#d7b46a]/30 bg-[#d7b46a]/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#f1d492]">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="text-xs uppercase tracking-[0.28em] text-stone-500">
                            {copy.answerCardEyebrow}
                          </span>
                        </div>

                        <h3 className="mt-5 text-2xl font-medium text-stone-50">{item.question}</h3>
                        <p className="mt-4 max-w-3xl text-sm leading-8 text-stone-300">{item.answer}</p>

                        <div className="mt-6 rounded-[24px] border border-white/8 bg-black/25 p-4">
                          <p className="text-xs uppercase tracking-[0.26em] text-stone-500">{copy.nextMove}</p>
                          <Link
                            href={action.href}
                            prefetch={false}
                            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#f1d492] transition hover:text-[#f7dfab]"
                          >
                            {action.label}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                          <p className="mt-2 text-sm leading-7 text-stone-400">{action.description}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </InnerPageChrome>
    </>
  );
}
