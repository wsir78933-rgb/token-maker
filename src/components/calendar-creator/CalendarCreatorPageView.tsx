import { CalendarCreatorWorkbench } from '@/components/calendar-creator/CalendarCreatorWorkbench';
import { CalendarCreatorContentSections } from '@/components/calendar-creator/CalendarCreatorContentSections';
import {
  CALENDAR_CREATOR_WORKSPACE_ID,
  CalendarCreatorPageHeading,
} from '@/components/calendar-creator/CalendarCreatorPageHeading';
import { InnerPageChrome } from '@/components/site/InnerPageChrome';
import { StructuredData } from '@/components/site/StructuredData';
import { absoluteUrl, getNavLabels } from '@/lib/site-content';
import { buildBreadcrumbStructuredData } from '@/lib/site-page-models';
import { getCalendarCreatorCopy } from '@/lib/calendar-creator/copy';
import { getCalendarCreatorPageCopy } from '@/lib/calendar-creator/page-copy';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

import styles from './CalendarCreatorPageView.module.css';

const CALENDAR_CREATOR_PATH = '/calendar-creator';

export function CalendarCreatorPageView({ locale }: { locale: SiteLocale }) {
  const copy = getCalendarCreatorCopy(locale);
  const pageCopy = getCalendarCreatorPageCopy(locale);
  const navLabels = getNavLabels(locale);
  const localizedPath = getLocalizedPath(locale, CALENDAR_CREATOR_PATH);

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: copy.title,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        url: absoluteUrl(localizedPath),
        description: copy.pageDescription,
        featureList: [
          copy.monthCount,
          copy.weekdayCount,
          copy.moonsTab,
          copy.disastersTab,
          copy.archives,
          copy.print,
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: pageCopy.faq.items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };

  return (
    <>
      <StructuredData id={`calendar-creator-${locale}-jsonld`} data={structuredData} />
      <StructuredData
        id={`calendar-creator-${locale}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: navLabels.editor, path: '/' },
          { name: copy.navigationTitle, path: CALENDAR_CREATOR_PATH },
        ])}
      />

      <InnerPageChrome
        locale={locale}
        currentPath={CALENDAR_CREATOR_PATH}
        tone="hub"
        className={styles.pageShell}
      >
        <CalendarCreatorPageHeading locale={locale} />
        <div
          id={CALENDAR_CREATOR_WORKSPACE_ID}
          data-testid="calendar-creator-workspace"
          className="mx-auto w-full max-w-[96rem] scroll-mt-24 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
        >
          <CalendarCreatorWorkbench locale={locale} />
        </div>
        <CalendarCreatorContentSections copy={pageCopy} locale={locale} />
      </InnerPageChrome>
    </>
  );
}
