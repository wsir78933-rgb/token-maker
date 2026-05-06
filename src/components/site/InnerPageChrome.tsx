import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { SiteMark } from '@/components/site/SiteMark';
import { SiteSupportStrip } from '@/components/site/SiteSupportStrip';
import { TrackedEditorLink } from '@/components/site/TrackedEditorLink';
import { getNavLabels, getSiteConfig } from '@/lib/site-content';
import { getLocalizedPath, stripLocalePrefix, switchLocalePath, type SiteLocale } from '@/lib/site-locale';
import { cn } from '@/lib/utils';

type InnerPageTone = 'template' | 'hub' | 'doc';

const toneClasses: Record<InnerPageTone, string> = {
  template: 'site-shell--template',
  hub: 'site-shell--hub',
  doc: 'site-shell--doc',
};

interface InnerPageChromeProps {
  locale: SiteLocale;
  currentPath: string;
  children: React.ReactNode;
  tone?: InnerPageTone;
  className?: string;
  showSupportStrip?: boolean;
  localeSwitchPath?: string;
}

export function InnerPageChrome({
  locale,
  currentPath,
  children,
  tone = 'hub',
  className,
  showSupportStrip = true,
  localeSwitchPath,
}: InnerPageChromeProps) {
  const siteConfig = getSiteConfig(locale);
  const navLabels = getNavLabels(locale);
  const navLinks = [
    { href: getLocalizedPath(locale, '/'), label: navLabels.editor },
    { href: getLocalizedPath(locale, '/dice-roller-dnd'), label: navLabels.diceRoller },
    { href: getLocalizedPath(locale, '/blog'), label: navLabels.blog },
  ];
  const switchedPath = localeSwitchPath ?? switchLocalePath(currentPath, locale === 'en' ? 'zh' : 'en');

  return (
    <main
      className={cn(
        'site-shell min-h-screen text-stone-100',
        tone === 'doc' ? 'site-shell--allow-sticky' : 'overflow-hidden',
        toneClasses[tone],
        className,
      )}
    >
      <div className="site-topbar sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TrackedEditorLink
              href={`${getLocalizedPath(locale, '/')}#editor-workspace`}
              prefetch={false}
              className="site-brand-link inline-flex items-center gap-3 text-sm transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <SiteMark className="h-8 w-8 rounded-lg" />
              <span className="flex flex-col">
                <span className="site-brand-title font-semibold">{siteConfig.name}</span>
                <span className="site-brand-subtitle text-xs">
                  {locale === 'zh' ? '返回首页编辑器' : 'Back to the editor'}
                </span>
              </span>
            </TrackedEditorLink>

            <div className="flex items-center">
              <Link href={switchedPath} prefetch={false} className="site-switch-chip">
                {navLabels.switchLocale}
              </Link>
            </div>
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
                  prefetch={false}
                  data-active={isActive}
                  className="site-nav-pill inline-flex shrink-0 items-center"
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
        {showSupportStrip ? <SiteSupportStrip locale={locale} currentPath={currentPath} /> : null}
      </div>
    </main>
  );
}
