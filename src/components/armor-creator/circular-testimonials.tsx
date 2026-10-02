'use client';

import Image from 'next/image';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';

const CIRCULAR_TESTIMONIAL_AUTOPLAY_INTERVAL_MS = 5000;
const CIRCULAR_TESTIMONIAL_ARROW_HOVER_VARIABLE = '--circular-testimonial-arrow-hover-background';

const CIRCULAR_TESTIMONIAL_COLOR_FIELDS = [
  'name',
  'designation',
  'testimony',
  'arrowBackground',
  'arrowForeground',
  'arrowHoverBackground',
] as const;

const CIRCULAR_TESTIMONIAL_FONT_SIZE_FIELDS = ['name', 'designation', 'quote'] as const;

type CircularTestimonialColorField = (typeof CIRCULAR_TESTIMONIAL_COLOR_FIELDS)[number];
type CircularTestimonialFontSizeField = (typeof CIRCULAR_TESTIMONIAL_FONT_SIZE_FIELDS)[number];

export type CircularTestimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

export type CircularTestimonialsColors = Partial<Record<CircularTestimonialColorField, string>>;

export type CircularTestimonialsFontSizes = Partial<Record<CircularTestimonialFontSizeField, string>>;

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

type CircularTestimonialImageProps = {
  src: string;
  alt: string;
  frameClassName: string;
};

type CircularTestimonialImagePosition = 'center' | 'left' | 'right' | 'hidden';
type CircularTestimonialsNavigationDirection = 'previous' | 'next';

type CircularTestimonialsStyle = CSSProperties & {
  [CIRCULAR_TESTIMONIAL_ARROW_HOVER_VARIABLE]: string;
};

const DEFAULT_CIRCULAR_TESTIMONIAL_COLORS: Required<CircularTestimonialsColors> = {
  name: '#f5f0e6',
  designation: '#a8a29e',
  testimony: '#d6d3d1',
  arrowBackground: '#17130d',
  arrowForeground: '#f3ddb0',
  arrowHoverBackground: '#71521c',
};

const DEFAULT_CIRCULAR_TESTIMONIAL_FONT_SIZES: Required<CircularTestimonialsFontSizes> = {
  name: '1.5rem',
  designation: '0.925rem',
  quote: '1.125rem',
};

function describeCircularTestimonialsValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint' ||
    typeof value === 'symbol' ||
    typeof value === 'function'
  ) {
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

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function requireCircularTestimonialsText(value: unknown, field: string): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  throw new Error(
    `CircularTestimonials ${field} must be a non-empty string. Received ${describeCircularTestimonialsValue(value)}.`,
  );
}

function requireCircularTestimonial(value: unknown, index: number): CircularTestimonial {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(
      `CircularTestimonials testimonials[${index}] must be a non-array object. Received ${describeCircularTestimonialsValue(value)}.`,
    );
  }

  const testimonial = value as Record<string, unknown>;

  return {
    quote: requireCircularTestimonialsText(testimonial.quote, `testimonials[${index}].quote`),
    name: requireCircularTestimonialsText(testimonial.name, `testimonials[${index}].name`),
    designation: requireCircularTestimonialsText(
      testimonial.designation,
      `testimonials[${index}].designation`,
    ),
    src: requireCircularTestimonialsText(testimonial.src, `testimonials[${index}].src`),
  };
}

function requireCircularTestimonials(testimonials: unknown): CircularTestimonial[] {
  if (!Array.isArray(testimonials)) {
    throw new Error(
      `CircularTestimonials testimonials must be a non-empty array. Received ${describeCircularTestimonialsValue(testimonials)}.`,
    );
  }

  if (testimonials.length === 0) {
    throw new Error('CircularTestimonials testimonials must contain at least one item. Received [].');
  }

  const validatedTestimonials: CircularTestimonial[] = [];
  for (let index = 0; index < testimonials.length; index += 1) {
    validatedTestimonials.push(requireCircularTestimonial(testimonials[index], index));
  }

  return validatedTestimonials;
}

function requireCircularTestimonialsColors(colors: unknown): CircularTestimonialsColors {
  if (colors === undefined) {
    return {};
  }

  if (!isPlainRecord(colors)) {
    throw new Error(
      `CircularTestimonials colors must be a plain object or undefined. Received ${describeCircularTestimonialsValue(colors)}.`,
    );
  }

  const validatedColors: CircularTestimonialsColors = {};

  for (const [field, value] of Object.entries(colors)) {
    if (!CIRCULAR_TESTIMONIAL_COLOR_FIELDS.includes(field as CircularTestimonialColorField)) {
      throw new Error(
        `CircularTestimonials colors.${field} is not a supported field. Received ${describeCircularTestimonialsValue(value)}.`,
      );
    }

    validatedColors[field as CircularTestimonialColorField] = requireCircularTestimonialsText(
      value,
      `colors.${field}`,
    );
  }

  return validatedColors;
}

function requireCircularTestimonialsFontSizes(fontSizes: unknown): CircularTestimonialsFontSizes {
  if (fontSizes === undefined) {
    return {};
  }

  if (!isPlainRecord(fontSizes)) {
    throw new Error(
      `CircularTestimonials fontSizes must be a plain object or undefined. Received ${describeCircularTestimonialsValue(fontSizes)}.`,
    );
  }

  const validatedFontSizes: CircularTestimonialsFontSizes = {};

  for (const [field, value] of Object.entries(fontSizes)) {
    if (!CIRCULAR_TESTIMONIAL_FONT_SIZE_FIELDS.includes(field as CircularTestimonialFontSizeField)) {
      throw new Error(
        `CircularTestimonials fontSizes.${field} is not a supported field. Received ${describeCircularTestimonialsValue(value)}.`,
      );
    }

    validatedFontSizes[field as CircularTestimonialFontSizeField] = requireCircularTestimonialsText(
      value,
      `fontSizes.${field}`,
    );
  }

  return validatedFontSizes;
}

function requireCircularTestimonialsLabel(label: unknown, field: string): string {
  return requireCircularTestimonialsText(label, field);
}

function requireCircularTestimonialsAutoplay(autoplay: unknown): boolean {
  if (typeof autoplay === 'boolean') {
    return autoplay;
  }

  throw new Error(
    `CircularTestimonials autoplay must be a boolean. Received ${describeCircularTestimonialsValue(autoplay)}.`,
  );
}

function requireCircularTestimonialsImagePosition(imagePosition: unknown): 'left' | 'right' {
  if (imagePosition === 'left' || imagePosition === 'right') {
    return imagePosition;
  }

  throw new Error(
    `CircularTestimonials imagePosition must be "left" or "right". Received ${describeCircularTestimonialsValue(imagePosition)}.`,
  );
}

function circularTestimonialsWrappedIndex(index: number, count: number): number {
  return (index + count) % count;
}

function getCircularTestimonialImagePosition(
  testimonialIndex: number,
  activeIndex: number,
  testimonialCount: number,
  navigationDirection: CircularTestimonialsNavigationDirection,
): CircularTestimonialImagePosition {
  if (testimonialIndex === activeIndex) {
    return 'center';
  }

  if (testimonialCount === 2) {
    return navigationDirection === 'next' ? 'left' : 'right';
  }

  const nextIndex = circularTestimonialsWrappedIndex(activeIndex + 1, testimonialCount);
  if (testimonialIndex === nextIndex) {
    return 'right';
  }

  const previousIndex = circularTestimonialsWrappedIndex(activeIndex - 1, testimonialCount);
  if (testimonialIndex === previousIndex) {
    return 'left';
  }

  return 'hidden';
}

function getCircularTestimonialImageTransform(
  position: CircularTestimonialImagePosition,
  gap: number,
): string | undefined {
  if (position === 'center') {
    return 'translateX(0px) translateY(0px) scale(1) rotateY(0deg)';
  }

  if (position === 'left') {
    return `translateX(-${gap}px) translateY(-${(gap * 0.8).toFixed(2)}px) scale(0.85) rotateY(15deg)`;
  }

  if (position === 'right') {
    return `translateX(${gap}px) translateY(-${(gap * 0.8).toFixed(2)}px) scale(0.85) rotateY(-15deg)`;
  }

  return undefined;
}

function getCircularTestimonialImageGap(stageWidth: number): number {
  if (!Number.isFinite(stageWidth) || stageWidth < 0) {
    throw new Error(`CircularTestimonials image stage width must be a non-negative number. Received ${stageWidth}.`);
  }

  if (stageWidth <= 320) {
    return 48;
  }

  if (stageWidth >= 560) {
    return 84;
  }

  return 48 + ((stageWidth - 320) / (560 - 320)) * (84 - 48);
}

function CircularTestimonialImage({ src, alt, frameClassName }: CircularTestimonialImageProps) {
  return (
    <div
      data-part="testimonial-image-frame"
      className={`relative overflow-hidden rounded-2xl border border-[#d7b46a]/30 bg-[#f4eee5] shadow-[0_18px_44px_rgba(0,0,0,0.36)] ${frameClassName}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 75vw, 18rem"
        unoptimized
        className="object-contain p-3"
      />
    </div>
  );
}

function CircularTestimonialQuote({ quote, fontSize, color }: { quote: string; fontSize: string; color: string }) {
  const quoteSegments = quote.split(/(\s+)/u);
  const firstWordIndex = quoteSegments.findIndex(
    (segment) => segment.length > 0 && !/^\s+$/u.test(segment),
  );

  return (
    <p
      aria-label={quote}
      className="max-w-2xl leading-relaxed"
      data-part="testimonial-quote"
      style={{ color, fontSize }}
    >
      {quoteSegments.map((wordOrSpace, index) => {
        if (wordOrSpace.length === 0 || /^\s+$/u.test(wordOrSpace)) {
          return wordOrSpace;
        }

        const delay = Math.floor((index - firstWordIndex) / 2) * 0.025;

        return (
          <motion.span
            key={`${index}-${wordOrSpace}`}
            className="inline-block"
            initial={{ filter: 'blur(10px)', opacity: 0, y: 8 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.28, ease: 'easeOut' }}
          >
            {wordOrSpace}
          </motion.span>
        );
      })}
    </p>
  );
}

export function CircularTestimonials({
  testimonials,
  ariaLabel = 'Circular testimonials',
  previousLabel,
  nextLabel,
  autoplay = true,
  colors,
  fontSizes,
  imagePosition = 'left',
}: CircularTestimonialsProps) {
  const validatedTestimonials = requireCircularTestimonials(testimonials);
  const validatedAriaLabel = requireCircularTestimonialsLabel(ariaLabel, 'ariaLabel');
  const validatedPreviousLabel = requireCircularTestimonialsLabel(previousLabel, 'previousLabel');
  const validatedNextLabel = requireCircularTestimonialsLabel(nextLabel, 'nextLabel');
  const validatedAutoplay = requireCircularTestimonialsAutoplay(autoplay);
  const validatedColors = requireCircularTestimonialsColors(colors);
  const validatedFontSizes = requireCircularTestimonialsFontSizes(fontSizes);
  const validatedImagePosition = requireCircularTestimonialsImagePosition(imagePosition);
  const resolvedColors = { ...DEFAULT_CIRCULAR_TESTIMONIAL_COLORS, ...validatedColors };
  const resolvedFontSizes = { ...DEFAULT_CIRCULAR_TESTIMONIAL_FONT_SIZES, ...validatedFontSizes };
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [navigationDirection, setNavigationDirection] =
    useState<CircularTestimonialsNavigationDirection>('next');
  const [autoplayPausedByInteraction, setAutoplayPausedByInteraction] = useState(false);
  const [imageStageWidth, setImageStageWidth] = useState(0);
  const imageStageRef = useRef<HTMLDivElement>(null);
  const activeIndex = selectedIndex % validatedTestimonials.length;
  const activeTestimonial = validatedTestimonials[activeIndex];
  const imageGap = getCircularTestimonialImageGap(imageStageWidth);
  const layoutClassName =
    validatedImagePosition === 'left'
      ? 'flex-col md:flex-row'
      : 'flex-col-reverse md:flex-row-reverse';
  const arrowButtonStyle = {
    backgroundColor: resolvedColors.arrowBackground,
    color: resolvedColors.arrowForeground,
    [CIRCULAR_TESTIMONIAL_ARROW_HOVER_VARIABLE]: resolvedColors.arrowHoverBackground,
  } as CircularTestimonialsStyle;

  useEffect(() => {
    if (!validatedAutoplay || autoplayPausedByInteraction || validatedTestimonials.length < 2) {
      return undefined;
    }

    const autoplayInterval = window.setInterval(() => {
      setNavigationDirection('next');
      setSelectedIndex((currentIndex) => (currentIndex + 1) % validatedTestimonials.length);
    }, CIRCULAR_TESTIMONIAL_AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(autoplayInterval);
  }, [autoplayPausedByInteraction, validatedAutoplay, validatedTestimonials.length]);

  useEffect(() => {
    const imageStage = imageStageRef.current;
    if (!imageStage) {
      throw new Error('CircularTestimonials image stage was not mounted.');
    }

    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver((entries) => {
        const imageStageEntry = entries[0];
        if (!imageStageEntry) {
          throw new Error('CircularTestimonials image stage resize did not include an observation entry.');
        }

        setImageStageWidth(imageStageEntry.contentRect.width);
      });

      resizeObserver.observe(imageStage);
      return () => resizeObserver.disconnect();
    }

    const updateImageStageWidth = () => {
      setImageStageWidth(imageStage.getBoundingClientRect().width);
    };

    window.addEventListener('resize', updateImageStageWidth);
    const initialMeasurementFrame = requestAnimationFrame(updateImageStageWidth);
    return () => {
      window.removeEventListener('resize', updateImageStageWidth);
      cancelAnimationFrame(initialMeasurementFrame);
    };
  }, []);

  function showPreviousTestimonial(): void {
    setAutoplayPausedByInteraction(true);
    setNavigationDirection('previous');
    setSelectedIndex((currentIndex) =>
      circularTestimonialsWrappedIndex(currentIndex - 1, validatedTestimonials.length),
    );
  }

  function showNextTestimonial(): void {
    setAutoplayPausedByInteraction(true);
    setNavigationDirection('next');
    setSelectedIndex((currentIndex) => (currentIndex + 1) % validatedTestimonials.length);
  }

  function handleCarouselKeyDown(event: KeyboardEvent<HTMLElement>): void {
    if (!event.currentTarget.contains(document.activeElement)) {
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPreviousTestimonial();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNextTestimonial();
    }
  }

  return (
    <section
      aria-label={validatedAriaLabel}
      aria-roledescription="carousel"
      className="relative isolate w-full px-5 py-8 text-stone-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d7b46a] sm:px-8 sm:py-10 lg:px-12"
      data-circular-testimonials="true"
      onKeyDown={handleCarouselKeyDown}
      tabIndex={0}
    >
      <div
        className={`flex items-center justify-center gap-8 md:gap-10 ${layoutClassName}`}
        data-part="layout"
      >
        <div
          className="relative flex min-h-[20rem] w-full max-w-[35rem] flex-1 items-center justify-center overflow-hidden [container-type:inline-size]"
          data-part="image-stage"
          ref={imageStageRef}
          style={{ perspective: '900px' }}
        >
          {validatedTestimonials.map((testimonial, testimonialIndex) => {
            const position = getCircularTestimonialImagePosition(
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
                className="absolute left-1/2 top-1/2 h-[min(18rem,72cqw)] w-[min(15rem,58cqw)] [transform-style:preserve-3d]"
                data-index={testimonialIndex}
                data-part={isActive ? 'active-testimonial-image' : 'testimonial-image-layer'}
                data-position={position}
                style={{
                  opacity: isActive || isPreview ? 1 : 0,
                  pointerEvents: isActive || isPreview ? 'auto' : 'none',
                  translate: '-50% -50%',
                  transform: getCircularTestimonialImageTransform(position, imageGap),
                  transition:
                    'transform 800ms cubic-bezier(.4,2,.3,1), opacity 800ms cubic-bezier(.4,2,.3,1)',
                  zIndex: isActive ? 3 : isPreview ? 2 : 1,
                }}
              >
                <CircularTestimonialImage
                  src={testimonial.src}
                  alt={isActive ? testimonial.name : ''}
                  frameClassName="h-full w-full"
                />
              </div>
            );
          })}
        </div>

        <div
          aria-live="polite"
          aria-atomic="true"
          className="flex w-full max-w-2xl flex-1 flex-col items-center gap-5 text-center md:items-start md:text-left"
          data-part="testimonial-copy"
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={`${activeIndex}-${activeTestimonial.name}`}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-5 md:items-start"
              data-part="active-testimonial"
              exit={{ opacity: 0, y: 8 }}
              initial={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div>
                <h3
                  className="font-semibold leading-tight"
                  data-part="testimonial-name"
                  style={{ color: resolvedColors.name, fontSize: resolvedFontSizes.name }}
                >
                  {activeTestimonial.name}
                </h3>
                <p
                  className="mt-1"
                  data-part="testimonial-designation"
                  style={{ color: resolvedColors.designation, fontSize: resolvedFontSizes.designation }}
                >
                  {activeTestimonial.designation}
                </p>
              </div>
              <CircularTestimonialQuote
                quote={activeTestimonial.quote}
                color={resolvedColors.testimony}
                fontSize={resolvedFontSizes.quote}
              />
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-3">
            <button
              aria-label={validatedPreviousLabel}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d7b46a]/30 shadow-sm transition-colors hover:bg-[var(--circular-testimonial-arrow-hover-background)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d7b46a]"
              onClick={showPreviousTestimonial}
              style={arrowButtonStyle}
              type="button"
            >
              <IconArrowLeft aria-hidden="true" size={20} stroke={1.8} />
            </button>
            <button
              aria-label={validatedNextLabel}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d7b46a]/30 shadow-sm transition-colors hover:bg-[var(--circular-testimonial-arrow-hover-background)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d7b46a]"
              onClick={showNextTestimonial}
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
