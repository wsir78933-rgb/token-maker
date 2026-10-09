import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { ToolDirectoryGrid } from '@/components/site/tools-directory/ToolDirectoryGrid';
import { ToolDirectoryHero } from '@/components/site/tools-directory/ToolDirectoryHero';
import type { SiteLocale } from '@/lib/site-locale';

export function ToolDirectoryPageView({ locale }: { locale: SiteLocale }) {
  return (
    <InnerPageChrome locale={locale} currentPath="/tools" tone="hub">
      <ToolDirectoryHero locale={locale} />
      <ToolDirectoryGrid locale={locale} />
    </InnerPageChrome>
  );
}
