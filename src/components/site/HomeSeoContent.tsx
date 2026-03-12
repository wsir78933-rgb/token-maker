import Link from 'next/link';
import { ArrowRight, Shield, Sparkles, Swords, Workflow } from 'lucide-react';
import {
  getFaqItems,
  getGuidePages,
  getHomeCopy,
  getHomeFeatures,
  getHomeSignals,
  getNavLabels,
  getSiteConfig,
  getTemplatePages,
  getWorkflowSteps,
} from '@/lib/site-content';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';
import { cn } from '@/lib/utils';
import { SiteMark } from '@/components/site/SiteMark';

export function HomeHero({ locale }: { locale: SiteLocale }) {
  const copy = getHomeCopy(locale);
  const homeSignals = getHomeSignals(locale);
  const navLabels = getNavLabels(locale);
  const siteConfig = getSiteConfig(locale);
  const nextLocale = locale === 'zh' ? 'en' : 'zh';
  const homeHref = getLocalizedPath(locale, '/');
  const navLinks = [
    { href: `${homeHref}#editor-workspace`, label: navLabels.editor },
    { href: getLocalizedPath(locale, '/templates'), label: navLabels.templates },
    { href: getLocalizedPath(locale, '/blog'), label: navLabels.guides },
    { href: getLocalizedPath(locale, '/faq'), label: navLabels.faq },
    { href: getLocalizedPath(locale, '/privacy'), label: navLabels.privacy },
  ];

  return (
    <>
      <div className="sticky top-0 z-50 border-b border-[#d7b46a]/15 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6 py-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={homeHref}
              className="inline-flex items-center gap-3 text-sm text-stone-200 transition-colors hover:text-[#f3d38f]"
            >
              <SiteMark />
              <span className="flex flex-col">
                <span className="font-semibold text-base text-stone-50">{siteConfig.name}</span>
                <span className="text-xs text-stone-400">{copy.heroEyebrow}</span>
              </span>
            </Link>
            <Link
              href={getLocalizedPath(nextLocale, '/')}
              className="rounded-full border border-white/12 px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-stone-400 transition hover:border-white/20 hover:text-stone-100"
            >
              {navLabels.switchLocale}
            </Link>
          </div>

          <nav className="mt-4 flex flex-wrap items-center gap-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] transition-colors',
                  index === 0
                    ? 'border-[#d7b46a]/35 bg-[#d7b46a]/12 text-[#f1d492]'
                    : 'border-white/12 text-stone-400 hover:border-white/20 hover:text-stone-100',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <section className="border-b border-[#d7b46a]/15 bg-[radial-gradient(circle_at_top,rgba(215,180,106,0.14),transparent_42%),linear-gradient(180deg,#090b10_0%,#07090d_100%)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.9fr)] lg:px-8 lg:py-20">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.34em] text-[#d7b46a]">{copy.heroEyebrow}</p>
          <h1 className="font-display max-w-4xl text-4xl leading-none text-stone-50 sm:text-5xl lg:text-6xl">
            {copy.heroTitle}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-stone-300 sm:text-lg">{copy.heroDescription}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#editor-workspace"
              className="inline-flex items-center gap-2 rounded-full border border-[#d7b46a]/40 bg-[#d7b46a]/12 px-5 py-2.5 text-sm font-medium text-[#f5ddb0] transition hover:border-[#f2cb7a] hover:bg-[#d7b46a]/18"
            >
              {copy.heroPrimaryCta}
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href={getLocalizedPath(locale, '/templates')}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-sm text-stone-300 transition hover:border-white/20 hover:text-stone-100"
            >
              {copy.heroSecondaryCta}
            </Link>
          </div>
        </div>

        <aside className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {homeSignals.map((signal) => (
            <div
              key={signal.label}
              className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.85)] backdrop-blur"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">{signal.label}</p>
              <p className="mt-3 font-display text-3xl text-stone-50">{signal.value}</p>
              <p className="mt-2 text-sm leading-6 text-stone-300">{signal.description}</p>
            </div>
          ))}
        </aside>
      </div>
      </section>
    </>
  );
}

export function HomeSeoContent({ locale }: { locale: SiteLocale }) {
  const copy = getHomeCopy(locale);
  const homeFeatures = getHomeFeatures(locale);
  const templatePages = getTemplatePages(locale);
  const guidePages = getGuidePages(locale);
  const workflowSteps = getWorkflowSteps(locale);
  const faqItems = getFaqItems(locale);

  return (
    <div className="relative overflow-hidden bg-[#07090d] text-stone-100">
      <section className="border-b border-white/8">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-16">
          <div className="mb-8 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-[#d7b46a]" />
            <h2 className="font-display text-3xl text-stone-50 sm:text-4xl">{copy.featuresTitle}</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {homeFeatures.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-6"
              >
                <h3 className="text-xl font-medium text-stone-50">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-300">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="templates" className="border-b border-white/8">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#d7b46a]">{copy.templatesEyebrow}</p>
              <h2 className="font-display mt-3 text-3xl text-stone-50 sm:text-4xl">{copy.templatesTitle}</h2>
            </div>
            <Link href={getLocalizedPath(locale, '/templates')} className="text-sm text-stone-300 transition hover:text-stone-100">
              {copy.seeAllTemplatePages}
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {templatePages.slice(0, 3).map((page) => (
              <article
                key={page.slug}
                className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.85)]"
              >
                <p className="text-xs uppercase tracking-[0.26em] text-stone-500">{page.intent}</p>
                <h3 className="mt-4 text-2xl font-medium text-stone-50">{page.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-300">{page.description}</p>
                <ul className="mt-5 space-y-2 text-sm text-stone-400">
                  {page.bestFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={getLocalizedPath(locale, `/templates/${page.slug}`)} className="inline-flex items-center gap-2 text-sm text-[#f1d492]">
                    {locale === 'zh' ? '查看页面' : 'Read page'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href={page.query} className="text-sm text-stone-400 transition hover:text-stone-100">
                    {locale === 'zh' ? '打开预设' : 'Open setup'}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="blog" className="border-b border-white/8">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-16">
          <div className="mb-8 flex items-center gap-3">
            <Workflow className="h-5 w-5 text-[#d7b46a]" />
            <h2 className="font-display text-3xl text-stone-50 sm:text-4xl">{copy.guidesTitle}</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {guidePages.map((page) => (
              <article
                key={page.slug}
                className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6"
              >
                <p className="text-xs uppercase tracking-[0.26em] text-stone-500">{page.outcome}</p>
                <h3 className="mt-4 text-2xl font-medium text-stone-50">{page.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-300">{page.description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={getLocalizedPath(locale, `/blog/${page.slug}`)} className="inline-flex items-center gap-2 text-sm text-[#f1d492]">
                    {locale === 'zh' ? '阅读全文' : 'Read article'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href={page.ctaQuery} className="text-sm text-stone-400 transition hover:text-stone-100">
                    {locale === 'zh' ? '在编辑器里试用' : 'Try in editor'}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/8">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-16">
          <div className="mb-8 flex items-center gap-3">
            <Swords className="h-5 w-5 text-[#d7b46a]" />
            <h2 className="font-display text-3xl text-stone-50 sm:text-4xl">{copy.workflowTitle}</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {workflowSteps.map((step) => (
              <article
                key={step.title}
                className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-6"
              >
                <h3 className="text-xl font-medium text-stone-50">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-300">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-b border-white/8">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-16">
          <div className="mb-8 flex items-center gap-3">
            <Shield className="h-5 w-5 text-[#d7b46a]" />
            <h2 className="font-display text-3xl text-stone-50 sm:text-4xl">{copy.faqTitle}</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-[28px] border border-white/10 bg-white/[0.03] p-5"
              >
                <summary className="cursor-pointer list-none text-lg font-medium text-stone-50">
                  {item.question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-stone-300">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-16">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="rounded-[30px] border border-[#d7b46a]/20 bg-[radial-gradient(circle_at_top_left,rgba(215,180,106,0.13),transparent_44%),rgba(255,255,255,0.03)] p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-[#d7b46a]">{copy.localFirstEyebrow}</p>
            <h2 className="font-display mt-4 text-3xl text-stone-50">{copy.localFirstTitle}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">{copy.localFirstDescription}</p>
          </div>

          <div className="grid gap-3">
            {copy.quickLinks.map((link) => (
              <Link
                key={link.href}
                href={getLocalizedPath(locale, link.href as '/' | '/templates' | '/blog' | '/faq')}
                className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/15 hover:bg-white/[0.045]"
              >
                <p className="text-lg font-medium text-stone-50">{link.label}</p>
                <p className="mt-2 text-sm leading-6 text-stone-300">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
