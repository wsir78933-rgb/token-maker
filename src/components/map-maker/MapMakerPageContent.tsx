import { Faq1 } from '@/components/armor-creator/Faq1';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Download,
  Layers,
  Save,
  Shuffle,
  Type,
  Waves,
  type LucideIcon,
} from 'lucide-react';
import { MAP_MAKER_WORKSPACE_ID } from '@/lib/map-maker/constants';
import type { MapMakerFeatureIcon, MapMakerPageCopy } from '@/lib/map-maker/page-copy';

import { MapMakerShowcase } from './MapMakerShowcase';
import styles from './MapMakerContent.module.css';

const INTRODUCTION_HEADING_ID = 'map-maker-introduction-heading';
const FEATURES_HEADING_ID = 'map-maker-features-heading';
const COMPARISON_HEADING_ID = 'map-maker-comparison-heading';
const HOW_IT_WORKS_HEADING_ID = 'map-maker-how-it-works-heading';
const CALL_TO_ACTION_HEADING_ID = 'map-maker-call-to-action-heading';

function getMapMakerFeatureIcon(iconName: MapMakerFeatureIcon): LucideIcon {
  switch (iconName) {
    case 'coastline':
      return Waves;
    case 'random':
      return Shuffle;
    case 'elements':
      return Layers;
    case 'labels':
      return Type;
    case 'saves':
      return Save;
    case 'export':
      return Download;
    default:
      throw new Error(`Unknown map maker feature icon: ${JSON.stringify(iconName)}.`);
  }
}

function MapMakerIntroduction({ copy }: { copy: MapMakerPageCopy['whatIs'] }) {
  return (
    <section
      aria-labelledby={INTRODUCTION_HEADING_ID}
      className={styles.section}
      data-testid="map-maker-introduction"
    >
      <h2 id={INTRODUCTION_HEADING_ID} className={`${styles.compactHeading} font-display`}>
        {copy.title}
      </h2>
      <p className={`${styles.bodyCopy} ${styles.introductionDescription}`}>{copy.description}</p>
    </section>
  );
}

function MapMakerFeatures({ copy }: { copy: MapMakerPageCopy['features'] }) {
  if (copy.items.length !== 6) {
    throw new Error(`Map maker features must contain 6 items. Received ${copy.items.length}.`);
  }

  return (
    <section
      aria-labelledby={FEATURES_HEADING_ID}
      className={styles.section}
      data-testid="map-maker-features"
    >
      <header className={styles.featuresHeader}>
        <h2 id={FEATURES_HEADING_ID} className={`${styles.sectionHeading} ${styles.featureHeading} font-display`}>
          {copy.title}
        </h2>
        <p className={styles.bodyCopy}>{copy.description}</p>
      </header>
      <ul className={styles.featureGrid}>
        {copy.items.map((item) => {
          const FeatureIcon = getMapMakerFeatureIcon(item.icon);

          return (
            <li className={styles.featureCard} key={item.icon}>
              <span className={styles.featureIcon}>
                <FeatureIcon aria-hidden="true" className={styles.featureIconSvg} />
              </span>
              <div className={styles.featureText}>
                <h3 className={styles.featureTitle}>{item.title}</h3>
                <p className={styles.featureDescription}>{item.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function MapMakerComparison({ copy }: { copy: MapMakerPageCopy['comparison'] }) {
  if (copy.rows.length !== 5) {
    throw new Error(`Map maker comparison must contain 5 rows. Received ${copy.rows.length}.`);
  }

  return (
    <section
      aria-labelledby={COMPARISON_HEADING_ID}
      className={styles.section}
      data-testid="map-maker-comparison"
    >
      <header className={styles.comparisonHeader}>
        <h2 id={COMPARISON_HEADING_ID} className={`${styles.sectionHeading} font-display`}>
          {copy.title}
        </h2>
        <p className={styles.bodyCopy}>{copy.description}</p>
      </header>
      <div
        aria-label={copy.tableLabel}
        className={styles.comparisonTableRegion}
        role="region"
        tabIndex={0}
      >
        <table className={styles.comparisonTable}>
          <caption className={styles.visuallyHidden}>{copy.tableLabel}</caption>
          <colgroup>
            <col className={styles.dimensionColumn} />
            <col className={styles.mapMakerColumn} />
            <col className={styles.comparisonColumn} />
            <col className={styles.comparisonColumn} />
          </colgroup>
          <thead>
            <tr>
              <th className={styles.dimensionHeader} scope="col">
                {copy.dimensionHeading}
              </th>
              <th className={`${styles.comparisonHeaderCell} ${styles.mapMakerHeader}`} scope="col">
                {copy.mapMakerHeading}
              </th>
              <th className={styles.comparisonHeaderCell} scope="col">
                {copy.photoshopHeading}
              </th>
              <th className={styles.comparisonHeaderCell} scope="col">
                {copy.illustratorHeading}
              </th>
            </tr>
          </thead>
          <tbody>
            {copy.rows.map((row) => (
              <tr className={styles.comparisonRow} key={row.dimension}>
                <th className={styles.dimensionCell} scope="row">
                  {row.dimension}
                </th>
                <td className={`${styles.comparisonCell} ${styles.mapMakerCell}`}>{row.mapMaker}</td>
                <td className={styles.comparisonCell}>{row.photoshop}</td>
                <td className={styles.comparisonCell}>{row.illustrator}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MapMakerHowItWorks({ copy }: { copy: MapMakerPageCopy['howItWorks'] }) {
  if (copy.steps.length !== 3) {
    throw new Error(`Map maker how-it-works section must contain 3 steps. Received ${copy.steps.length}.`);
  }

  return (
    <section
      aria-labelledby={HOW_IT_WORKS_HEADING_ID}
      className={styles.section}
      data-testid="map-maker-how-it-works"
    >
      <header className={styles.howItWorksHeader}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 id={HOW_IT_WORKS_HEADING_ID} className={`${styles.sectionHeading} font-display`}>
          {copy.title}
        </h2>
      </header>
      <ol className={styles.stepList}>
        {copy.steps.map((step, index) => (
          <li className={styles.step} key={step.title}>
            <span className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</span>
            <div className={styles.stepText}>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
            {index < copy.steps.length - 1 ? (
              <ArrowRight aria-hidden="true" className={styles.mobileStepArrow} />
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

function MapMakerCallToAction({ copy }: { copy: MapMakerPageCopy['callToAction'] }) {
  return (
    <section
      aria-labelledby={CALL_TO_ACTION_HEADING_ID}
      className={`${styles.section} ${styles.callToAction}`}
      data-testid="map-maker-call-to-action"
    >
      <h2 id={CALL_TO_ACTION_HEADING_ID} className={`${styles.compactHeading} font-display`}>
        {copy.title}
      </h2>
      <p className={`${styles.bodyCopy} ${styles.callToActionDescription}`}>{copy.description}</p>
      <Button
        size="lg"
        className={styles.callToActionButton}
        role="link"
        nativeButton={false}
        render={<a href={`#${MAP_MAKER_WORKSPACE_ID}`} />}
      >
        {copy.label}
        <ArrowRight aria-hidden="true" className={styles.callToActionIcon} />
      </Button>
    </section>
  );
}

function MapMakerFaq({ copy }: { copy: MapMakerPageCopy['faq'] }) {
  if (copy.items.length !== 5) {
    throw new Error(`Map maker FAQ must contain 5 items. Received ${copy.items.length}.`);
  }

  return (
    <Faq1
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      items={copy.items}
      className="map-maker-faq"
    />
  );
}

export function MapMakerPageContent({ copy }: { copy: MapMakerPageCopy }) {
  return (
    <div className={styles.pageContent} data-testid="map-maker-page-content">
      <MapMakerIntroduction copy={copy.whatIs} />
      <MapMakerShowcase copy={copy.showcase} />
      <MapMakerFeatures copy={copy.features} />
      <MapMakerComparison copy={copy.comparison} />
      <MapMakerHowItWorks copy={copy.howItWorks} />
      <MapMakerCallToAction copy={copy.callToAction} />
      <MapMakerFaq copy={copy.faq} />
    </div>
  );
}
