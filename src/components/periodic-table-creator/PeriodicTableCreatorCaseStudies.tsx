'use client';

import Image from 'next/image';
import { IconArrowLeft, IconArrowRight, IconDownload, IconWand } from '@tabler/icons-react';
import { motion } from 'motion/react';
import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type KeyboardEvent,
} from 'react';

import {
  getPeriodicTableCaseAsset,
  loadPeriodicTableCaseDocument,
} from '@/lib/periodic-table-creator/case-studies';
import {
  getPeriodicTableCaseStudiesCopy,
  type PeriodicTableCaseGroupCopy,
  type PeriodicTableCaseStudiesCopy,
} from '@/lib/periodic-table-creator/case-studies-copy';
import type { SiteLocale } from '@/lib/site-locale';

import { usePeriodicTableCaseLoad } from './PeriodicTableCreatorCaseLoadProvider';
import styles from './PeriodicTableCreatorCaseStudies.module.css';

const PERIODIC_TABLE_CASE_GROUP_COUNT = 3;
const PERIODIC_TABLE_CASE_GROUP_EXAMPLE_COUNTS = [4, 5, 3] as const;
const PERIODIC_TABLE_CASE_GROUP_IMAGE_POSITIONS = ['left', 'right', 'left'] as const;
const PERIODIC_TABLE_CASE_AUTOPLAY_INTERVAL_MS = 5000;
const PERIODIC_TABLE_CASE_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

type PeriodicTableCaseNavigationDirection = 'previous' | 'next';
type PeriodicTableCasePreviewPosition = 'center' | 'left' | 'right' | 'hidden';
type PeriodicTableCaseLoadError = { caseId: string; message: string };

function assertPeriodicTableCaseStudiesShape(copy: PeriodicTableCaseStudiesCopy): void {
  if (copy.groups.length !== PERIODIC_TABLE_CASE_GROUP_COUNT) {
    throw new Error(
      `Periodic table case studies must contain exactly ${PERIODIC_TABLE_CASE_GROUP_COUNT} groups. Received length ${copy.groups.length}.`,
    );
  }

  if (!copy.caseLoaded.includes('{name}')) {
    throw new Error(
      `Periodic table case studies caseLoaded must contain the "{name}" placeholder. Received ${JSON.stringify(copy.caseLoaded)}.`,
    );
  }

  const caseIds = new Set<string>();

  copy.groups.forEach((caseGroup, groupIndex) => {
    const expectedExampleCount = PERIODIC_TABLE_CASE_GROUP_EXAMPLE_COUNTS[groupIndex];
    if (caseGroup.examples.length !== expectedExampleCount) {
      throw new Error(
        `Periodic table case group ${JSON.stringify(caseGroup.id)} must contain exactly ${expectedExampleCount} examples. Received length ${caseGroup.examples.length}.`,
      );
    }

    const expectedImagePosition = PERIODIC_TABLE_CASE_GROUP_IMAGE_POSITIONS[groupIndex];
    if (caseGroup.imagePosition !== expectedImagePosition) {
      throw new Error(
        `Periodic table case group ${JSON.stringify(caseGroup.id)} at index ${groupIndex} must use imagePosition ${JSON.stringify(expectedImagePosition)}. Received ${JSON.stringify(caseGroup.imagePosition)}.`,
      );
    }

    caseGroup.examples.forEach((example) => {
      if (caseIds.has(example.caseId)) {
        throw new Error(
          `Periodic table case studies caseId must be unique. Received duplicate ${JSON.stringify(example.caseId)}.`,
        );
      }

      caseIds.add(example.caseId);
    });
  });
}

function wrapPeriodicTableCaseIndex(index: number, count: number): number {
  if (!Number.isInteger(index)) {
    throw new Error(`Periodic table case index must be an integer. Received ${index}.`);
  }

  if (!Number.isInteger(count) || count < 1) {
    throw new Error(`Periodic table case count must be a positive integer. Received ${count}.`);
  }

  return ((index % count) + count) % count;
}

function getPeriodicTableCasePreviewPosition(
  exampleIndex: number,
  activeIndex: number,
  exampleCount: number,
  navigationDirection: PeriodicTableCaseNavigationDirection,
): PeriodicTableCasePreviewPosition {
  if (exampleIndex === activeIndex) {
    return 'center';
  }

  if (exampleCount === 2) {
    return navigationDirection === 'next' ? 'left' : 'right';
  }

  if (exampleIndex === wrapPeriodicTableCaseIndex(activeIndex + 1, exampleCount)) {
    return 'right';
  }

  if (exampleIndex === wrapPeriodicTableCaseIndex(activeIndex - 1, exampleCount)) {
    return 'left';
  }

  return 'hidden';
}

function getPeriodicTableCasePreviewTransform(position: PeriodicTableCasePreviewPosition): string | undefined {
  if (position === 'center') {
    return 'translate3d(-50%, -50%, 0) scale(1) rotateY(0deg)';
  }

  if (position === 'left') {
    return 'translate3d(-64%, -54%, 0) scale(0.85) rotateY(15deg)';
  }

  if (position === 'right') {
    return 'translate3d(-36%, -54%, 0) scale(0.85) rotateY(-15deg)';
  }

  return undefined;
}

function getPeriodicTableCaseReducedMotionSnapshot(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia(PERIODIC_TABLE_CASE_REDUCED_MOTION_QUERY).matches;
}

function getPeriodicTableCaseServerReducedMotionSnapshot(): boolean {
  return false;
}

function subscribeToPeriodicTableCaseReducedMotion(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => undefined;
  }

  const mediaQueryList = window.matchMedia(PERIODIC_TABLE_CASE_REDUCED_MOTION_QUERY);
  const handleMediaQueryChange = () => onStoreChange();

  mediaQueryList.addEventListener('change', handleMediaQueryChange);
  return () => mediaQueryList.removeEventListener('change', handleMediaQueryChange);
}

function usePeriodicTableCaseReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToPeriodicTableCaseReducedMotion,
    getPeriodicTableCaseReducedMotionSnapshot,
    getPeriodicTableCaseServerReducedMotionSnapshot,
  );
}

type PeriodicTableCaseQuoteSegment = {
  text: string;
  animate: boolean;
};

function isPeriodicTableCasePunctuation(text: string): boolean {
  return /^\p{P}+$/u.test(text);
}

function attachPeriodicTableCasePunctuation(
  segments: readonly PeriodicTableCaseQuoteSegment[],
): PeriodicTableCaseQuoteSegment[] {
  const mergedSegments: PeriodicTableCaseQuoteSegment[] = [];

  for (const segment of segments) {
    const previousSegment = mergedSegments[mergedSegments.length - 1];
    if (previousSegment?.animate && isPeriodicTableCasePunctuation(segment.text)) {
      mergedSegments[mergedSegments.length - 1] = {
        text: previousSegment.text + segment.text,
        animate: true,
      };
      continue;
    }

    mergedSegments.push(segment);
  }

  return mergedSegments;
}

function getSpacedPeriodicTableCaseQuoteSegments(quote: string): PeriodicTableCaseQuoteSegment[] {
  return quote
    .split(/(\s+)/u)
    .filter((segment) => segment.length > 0)
    .map((segment) => ({ text: segment, animate: !/^\s+$/u.test(segment) }));
}

function getIntlPeriodicTableCaseQuoteSegments(quote: string): PeriodicTableCaseQuoteSegment[] {
  if (typeof Intl.Segmenter !== 'function') {
    return attachPeriodicTableCasePunctuation(
      Array.from(quote, (character) => ({
        text: character,
        animate: !/\s/u.test(character) && !isPeriodicTableCasePunctuation(character),
      })),
    );
  }

  const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' });
  const segments = Array.from(segmenter.segment(quote), (segment) => ({
    text: segment.segment,
    animate: segment.isWordLike === true,
  }));

  if (segments.length === 0) {
    throw new Error(`Periodic table case quote produced no segments. Received ${JSON.stringify(quote)}.`);
  }

  return attachPeriodicTableCasePunctuation(segments);
}

function getPeriodicTableCaseQuoteSegments(quote: string): PeriodicTableCaseQuoteSegment[] {
  return /\p{Script=Han}/u.test(quote)
    ? getIntlPeriodicTableCaseQuoteSegments(quote)
    : getSpacedPeriodicTableCaseQuoteSegments(quote);
}

function PeriodicTableCaseQuote({
  quote,
  reducedMotion,
}: {
  quote: string;
  reducedMotion: boolean;
}) {
  const quoteSegments = getPeriodicTableCaseQuoteSegments(quote);

  return (
    <p aria-label={quote} className={styles.quote} data-part="periodic-table-case-quote">
      {quoteSegments.map((segment, segmentIndex) => {
        if (!segment.animate) {
          return segment.text;
        }

        const animatedSegmentIndex = quoteSegments
          .slice(0, segmentIndex)
          .filter((previousSegment) => previousSegment.animate).length;
        const delay = animatedSegmentIndex * 0.025;

        return (
          <motion.span
            key={`${segmentIndex}-${segment.text}-${reducedMotion ? 'reduced' : 'animated'}`}
            className={styles.quoteSegment}
            initial={reducedMotion ? false : { filter: 'blur(10px)', opacity: 0, y: 8 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={reducedMotion ? { duration: 0 } : { delay, duration: 0.28, ease: 'easeOut' }}
          >
            {segment.text}
          </motion.span>
        );
      })}
    </p>
  );
}

function PeriodicTableCaseStudyGroup({
  caseGroup,
  copy,
  loadingCaseId,
  loadError,
  onLoadCase,
}: {
  caseGroup: PeriodicTableCaseGroupCopy;
  copy: PeriodicTableCaseStudiesCopy;
  loadingCaseId: string | null;
  loadError: PeriodicTableCaseLoadError | null;
  onLoadCase: (caseId: string, name: string) => void;
}) {
  const reducedMotion = usePeriodicTableCaseReducedMotion();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [navigationDirection, setNavigationDirection] =
    useState<PeriodicTableCaseNavigationDirection>('next');
  const [autoplayStopped, setAutoplayStopped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const activeExample = caseGroup.examples[selectedIndex];
  if (activeExample === undefined) {
    throw new Error(
      `Periodic table case group ${JSON.stringify(caseGroup.id)} has no example at index ${selectedIndex}.`,
    );
  }

  const activeAsset = getPeriodicTableCaseAsset(activeExample.caseId);
  const groupHasLoadingCase = loadingCaseId !== null
    && caseGroup.examples.some((example) => example.caseId === loadingCaseId);
  const groupHasLoadError = loadError !== null && loadError.caseId === activeExample.caseId;

  const moveToCase = useCallback(
    (direction: PeriodicTableCaseNavigationDirection) => {
      setAutoplayStopped(true);
      setNavigationDirection(direction);
      setSelectedIndex((currentIndex) => {
        const step = direction === 'next' ? 1 : -1;
        return wrapPeriodicTableCaseIndex(currentIndex + step, caseGroup.examples.length);
      });
    },
    [caseGroup.examples.length],
  );

  useEffect(() => {
    if (
      reducedMotion
      || autoplayStopped
      || isHovered
      || isFocused
      || groupHasLoadingCase
      || caseGroup.examples.length < 2
    ) {
      return undefined;
    }

    const autoplayTimer = window.setInterval(() => {
      setNavigationDirection('next');
      setSelectedIndex((currentIndex) =>
        wrapPeriodicTableCaseIndex(currentIndex + 1, caseGroup.examples.length),
      );
    }, PERIODIC_TABLE_CASE_AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(autoplayTimer);
  }, [autoplayStopped, caseGroup.examples.length, groupHasLoadingCase, isFocused, isHovered, reducedMotion]);

  function handleCarouselKeyDown(event: KeyboardEvent<HTMLElement>): void {
    if (!(event.target instanceof Node) || !event.currentTarget.contains(event.target)) {
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveToCase('previous');
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveToCase('next');
    }
  }

  function handleCarouselFocus(): void {
    setIsFocused(true);
  }

  function handleCarouselBlur(event: FocusEvent<HTMLElement>): void {
    if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
      setIsFocused(false);
    }
  }

  const activePreviewCaseId = activeExample.caseId;

  return (
    <article
      aria-label={caseGroup.title}
      className={styles.group}
      data-image-position={caseGroup.imagePosition}
      data-periodic-table-case-group={caseGroup.id}
    >
      <div
        aria-label={`${caseGroup.title} — ${copy.useCase}`}
        aria-roledescription="carousel"
        aria-busy={groupHasLoadingCase}
        className={styles.carouselRegion}
        data-periodic-table-case-id={activePreviewCaseId}
        data-periodic-table-case-load-state={groupHasLoadingCase ? 'loading' : 'idle'}
        onBlur={handleCarouselBlur}
        onFocus={handleCarouselFocus}
        onKeyDown={handleCarouselKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="region"
        tabIndex={0}
      >
        <div className={styles.groupLayout} data-image-position={caseGroup.imagePosition}>
          <div className={styles.imageStage} data-part="periodic-table-case-image-stage">
            {caseGroup.examples.map((example, exampleIndex) => {
              const previewPosition = getPeriodicTableCasePreviewPosition(
                exampleIndex,
                selectedIndex,
                caseGroup.examples.length,
                navigationDirection,
              );
              const isActive = previewPosition === 'center';
              const isPreview = previewPosition === 'left' || previewPosition === 'right';
              const asset = getPeriodicTableCaseAsset(example.caseId);

              return (
                <div
                  key={example.caseId}
                  aria-hidden={!isActive}
                  className={styles.imageLayer}
                  data-case-preview-active={isActive ? example.caseId : undefined}
                  data-case-preview-position={previewPosition}
                  data-index={exampleIndex}
                  data-periodic-table-case-id={example.caseId}
                  style={{
                    opacity: isActive || isPreview ? 1 : 0,
                    pointerEvents: 'none',
                    transform: getPeriodicTableCasePreviewTransform(previewPosition),
                    transition: reducedMotion
                      ? 'none'
                      : 'transform 800ms cubic-bezier(.4,2,.3,1), opacity 800ms cubic-bezier(.4,2,.3,1)',
                    zIndex: isActive ? 3 : isPreview ? 2 : 1,
                  }}
                >
                  <div className={styles.imageFrame}>
                    <Image
                      alt={isActive ? example.alt : ''}
                      className={`${styles.previewImage} object-contain`}
                      data-image-fit="contain"
                      fill
                      loading={exampleIndex === 0 ? 'eager' : 'lazy'}
                      sizes="(max-width: 899px) calc(100vw - 2rem), 58vw"
                      src={asset.imageSrc}
                      unoptimized
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.copyPanel} data-part="periodic-table-case-copy">
            <p className={styles.groupEyebrow}>{caseGroup.title}</p>
            <p className={styles.groupDescription}>{caseGroup.description}</p>
            <motion.div
              key={`${activeExample.caseId}-${reducedMotion ? 'reduced' : 'animated'}`}
              animate={{ opacity: 1, y: 0 }}
              className={styles.activeCopy}
              initial={reducedMotion ? false : { opacity: 0, y: -8 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' }}
            >
              <h3 className={styles.caseName} data-part="periodic-table-case-name">
                {activeExample.name}
              </h3>
              <p className={styles.caseDesignation} data-part="periodic-table-case-designation">
                {activeExample.designation}
              </p>
              <PeriodicTableCaseQuote quote={activeExample.quote} reducedMotion={reducedMotion} />

              <div className={styles.actions}>
                <button
                  aria-label={`${activeExample.name}: ${copy.useCase}`}
                  className={styles.useButton}
                  disabled={loadingCaseId !== null}
                  onClick={() => onLoadCase(activeExample.caseId, activeExample.name)}
                  type="button"
                >
                  <IconWand aria-hidden="true" size={17} stroke={1.8} />
                  <span>{copy.useCase}</span>
                </button>
                <a
                  aria-label={`${activeExample.name}: ${copy.downloadTemplate}`}
                  className={styles.downloadButton}
                  download
                  href={activeAsset.templateSrc}
                >
                  <IconDownload aria-hidden="true" size={17} stroke={1.8} />
                  <span>{copy.downloadTemplate}</span>
                </a>
              </div>
            </motion.div>

            <div className={styles.statusStack} aria-live="polite">
              {groupHasLoadingCase ? <p className={styles.loadingStatus}>{copy.loadingCase}</p> : null}
              {groupHasLoadError && loadError !== null ? (
                <p className={styles.errorStatus} role="alert">
                  {loadError.message}
                </p>
              ) : null}
            </div>

            <div className={styles.navigation}>
              <button
                aria-label={`${copy.previousLabel} — ${caseGroup.title}`}
                className={styles.navigationButton}
                onClick={() => moveToCase('previous')}
                type="button"
              >
                <IconArrowLeft aria-hidden="true" size={20} stroke={1.8} />
              </button>
              <span className={styles.caseCounter} aria-hidden="true">
                {selectedIndex + 1} / {caseGroup.examples.length}
              </span>
              <button
                aria-label={`${copy.nextLabel} — ${caseGroup.title}`}
                className={styles.navigationButton}
                onClick={() => moveToCase('next')}
                type="button"
              >
                <IconArrowRight aria-hidden="true" size={20} stroke={1.8} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function PeriodicTableCreatorCaseStudies({ locale }: { locale: SiteLocale }) {
  const copy = getPeriodicTableCaseStudiesCopy(locale);
  const caseLoadContext = usePeriodicTableCaseLoad();
  const [loadingCaseId, setLoadingCaseId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<PeriodicTableCaseLoadError | null>(null);

  assertPeriodicTableCaseStudiesShape(copy);

  if (caseLoadContext === null) {
    throw new Error(
      'PeriodicTableCreatorCaseStudies requires PeriodicTableCreatorCaseLoadProvider. Wrap the case studies and workbench with the provider before rendering.',
    );
  }

  const handleLoadCase = useCallback(
    async (caseId: string, name: string): Promise<void> => {
      if (loadingCaseId !== null) {
        return;
      }

      setLoadingCaseId(caseId);
      setLoadError(null);

      try {
        const periodicTableDocument = await loadPeriodicTableCaseDocument(caseId);
        const statusMessage = copy.caseLoaded.replace('{name}', name);
        caseLoadContext.requestTable(periodicTableDocument, statusMessage);
      } catch (loadFailure: unknown) {
        if (!(loadFailure instanceof Error)) {
          throw loadFailure;
        }

        setLoadError({ caseId, message: loadFailure.message });
      } finally {
        setLoadingCaseId(null);
      }
    },
    [caseLoadContext, copy.caseLoaded, loadingCaseId],
  );

  return (
    <section
      id="periodic-table-creator-case-studies"
      aria-busy={loadingCaseId !== null}
      aria-labelledby="periodic-table-creator-case-studies-title"
      className={styles.section}
    >
      <header className={styles.header}>
        <h2 id="periodic-table-creator-case-studies-title" className={styles.sectionTitle}>
          {copy.title}
        </h2>
        <p className={styles.sectionDescription}>{copy.description}</p>
      </header>

      <div className={styles.groupList}>
        {copy.groups.map((caseGroup) => (
          <PeriodicTableCaseStudyGroup
            key={caseGroup.id}
            caseGroup={caseGroup}
            copy={copy}
            loadError={loadError}
            loadingCaseId={loadingCaseId}
            onLoadCase={handleLoadCase}
          />
        ))}
      </div>
    </section>
  );
}

export default PeriodicTableCreatorCaseStudies;
