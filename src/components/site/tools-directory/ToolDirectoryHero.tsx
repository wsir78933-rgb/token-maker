'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

import styles from './ToolDirectoryHero.module.css';

const ROTATION_INTERVAL_MS = 5_000;
const COMPACT_VIEWPORT_QUERY = '(max-width: 767px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

type ArtworkId = 'token-0' | 'greyforge' | 'greatblade' | 'astral-academy' | 'token-1';
type ArtworkKind = 'token' | 'heraldry' | 'weapon';
type ArtworkPositions = Record<ArtworkId, number>;

type Artwork = {
  id: ArtworkId;
  kind: ArtworkKind;
  path: string;
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
  altByLocale: Record<SiteLocale, string>;
  linkNameByLocale: Record<SiteLocale, string>;
};

type HeroCopy = {
  eyebrow: string;
  titleFirst: string;
  titleSecond: string;
  descriptionFirst: string;
  descriptionSecond: string;
  carouselLabel: string;
  artworkLinkSuffix: string;
};

const ARTWORKS: readonly Artwork[] = [
  {
    id: 'token-0',
    kind: 'token',
    path: '/',
    imageSrc: '/work-gallery/-CHRu5fo-1.webp',
    imageWidth: 768,
    imageHeight: 403,
    altByLocale: { zh: '奇幻角色 Token 成品 1', en: 'Fantasy character token artwork 1' },
    linkNameByLocale: { zh: 'Token 制作器作品 1', en: 'Token Maker artwork 1' },
  },
  {
    id: 'greyforge',
    kind: 'heraldry',
    path: '/coat-of-arms-maker',
    imageSrc: '/coat-assets/showcase/greyforge-guild.webp',
    imageWidth: 640,
    imageHeight: 640,
    altByLocale: { zh: '灰炉工会纹章成品', en: 'Greyforge guild coat of arms' },
    linkNameByLocale: { zh: '灰炉工会纹章作品', en: 'Greyforge guild artwork' },
  },
  {
    id: 'greatblade',
    kind: 'weapon',
    path: '/weapon-creator',
    imageSrc: '/weapon-creator/cases/01-warden-greatblade.png',
    imageWidth: 640,
    imageHeight: 508,
    altByLocale: { zh: '巨刃武器成品', en: 'Greatblade weapon artwork' },
    linkNameByLocale: { zh: '巨刃武器作品', en: 'Greatblade artwork' },
  },
  {
    id: 'astral-academy',
    kind: 'heraldry',
    path: '/coat-of-arms-maker',
    imageSrc: '/coat-assets/showcase/astral-academy.webp',
    imageWidth: 640,
    imageHeight: 640,
    altByLocale: { zh: '星界学院纹章成品', en: 'Astral academy coat of arms' },
    linkNameByLocale: { zh: '星界学院纹章作品', en: 'Astral academy artwork' },
  },
  {
    id: 'token-1',
    kind: 'token',
    path: '/',
    imageSrc: '/work-gallery/-H4obUacwq.webp',
    imageWidth: 768,
    imageHeight: 403,
    altByLocale: { zh: '奇幻角色 Token 成品 2', en: 'Fantasy character token artwork 2' },
    linkNameByLocale: { zh: 'Token 制作器作品 2', en: 'Token Maker artwork 2' },
  },
];

const INITIAL_ARTWORK_POSITIONS: ArtworkPositions = {
  'token-0': 2,
  greyforge: 3,
  greatblade: 4,
  'astral-academy': 0,
  'token-1': 1,
};

const HERO_COPY_BY_LOCALE: Record<SiteLocale, HeroCopy> = {
  zh: {
    eyebrow: 'Token Maker 工具合集',
    titleFirst: '免费的桌游与',
    titleSecond: '奇幻创作工具',
    descriptionFirst: '制作角色 Token、设计纹章与武器。',
    descriptionSecond: '为你的下一场冒险，找到顺手的工具。',
    carouselLabel: '精选工具作品轮播',
    artworkLinkSuffix: '，打开对应工具',
  },
  en: {
    eyebrow: 'Token Maker tools',
    titleFirst: 'Free tabletop &',
    titleSecond: 'fantasy creation tools',
    descriptionFirst: 'Make character tokens, heraldry, and weapons.',
    descriptionSecond: 'Find the right tool for your next adventure.',
    carouselLabel: 'Featured tool artwork carousel',
    artworkLinkSuffix: ', open the related tool',
  },
};

function getHeroCopy(locale: SiteLocale): HeroCopy {
  const heroCopy = HERO_COPY_BY_LOCALE[locale];
  if (!heroCopy) {
    throw new Error(`ToolDirectoryHero received unsupported locale: ${String(locale)}`);
  }

  return heroCopy;
}

function findArtworkAtPosition(positions: ArtworkPositions, targetPosition: number): ArtworkId {
  if (!Number.isInteger(targetPosition) || targetPosition < 0 || targetPosition >= ARTWORKS.length) {
    throw new Error(`ToolDirectoryHero received invalid target card position: ${targetPosition}`);
  }

  const artwork = ARTWORKS.find((candidate) => positions[candidate.id] === targetPosition);
  if (!artwork) {
    throw new Error(`ToolDirectoryHero has no artwork at card position ${targetPosition}`);
  }

  return artwork.id;
}

function rotateArtworkPositions(positions: ArtworkPositions): ArtworkPositions {
  const nextPositions = { ...positions };

  for (const artwork of ARTWORKS) {
    const currentPosition = positions[artwork.id];
    if (!Number.isInteger(currentPosition) || currentPosition < 0 || currentPosition >= ARTWORKS.length) {
      throw new Error(`ToolDirectoryHero received invalid position for ${artwork.id}: ${currentPosition}`);
    }

    nextPositions[artwork.id] = (currentPosition + ARTWORKS.length - 1) % ARTWORKS.length;
  }

  return nextPositions;
}

function getArtworkFrameClass(kind: ArtworkKind): string {
  if (kind === 'token') return styles.tokenFrame;
  if (kind === 'heraldry') return styles.heraldryFrame;
  if (kind === 'weapon') return styles.weaponFrame;

  throw new Error(`ToolDirectoryHero received unsupported artwork kind: ${String(kind)}`);
}

export function ToolDirectoryHero({ locale }: { locale: SiteLocale }) {
  const heroCopy = getHeroCopy(locale);
  const stageRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState(INITIAL_ARTWORK_POSITIONS);
  const [rotationCount, setRotationCount] = useState(0);
  const [returningArtworkId, setReturningArtworkId] = useState<ArtworkId | null>(null);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(false);
  const [isStageVisible, setIsStageVisible] = useState(false);
  const [isBrowserReady, setIsBrowserReady] = useState(false);
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [isFocusInside, setIsFocusInside] = useState(false);

  const isRotationPaused =
    !isBrowserReady ||
    isReducedMotion ||
    !isPageVisible ||
    !isStageVisible ||
    isPointerInside ||
    isFocusInside;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      throw new Error('ToolDirectoryHero could not find its artwork stage after mounting');
    }

    if (typeof window.matchMedia !== 'function' || typeof IntersectionObserver !== 'function') {
      return;
    }

    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const compactViewportQuery = window.matchMedia(COMPACT_VIEWPORT_QUERY);
    if (
      typeof reducedMotionQuery.addEventListener !== 'function' ||
      typeof reducedMotionQuery.removeEventListener !== 'function' ||
      typeof compactViewportQuery.addEventListener !== 'function' ||
      typeof compactViewportQuery.removeEventListener !== 'function'
    ) {
      return;
    }

    const updateReducedMotion = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsReducedMotion(event.matches);
      if (event.matches) setReturningArtworkId(null);
    };
    const updateCompactViewport = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsCompactViewport(event.matches);
      if (event.matches) {
        const focusedElement = document.activeElement;
        const focusedArtwork = focusedElement?.closest<HTMLElement>('[data-artwork-id]');
        if (focusedArtwork?.dataset.position === '0' || focusedArtwork?.dataset.position === '4') {
          stage.querySelector<HTMLAnchorElement>('[data-position="2"] a')?.focus({ preventScroll: true });
        }
      }
    };

    updateReducedMotion(reducedMotionQuery);
    updateCompactViewport(compactViewportQuery);
    reducedMotionQuery.addEventListener('change', updateReducedMotion);
    compactViewportQuery.addEventListener('change', updateCompactViewport);

    const visibilityObserver = new IntersectionObserver((entries) => {
      const stageEntry = entries.find((entry) => entry.target === stage);
      if (!stageEntry) {
        throw new Error('ToolDirectoryHero visibility observer returned no entry for its artwork stage');
      }

      setIsBrowserReady(true);
      setIsStageVisible(stageEntry.isIntersecting);
      if (!stageEntry.isIntersecting) setReturningArtworkId(null);
    });
    visibilityObserver.observe(stage);

    const updatePageVisibility = () => {
      const pageVisible = !document.hidden;
      setIsPageVisible(pageVisible);
      if (!pageVisible) setReturningArtworkId(null);
    };
    updatePageVisibility();
    document.addEventListener('visibilitychange', updatePageVisibility);

    return () => {
      visibilityObserver.disconnect();
      reducedMotionQuery.removeEventListener('change', updateReducedMotion);
      compactViewportQuery.removeEventListener('change', updateCompactViewport);
      document.removeEventListener('visibilitychange', updatePageVisibility);
    };
  }, []);

  useEffect(() => {
    if (isRotationPaused) return;

    const rotationTimer = window.setTimeout(() => {
      const returningId = findArtworkAtPosition(positions, 0);
      setReturningArtworkId(returningId);
      setPositions(rotateArtworkPositions);
      setRotationCount((previousCount) => previousCount + 1);
    }, ROTATION_INTERVAL_MS);

    return () => window.clearTimeout(rotationTimer);
  }, [isRotationPaused, positions]);

  function handlePointerEnter(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
      setIsPointerInside(true);
      setReturningArtworkId(null);
    }
  }

  function handleStageFocus() {
    setIsFocusInside(true);
    setReturningArtworkId(null);
  }

  function handleStageBlur(event: React.FocusEvent<HTMLDivElement>) {
    const nextFocusedElement = event.relatedTarget;
    if (nextFocusedElement instanceof Node && event.currentTarget.contains(nextFocusedElement)) return;

    setIsFocusInside(false);
  }

  function handleWrapAnimationEnd(event: React.AnimationEvent<HTMLLIElement>, artworkId: ArtworkId) {
    if (event.target === event.currentTarget && returningArtworkId === artworkId) {
      setReturningArtworkId(null);
    }
  }

  return (
    <section className={styles.hero} aria-labelledby="tool-directory-heading" data-testid="tool-directory-hero">
      <div className={styles.inner}>
        <div
          ref={stageRef}
          className={styles.stage}
          role="group"
          aria-label={heroCopy.carouselLabel}
          data-rotation={rotationCount}
          data-motion-paused={isRotationPaused}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={(event) => {
            if (event.pointerType === 'mouse' || event.pointerType === 'pen') setIsPointerInside(false);
          }}
          onFocus={handleStageFocus}
          onBlur={handleStageBlur}
        >
          <ul className={styles.artworkList} aria-label={heroCopy.carouselLabel}>
            {ARTWORKS.map((artwork) => {
              const position = positions[artwork.id];
              const isHiddenArtwork = isCompactViewport && (position === 0 || position === 4);
              const artworkName = artwork.linkNameByLocale[locale];

              return (
                <li
                  key={artwork.id}
                  className={`${styles.frame} ${getArtworkFrameClass(artwork.kind)}`}
                  data-artwork-id={artwork.id}
                  data-position={position}
                  data-returning={returningArtworkId === artwork.id}
                  aria-hidden={isHiddenArtwork || undefined}
                  onAnimationEnd={(event) => handleWrapAnimationEnd(event, artwork.id)}
                >
                  <Link
                    className={styles.artworkLink}
                    href={getLocalizedPath(locale, artwork.path)}
                    aria-label={`${artworkName}${heroCopy.artworkLinkSuffix}`}
                    tabIndex={isHiddenArtwork ? -1 : 0}
                  >
                    <Image
                      className={styles.artworkImage}
                      src={artwork.imageSrc}
                      alt={artwork.altByLocale[locale]}
                      width={artwork.imageWidth}
                      height={artwork.imageHeight}
                      preload={artwork.id === 'token-0'}
                      decoding="async"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

        </div>

        <div className={styles.copy}>
          <p className={styles.eyebrow}>{heroCopy.eyebrow}</p>
          <h1 className={styles.title} id="tool-directory-heading">
            <span>{heroCopy.titleFirst}</span>{' '}
            <span>{heroCopy.titleSecond}</span>
          </h1>
          <p className={styles.description}>
            <span>{heroCopy.descriptionFirst}</span>{' '}
            <span>{heroCopy.descriptionSecond}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
