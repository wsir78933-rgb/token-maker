import { MAP_MAKER_WORKSPACE_ID } from '@/lib/map-maker/constants';
import type { MapMakerCopy } from '@/lib/map-maker/copy';
import type { SiteLocale } from '@/lib/site-locale';

import { MapMakerHeroAction } from './MapMakerHeroAction';
import styles from './MapMakerHero.module.css';

export function MapMakerPageHeading({ copy, locale }: { copy: MapMakerCopy; locale: SiteLocale }) {
  return (
    <section
      aria-labelledby="map-maker-heading"
      className={styles.hero}
      data-locale={locale}
      data-testid="map-maker-page-heading"
    >
      <div className={styles.content}>
        <h1 id="map-maker-heading" className={`${styles.heading} ${styles.fadeIn}`}>
          <span className={styles.emphasisWrapper}>
            <span className={styles.emphasis}>{copy.heading}</span>
            <svg
              className={styles.underline}
              viewBox="0 0 170 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M2 9C32.8203 5.34032 108.769 -0.881146 166 3.51047"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                opacity="0.9"
              />
            </svg>
          </span>
        </h1>
        <p className={`${styles.description} ${styles.fadeIn} ${styles.fadeInDelayOne}`}>
          {copy.pageDescription}
        </p>
        <MapMakerHeroAction
          label={copy.heroAction}
          href={`#${MAP_MAKER_WORKSPACE_ID}`}
        />
      </div>
    </section>
  );
}
