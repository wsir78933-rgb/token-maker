import {
  getCalendarCreatorShowcaseCopy,
  type CalendarCreatorShowcaseCopy,
  type CalendarCreatorShowcaseGroup,
} from '@/lib/calendar-creator/showcase-copy';
import type { SiteLocale } from '@/lib/site-locale';

import { CalendarCreatorShowcaseCarousel } from './CalendarCreatorShowcaseCarousel';
import styles from './CalendarCreatorShowcase.module.css';

const CALENDAR_CREATOR_SHOWCASE_GROUP_IDS = ['worlds', 'adventures', 'stories'] as const;
const CALENDAR_CREATOR_SHOWCASE_IMAGE_POSITIONS = ['left', 'right', 'left'] as const;
const CALENDAR_CREATOR_SHOWCASE_EXAMPLE_COUNT = 4;

function assertCalendarCreatorShowcaseShape(copy: CalendarCreatorShowcaseCopy): void {
  if (copy.groups.length !== CALENDAR_CREATOR_SHOWCASE_GROUP_IDS.length) {
    throw new Error(
      `Calendar creator showcase expected exactly ${CALENDAR_CREATOR_SHOWCASE_GROUP_IDS.length} groups but received ${copy.groups.length}.`,
    );
  }

  const sourcePaths = new Set<string>();
  copy.groups.forEach((showcaseGroup, groupIndex) => {
    const expectedGroupId = CALENDAR_CREATOR_SHOWCASE_GROUP_IDS[groupIndex];
    const expectedImagePosition = CALENDAR_CREATOR_SHOWCASE_IMAGE_POSITIONS[groupIndex];
    if (showcaseGroup.id !== expectedGroupId) {
      throw new Error(
        `Calendar creator showcase group ${groupIndex} must use id ${JSON.stringify(expectedGroupId)} but received ${JSON.stringify(showcaseGroup.id)}.`,
      );
    }

    if (showcaseGroup.imagePosition !== expectedImagePosition) {
      throw new Error(
        `Calendar creator showcase group ${JSON.stringify(showcaseGroup.id)} must use imagePosition ${JSON.stringify(expectedImagePosition)} but received ${JSON.stringify(showcaseGroup.imagePosition)}.`,
      );
    }

    if (showcaseGroup.examples.length !== CALENDAR_CREATOR_SHOWCASE_EXAMPLE_COUNT) {
      throw new Error(
        `Calendar creator showcase group ${JSON.stringify(showcaseGroup.id)} expected exactly ${CALENDAR_CREATOR_SHOWCASE_EXAMPLE_COUNT} examples but received ${showcaseGroup.examples.length}.`,
      );
    }

    showcaseGroup.examples.forEach((showcaseExample, exampleIndex) => {
      if (sourcePaths.has(showcaseExample.src)) {
        throw new Error(
          `Calendar creator showcase example source ${JSON.stringify(showcaseExample.src)} is duplicated at group ${groupIndex}, example ${exampleIndex}.`,
        );
      }

      sourcePaths.add(showcaseExample.src);
    });
  });
}

function buildCalendarCreatorShowcaseLabel(label: string, groupTitle: string): string {
  return `${label}: ${groupTitle}`;
}

function renderCalendarCreatorShowcaseGroup(
  showcaseGroup: CalendarCreatorShowcaseGroup,
  copy: CalendarCreatorShowcaseCopy,
) {
  const carouselLabel = buildCalendarCreatorShowcaseLabel(copy.title, showcaseGroup.title);

  return (
    <article
      key={showcaseGroup.id}
      className={styles.showcaseGroup}
      data-calendar-showcase-group={showcaseGroup.id}
      data-image-position={showcaseGroup.imagePosition}
    >
      <header className={styles.showcaseGroupHeader}>
        <h3 className={styles.showcaseGroupTitle}>{showcaseGroup.title}</h3>
      </header>
      <div className={styles.showcaseCarousel}>
        <CalendarCreatorShowcaseCarousel
          group={showcaseGroup}
          ariaLabel={carouselLabel}
          previousLabel={buildCalendarCreatorShowcaseLabel(copy.previousLabel, showcaseGroup.title)}
          nextLabel={buildCalendarCreatorShowcaseLabel(copy.nextLabel, showcaseGroup.title)}
          openImageLabel={copy.openImageLabel}
          closeImageLabel={copy.closeImageLabel}
        />
      </div>
    </article>
  );
}

export function CalendarCreatorShowcase({ locale }: { locale: SiteLocale }) {
  const copy = getCalendarCreatorShowcaseCopy(locale);
  assertCalendarCreatorShowcaseShape(copy);

  return (
    <section
      id="calendar-creator-showcase"
      data-calendar-screen-only
      aria-labelledby="calendar-creator-showcase-title"
      className={styles.showcaseSection}
    >
      <div className={styles.showcaseInner}>
        <header className={styles.showcaseHeader}>
          <h2 id="calendar-creator-showcase-title" className={styles.showcaseTitle}>
            {copy.title}
          </h2>
          <p className={styles.showcaseDescription}>{copy.description}</p>
        </header>
        <div className={styles.showcaseGroups}>
          {copy.groups.map((showcaseGroup) => renderCalendarCreatorShowcaseGroup(showcaseGroup, copy))}
        </div>
      </div>
    </section>
  );
}
