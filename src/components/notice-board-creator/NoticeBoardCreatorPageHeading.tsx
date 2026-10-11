import { ArrowDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { NOTICE_BOARD_CREATOR_EDITOR_ID } from '@/lib/notice-board-creator/constants';
import type { NoticeBoardCreatorLandingCopy } from '@/lib/notice-board-creator/landing-copy';
import type { SiteLocale } from '@/lib/site-locale';

import styles from './landing.module.css';

export function NoticeBoardCreatorPageHeading({
  locale,
  pageCopy,
}: {
  locale: SiteLocale;
  pageCopy: NoticeBoardCreatorLandingCopy;
}) {
  const emphasisStart = pageCopy.heading.indexOf(pageCopy.headingEmphasis);

  if (emphasisStart < 0) {
    throw new Error(
      `Notice board creator heading must contain its emphasis for locale ${JSON.stringify(locale)}. Received heading=${JSON.stringify(pageCopy.heading)}, emphasis=${JSON.stringify(pageCopy.headingEmphasis)}.`,
    );
  }

  const emphasisEnd = emphasisStart + pageCopy.headingEmphasis.length;
  const documentLanguage = locale === 'zh' ? 'zh-CN' : 'en';

  return (
    <section
      aria-labelledby="notice-board-creator-heading"
      className={styles.hero}
      lang={documentLanguage}
    >
      <div className={styles.heroContent}>
        <h1 id="notice-board-creator-heading" className={`${styles.heading} ${styles.fadeIn}`}>
          {pageCopy.heading.slice(0, emphasisStart)}
          <span className={styles.headingEmphasis}>
            {pageCopy.headingEmphasis}
            <svg
              aria-hidden="true"
              className={styles.underline}
              viewBox="0 0 170 30"
              fill="none"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 12C38 8 111 3 166 7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="6"
              />
            </svg>
          </span>
          {pageCopy.heading.slice(emphasisEnd)}
        </h1>
        <p className={`${styles.description} ${styles.fadeIn} ${styles.delayOne}`}>
          {pageCopy.description}
        </p>
        <Button
          size="lg"
          className={`${styles.action} ${styles.fadeIn} ${styles.delayTwo} h-[72px] min-w-[44px] rounded-[10px] bg-foreground px-8 py-6 text-base font-medium text-background hover:bg-foreground/90`}
          nativeButton={false}
          render={<a href={`#${NOTICE_BOARD_CREATOR_EDITOR_ID}`} role="link" />}
        >
          {pageCopy.heroAction}
          <ArrowDown aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </section>
  );
}
