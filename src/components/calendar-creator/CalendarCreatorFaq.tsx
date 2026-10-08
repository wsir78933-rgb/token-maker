'use client';

import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';

import type { CalendarCreatorPageCopy } from '@/lib/calendar-creator/page-copy';

import styles from './CalendarCreatorPageView.module.css';

export type CalendarCreatorFaqProps = {
  copy: CalendarCreatorPageCopy['faq'];
};

function requireCalendarCreatorFaqItems(
  items: CalendarCreatorPageCopy['faq']['items'],
): void {
  if (!Array.isArray(items)) {
    throw new Error(
      `Calendar creator FAQ items must be an array. Received ${JSON.stringify(items)}.`,
    );
  }

  if (items.length === 0) {
    throw new Error('Calendar creator FAQ items must not be empty. Received length 0.');
  }
}

export function CalendarCreatorFaq({ copy }: CalendarCreatorFaqProps) {
  requireCalendarCreatorFaqItems(copy.items);

  const faqId = useId();
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);
  const titleId = `${faqId}-title`;
  const descriptionId = `${faqId}-description`;

  return (
    <section
      id="calendar-creator-faq"
      data-calendar-screen-only
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={`${styles.contentSection} ${styles.faqSection}`}
    >
      <div className={styles.sectionInner}>
        <header className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>{copy.eyebrow}</span>
          <h2 className={styles.sectionTitle} id={titleId}>
            {copy.title}
          </h2>
          <p className={styles.sectionDescription} id={descriptionId}>
            {copy.description}
          </p>
        </header>

        <div className={styles.faqList}>
          {copy.items.map((item, index) => {
            const isExpanded = openItemIndex === index;
            const questionId = `${faqId}-question-${index}`;
            const answerId = `${faqId}-answer-${index}`;

            return (
              <article className={styles.faqItem} key={`${faqId}-item-${index}`}>
                <h3>
                  <button
                    id={questionId}
                    type="button"
                    className={styles.faqQuestion}
                    aria-controls={answerId}
                    aria-expanded={isExpanded}
                    onClick={() => setOpenItemIndex((currentIndex) => (
                      currentIndex === index ? null : index
                    ))}
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`${styles.faqChevron} ${isExpanded ? styles.faqChevronExpanded : ''}`}
                    />
                  </button>
                </h3>
                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={questionId}
                  className={styles.faqAnswer}
                  hidden={!isExpanded}
                >
                  <p>{item.answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
