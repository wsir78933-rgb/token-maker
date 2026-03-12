import Link from 'next/link';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { SiteMark } from '@/components/site/SiteMark';
import { getNavLabels, getShellCopy, getSiteConfig } from '@/lib/site-content';
import { getLocalizedPath, stripLocalePrefix, switchLocalePath, type SiteLocale } from '@/lib/site-locale';
import { cn } from '@/lib/utils';

interface ContentPageShellProps {
  locale: SiteLocale;
  currentPath: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
  className?: string;
}

export function ContentPageShell({
  locale,
  currentPath,
  eyebrow,
  title,
  description,
  children,
  ctaHref,
  ctaLabel,
  className,
}: ContentPageShellProps) {
  const siteConfig = getSiteConfig(locale);
  const shellCopy = getShellCopy(locale);
  const navLabels = getNavLabels(locale);
  const navLinks = [
    { href: getLocalizedPath(locale, '/'), label: navLabels.editor },
    { href: getLocalizedPath(locale, '/templates'), label: navLabels.templates },
    { href: getLocalizedPath(locale, '/guides'), label: navLabels.guides },
    { href: getLocalizedPath(locale, '/faq'), label: navLabels.faq },
    { href: getLocalizedPath(locale, '/privacy'), label: navLabels.privacy },
  ];
  const switchedPath = switchLocalePath(currentPath, locale === 'en' ? 'zh' : 'en');
  const resolvedCtaHref = ctaHref ?? `${getLocalizedPath(locale, '/')}#editor-workspace`;
  const resolvedCtaLabel = ctaLabel ?? (locale === 'zh' ? '打开首页编辑器' : 'Open the editor');

  return (
    <main className={cn('min-h-screen bg-[#07090d] text-stone-100', className)}>
      <div className="sticky top-0 z-50 border-b border-[#d7b46a]/15 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6 py-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`${getLocalizedPath(locale, '/')}#editor-workspace`}
              className="inline-flex items-center gap-3 text-sm text-stone-300 transition-colors hover:text-[#f3d38f]"
            >
              <ChevronLeft className="h-4 w-4" />
              <SiteMark className="h-8 w-8 rounded-lg" />
              {shellCopy.backToSite} {siteConfig.name}
            </Link>
            <Link
              href={switchedPath}
              className="rounded-full border border-white/12 px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-stone-400 transition hover:border-white/20 hover:text-stone-100"
            >
              {navLabels.switchLocale}
            </Link>
          </div>

          <nav className="mt-4 flex flex-wrap items-center gap-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.href || currentPath === stripLocalePrefix(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] transition-colors',
                    isActive
                      ? 'border-[#d7b46a]/35 bg-[#d7b46a]/12 text-[#f1d492]'
                      : 'border-white/12 text-stone-400 hover:border-white/20 hover:text-stone-100',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <section className="relative overflow-hidden border-b border-[#d7b46a]/15 bg-[radial-gradient(circle_at_top_left,rgba(215,180,106,0.16),transparent_40%),radial-gradient(circle_at_top_right,rgba(77,113,168,0.18),transparent_30%),linear-gradient(180deg,#090b10_0%,#07090d_100%)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.75fr)] lg:px-8 lg:py-20">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.32em] text-[#d7b46a]">{eyebrow}</p>
            <h1 className="font-display max-w-4xl text-4xl leading-none text-stone-50 sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-stone-300 sm:text-lg">{description}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={resolvedCtaHref}
                className="inline-flex items-center gap-2 rounded-full border border-[#d7b46a]/40 bg-[#d7b46a]/12 px-5 py-2.5 text-sm font-medium text-[#f5ddb0] transition hover:border-[#f2cb7a] hover:bg-[#d7b46a]/18"
              >
                {resolvedCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={getLocalizedPath(locale, '/templates')}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-sm text-stone-300 transition hover:border-white/20 hover:text-stone-100"
              >
                {shellCopy.browseTemplates}
              </Link>
            </div>
          </div>

          <aside className="space-y-3 rounded-[28px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_24px_100px_-40px_rgba(0,0,0,0.9)] backdrop-blur">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-500">{shellCopy.whyThisPageExists}</p>
            <ul className="space-y-3 text-sm leading-6 text-stone-300">
              {shellCopy.whyPageBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-16">{children}</div>
    </main>
  );
}
