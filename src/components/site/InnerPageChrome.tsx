import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { SiteMark } from '@/components/site/SiteMark';
import { getNavLabels, getSiteConfig } from '@/lib/site-content';
import { getLocalizedPath, stripLocalePrefix, switchLocalePath, type SiteLocale } from '@/lib/site-locale';
import { cn } from '@/lib/utils';

type InnerPageTone = 'template' | 'guide' | 'hub' | 'doc';

const toneClasses: Record<InnerPageTone, string> = {
  template:
    'bg-[radial-gradient(circle_at_top_left,rgba(215,180,106,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(94,133,199,0.16),transparent_36%),linear-gradient(180deg,#08090e_0%,#07090d_100%)]',
  guide:
    'bg-[radial-gradient(circle_at_top_left,rgba(180,205,255,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(215,180,106,0.14),transparent_40%),linear-gradient(180deg,#06080d_0%,#07090d_100%)]',
  hub:
    'bg-[radial-gradient(circle_at_top,rgba(215,180,106,0.16),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(113,158,210,0.16),transparent_30%),linear-gradient(180deg,#07090d_0%,#06070a_100%)]',
  doc:
    'bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%),linear-gradient(180deg,#090b10_0%,#07090d_100%)]',
};

interface InnerPageChromeProps {
  locale: SiteLocale;
  currentPath: string;
  children: React.ReactNode;
  tone?: InnerPageTone;
  className?: string;
}

export function InnerPageChrome({
  locale,
  currentPath,
  children,
  tone = 'hub',
  className,
}: InnerPageChromeProps) {
  const siteConfig = getSiteConfig(locale);
  const navLabels = getNavLabels(locale);
  const navLinks = [
    { href: getLocalizedPath(locale, '/'), label: navLabels.editor },
    { href: getLocalizedPath(locale, '/templates'), label: navLabels.templates },
    { href: getLocalizedPath(locale, '/blog'), label: navLabels.guides },
    { href: getLocalizedPath(locale, '/faq'), label: navLabels.faq },
    { href: getLocalizedPath(locale, '/privacy'), label: navLabels.privacy },
  ];
  const switchedPath = switchLocalePath(currentPath, locale === 'en' ? 'zh' : 'en');

  return (
    <main className={cn('min-h-screen overflow-hidden text-stone-100', toneClasses[tone], className)}>
      <div className="sticky top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`${getLocalizedPath(locale, '/')}#editor-workspace`}
              className="inline-flex items-center gap-3 text-sm text-stone-300 transition-colors hover:text-[#f3d38f]"
            >
              <ChevronLeft className="h-4 w-4" />
              <SiteMark className="h-8 w-8 rounded-lg" />
              <span className="flex flex-col">
                <span className="font-semibold text-stone-100">{siteConfig.name}</span>
                <span className="text-xs text-stone-500">{locale === 'zh' ? '返回首页编辑器' : 'Back to the editor'}</span>
              </span>
            </Link>

            <Link
              href={switchedPath}
              className="rounded-full border border-white/12 px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-stone-400 transition hover:border-white/25 hover:text-stone-100"
            >
              {navLabels.switchLocale}
            </Link>
          </div>

          <nav className="mt-4 flex flex-wrap items-center gap-2">
            {navLinks.map((link) => {
              const normalizedCurrentPath = stripLocalePrefix(currentPath);
              const normalizedHref = stripLocalePrefix(link.href);
              const isActive =
                normalizedCurrentPath === normalizedHref ||
                (normalizedHref !== '/' && normalizedCurrentPath.startsWith(`${normalizedHref}/`));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] transition-colors',
                    isActive
                      ? 'border-[#d7b46a]/40 bg-[#d7b46a]/15 text-[#f1d492]'
                      : 'border-white/12 text-stone-400 hover:border-white/25 hover:text-stone-100',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_28%,transparent_72%,rgba(255,255,255,0.03))]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        {children}
      </div>
    </main>
  );
}
