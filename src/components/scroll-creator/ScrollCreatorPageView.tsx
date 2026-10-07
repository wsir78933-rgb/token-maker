import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { ScrollCreatorCaseStudies } from '@/components/scroll-creator/ScrollCreatorCaseStudies';
import { ScrollCreatorContentSections } from '@/components/scroll-creator/ScrollCreatorContentSections';
import { ScrollCreatorPageHeading } from '@/components/scroll-creator/ScrollCreatorPageHeading';
import { ScrollCreatorWorkbench } from '@/components/scroll-creator/ScrollCreatorWorkbench';
import { getScrollCreatorCopy } from '@/lib/scroll-creator/copy';
import { SCROLL_CREATOR_EDITOR_ID } from '@/lib/scroll-creator/constants';
import type { ScrollLocale } from '@/lib/scroll-creator/types';

const SCROLL_CREATOR_PATH = '/scroll-creator';

export function ScrollCreatorPageView({ locale }: { locale: ScrollLocale }) {
  const copy = getScrollCreatorCopy(locale);

  return (
    <InnerPageChrome
      locale={locale}
      currentPath={SCROLL_CREATOR_PATH}
      tone="hub"
      className="scroll-creator-page [&_a]:cursor-pointer [&_button:not(:disabled)]:cursor-pointer"
    >
      <ScrollCreatorPageHeading locale={locale} />
      <div
        id={SCROLL_CREATOR_EDITOR_ID}
        className="mx-auto w-full max-w-[96rem] scroll-mt-20 px-3 pt-4 pb-6 sm:px-6 sm:pt-6 sm:pb-10 lg:px-8"
      >
        <ScrollCreatorWorkbench locale={locale} copy={copy} />
      </div>
      <ScrollCreatorCaseStudies locale={locale} />
      <ScrollCreatorContentSections locale={locale} />
    </InnerPageChrome>
  );
}
