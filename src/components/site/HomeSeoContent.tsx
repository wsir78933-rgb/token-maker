import Link from 'next/link';
import { ArrowRight, MessageSquareText, Shield, Sparkles } from 'lucide-react';
import {
  getFaqItems,
  getHomeCopy,
  getHomeFeatures,
  getHomeSignals,
  getNavLabels,
  getSiteConfig,
} from '@/lib/site-content';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';
import { cn } from '@/lib/utils';
import { SiteMark } from '@/components/site/SiteMark';
import { SiteSupportStrip } from '@/components/site/SiteSupportStrip';

function HomeFaqDisclosure({ item }: { item: { question: string; answer: string } }) {
  return (
    <details
      className="site-surface-card site-surface-card--plain group rounded-[28px] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#d7b46a]/35 open:border-[#d7b46a]/35 open:bg-[#d7b46a]/[0.06]"
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 outline-none focus-visible:ring-2 focus-visible:ring-[#d7b46a]/25 [&::-webkit-details-marker]:hidden">
        <h3 className="text-lg font-medium text-stone-50">{item.question}</h3>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-stone-500 transition duration-300 group-open:rotate-90 group-open:text-[#f1d492]" />
      </summary>
      <p className="mt-4 text-sm leading-7 text-stone-300">{item.answer}</p>
    </details>
  );
}

function HomeFeedbackSection({ locale }: { locale: SiteLocale }) {
  const copy = {
    en: {
      eyebrow: 'Feedback',
      title: 'Questions or feedback?',
      body:
        'Tell me what broke, what felt slow, or which token workflow you want next. Real table feedback helps improve Token Maker faster.',
      cta: 'Send feedback',
    },
    zh: {
      eyebrow: '反馈',
      title: '有问题或建议？',
      body:
        '如果你在制作 Token、导出 PNG、适配 Roll20 或 Foundry VTT 时遇到问题，欢迎直接告诉我。我会优先根据这些反馈修复问题、补足常用场景。',
      cta: '发送反馈',
    },
  }[locale];

  return (
    <section className="site-content-section">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-12">
        <div className="border-t border-white/10 pt-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#d7b46a]/30 bg-[#d7b46a]/10 text-[#f1d492]">
            <MessageSquareText className="h-5 w-5" />
          </div>
          <p className="mt-5 text-xs uppercase tracking-[0.34em] text-[#d7b46a]">{copy.eyebrow}</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl leading-tight text-stone-50 sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-300 sm:text-base">{copy.body}</p>
          <Link
            href={getLocalizedPath(locale, '/contact')}
            prefetch={false}
            className="mt-7 inline-flex items-center gap-2 text-base font-medium text-[#f1d492] underline decoration-white/25 underline-offset-8 transition hover:text-[#f7dfab] hover:decoration-[#f1d492]"
          >
            {copy.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomeHero({ locale }: { locale: SiteLocale }) {
  const copy = getHomeCopy(locale);
  const homeSignals = getHomeSignals(locale);
  const navLabels = getNavLabels(locale);
  const siteConfig = getSiteConfig(locale);
  const nextLocale = locale === 'zh' ? 'en' : 'zh';
  const homeHref = getLocalizedPath(locale, '/');
  const navLinks = [
    { href: `${homeHref}#editor-workspace`, label: navLabels.editor },
    { href: getLocalizedPath(locale, '/dice-roller-dnd'), label: navLabels.diceRoller },
    { href: getLocalizedPath(locale, '/blog'), label: navLabels.blog },
  ];

  return (
    <>
      <div className="site-topbar z-50 md:sticky md:top-0">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={homeHref}
              prefetch={false}
              className="site-brand-link inline-flex items-center gap-3 text-sm transition-colors"
            >
              <SiteMark />
              <span className="flex flex-col">
                <span className="site-brand-title text-base font-semibold">{siteConfig.name}</span>
                <span className="site-brand-subtitle text-xs">{copy.heroEyebrow}</span>
              </span>
            </Link>
            <div className="flex items-center">
              <Link href={getLocalizedPath(nextLocale, '/')} prefetch={false} className="site-switch-chip">
                {navLabels.switchLocale}
              </Link>
            </div>
          </div>

          <nav className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                data-active={index === 0}
                className="site-nav-pill inline-flex shrink-0 items-center"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <section className="site-hero-section">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.9fr)] lg:px-8 lg:py-20">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.34em] text-[#d7b46a]">{copy.heroEyebrow}</p>
            <h1 className="font-display max-w-4xl text-4xl leading-none text-stone-50 sm:text-5xl lg:text-6xl">
              {copy.heroTitle}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-stone-300 sm:text-lg">{copy.heroDescription}</p>
            <div className="flex flex-wrap gap-2">
              {copy.heroHighlights.map((highlight) => (
                <span
                  key={highlight}
                  className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs text-stone-300"
                >
                  {highlight}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="#editor-workspace" className="site-cta-primary">
                {copy.heroPrimaryCta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <aside className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
            {homeSignals.map((signal) => (
              <div key={signal.label} className="site-stat-card rounded-[28px] p-5 backdrop-blur">
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
  const answerSections = copy.answerSections;
  const faqItems = getFaqItems(locale).slice(0, 3);
  const faqCtaLabel = locale === 'zh' ? '查看全部解答' : 'Read all answers';

  return (
    <div className="site-shell__content relative overflow-hidden text-stone-100">
      <section className="site-content-section">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-16">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
            <div>
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-[#d7b46a]" />
                <h2 className="font-display text-3xl text-stone-50 sm:text-4xl">{copy.featuresTitle}</h2>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300 sm:text-base">
                {copy.featuresDescription}
              </p>
            </div>

            <aside className="site-surface-card site-surface-card--warm rounded-[32px] p-6">
              <h3 className="font-display text-2xl leading-tight text-stone-50">{copy.comparisonTitle}</h3>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-300">
                {copy.comparisonPoints.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d7b46a]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {homeFeatures.map((feature, index) => (
              <article
                key={feature.title}
                className={cn(
                  'site-surface-card rounded-[30px] p-6',
                  index === 0 && 'site-surface-card--warm lg:col-span-2',
                  index > 0 && 'site-surface-card--plain',
                  index === homeFeatures.length - 1 &&
                    (homeFeatures.length - 1) % 2 === 1 &&
                    'lg:col-span-2',
                )}
              >
                <h3 className="text-xl font-medium text-stone-50">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-300">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-content-section">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-16">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-[#d7b46a]">
              {locale === 'zh' ? '制作流程' : 'Token workflow'}
            </p>
            <h2 className="font-display mt-3 text-3xl text-stone-50 sm:text-4xl">
              {locale === 'zh' ? '制作 Token 前最常遇到的选择' : 'Answers before you export a token'}
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-300 sm:text-base">
              {locale === 'zh'
                ? '如果你要为 DnD、Roll20、Foundry VTT 或 Owlbear 准备头像素材，先确认形状、边框、透明 PNG 和导出尺寸会更省时间。'
                : 'If you are preparing DnD tokens for Roll20, Foundry VTT, Owlbear, or another VTT, these notes help you choose the right shape, border, PNG format, and export size.'}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {answerSections.map((section, index) => (
              <article
                key={section.title}
                className={cn(
                  'site-surface-card site-surface-card--plain rounded-[30px] p-6',
                  index === 0 && 'site-surface-card--warm lg:col-span-2',
                )}
              >
                <h2 className="font-display text-2xl leading-tight text-stone-50">{section.title}</h2>
                <p className="mt-4 text-sm leading-7 text-stone-300">{section.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="site-content-section">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-16">
          <div className="mb-8 flex items-center gap-3">
            <Shield className="h-5 w-5 text-[#d7b46a]" />
            <h2 className="font-display text-3xl text-stone-50 sm:text-4xl">{copy.faqTitle}</h2>
          </div>
          <div className="grid items-start gap-4 lg:grid-cols-2">
            {faqItems.map((item) => (
              <HomeFaqDisclosure key={item.question} item={item} />
            ))}
          </div>
          <div className="mt-8">
            <Link
              href={getLocalizedPath(locale, '/faq')}
              prefetch={false}
              className="inline-flex items-center gap-2 text-sm text-[#f1d492] transition hover:text-[#f7dfab]"
            >
              {faqCtaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <HomeFeedbackSection locale={locale} />

      <SiteSupportStrip locale={locale} currentPath="/" className="pt-0" hideContact />
    </div>
  );
}
