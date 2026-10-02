'use client';

import Image from 'next/image';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

const AUTOPLAY_MS = 5000;
const IMAGE_EASE: [number, number, number, number] = [0.4, 2, 0.3, 1];
const COLOR_FIELDS = [
  'name',
  'designation',
  'testimony',
  'arrowBackground',
  'arrowForeground',
  'arrowHoverBackground',
] as const;
const FONT_SIZE_FIELDS = ['name', 'designation', 'quote'] as const;

type ColorField = (typeof COLOR_FIELDS)[number];
type FontSizeField = (typeof FONT_SIZE_FIELDS)[number];
type ArrowStyle = CSSProperties & { '--circular-testimonial-arrow-hover-background': string };
type QuotePart = { text: string; animate: boolean; delay: number };
type ImagePose = { x: number; y: number; scale: number; rotateY: number; opacity: number; zIndex: number };

export type CircularTestimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

export type CircularTestimonialsProps = {
  testimonials: readonly CircularTestimonial[];
  ariaLabel: string;
  previousLabel: string;
  nextLabel: string;
  autoplay?: boolean;
  imageOnLeft?: boolean;
  colors?: Partial<Record<ColorField, string>>;
  fontSizes?: Partial<Record<FontSizeField, string>>;
};

const DEFAULT_COLORS: Record<ColorField, string> = {
  name: '#fafaf9',
  designation: '#a8a29e',
  testimony: '#d6d3d1',
  arrowBackground: '#292524',
  arrowForeground: '#fafaf9',
  arrowHoverBackground: '#44403c',
};

const DEFAULT_FONT_SIZES: Record<FontSizeField, string> = {
  name: '1.5rem',
  designation: '0.925rem',
  quote: '1.125rem',
};

function describeValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }
  if (typeof value === 'symbol' || typeof value === 'function') {
    return String(value);
  }
  if (value === null) {
    return 'null';
  }
  if (value === undefined) {
    return 'undefined';
  }
  return Object.prototype.toString.call(value);
}

function requireText(value: unknown, field: string): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  throw new Error(
    `CircularTestimonials ${field} must be a non-empty string. Received ${describeValue(value)}.`,
  );
}

function requireTestimonials(testimonials: unknown): CircularTestimonial[] {
  if (!Array.isArray(testimonials)) {
    throw new Error(
      `CircularTestimonials testimonials must be a non-empty array. Received ${describeValue(testimonials)}.`,
    );
  }
  if (testimonials.length === 0) {
    throw new Error('CircularTestimonials testimonials must contain at least one item. Received [].');
  }

  return testimonials.map((item, index) => {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      throw new Error(
        `CircularTestimonials testimonials[${index}] must be a non-array object. Received ${describeValue(item)}.`,
      );
    }
    const record = item as Record<string, unknown>;
    return {
      quote: requireText(record.quote, `testimonials[${index}].quote`),
      name: requireText(record.name, `testimonials[${index}].name`),
      designation: requireText(record.designation, `testimonials[${index}].designation`),
      src: requireText(record.src, `testimonials[${index}].src`),
    };
  });
}

function requireBoolean(value: unknown, field: string, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  throw new Error(`CircularTestimonials ${field} must be a boolean. Received ${describeValue(value)}.`);
}

function requireStyleOverrides<Field extends string>(
  value: unknown,
  fieldName: string,
  allowedFields: readonly Field[],
): Partial<Record<Field, string>> {
  if (value === undefined) {
    return {};
  }
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(
      `CircularTestimonials ${fieldName} must be a plain object or undefined. Received ${describeValue(value)}.`,
    );
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new Error(
      `CircularTestimonials ${fieldName} must be a plain object or undefined. Received ${describeValue(value)}.`,
    );
  }

  const overrides: Partial<Record<Field, string>> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (!allowedFields.includes(key as Field)) {
      throw new Error(
        `CircularTestimonials ${fieldName}.${key} is not a supported field. Received ${describeValue(entry)}.`,
      );
    }
    overrides[key as Field] = requireText(entry, `${fieldName}.${key}`);
  }
  return overrides;
}

function observeStageWidth(stageElement: HTMLElement, publishWidth: () => void): () => void {
  publishWidth();
  if (typeof ResizeObserver === 'function') {
    const stageObserver = new ResizeObserver(publishWidth);
    stageObserver.observe(stageElement);
    return () => stageObserver.disconnect();
  }

  window.addEventListener('resize', publishWidth);
  return () => window.removeEventListener('resize', publishWidth);
}

function stageGapPx(stageWidthPx: number): number {
  const minWidthPx = 1024;
  const maxWidthPx = 1456;
  const minGapPx = 60;
  const maxGapPx = 86;
  if (stageWidthPx <= minWidthPx) {
    return minGapPx;
  }
  if (stageWidthPx >= maxWidthPx) {
    return Math.max(minGapPx, maxGapPx + 0.06018 * (stageWidthPx - maxWidthPx));
  }
  return minGapPx + (maxGapPx - minGapPx) * ((stageWidthPx - minWidthPx) / (maxWidthPx - minWidthPx));
}

function wrappedIndex(index: number, count: number): number {
  if (count <= 0) {
    throw new Error(`CircularTestimonials index wrap requires a positive count. Received ${count}.`);
  }
  return ((index % count) + count) % count;
}

function shiftedIndex(currentIndex: number, direction: 'previous' | 'next', itemCount: number): number {
  const indexDelta = direction === 'next' ? 1 : -1;
  return wrappedIndex(currentIndex + indexDelta, itemCount);
}

function arrowDirectionFromKey(key: string): 'previous' | 'next' | null {
  if (key === 'ArrowLeft') {
    return 'previous';
  }
  if (key === 'ArrowRight') {
    return 'next';
  }
  return null;
}

function bindWindowArrowKeys(onArrow: (direction: 'previous' | 'next') => void): () => void {
  function handleWindowArrowKey(event: globalThis.KeyboardEvent): void {
    const direction = arrowDirectionFromKey(event.key);
    if (direction === null) {
      return;
    }
    event.preventDefault();
    onArrow(direction);
  }

  window.addEventListener('keydown', handleWindowArrowKey);
  return () => window.removeEventListener('keydown', handleWindowArrowKey);
}

function imagePose(imageIndex: number, activeIndex: number, count: number, gapPx: number): ImagePose {
  if (imageIndex === activeIndex) {
    return { x: 0, y: 0, scale: 1, rotateY: 0, opacity: 1, zIndex: 3 };
  }
  if (count > 1 && imageIndex === wrappedIndex(activeIndex - 1, count)) {
    return { x: -gapPx, y: -(gapPx * 0.8), scale: 0.85, rotateY: 15, opacity: 1, zIndex: 2 };
  }
  if (count > 1 && imageIndex === wrappedIndex(activeIndex + 1, count)) {
    return { x: gapPx, y: -(gapPx * 0.8), scale: 0.85, rotateY: -15, opacity: 1, zIndex: 2 };
  }
  return { x: 0, y: 0, scale: 1, rotateY: 0, opacity: 0, zIndex: 1 };
}

function quoteParts(quote: string): QuotePart[] {
  const pieces = /\s/u.test(quote) ? spacedQuotePieces(quote) : unspacedQuotePieces(quote);
  let wordIndex = 0;
  return pieces.map((piece) => {
    if (!piece.animate) {
      return { ...piece, delay: 0 };
    }
    const delay = wordIndex * 0.025;
    wordIndex += 1;
    return { ...piece, delay };
  });
}

function spacedQuotePieces(quote: string): Array<{ text: string; animate: boolean }> {
  return quote
    .split(/(\s+)/u)
    .filter((piece) => piece.length > 0)
    .map((piece) => ({ text: piece, animate: !/^\s+$/u.test(piece) }));
}

function unspacedQuotePieces(quote: string): Array<{ text: string; animate: boolean }> {
  if (typeof Intl.Segmenter !== 'function') {
    return Array.from(quote, (character) => ({ text: character, animate: true }));
  }

  const locale = /\p{Script=Han}/u.test(quote) ? 'zh' : 'en';
  const segmenter = new Intl.Segmenter(locale, { granularity: 'word' });
  const pieces = Array.from(segmenter.segment(quote), (segment) => ({
    text: segment.segment,
    animate: segment.isWordLike === true,
  }));
  if (pieces.length === 0) {
    throw new Error(`CircularTestimonials quote produced no words. Received ${JSON.stringify(quote)}.`);
  }
  return pieces;
}

export function CircularTestimonials({
  testimonials,
  ariaLabel,
  previousLabel,
  nextLabel,
  autoplay,
  imageOnLeft,
  colors,
  fontSizes,
}: CircularTestimonialsProps) {
  const items = requireTestimonials(testimonials);
  const carouselLabel = requireText(ariaLabel, 'ariaLabel');
  const previousButtonLabel = requireText(previousLabel, 'previousLabel');
  const nextButtonLabel = requireText(nextLabel, 'nextLabel');
  const autoplayEnabled = requireBoolean(autoplay, 'autoplay', true);
  const showImageOnLeft = requireBoolean(imageOnLeft, 'imageOnLeft', true);
  const resolvedColors = {
    ...DEFAULT_COLORS,
    ...requireStyleOverrides(colors, 'colors', COLOR_FIELDS),
  };
  const resolvedFontSizes = {
    ...DEFAULT_FONT_SIZES,
    ...requireStyleOverrides(fontSizes, 'fontSizes', FONT_SIZE_FIELDS),
  };
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [autoplayStopped, setAutoplayStopped] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageWidthPx, setStageWidthPx] = useState(0);
  const activeIndex = wrappedIndex(selectedIndex, items.length);
  const activeItem = items[activeIndex];
  const arrowStyle: ArrowStyle = {
    backgroundColor: resolvedColors.arrowBackground,
    color: resolvedColors.arrowForeground,
    '--circular-testimonial-arrow-hover-background': resolvedColors.arrowHoverBackground,
  };

  useEffect(() => {
    const stageElement = stageRef.current;
    if (stageElement === null) {
      return undefined;
    }
    return observeStageWidth(stageElement, () => setStageWidthPx(stageElement.clientWidth));
  }, []);

  useEffect(() => {
    if (!autoplayEnabled || autoplayStopped || items.length < 2) {
      return undefined;
    }
    const intervalId = window.setInterval(() => {
      setSelectedIndex((currentIndex) => wrappedIndex(currentIndex + 1, items.length));
    }, AUTOPLAY_MS);
    return () => window.clearInterval(intervalId);
  }, [autoplayEnabled, autoplayStopped, items.length]);

  useEffect(() => {
    return bindWindowArrowKeys((direction) => {
      setAutoplayStopped(true);
      setSelectedIndex((currentIndex) => shiftedIndex(currentIndex, direction, items.length));
    });
  }, [items.length]);

  function showDirection(direction: 'previous' | 'next'): void {
    setAutoplayStopped(true);
    setSelectedIndex((currentIndex) => shiftedIndex(currentIndex, direction, items.length));
  }

  if (!activeItem) {
    throw new Error(
      `CircularTestimonials testimonials[${activeIndex}] is missing. Received length ${items.length}.`,
    );
  }

  const gapPx = stageGapPx(stageWidthPx);

  return (
    <section
      aria-label={carouselLabel}
      aria-roledescription="carousel"
      className="w-full text-stone-100 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-300"
      data-circular-testimonials="true"
      data-image-on-left={showImageOnLeft ? 'true' : 'false'}
      tabIndex={0}
    >
      <div
        className={
          showImageOnLeft
            ? 'flex w-full flex-col items-center gap-10 md:flex-row md:items-center md:gap-20'
            : 'flex w-full flex-col-reverse items-center gap-10 md:flex-row-reverse md:items-center md:gap-20'
        }
        data-part="layout"
      >
        <div
          ref={stageRef}
          className="relative h-96 w-full min-w-0 md:flex-1 [perspective:1000px]"
          data-part="image-stage"
        >
          {items.map((item, imageIndex) => {
            const pose = imagePose(imageIndex, activeIndex, items.length, gapPx);
            const imageIsActive = imageIndex === activeIndex;
            return (
              <motion.div
                key={`${imageIndex}-${item.src}`}
                animate={{ x: pose.x, y: pose.y, scale: pose.scale, rotateY: pose.rotateY, opacity: pose.opacity }}
                aria-hidden={imageIsActive ? undefined : true}
                className="absolute inset-0"
                data-part="testimonial-image"
                data-placement={imageIsActive ? 'active' : pose.opacity === 0 ? 'hidden' : pose.x < 0 ? 'previous' : 'next'}
                initial={false}
                style={{
                  pointerEvents: pose.opacity === 0 ? 'none' : 'auto',
                  transformStyle: 'preserve-3d',
                  zIndex: pose.zIndex,
                }}
                transition={{ duration: 0.8, ease: IMAGE_EASE }}
              >
                <Image
                  src={item.src}
                  alt={imageIsActive ? item.name : ''}
                  fill
                  sizes="(max-width: 768px) 100vw, 36rem"
                  unoptimized
                  className="object-contain object-center"
                  style={{ objectFit: 'contain', objectPosition: 'center' }}
                />
              </motion.div>
            );
          })}
        </div>

        <div
          aria-atomic="true"
          aria-live="polite"
          className="flex w-full min-w-0 flex-1 flex-col justify-between gap-8 text-left"
          data-part="testimonial-copy"
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={`${activeIndex}-${activeItem.src}`}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <h3
                className="font-semibold leading-tight"
                data-part="testimonial-name"
                style={{ color: resolvedColors.name, fontSize: resolvedFontSizes.name }}
              >
                {activeItem.name}
              </h3>
              <p
                className="mt-1"
                data-part="testimonial-designation"
                style={{ color: resolvedColors.designation, fontSize: resolvedFontSizes.designation }}
              >
                {activeItem.designation}
              </p>
              <p
                aria-label={activeItem.quote}
                className="mt-8 max-w-2xl leading-relaxed"
                data-part="testimonial-quote"
                style={{ color: resolvedColors.testimony, fontSize: resolvedFontSizes.quote }}
              >
                {quoteParts(activeItem.quote).map((part, partIndex) =>
                  part.animate ? (
                    <motion.span
                      key={`${partIndex}-${part.text}`}
                      className="inline-block"
                      initial={{ filter: 'blur(10px)', opacity: 0, y: 5 }}
                      animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                      transition={{ delay: part.delay, duration: 0.22, ease: 'easeInOut' }}
                    >
                      {part.text}
                    </motion.span>
                  ) : (
                    part.text
                  ),
                )}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center gap-6">
            <button
              aria-label={previousButtonLabel}
              className="inline-flex h-[2.7rem] w-[2.7rem] items-center justify-center rounded-full transition-colors duration-300 hover:bg-[var(--circular-testimonial-arrow-hover-background)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-300"
              onClick={() => showDirection('previous')}
              style={arrowStyle}
              type="button"
            >
              <IconArrowLeft aria-hidden="true" size={28} stroke={1.8} />
            </button>
            <button
              aria-label={nextButtonLabel}
              className="inline-flex h-[2.7rem] w-[2.7rem] items-center justify-center rounded-full transition-colors duration-300 hover:bg-[var(--circular-testimonial-arrow-hover-background)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-300"
              onClick={() => showDirection('next')}
              style={arrowStyle}
              type="button"
            >
              <IconArrowRight aria-hidden="true" size={28} stroke={1.8} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CircularTestimonials;
