import { ContentSiteTopbar } from '@/components/site/ContentSiteTopbar';
import { SiteFooter } from '@/components/site/SiteFooter';
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
  localeSwitchPath?: string;
}

export function InnerPageChrome({
  locale,
  currentPath,
  children,
  tone = 'hub',
  className,
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
  const contentTopbarNavLinks = navLinks.map((link) => {
    const normalizedCurrentPath = stripLocalePrefix(currentPath);
    const normalizedHref = stripLocalePrefix(link.href);
    const isActive =
      normalizedCurrentPath === normalizedHref ||
      (normalizedHref !== '/' && normalizedCurrentPath.startsWith(`${normalizedHref}/`));

    return {
      ...link,
      isActive,
    };
  });

  return (
    <main
      className={cn(
        'site-shell min-h-screen text-stone-100',
        'site-shell--allow-sticky',
        toneClasses[tone],
        className,
      )}
    >
      <ContentSiteTopbar
        brandHref={`${getLocalizedPath(locale, '/')}#editor-workspace`}
        brandName={siteConfig.name}
        brandSubtitle={locale === 'zh' ? '返回首页编辑器' : 'Back to the editor'}
        contentClassName="mx-auto max-w-7xl px-6 py-4 lg:px-8"
        localeSwitchHref={switchedPath}
        localeSwitchLabel={navLabels.switchLocale}
        navClassName="mt-4 flex flex-wrap items-center gap-2"
        navLinks={contentTopbarNavLinks}
        showBackIcon
        siteMarkClassName="h-8 w-8 rounded-lg"
        topbarClassName="sticky top-0 z-50"
      />

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_28%,transparent_72%,rgba(255,255,255,0.03))]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        {children}
        <SiteFooter locale={locale} currentPath={currentPath} contentWidth="contained" />
      </div>
    </main>
  );
}
