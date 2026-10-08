import {
  ArrowRight,
  CalendarDays,
  Moon,
  NotebookPen,
  Printer,
  Save,
  TriangleAlert,
} from 'lucide-react';

import type { CalendarCreatorPageCopy } from '@/lib/calendar-creator/page-copy';
import type { SiteLocale } from '@/lib/site-locale';

import { CalendarCreatorFaq } from './CalendarCreatorFaq';
import { CalendarCreatorShowcase } from './CalendarCreatorShowcase';
import styles from './CalendarCreatorPageView.module.css';

const CALENDAR_CREATOR_FEATURE_ICONS = [
  CalendarDays,
  Moon,
  TriangleAlert,
  NotebookPen,
  Save,
  Printer,
] as const;

function renderWhatIsSection(copy: CalendarCreatorPageCopy['whatIs']) {
  return (
    <section
      id="calendar-creator-what-is"
      data-calendar-screen-only
      aria-labelledby="calendar-creator-what-is-title"
      className={`${styles.contentSection} ${styles.whatIsSection}`}
    >
      <div className={styles.sectionInner}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>{copy.eyebrow}</p>
          <h2 id="calendar-creator-what-is-title" className={styles.sectionTitle}>
            {copy.title}
          </h2>
        </div>
        <div className={styles.whatIsLayout}>
          <div className={styles.paragraphStack}>
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ul className={styles.audienceList}>
            {copy.audiences.map((audience) => (
              <li key={audience.title} className={styles.audienceItem}>
                <h3>{audience.title}</h3>
                <p>{audience.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function renderFeaturesSection(copy: CalendarCreatorPageCopy['features']) {
  const expectedFeatureCount = CALENDAR_CREATOR_FEATURE_ICONS.length;

  if (copy.items.length !== expectedFeatureCount) {
    throw new Error(
      `Calendar creator features expected exactly ${expectedFeatureCount} items but received ${copy.items.length}.`,
    );
  }

  return (
    <section
      id="calendar-creator-features"
      data-calendar-screen-only
      aria-labelledby="calendar-creator-features-title"
      className={`${styles.contentSection} ${styles.featuresSection}`}
    >
      <div className={styles.sectionInner}>
        <header className={styles.sectionHeader}>
          <h2 id="calendar-creator-features-title" className={styles.sectionTitle}>
            {copy.title}
          </h2>
          <p className={styles.sectionDescription}>{copy.description}</p>
        </header>
        <ul className={styles.featureGrid}>
          {copy.items.map((feature, featureIndex) => {
            const FeatureIcon = CALENDAR_CREATOR_FEATURE_ICONS[featureIndex];

            if (FeatureIcon === undefined) {
              throw new Error(
                `Missing calendar creator feature icon at index ${featureIndex} for ${JSON.stringify(feature.title)}.`,
              );
            }

            return (
              <li key={feature.title} className={styles.featureItem}>
                <article className={styles.featureCard}>
                  <div className={styles.featureIconBox} aria-hidden="true">
                    <FeatureIcon className={styles.featureIcon} aria-hidden="true" />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function renderHowItWorksSection(copy: CalendarCreatorPageCopy['howItWorks']) {
  const expectedStepCount = 3;

  if (copy.steps.length !== expectedStepCount) {
    throw new Error(
      `Calendar creator how-it-works expected exactly ${expectedStepCount} steps but received ${copy.steps.length}.`,
    );
  }

  return (
    <section
      id="calendar-creator-how-it-works"
      data-calendar-screen-only
      aria-labelledby="calendar-creator-how-it-works-title"
      className={`${styles.contentSection} ${styles.howItWorksSection}`}
    >
      <div className={styles.sectionInner}>
        <header className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>{copy.eyebrow}</p>
          <h2 id="calendar-creator-how-it-works-title" className={styles.sectionTitle}>
            {copy.title}
          </h2>
        </header>
        <ol className={styles.stepList}>
          {copy.steps.map((step, stepIndex) => (
            <li key={step.title} className={styles.stepItem}>
              <span className={styles.stepNumber} aria-hidden="true">
                {String(stepIndex + 1).padStart(2, '0')}
              </span>
              <div className={styles.stepContent}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              {stepIndex < copy.steps.length - 1 ? (
                <ArrowRight className={styles.stepArrow} aria-hidden="true" />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function renderComparisonTable(copy: CalendarCreatorPageCopy['comparison']) {
  const comparisonHeaders = [
    { key: 'tokenMaker', label: copy.tokenMakerLabel },
    { key: 'rollForFantasy', label: copy.rollForFantasyLabel },
    { key: 'spreadsheet', label: copy.spreadsheetLabel },
  ] as const;

  return (
    <table className={styles.comparisonTable}>
      <caption className="sr-only">{copy.tableLabel}</caption>
      <thead>
        <tr>
          <th scope="col">{copy.criterionLabel}</th>
          {comparisonHeaders.map((header) => (
            <th scope="col" key={header.key}>
              {header.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {copy.rows.map((row) => (
          <tr key={row.label}>
            <th scope="row">{row.label}</th>
            {comparisonHeaders.map((header) => (
              <td key={`${row.label}-${header.key}`} data-label={header.label}>
                {row[header.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function renderComparisonSection(copy: CalendarCreatorPageCopy['comparison']) {
  return (
    <section
      id="calendar-creator-comparison"
      data-calendar-screen-only
      aria-labelledby="calendar-creator-comparison-title"
      className={`${styles.contentSection} ${styles.comparisonSection}`}
    >
      <div className={styles.sectionInner}>
        <header className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>{copy.eyebrow}</p>
          <h2 id="calendar-creator-comparison-title" className={styles.sectionTitle}>
            {copy.title}
          </h2>
          <p className={styles.sectionDescription}>{copy.description}</p>
        </header>
        <div className={styles.comparisonFrame} role="region" aria-label={copy.tableLabel}>
          {renderComparisonTable(copy)}
        </div>
      </div>
    </section>
  );
}

function renderCtaSection(copy: CalendarCreatorPageCopy['cta']) {
  return (
    <section
      id="calendar-creator-cta"
      data-calendar-screen-only
      aria-labelledby="calendar-creator-cta-title"
      className={`${styles.contentSection} ${styles.ctaSection}`}
    >
      <div className={`${styles.sectionInner} ${styles.ctaInner}`}>
        <div>
          <p className={styles.sectionEyebrow}>{copy.eyebrow}</p>
          <h2 id="calendar-creator-cta-title" className={styles.sectionTitle}>
            {copy.title}
          </h2>
          <p className={styles.ctaDescription}>{copy.description}</p>
        </div>
        <a href="#calendar-creator-workspace" className={styles.ctaButton}>
          {copy.buttonLabel}
        </a>
      </div>
    </section>
  );
}

export function CalendarCreatorContentSections({
  copy,
  locale,
}: {
  copy: CalendarCreatorPageCopy;
  locale: SiteLocale;
}) {
  return (
    <>
      {renderWhatIsSection(copy.whatIs)}
      <CalendarCreatorShowcase locale={locale} />
      {renderFeaturesSection(copy.features)}
      {renderComparisonSection(copy.comparison)}
      {renderHowItWorksSection(copy.howItWorks)}
      {renderCtaSection(copy.cta)}
      <CalendarCreatorFaq copy={copy.faq} />
    </>
  );
}
