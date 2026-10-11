'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
  type UIEvent,
} from 'react';
import { getHomeToolShowcase, type HomeToolShowcaseItem } from '@/lib/home-tool-showcase';
import type { SiteLocale } from '@/lib/site-locale';
import styles from './HomeToolShowcaseSection.module.css';

const HOME_TOOL_SHOWCASE_IMAGE_SIZES = '(max-width: 767px) 82vw, 240px';
const HOME_TOOL_SHOWCASE_PAGE_SIZE = 5;

function HomeToolShowcaseCard({
  item,
  previewImageLabel,
  onPreview,
}: {
  item: HomeToolShowcaseItem;
  previewImageLabel: string;
  onPreview: (item: HomeToolShowcaseItem, trigger: HTMLButtonElement) => void;
}) {
  const displayAspectRatio = item.displayAspectRatio;

  if (
    displayAspectRatio !== undefined &&
    (!Number.isFinite(displayAspectRatio) || displayAspectRatio <= 0)
  ) {
    throw new Error(
      `HomeToolShowcaseSection item ${item.id} has invalid displayAspectRatio=${displayAspectRatio}; expected a positive finite number.`,
    );
  }

  const imageClassName =
    displayAspectRatio === undefined
      ? styles.image
      : `${styles.image} ${styles.uniformAspectRatioImage}`;

  return (
    <li className={styles.gridItem}>
      <article className={styles.card}>
        <button
          aria-haspopup="dialog"
          aria-label={`${previewImageLabel}: ${item.toolName}`}
          className={styles.imageFrame}
          onClick={(event) => onPreview(item, event.currentTarget)}
          type="button"
        >
          <Image
            alt={item.imageAlt}
            className={imageClassName}
            decoding="async"
            height={item.imageHeight}
            loading="lazy"
            sizes={HOME_TOOL_SHOWCASE_IMAGE_SIZES}
            src={item.imageSrc}
            style={displayAspectRatio === undefined ? undefined : { aspectRatio: displayAspectRatio }}
            width={item.imageWidth}
          />
        </button>
        <HomeToolShowcaseToolLink item={item} />
      </article>
    </li>
  );
}

function HomeToolShowcaseToolLink({ item }: { item: HomeToolShowcaseItem }) {
  return (
    <h3 className={styles.toolHeading}>
      <Link className={styles.toolEntry} href={item.href}>
        {item.toolName}
      </Link>
    </h3>
  );
}

function HomeToolShowcaseImagePreview({
  item,
  closePreviewLabel,
  onClose,
  triggerRef,
}: {
  item: HomeToolShowcaseItem | null;
  closePreviewLabel: string;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog === null) {
      throw new Error('HomeToolShowcaseImagePreview dialog was null after mount.');
    }

    if (item === null) {
      triggerRef.current?.focus();
      return;
    }

    if (!dialog.open) {
      dialog.showModal();
    }

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      if (dialog.open) {
        dialog.close();
      }

      document.body.style.overflow = previousBodyOverflow;
    };
  }, [item, triggerRef]);

  function handleDialogClick(event: ReactMouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <dialog
      aria-labelledby={titleId}
      className={styles.previewDialog}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={handleDialogClick}
      ref={dialogRef}
    >
      {item === null ? null : (
        <div className={styles.previewContent}>
          <header className={styles.previewHeader}>
            <h2 className={styles.previewTitle} id={titleId}>
              {item.toolName}
            </h2>
            <button
              autoFocus
              className={styles.previewCloseButton}
              onClick={onClose}
              type="button"
            >
              {closePreviewLabel}
            </button>
          </header>
          <div className={styles.previewImageFrame}>
            <Image
              alt={item.imageAlt}
              className={styles.previewImage}
              decoding="async"
              height={item.imageHeight}
              sizes="(max-width: 1391px) 92vw, 1280px"
              src={item.imageSrc}
              width={item.imageWidth}
            />
          </div>
        </div>
      )}
    </dialog>
  );
}

function getFiveCardScrollStep(track: HTMLUListElement) {
  const firstCard = track.children.item(0);
  const sixthCard = track.children.item(HOME_TOOL_SHOWCASE_PAGE_SIZE);

  if (firstCard === null || sixthCard === null) {
    throw new Error(
      `HomeToolShowcaseSection needs at least ${HOME_TOOL_SHOWCASE_PAGE_SIZE + 1} cards to measure a page step; received ${track.children.length}.`,
    );
  }

  const step = sixthCard.getBoundingClientRect().left - firstCard.getBoundingClientRect().left;

  if (!Number.isFinite(step) || step <= 0) {
    throw new Error(`HomeToolShowcaseSection measured an invalid five-card scroll step: ${step}.`);
  }

  return step;
}

export function HomeToolShowcaseSection({ locale }: { locale: SiteLocale }) {
  const showcase = getHomeToolShowcase(locale);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const viewAllRef = useRef<HTMLAnchorElement>(null);
  const previewTriggerRef = useRef<HTMLButtonElement>(null);
  const [previewItem, setPreviewItem] = useState<HomeToolShowcaseItem | null>(null);
  const focusTargetRef = useRef<'next' | 'view' | null>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const syncGalleryState = useCallback((viewport: HTMLDivElement) => {
    const maxScrollLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const nextIsAtStart = viewport.scrollLeft <= 1;
    const nextIsAtEnd = maxScrollLeft <= 1 || viewport.scrollLeft >= maxScrollLeft - 1;

    if (nextIsAtEnd && nextButtonRef.current === document.activeElement) {
      focusTargetRef.current = 'view';
    } else if (!nextIsAtEnd && viewAllRef.current === document.activeElement) {
      focusTargetRef.current = 'next';
    }

    setIsAtStart(nextIsAtStart);
    setIsAtEnd(nextIsAtEnd);
  }, []);

  function handleGalleryScroll(event: UIEvent<HTMLDivElement>) {
    syncGalleryState(event.currentTarget);
  }

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (viewport === null) {
      throw new Error('HomeToolShowcaseSection gallery viewport was null after mount.');
    }

    if (track === null) {
      throw new Error('HomeToolShowcaseSection gallery track was null after mount.');
    }

    syncGalleryState(viewport);

    const resizeObserver = new ResizeObserver(() => {
      syncGalleryState(viewport);
    });

    resizeObserver.observe(viewport);
    resizeObserver.observe(track);

    return () => resizeObserver.disconnect();
  }, [syncGalleryState]);

  useEffect(() => {
    const focusTarget = focusTargetRef.current;

    if (focusTarget === 'view') {
      viewAllRef.current?.focus();
    } else if (focusTarget === 'next') {
      nextButtonRef.current?.focus();
    }

    focusTargetRef.current = null;
  }, [isAtEnd]);

  function scrollGallery(direction: 'previous' | 'next') {
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (viewport === null) {
      throw new Error(
        `HomeToolShowcaseSection ${direction} control cannot find its gallery viewport: received null.`,
      );
    }

    if (track === null) {
      throw new Error(
        `HomeToolShowcaseSection ${direction} control cannot find its gallery track: received null.`,
      );
    }

    const maxScrollLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const scrollStep = getFiveCardScrollStep(track);
    const scrollDelta = direction === 'next' ? scrollStep : -scrollStep;
    const left = Math.min(maxScrollLeft, Math.max(0, viewport.scrollLeft + scrollDelta));

    viewport.scrollTo({
      left,
      behavior: 'auto',
    });
  }

  function openImagePreview(item: HomeToolShowcaseItem, trigger: HTMLButtonElement) {
    previewTriggerRef.current = trigger;
    setPreviewItem(item);
  }

  function closeImagePreview() {
    setPreviewItem(null);
  }

  return (
    <section
      aria-labelledby="home-tool-showcase-title"
      className={styles.section}
      data-testid="home-tool-showcase"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title} id="home-tool-showcase-title">
            {showcase.title}
          </h2>
          <p className={styles.description}>{showcase.description}</p>
        </header>
        <div className={styles.gallery}>
          <button
            aria-controls="home-tool-showcase-viewport"
            aria-label={showcase.previousCasesLabel}
            className={styles.previousButton}
            disabled={isAtStart}
            onClick={() => scrollGallery('previous')}
            type="button"
          >
            <span aria-hidden="true">←</span>
          </button>
          <div
            aria-label={showcase.eyebrow}
            className={styles.viewport}
            id="home-tool-showcase-viewport"
            onScroll={handleGalleryScroll}
            ref={viewportRef}
            role="region"
            tabIndex={0}
          >
            <ul className={styles.track} ref={trackRef}>
              {showcase.items.map((item) => (
                <HomeToolShowcaseCard
                  item={item}
                  key={item.id}
                  onPreview={openImagePreview}
                  previewImageLabel={showcase.previewImageLabel}
                />
              ))}
            </ul>
          </div>
          {isAtEnd ? (
            <Link
              aria-label={showcase.viewAllLabel}
              className={styles.viewAll}
              href={showcase.allToolsHref}
              ref={viewAllRef}
            >
              View
            </Link>
          ) : (
            <button
              aria-controls="home-tool-showcase-viewport"
              aria-label={showcase.nextCasesLabel}
              className={styles.nextButton}
              onClick={() => scrollGallery('next')}
              ref={nextButtonRef}
              type="button"
            >
              <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </div>
      <HomeToolShowcaseImagePreview
        closePreviewLabel={showcase.closePreviewLabel}
        item={previewItem}
        onClose={closeImagePreview}
        triggerRef={previewTriggerRef}
      />
    </section>
  );
}
