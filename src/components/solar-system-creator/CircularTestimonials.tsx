'use client';

import Image from 'next/image';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';

const AUTOPLAY_INTERVAL_MS = 5000;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const ARROW_BACKGROUND_VARIABLE = '--solar-system-testimonial-arrow-background';
const ARROW_HOVER_VARIABLE = '--solar-system-testimonial-arrow-hover-background';
const IMAGE_FRAME_WIDTH_RATIO = 0.78;
const IMAGE_STACK_VERTICAL_SHIFT_RATIO = 0.45;

const COLOR_FIELDS = [
  'name',
  'designation',
  'testimony',
  'imageBackground',
  'arrowBackground',
  'arrowForeground',
  'arrowHoverBackground',
] as const;
const FONT_SIZE_FIELDS = ['name', 'designation', 'quote'] as const;

type ColorField = (typeof COLOR_FIELDS)[number];
type FontSizeField = (typeof FONT_SIZE_FIELDS)[number];

export type CircularTestimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  alt?: string;
};

export type CircularTestimonialsColors = Partial<Record<ColorField, string>>;
export type CircularTestimonialsFontSizes = Partial<Record<FontSizeField, string>>;

export type CircularTestimonialsProps = {
  testimonials: readonly CircularTestimonial[];
  ariaLabel?: string;
  previousLabel: string;
  nextLabel: string;
  autoplay?: boolean;
  colors?: CircularTestimonialsColors;
  fontSizes?: CircularTestimonialsFontSizes;
  imagePosition?: 'left' | 'right';
};

type ImagePosition = 'center' | 'left' | 'right' | 'hidden';
type NavigationDirection = 'previous' | 'next';
type TestimonialsStyle = CSSProperties & {
  [ARROW_BACKGROUND_VARIABLE]: string;
  [ARROW_HOVER_VARIABLE]: string;
};
type QuoteSegment = { text: string; animate: boolean };

const DEFAULT_COLORS: Required<CircularTestimonialsColors> = {
  name: '#f5f0e6',
  designation: '#a8a29e',
  testimony: '#d6d3d1',
  imageBackground: '#050505',
  arrowBackground: '#17130d',
  arrowForeground: '#f3ddb0',
  arrowHoverBackground: '#71521c',
};

const DEFAULT_FONT_SIZES: Required<CircularTestimonialsFontSizes> = {
  name: '1.5rem',
  designation: '0.925rem',
  quote: '1.125rem',
};

function describeValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value);
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value);
  return Object.prototype.toString.call(value);
}

function requireText(value: unknown, field: string): string {
  if (typeof value === 'string' && value.trim().length > 0) return value;
  throw new Error(`CircularTestimonials ${field} must be a non-empty string. Received ${describeValue(value)}.`);
}

function requireBoolean(value: unknown, field: string, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue;
  if (typeof value === 'boolean') return value;
  throw new Error(`CircularTestimonials ${field} must be a boolean. Received ${describeValue(value)}.`);
}

function requireTestimonials(value: unknown): CircularTestimonial[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`CircularTestimonials testimonials must be a non-empty array. Received ${describeValue(value)}.`);
  }

  return value.map((testimonial, index) => {
    if (typeof testimonial !== 'object' || testimonial === null || Array.isArray(testimonial)) {
      throw new Error(
        `CircularTestimonials testimonials[${index}] must be an object. Received ${describeValue(testimonial)}.`,
      );
    }

    const receivedTestimonial = testimonial as Record<string, unknown>;
    return {
      quote: requireText(receivedTestimonial.quote, `testimonials[${index}].quote`),
      name: requireText(receivedTestimonial.name, `testimonials[${index}].name`),
      designation: requireText(receivedTestimonial.designation, `testimonials[${index}].designation`),
      src: requireText(receivedTestimonial.src, `testimonials[${index}].src`),
      ...(receivedTestimonial.alt === undefined
        ? {}
        : { alt: requireText(receivedTestimonial.alt, `testimonials[${index}].alt`) }),
    };
  });
}

function requireLabels(previousLabel: unknown, nextLabel: unknown, ariaLabel: unknown): {
  previous: string;
  next: string;
  aria: string;
} {
  return {
    previous: requireText(previousLabel, 'previousLabel'),
    next: requireText(nextLabel, 'nextLabel'),
    aria: requireText(ariaLabel, 'ariaLabel'),
  };
}

function requireImagePosition(imagePosition: unknown): 'left' | 'right' {
  if (imagePosition === 'left' || imagePosition === 'right') return imagePosition;
  throw new Error(
    `CircularTestimonials imagePosition must be "left" or "right". Received ${describeValue(imagePosition)}.`,
  );
}

function requireStyleRecord(value: unknown, field: 'colors' | 'fontSizes'): Record<string, string> {
  if (value === undefined) return {};
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`CircularTestimonials ${field} must be a plain object. Received ${describeValue(value)}.`);
  }

  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new Error(`CircularTestimonials ${field} must be a plain object. Received ${describeValue(value)}.`);
  }

  const record = value as Record<string, unknown>;
  const allowedFields = field === 'colors' ? COLOR_FIELDS : FONT_SIZE_FIELDS;
  const validatedRecord: Record<string, string> = {};
  for (const [key, receivedValue] of Object.entries(record)) {
    if (!allowedFields.includes(key as never)) {
      throw new Error(`CircularTestimonials ${field}.${key} is unsupported. Received ${describeValue(receivedValue)}.`);
    }
    validatedRecord[key] = requireText(receivedValue, `${field}.${key}`);
  }
  return validatedRecord;
}

function reducedMotionSnapshot(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function reducedMotionServerSnapshot(): boolean {
  return false;
}

function subscribeToReducedMotion(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => undefined;
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  const handleChange = () => onStoreChange();
  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}

function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeToReducedMotion, reducedMotionSnapshot, reducedMotionServerSnapshot);
}

function wrapIndex(index: number, count: number): number {
  return (index + count) % count;
}

function getImagePosition(
  testimonialIndex: number,
  activeIndex: number,
  testimonialCount: number,
  direction: NavigationDirection,
): ImagePosition {
  if (testimonialIndex === activeIndex) return 'center';
  if (testimonialCount === 2) return direction === 'next' ? 'left' : 'right';
  if (testimonialIndex === wrapIndex(activeIndex + 1, testimonialCount)) return 'right';
  if (testimonialIndex === wrapIndex(activeIndex - 1, testimonialCount)) return 'left';
  return 'hidden';
}

function getImageTransform(position: ImagePosition, gap: number): string | undefined {
  if (position === 'center') return 'translateX(0px) translateY(0px) scale(1) rotateY(0deg)';
  const verticalShift = (gap * IMAGE_STACK_VERTICAL_SHIFT_RATIO).toFixed(2);
  if (position === 'left') return `translateX(-${gap}px) translateY(-${verticalShift}px) scale(0.85) rotateY(15deg)`;
  if (position === 'right') return `translateX(${gap}px) translateY(-${verticalShift}px) scale(0.85) rotateY(-15deg)`;
  return undefined;
}

function getImageGap(stageWidth: number): number {
  if (!Number.isFinite(stageWidth) || stageWidth < 0) {
    throw new Error(`CircularTestimonials image stage width must be non-negative. Received ${stageWidth}.`);
  }

  const frameWidth = Math.min(stageWidth * IMAGE_FRAME_WIDTH_RATIO, 448);
  const safeGap = Math.max(32, (stageWidth - frameWidth) / 2 + 16);
  return Math.min(140, safeGap);
}

function punctuationOnly(text: string): boolean {
  return /^\p{P}+$/u.test(text);
}

function attachPunctuation(segments: readonly QuoteSegment[]): QuoteSegment[] {
  const joinedSegments: QuoteSegment[] = [];
  for (const segment of segments) {
    const previous = joinedSegments[joinedSegments.length - 1];
    if (previous?.animate && punctuationOnly(segment.text)) {
      joinedSegments[joinedSegments.length - 1] = { text: previous.text + segment.text, animate: true };
    } else {
      joinedSegments.push(segment);
    }
  }
  return joinedSegments;
}

function getQuoteSegments(quote: string): QuoteSegment[] {
  if (!/\p{Script=Han}/u.test(quote)) {
    return quote
      .split(/(\s+)/u)
      .filter((segment) => segment.length > 0)
      .map((segment) => ({ text: segment, animate: !/^\s+$/u.test(segment) }));
  }

  if (typeof Intl.Segmenter !== 'function') {
    return attachPunctuation(Array.from(quote, (character) => ({
      text: character,
      animate: !/\s/u.test(character) && !punctuationOnly(character),
    })));
  }

  const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' });
  const segments = Array.from(segmenter.segment(quote), (segment) => ({
    text: segment.segment,
    animate: segment.isWordLike === true,
  }));
  if (segments.length === 0) throw new Error(`CircularTestimonials quote produced no segments. Received ${JSON.stringify(quote)}.`);
  return attachPunctuation(segments);
}

function TestimonialQuote({
  quote,
  fontSize,
  color,
  prefersReducedMotion,
}: {
  quote: string;
  fontSize: string;
  color: string;
  prefersReducedMotion: boolean;
}) {
  const segments = getQuoteSegments(quote);
  return (
    <p aria-label={quote} className="max-w-2xl leading-relaxed" data-part="testimonial-quote" style={{ color, fontSize }}>
      {segments.map((segment, index) => {
        if (!segment.animate) return segment.text;
        const animatedIndex = segments.slice(0, index).filter((previous) => previous.animate).length;
        const initial = prefersReducedMotion ? { filter: 'none', opacity: 1, y: 0 } : { filter: 'blur(10px)', opacity: 0, y: 8 };
        return (
          <motion.span
            key={`${index}-${segment.text}-${prefersReducedMotion ? 'reduced' : 'animated'}`}
            className="inline-block"
            initial={initial}
            animate={prefersReducedMotion ? initial : { filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { delay: animatedIndex * 0.025, duration: 0.28, ease: 'easeOut' }}
          >
            {segment.text}
          </motion.span>
        );
      })}
    </p>
  );
}

function TestimonialImage({ src, alt, backgroundColor }: { src: string; alt: string; backgroundColor: string }) {
  return (
    <div
      data-part="testimonial-image-frame"
      className="relative aspect-[2/1] h-auto w-full overflow-hidden rounded-3xl border border-[#d7b46a]/30 bg-black shadow-[0_18px_44px_rgba(0,0,0,0.36)]"
      style={{ backgroundColor }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 92vw, 28rem"
        unoptimized
        className="object-contain"
      />
    </div>
  );
}

export function CircularTestimonials({
  testimonials,
  ariaLabel = 'Circular testimonials',
  previousLabel,
  nextLabel,
  autoplay,
  colors,
  fontSizes,
  imagePosition = 'left',
}: CircularTestimonialsProps) {
  const validatedTestimonials = requireTestimonials(testimonials);
  const labels = requireLabels(previousLabel, nextLabel, ariaLabel);
  const validatedImagePosition = requireImagePosition(imagePosition);
  const shouldAutoplay = requireBoolean(autoplay, 'autoplay', true);
  const validatedColors = requireStyleRecord(colors, 'colors');
  const validatedFontSizes = requireStyleRecord(fontSizes, 'fontSizes');
  const resolvedColors = { ...DEFAULT_COLORS, ...validatedColors };
  const resolvedFontSizes = { ...DEFAULT_FONT_SIZES, ...validatedFontSizes };
  const prefersReducedMotion = useReducedMotion();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [navigationDirection, setNavigationDirection] = useState<NavigationDirection>('next');
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const [stageWidth, setStageWidth] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeIndex = selectedIndex % validatedTestimonials.length;
  const activeTestimonial = validatedTestimonials[activeIndex];
  const imageGap = getImageGap(stageWidth);
  const imageStackMinHeight = `${Math.max(224, Math.min(320, stageWidth * 0.68))}px`;
  const layoutClassName = validatedImagePosition === 'left' ? 'flex-col md:flex-row' : 'flex-col-reverse md:flex-row-reverse';
  const arrowButtonStyle = {
    color: resolvedColors.arrowForeground,
    [ARROW_BACKGROUND_VARIABLE]: resolvedColors.arrowBackground,
    [ARROW_HOVER_VARIABLE]: resolvedColors.arrowHoverBackground,
  } as TestimonialsStyle;

  useEffect(() => {
    if (prefersReducedMotion || !shouldAutoplay || autoplayPaused || validatedTestimonials.length < 2) return undefined;
    const interval = window.setInterval(() => {
      setNavigationDirection('next');
      setSelectedIndex((currentIndex) => (currentIndex + 1) % validatedTestimonials.length);
    }, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [autoplayPaused, prefersReducedMotion, shouldAutoplay, validatedTestimonials.length]);

  useEffect(() => {
    const stage = stageRef.current;
    if (stage === null) throw new Error('CircularTestimonials image stage was not mounted.');

    const updateStageWidth = () => setStageWidth(stage.getBoundingClientRect().width);
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateStageWidth);
      observer.observe(stage);
      updateStageWidth();
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateStageWidth);
    const frame = requestAnimationFrame(updateStageWidth);
    return () => {
      window.removeEventListener('resize', updateStageWidth);
      cancelAnimationFrame(frame);
    };
  }, []);

  function showPrevious(): void {
    setAutoplayPaused(true);
    setNavigationDirection('previous');
    setSelectedIndex((currentIndex) => wrapIndex(currentIndex - 1, validatedTestimonials.length));
  }

  function showNext(): void {
    setAutoplayPaused(true);
    setNavigationDirection('next');
    setSelectedIndex((currentIndex) => (currentIndex + 1) % validatedTestimonials.length);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>): void {
    if (!event.currentTarget.contains(document.activeElement)) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPrevious();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNext();
    }
  }

  return (
    <section
      aria-label={labels.aria}
      aria-roledescription="carousel"
      className="relative isolate w-full min-w-0 px-4 py-0 text-stone-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d7b46a] sm:px-8 lg:px-12"
      data-circular-testimonials="true"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className={`flex min-w-0 items-center justify-center gap-8 md:gap-10 ${layoutClassName}`} data-part="layout">
        <div
          className="relative flex min-h-[12rem] w-full min-w-0 max-w-[35rem] flex-1 items-center justify-center overflow-hidden [container-type:inline-size]"
          data-part="image-stage"
          ref={stageRef}
          style={{ minHeight: imageStackMinHeight, perspective: '900px' }}
        >
          {validatedTestimonials.map((testimonial, testimonialIndex) => {
            const position = getImagePosition(
              testimonialIndex,
              activeIndex,
              validatedTestimonials.length,
              navigationDirection,
            );
            const isActive = position === 'center';
            const isPreview = position === 'left' || position === 'right';
            return (
              <div
                key={`${testimonialIndex}-${testimonial.src}`}
                aria-hidden={!isActive}
                className="absolute left-1/2 top-1/2 aspect-[2/1] h-auto w-[min(78%,28rem)] max-w-full [transform-style:preserve-3d]"
                data-index={testimonialIndex}
                data-part={isActive ? 'active-testimonial-image' : 'testimonial-image-layer'}
                data-position={position}
                style={{
                  opacity: isActive || isPreview ? 1 : 0,
                  pointerEvents: isActive || isPreview ? 'auto' : 'none',
                  translate: '-50% -50%',
                  transform: getImageTransform(position, imageGap),
                  transition: prefersReducedMotion ? 'none' : 'transform 800ms cubic-bezier(.4,2,.3,1), opacity 800ms cubic-bezier(.4,2,.3,1)',
                  zIndex: isActive ? 3 : isPreview ? 2 : 1,
                }}
              >
                <TestimonialImage
                  src={testimonial.src}
                  alt={isActive ? testimonial.alt ?? testimonial.name : ''}
                  backgroundColor={resolvedColors.imageBackground}
                />
              </div>
            );
          })}
        </div>

        <div
          aria-atomic="true"
          aria-live="polite"
          className="flex w-full min-w-0 max-w-2xl flex-1 flex-col items-center gap-5 text-center md:items-start md:text-left"
          data-part="testimonial-copy"
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={`${activeIndex}-${activeTestimonial.name}-${prefersReducedMotion ? 'reduced' : 'animated'}`}
              animate={{ opacity: 1, y: 0 }}
              className="flex min-w-0 flex-col items-center gap-5 md:items-start"
              data-part="active-testimonial"
              exit={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' }}
            >
              <div>
                <h3 className="font-semibold leading-tight" data-part="testimonial-name" style={{ color: resolvedColors.name, fontSize: resolvedFontSizes.name }}>
                  {activeTestimonial.name}
                </h3>
                <p className="mt-1" data-part="testimonial-designation" style={{ color: resolvedColors.designation, fontSize: resolvedFontSizes.designation }}>
                  {activeTestimonial.designation}
                </p>
              </div>
              <TestimonialQuote
                quote={activeTestimonial.quote}
                color={resolvedColors.testimony}
                fontSize={resolvedFontSizes.quote}
                prefersReducedMotion={prefersReducedMotion}
              />
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-3">
            <button
              aria-label={labels.previous}
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#d7b46a]/30 bg-[var(--solar-system-testimonial-arrow-background)] shadow-sm transition-colors hover:bg-[var(--solar-system-testimonial-arrow-hover-background)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d7b46a]"
              onClick={showPrevious}
              style={arrowButtonStyle}
              type="button"
            >
              <IconArrowLeft aria-hidden="true" size={20} stroke={1.8} />
            </button>
            <button
              aria-label={labels.next}
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#d7b46a]/30 bg-[var(--solar-system-testimonial-arrow-background)] shadow-sm transition-colors hover:bg-[var(--solar-system-testimonial-arrow-hover-background)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d7b46a]"
              onClick={showNext}
              style={arrowButtonStyle}
              type="button"
            >
              <IconArrowRight aria-hidden="true" size={20} stroke={1.8} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CircularTestimonials;
