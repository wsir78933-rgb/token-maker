'use client';

import Image from 'next/image';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState, type CSSProperties, type KeyboardEvent } from 'react';

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
  const [autoplayPausedByInteraction, setAutoplayPausedByInteraction] = useState(false);
  const activeIndex = selectedIndex % validatedTestimonials.length;
  const activeTestimonial = validatedTestimonials[activeIndex];
  const previousTestimonial =
    validatedTestimonials[
      circularTestimonialsWrappedIndex(activeIndex - 1, validatedTestimonials.length)
    ];
  const nextTestimonial =
    validatedTestimonials[
      circularTestimonialsWrappedIndex(activeIndex + 1, validatedTestimonials.length)
    ];
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
      setSelectedIndex((currentIndex) => (currentIndex + 1) % validatedTestimonials.length);
    }, CIRCULAR_TESTIMONIAL_AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(autoplayInterval);
  }, [autoplayPausedByInteraction, validatedAutoplay, validatedTestimonials.length]);

  function showPreviousTestimonial(): void {
    setAutoplayPausedByInteraction(true);
    setSelectedIndex((currentIndex) =>
      circularTestimonialsWrappedIndex(currentIndex - 1, validatedTestimonials.length),
    );
  }

  function showNextTestimonial(): void {
    setAutoplayPausedByInteraction(true);
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
          className="relative flex min-h-[20rem] w-full max-w-[35rem] flex-1 items-center justify-center"
          data-part="image-stage"
        >
          {validatedTestimonials.length > 1 ? (
            <>
              <motion.div
                animate={{ opacity: 0.72 }}
                aria-hidden="true"
                className="absolute -left-12 top-1/2 z-0 hidden h-[15rem] w-[12rem] -translate-y-1/2 sm:block"
                initial={false}
                style={{ transform: 'translateY(-50%) perspective(900px) rotateY(26deg) scale(0.82)' }}
              >
                <CircularTestimonialImage
                  src={previousTestimonial.src}
                  alt=""
                  frameClassName="h-full w-full"
                />
              </motion.div>
              <motion.div
                animate={{ opacity: 0.72 }}
                aria-hidden="true"
                className="absolute -right-12 top-1/2 z-0 hidden h-[15rem] w-[12rem] -translate-y-1/2 sm:block"
                initial={false}
                style={{ transform: 'translateY(-50%) perspective(900px) rotateY(-26deg) scale(0.82)' }}
              >
                <CircularTestimonialImage
                  src={nextTestimonial.src}
                  alt=""
                  frameClassName="h-full w-full"
                />
              </motion.div>
            </>
          ) : null}

          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={`${activeIndex}-${activeTestimonial.src}`}
              animate={{ opacity: 1, rotateY: 0, scale: 1, x: 0 }}
              className="relative z-10 h-[18rem] w-[15rem] sm:h-[20rem] sm:w-[17rem]"
              data-part="active-testimonial-image"
              exit={{ opacity: 0, rotateY: 4, scale: 0.94, x: -8 }}
              initial={{ opacity: 0, rotateY: -4, scale: 0.94, x: 8 }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <CircularTestimonialImage
                src={activeTestimonial.src}
                alt={activeTestimonial.name}
                frameClassName="h-full w-full"
              />
            </motion.div>
          </AnimatePresence>
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
