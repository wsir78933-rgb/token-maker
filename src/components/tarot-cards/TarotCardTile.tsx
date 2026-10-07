'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';

import { TAROT_CARD_BACK_SRC } from '@/lib/tarot-cards/cards';
import { getTarotCopy } from '@/lib/tarot-cards/copy';
import { TAROT_CARD_FLIP_DURATION_MS } from '@/lib/tarot-cards/constants';
import type {
  TarotCard,
  TarotDealtCard,
  TarotLocale,
  TarotSpreadPosition,
} from '@/lib/tarot-cards/types';
import { cn } from '@/lib/utils';

import motion from './TarotCardMotion.module.css';

export interface TarotCardTileProps {
  locale: TarotLocale;
  card: TarotCard;
  dealtCard: TarotDealtCard;
  position: TarotSpreadPosition;
  onSelect: (position: number) => void;
  selected?: boolean;
  size?: 'single' | 'spread' | 'mobile' | 'preview';
  captionPlacement?: TarotCardCaptionPlacement;
  dealEffectsActive?: boolean;
  dealDelayMs?: number;
  className?: string;
  style?: CSSProperties;
}

export type TarotCardCaptionPlacement = 'below' | 'above';

interface TarotMotionStyle extends CSSProperties {
  '--tarot-deal-delay'?: string;
  '--tarot-flip-duration'?: string;
}

interface TarotCardFaceProps {
  face: 'back' | 'front';
  imageSrc: string;
  imageAlt: string;
  isHorizontal: boolean;
  imageRotation: number;
  imageRotationClass: string | undefined;
  size: TarotCardTileProps['size'];
  hidden: boolean;
}

const MAX_DEAL_DELAY_MS = 240;

function assertCardTileInput({
  card,
  dealtCard,
  position,
}: Pick<TarotCardTileProps, 'card' | 'dealtCard' | 'position'>): void {
  if (card.id !== dealtCard.cardId) {
    throw new Error(
      `Tarot card tile card id ${JSON.stringify(card.id)} does not match dealt card id ${JSON.stringify(dealtCard.cardId)}.`,
    );
  }

  if (position.number !== dealtCard.position) {
    throw new Error(
      `Tarot card tile position ${position.number} does not match dealt card position ${dealtCard.position}.`,
    );
  }

  if (!Number.isInteger(position.number) || position.number < 1) {
    throw new RangeError(
      `Tarot card tile position must be a positive integer; received ${JSON.stringify(position.number)}.`,
    );
  }
}

function cardSizeClass(size: TarotCardTileProps['size']): string {
  if (size === 'single') return 'w-[min(250px,100%)]';
  if (size === 'spread') return 'w-full';
  if (size === 'mobile') return 'w-full';
  return 'w-full';
}

function cardImageSizes(size: TarotCardTileProps['size']): string {
  if (size === 'single') return '(max-width: 639px) 250px, 250px';
  if (size === 'mobile') return '(max-width: 1023px) 30vw, 120px';
  if (size === 'preview') return '(max-width: 639px) 120px, 160px';
  return '(max-width: 1279px) 12vw, 112px';
}

function localizedCardLabel(
  locale: TarotLocale,
  card: TarotCard,
  position: TarotSpreadPosition,
  dealtCard: TarotDealtCard,
): string {
  const englishCopy = getTarotCopy('en');
  const chineseCopy = getTarotCopy('zh');
  const positionLabel = `${position.number} ${position.label.en} / ${position.label.zh}`;
  if (!dealtCard.revealed) {
    return `${englishCopy.labels.unrevealed} / ${chineseCopy.labels.unrevealed} · ${positionLabel}`;
  }

  const polarity = dealtCard.reversed
    ? `${englishCopy.labels.reversed} / ${chineseCopy.labels.reversed}`
    : `${englishCopy.labels.upright} / ${chineseCopy.labels.upright}`;
  const horizontal = position.fixedRotationDeg === 90
    ? ` · ${englishCopy.labels.horizontal} / ${chineseCopy.labels.horizontal}`
    : '';

  const localizedName = `${card.name[locale]} / ${card.name[locale === 'en' ? 'zh' : 'en']}`;
  const cardLabel = `${englishCopy.labels.cardName} / ${chineseCopy.labels.cardName}`;
  const positionLabelCopy = `${englishCopy.labels.position} / ${chineseCopy.labels.position}`;
  return `${cardLabel}: ${localizedName} · ${positionLabelCopy}: ${positionLabel} · ${polarity}${horizontal}`;
}

function cardCaption(
  locale: TarotLocale,
  card: TarotCard,
  dealtCard: TarotDealtCard,
  copy: ReturnType<typeof getTarotCopy>,
): string {
  if (!dealtCard.revealed) return copy.labels.unrevealed;

  const name = card.name[locale];
  const polarity = dealtCard.reversed ? copy.labels.reversed : copy.labels.upright;
  return `${name} · ${polarity}`;
}

function captionClassName(captionPlacement: TarotCardCaptionPlacement): string {
  const baseClassName = 'w-full min-w-0 px-0.5 text-[0.68rem] leading-tight text-stone-400';
  if (captionPlacement === 'above') {
    return `${baseClassName} @xl:absolute @xl:bottom-full @xl:mb-3 @xl:px-0`;
  }

  return baseClassName;
}

function assertDealDelayMs(dealDelayMs: number): void {
  if (!Number.isFinite(dealDelayMs) || dealDelayMs < 0 || dealDelayMs > MAX_DEAL_DELAY_MS) {
    throw new RangeError(
      `Tarot card tile dealDelayMs must be between 0 and ${MAX_DEAL_DELAY_MS}; received ${String(dealDelayMs)}.`,
    );
  }
}

function TarotCardFace({
  face,
  imageSrc,
  imageAlt,
  isHorizontal,
  imageRotation,
  imageRotationClass,
  size,
  hidden,
}: TarotCardFaceProps) {
  const faceImageRotation = face === 'back' ? (isHorizontal ? 90 : 0) : imageRotation;
  const faceImageRotationClass = face === 'back'
    ? isHorizontal
      ? 'rotate-90'
      : undefined
    : imageRotationClass;

  return (
    <span className={cn(motion.cardFace, face === 'front' ? motion.cardFront : motion.cardBack)} aria-hidden={hidden}>
      <span
        className={cn(
          'relative block origin-center',
          isHorizontal ? 'h-[150%] w-[66.6667%]' : 'h-full w-full',
          faceImageRotationClass,
        )}
        style={faceImageRotationClass === undefined && faceImageRotation !== 0
          ? { transform: `rotate(${faceImageRotation}deg)` }
          : undefined}
        data-card-image-frame={isHorizontal ? 'portrait-rotated' : 'portrait'}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes={cardImageSizes(size)}
          className="object-contain"
          unoptimized
        />
      </span>
    </span>
  );
}

export function TarotCardTile({
  locale,
  card,
  dealtCard,
  position,
  onSelect,
  selected = false,
  size = 'spread',
  captionPlacement = 'below',
  dealEffectsActive = false,
  dealDelayMs = 0,
  className,
  style,
}: TarotCardTileProps) {
  assertCardTileInput({ card, dealtCard, position });

  if (typeof onSelect !== 'function') {
    throw new TypeError(`Tarot card tile onSelect must be a function; received ${typeof onSelect}.`);
  }

  if (typeof dealEffectsActive !== 'boolean') {
    throw new TypeError(
      `Tarot card tile dealEffectsActive must be a boolean; received ${typeof dealEffectsActive}.`,
    );
  }
  assertDealDelayMs(dealDelayMs);

  const copy = getTarotCopy(locale);
  const isHorizontal = position.fixedRotationDeg === 90;
  const imageRotation = (isHorizontal ? 90 : 0) + (dealtCard.reversed ? 180 : 0);
  const imageRotationClass = imageRotation === 90
    ? 'rotate-90'
    : imageRotation === 180
      ? 'rotate-180'
      : undefined;
  const imageAlt = localizedCardLabel(locale, card, position, dealtCard);
  const motionStyle: TarotMotionStyle = {
    ...style,
    '--tarot-deal-delay': `${dealDelayMs}ms`,
    '--tarot-flip-duration': `${TAROT_CARD_FLIP_DURATION_MS}ms`,
  };

  return (
    <figure
      className={cn(
        'relative m-0 flex min-w-0 flex-col items-center gap-1.5 text-center',
        cardSizeClass(size),
        dealEffectsActive && motion.dealEntry,
        className,
      )}
      style={motionStyle}
      data-card-position={position.number}
      data-card-revealed={dealtCard.revealed ? 'true' : 'false'}
      data-card-rotation={imageRotation}
      data-deal-effect={dealEffectsActive ? 'active' : 'idle'}
      data-deal-delay-ms={dealDelayMs}
    >
      <button
        type="button"
        aria-label={imageAlt}
        aria-pressed={selected}
        onClick={() => onSelect(position.number)}
        className={cn(
          'relative block min-h-11 min-w-11 w-full overflow-visible rounded-xl border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] p-1 shadow-[var(--site-card-shadow)] transition duration-200',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--site-accent-strong)]',
          'hover:-translate-y-0.5 hover:border-[var(--site-accent-strong)] hover:shadow-[var(--site-card-shadow-hover)] active:translate-y-0',
          isHorizontal ? 'aspect-[3/2]' : 'aspect-[2/3]',
          selected
            ? 'border-[var(--site-accent-strong)] ring-2 ring-[var(--site-accent-strong)] ring-offset-2 ring-offset-[var(--site-panel-deep)]'
            : 'border-[var(--site-border-soft)]',
        )}
        data-selected={selected ? 'true' : 'false'}
      >
        <span className={motion.motionStage}>
          <span
            className={cn(motion.flipShell, dealtCard.revealed && motion.flipShellRevealed)}
            data-card-flip-state={dealtCard.revealed ? 'revealed' : 'hidden'}
          >
            <TarotCardFace
              face="front"
              imageSrc={card.imageSrc}
              imageAlt={dealtCard.revealed ? imageAlt : ''}
              isHorizontal={isHorizontal}
              imageRotation={imageRotation}
              imageRotationClass={imageRotationClass}
              size={size}
              hidden={!dealtCard.revealed}
            />
            <TarotCardFace
              face="back"
              imageSrc={TAROT_CARD_BACK_SRC}
              imageAlt={dealtCard.revealed ? '' : imageAlt}
              isHorizontal={isHorizontal}
              imageRotation={imageRotation}
              imageRotationClass={imageRotationClass}
              size={size}
              hidden={dealtCard.revealed}
            />
          </span>
        </span>

        {dealEffectsActive ? (
          <span className={motion.dealOverlay} aria-hidden="true">
            <span className={motion.dealRune} />
            <span className={motion.dealSpark} />
          </span>
        ) : null}

        <span
          aria-hidden="true"
          className="absolute left-1 top-1 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full border border-[var(--site-border-strong)] bg-[var(--site-panel-deep)] px-1.5 text-[0.65rem] font-semibold tabular-nums text-[var(--site-accent-strong)]"
        >
          {String(position.number).padStart(2, '0')}
        </span>
      </button>

      <figcaption className={captionClassName(captionPlacement)}>
        <span className="block truncate text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-stone-500">
          {String(position.number).padStart(2, '0')}
        </span>
        <span className="block min-h-[1.65rem] break-words text-stone-200">
          {cardCaption(locale, card, dealtCard, copy)}
        </span>
      </figcaption>
    </figure>
  );
}
