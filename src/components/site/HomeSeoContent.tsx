import Link from 'next/link';
import { ArrowRight, Shield, Sparkles } from 'lucide-react';
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

      <section id="faq" className="site-content-section">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-[#d7b46a]" />
              <h2 className="font-display text-3xl text-stone-50 sm:text-4xl">{copy.faqTitle}</h2>
            </div>
            <div className="max-w-sm text-sm leading-7 text-stone-400">{copy.faqDescription}</div>
          </div>
          <div className="grid items-start gap-4 lg:grid-cols-2">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="site-surface-card site-surface-card--plain group rounded-[28px] p-5"
              >
                <summary className="cursor-pointer list-none text-lg font-medium text-stone-50">
                  {item.question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-stone-300">{item.answer}</p>
              </details>
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

      <SiteSupportStrip locale={locale} currentPath="/" className="pt-0" />
    </div>
  );
}
