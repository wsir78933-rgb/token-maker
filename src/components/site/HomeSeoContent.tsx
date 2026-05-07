import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Bug, Gauge, ImagePlus, MessageSquareText, Sparkles } from 'lucide-react';
import {
  getHomeCopy,
  getHomeSignals,
  getNavLabels,
  getSiteConfig,
} from '@/lib/site-content';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';
import { SiteMark } from '@/components/site/SiteMark';
import { SiteSupportStrip } from '@/components/site/SiteSupportStrip';

function HomeFeedbackSection({ locale }: { locale: SiteLocale }) {
  const copy = {
    en: {
      eyebrow: 'Fix requests',
      title: 'Need a token export fixed?',
      body:
        'If upload, crop, PNG export, Roll20 or Foundry fit, or missing styles are blocking prep, send the details. Reproducible issues get fixed first, and common requests become new borders, masks, or presets.',
      cta: 'Report an issue',
      ctaNote: 'Screenshots, VTT platform, and export settings make the issue easier to fix.',
      visualEyebrow: 'Export goal',
      visualTitle: 'Export once, drop it into your VTT',
      visualBody: 'The target is simple: clean transparent edges, readable portraits at battle-map scale, and token files that need less resizing after they land in Roll20, Foundry, or Owlbear.',
      imageAlt: 'Finished fantasy character token made in Token Maker',
      prompts: [
        {
          title: 'Export issue',
          body: 'Transparent PNG, size, edge, or download problems.',
          icon: Bug,
        },
        {
          title: 'VTT fit problem',
          body: 'Roll20, Foundry, or Owlbear tokens that need extra fixing.',
          icon: Gauge,
        },
        {
          title: 'Missing style',
          body: 'Borders, masks, labels, or presets your table needs.',
          icon: ImagePlus,
        },
      ],
      focusItems: ['Clean transparent PNG edges', 'Readable faces at map scale', 'Less resizing after VTT import'],
    },
    zh: {
      eyebrow: '反馈',
      title: '有问题或建议？',
      body:
        '如果你在制作 Token、导出 PNG、适配 Roll20 或 Foundry VTT 时遇到问题，欢迎直接告诉我。',
      cta: '发送反馈',
      ctaNote: '附上截图、使用平台和导出设置，会更容易定位。',
      visualEyebrow: '导出目标',
      visualTitle: '导出后少修一次图',
      visualBody: '目标很直接：透明 PNG 边缘干净，头像在战斗地图缩放下看得清，导入 Roll20、Foundry 或 Owlbear 后不用反复裁切和改尺寸。',
      imageAlt: '使用 Token Maker 制作完成的奇幻角色 Token',
      prompts: [
        {
          title: '导出有问题',
          body: '透明 PNG、尺寸、边缘或下载异常。',
          icon: Bug,
        },
        {
          title: '平台不适配',
          body: 'Roll20、Foundry 或 Owlbear 里还要二次调整。',
          icon: Gauge,
        },
        {
          title: '缺少样式',
          body: '你需要的边框、遮罩、文字或预设。',
          icon: ImagePlus,
        },
      ],
      focusItems: ['透明 PNG 边缘干净', '地图缩放下头像清楚', '导入 VTT 后少调尺寸'],
    },
  }[locale];

  return (
    <section id="feedback" className="site-content-section overflow-hidden">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(215,180,106,0.16),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(143,183,255,0.14),transparent_28%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-16">
        <div className="border-t border-white/10 pt-8 lg:pt-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-[#d7b46a]/24 bg-[#d7b46a]/10 px-3 py-2 text-[#f1d492]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/24">
                  <MessageSquareText className="h-4 w-4" />
                </span>
                <span className="text-xs uppercase tracking-[0.26em]">{copy.eyebrow}</span>
              </div>

              <h2
                className="mt-5 max-w-3xl font-display text-3xl leading-tight text-stone-50 sm:text-4xl lg:text-5xl"
                style={{ letterSpacing: 0 }}
              >
                {copy.title}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300 sm:text-base">{copy.body}</p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {copy.prompts.map((prompt) => {
                  const Icon = prompt.icon;

                  return (
                    <div
                      key={prompt.title}
                      className="rounded-[24px] border border-white/10 bg-black/22 p-4 shadow-[0_24px_80px_-56px_rgba(0,0,0,0.76)] backdrop-blur transition hover:border-[#d7b46a]/32 hover:bg-white/[0.045]"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[#f1d492]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="mt-4 text-sm font-semibold text-stone-50">{prompt.title}</h3>
                      <p className="mt-2 text-xs leading-6 text-stone-400">{prompt.body}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href={getLocalizedPath(locale, '/contact')} prefetch={false} className="site-cta-primary">
                  {copy.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="max-w-sm text-xs leading-6 text-stone-500">{copy.ctaNote}</p>
              </div>
            </div>

            <aside className="relative min-h-[340px] overflow-hidden rounded-[30px] border border-white/10 bg-black/30 p-5 shadow-[0_30px_100px_-54px_rgba(0,0,0,0.88)]">
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(215,180,106,0.2),transparent_32%),linear-gradient(150deg,rgba(143,183,255,0.14),rgba(215,180,106,0.08)_44%,rgba(0,0,0,0)_78%)]"
                aria-hidden="true"
              />
              <div className="relative flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.28em] text-[#d7b46a]">{copy.visualEyebrow}</p>
                <Sparkles className="h-5 w-5 text-[#f1d492]" />
              </div>

              <div className="relative mt-6 h-40 sm:h-48">
                <Image
                  src="/showcase/radiant-paladin-circle.webp"
                  alt={copy.imageAlt}
                  width={260}
                  height={260}
                  sizes="(min-width: 1024px) 180px, 42vw"
                  className="absolute left-0 top-4 h-32 w-32 rounded-full border border-white/12 bg-black/35 object-contain p-2 shadow-[0_22px_54px_-24px_rgba(0,0,0,0.9)] sm:h-40 sm:w-40"
                />
                <Image
                  src="/showcase/dusk-rogue-ring.webp"
                  alt={copy.imageAlt}
                  width={260}
                  height={260}
                  sizes="(min-width: 1024px) 180px, 42vw"
                  className="absolute left-1/2 top-0 h-36 w-36 -translate-x-1/2 rounded-full border border-[#d7b46a]/28 bg-black/40 object-contain p-2 shadow-[0_28px_70px_-24px_rgba(215,180,106,0.42)] sm:h-44 sm:w-44"
                />
                <Image
                  src="/showcase/frost-ranger-ice.webp"
                  alt={copy.imageAlt}
                  width={260}
                  height={260}
                  sizes="(min-width: 1024px) 180px, 42vw"
                  className="absolute right-0 top-8 h-28 w-28 rounded-full border border-[#8fb7ff]/24 bg-black/35 object-contain p-2 shadow-[0_22px_54px_-24px_rgba(143,183,255,0.34)] sm:h-36 sm:w-36"
                />
              </div>

              <div className="relative mt-7">
                <h3 className="font-display text-2xl leading-tight text-stone-50" style={{ letterSpacing: 0 }}>
                  {copy.visualTitle}
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-300">{copy.visualBody}</p>

                <div className="mt-5 grid gap-2">
                  {copy.focusItems.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-[18px] border border-white/10 bg-white/[0.045] px-3 py-2.5 text-sm text-stone-200"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#f1d492]" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
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
  return (
    <div className="site-shell__content relative overflow-hidden text-stone-100">
      <HomeFeedbackSection locale={locale} />

      <SiteSupportStrip locale={locale} currentPath="/" className="pt-0" hideContact />
    </div>
  );
}
